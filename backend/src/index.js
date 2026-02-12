// importation de modules et fonctions
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { connectDB } from "./lib/db.js";
import { app, httpServer } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import messageRoutes from "./routes/message.route.js";
import { detectActiveIP, writeEnvFile } from "./ip.js";

dotenv.config(); // chargement du fichier .env
connectDB(); // connection à la database mongoDB

/* ===============================
   Constantes
   =============================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5001; // au cas où !
const HOST = process.env.HOST;
const swaggerDocument = YAML.load("./api.yaml");

// Servir le build Vite (frontend/dist)
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Rediriger toutes les routes vers index.html pour le SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ===============================
   Middleware
   =============================== */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      
      // On les vérifie les origines autorisées
      if (!origin) return callback(null, true);

      const allowed = [
        "http://localhost:5173",  // Vite dev server
        "http://127.0.0.1:5173",
        // Et on Ajoute des domaines si besoin
      ];

      try {
        const url = new URL(origin);
        if (
          origin.match(/^http:\/\/192\.168\.\d+\.\d+:5173$/) ||
          allowed.includes(origin) ||
          allowed.includes(`${url.protocol}//${url.hostname}`) ||
          allowed.includes(`${url.protocol}//${url.hostname}:${url.port}`)
        ) {
          return callback(null, true);
        }
      } catch {}

      callback(null, false); // Retourne false au lieu de lancer une erreur
    },
    credentials: true,
  })
);

/* ===============================
   Routes API
   =============================== */
// chemin administrateur
app.use("/admin", express.static(join(__dirname, "admin")));
app.use("/admin", adminRoutes);
// on expose le dossier "uploads" en URL publique
app.use("/images", express.static(path.join(process.cwd(), "../frontend/public/uploads")));
// authentification et messages
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* ===============================
   Démarrage du Serveur
   =============================== */
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

(async () => {
  const ip = "0.0.0.0"; //await detectActiveIP();
  await writeEnvFile({ host: ip, port: PORT }); // écriture dans le fichier .env

  httpServer.listen(PORT, ip, () => {
    console.log(`✅ Lien de connection serveur [http://${ip}:${PORT}]`);
  }); // serveur en écoute sur un PORT d'une IP spécifique
})();
