// importation de modules et fonctions
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
  const imageFolder = join(__dirname, "../../../frontend/public/uploads/profile/");
  const files = await fs.readdir(imageFolder);
  
  // filtrer seulement les images
  const images = files
  .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f)); 
  console.log("✅ Recherce de tous les Images [privilège admin]", images);
  res.json(images);
});

router.delete("/images/:name", async (req, res) => {
  await fs.unlink(join(__dirname, "../../../frontend/public/uploads/profile/", req.params.name));
  console.log("✅ Suppression d'une Image [privilège admin]", req.params.name);
  res.json({ success: true });
});

export default router;
