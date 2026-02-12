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
    // récupérer toutes les images dans le dossier "users" (Cloudinary)
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "users/", // même dossier que lors de l'upload
      max_results: 100, // tu peux ajuster
    });

    // renvoyer seulement les URLs et le public_id
    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id
    }));

    console.log("✅ Recherche de toutes les images Cloudinary [admin]", images);
    res.json(images);

  } catch (error) {
    console.log("⛔ Erreur lors de la récupération des images Cloudinary", error);
    res.status(500).json({ message: "Cannot fetch images" });
  }
});

router.delete("/images/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;

    await cloudinary.uploader.destroy(public_id);
    console.log("✅ Suppression de l'image Cloudinary [admin]", public_id);
    res.json({ success: true });

  } catch (error) {
    console.log("⛔ Erreur lors de la suppression Cloudinary", error);
    res.status(500).json({ message: "Cannot delete image" });
  }
});


export default router;
