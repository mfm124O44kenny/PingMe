// importation de modules et fonctions
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cloudinary from '../config/cloudinary.js';

import fs from "fs/promises";
import User from "../models/user.model.js";
import adminOnly from "../middlewares/adminOnly.js";

/* =====================
   Constantes
   ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

/* =============================
   Controlleur intégré
   ============================= */
   
/*-------- Authentification et DashBoard ADMIN --------*/
router.post("/", express.json(), (req, res) => {
  const { name, secret } = req.body; 
  console.log("⏩ Demande d'authentification admin [" + "Nom : " + name, " Mot de passe : " + secret + "]");
  
  if (name == "kenny fotso" && secret == "kennyfotso2007") {
    res.cookie("admin", JSON.stringify({ fullName: "KENNY FOTSO" }), { httpOnly: true });
    console.log("✅ Demande validée [C'est bel et bien L'administrateur !]");
    return res.status(200).json({ message: "admin login successful" });
  } 
  console.log("⛔ Demande réfusée [Il ne s'agit pas de l'administrateur !]");
  res.status(401).json({ message: "Invalid Name or Secret key" });
}); // pour récupérer toutes requêtes entrantes (afin de permettre ou non, un login en tant que ADMIN)

router.use(adminOnly); // Protection ADMIN
router.get("/", (req, res) => {
  console.log("✅ Ouverture d'une page html [admin/admin]");
  res.sendFile(join(__dirname, "../admin/admin.html"));
}); // Page ADMIN


/*-------- Privilèges ADMIN sur les USERS --------*/
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  console.log("✅ Recherche de tous les Utilisateurs [privilège admin]", users);
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  console.log("✅ Suppression d'un User [privilège admin]", req.params.id);
  res.json({ success: true });
});


/*-------- Privilèges ADMIN sur les Images --------*/
router.get("/images/all", async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec leur nom et URL de profil
    const users = await User.find().select("name profilePic");

    // Filtrer uniquement ceux qui ont une image
    const images = users
      .filter(u => u.profileImageUrl)
      .map(u => ({
        name: u.name,
        url: u.profileImageUrl
      }));

    console.log("✅ Toutes les images des utilisateurs depuis MongoDB [admin]", images);
    res.json(images);

  } catch (error) {
    console.log("⛔ Erreur lors de la récupération des images depuis MongoDB", error);
    res.status(500).json({ message: "Cannot fetch images" });
  }
});

router.delete("/images/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupérer l'utilisateur pour avoir l'URL Cloudinary
    const user = await User.findById(userId);
    if (!user || !user.profileImageUrl) {
      return res.status(404).json({ message: "Utilisateur ou image non trouvée" });
    }

    // Extraire le public_id depuis l'URL Cloudinary
    // Exemple URL : https://res.cloudinary.com/demo/image/upload/v1234567890/users/abc123.jpg
    const urlParts = user.profileImageUrl.split("/");
    const publicIdWithExt = urlParts.slice(-1)[0]; // 'abc123.jpg'
    const publicId = "users/" + publicIdWithExt.split(".")[0]; // 'users/abc123'

    // Supprimer l'image sur Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Supprimer la référence dans MongoDB
    user.profileImageUrl = null;
    await user.save();

    console.log(`✅ Image supprimée pour l'utilisateur [${user.name}]`);
    res.json({ success: true, message: "Image supprimée de Cloudinary et MongoDB" });

  } catch (error) {
    console.log("⛔ Erreur lors de la suppression de l'image", error);
    res.status(500).json({ message: "Cannot delete image" });
  }
});



export default router;
