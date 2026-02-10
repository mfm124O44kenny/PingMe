// importation de modules et fonctions
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/* ===============================
   Constantes
   =============================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*------------ Tous les utilisateurs ------------*/
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    console.log("✅ Liste des utilisateurs affichée sur le Sidebar : ", users);
    res.status(200).json(users);

  } catch (error) {
    console.log("⛔ Impossible d'afficher la liste des Users sur le Sidebar : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*------------ Entrer dans une conversation (Messages) ------------*/
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    console.log("✅ L'user [" + myId.fullName + "] veut converser avec : ", userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    console.log("⛔ L'user [" + myId.fullName + "] n'arrive pas à converser avec : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*------------ Envoi d'un message ------------*/
export const sendMessage = async (req, res) => {
    try {
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
      const { text, image } = req.body;
      let imageUrl = null;
  
      if (image && image.startsWith("data:image")) {
        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
  
        if (!matches) {
          console.log("⛔ Format d'image invalide [Ne peut être envoyer avec son message]");
          return res.status(400).json({ error: "Invalid image format" });
        }
  
        const ext = matches[1].split("/")[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
  
        // créer le dossier si besoin
        const uploadDir = path.join(__dirname, "../../../frontend/public/uploads/messages/");
        await fs.mkdir(uploadDir, { recursive: true });

        const fileName = `msg-${Date.now()}-${senderId}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
 
        // écriture du fichier (PROMISE)
        await fs.writeFile(filePath, buffer);
  
        console.log("✅ Image du message [" + text + "], de l'user [" + senderId + "] enregistrée !");
  
        imageUrl = `/public/uploads/messages/${fileName}`;
      }else { console.log("✅ Message [" + text + "], de l'user [" + senderId + "] envoyé !"); }
  
      //sauvegarde dans la collection messages
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("⛔ Impossible d'envoyer un message : ", error);
      res.status(500).json({ error: error.message });
    }
  };
  
