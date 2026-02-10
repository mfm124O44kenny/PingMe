Oui, clairement — et très bon projet au passage 👌
Ton README est déjà solide, je vais le **faire passer au niveau “pro GitHub / portfolio / recruteur”**, en m’appuyant **fidèlement sur ton Swagger.yaml** (routes, rôles, sécurité, admin, etc.) **sans inventer**.

Objectif :

* lisible
* structuré
* crédible techniquement
* aligné avec ton API réelle
* prêt pour open-source ou démo

---

# 📘 README.md — VERSION PRO & DÉTAILLÉE

Tu peux **copier-coller tel quel**.

---

# PingMe 💬

**PingMe** est une application de chat **temps réel full-stack** construite avec le **stack MERN** (MongoDB, Express, React, Node.js) et **Socket.IO**, conçue pour offrir une expérience de messagerie **sécurisée**, **fluide** et **moderne**, avec un **panneau d’administration** et une **API documentée via OpenAPI (Swagger)**.

---

## 🚀 Fonctionnalités principales

### 🔐 Authentification & Sécurité

* Inscription et connexion utilisateur
* Authentification basée sur **JSON Web Tokens (JWT)**
* JWT stocké côté client (cookies sécurisés) avec expiration
* Hachage des mots de passe avec **bcrypt**
* Vérification de session (`/api/auth/check`)
* Routes protégées par middleware d’authentification

---

### 💬 Messagerie en temps réel

* Chat en temps réel avec **Socket.IO**
* Envoi de messages :

  * texte
  * image
  * texte + image
* Indicateurs d’activité :

  * utilisateurs en ligne / hors ligne
* Récupération de l’historique de messages entre deux utilisateurs

---

### 👤 Gestion du profil utilisateur

* Affichage des informations utilisateur
* Mise à jour de la photo de profil
* Upload et stockage des images via **Cloudinary**
* Mise à jour instantanée côté client

---

### 🎨 Interface & Expérience utilisateur

* UI moderne et responsive
* **Tailwind CSS + DaisyUI**
* Plus de **30 thèmes dynamiques**
* Thème persistant via `localStorage`
* Skeleton loaders pour une meilleure UX
* Notifications en temps réel avec **React Hot Toast**
* Filtrage de la sidebar (utilisateurs en ligne uniquement)

---

### 🛠️ Panneau d’administration

* Connexion administrateur dédiée
* Accès sécurisé via JWT
* Fonctions admin :

  * consulter tous les utilisateurs
  * supprimer un utilisateur spécifique
  * consulter toutes les images de profil
  * supprimer une image spécifique

---

## 🧩 Stack technique

### Frontend

* React
* Tailwind CSS
* DaisyUI
* Zustand (state management)
* Axios
* React Hot Toast
* Socket.IO Client

---

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* Socket.IO
* JSON Web Tokens (JWT)
* Bcrypt
* Cloudinary
* Swagger (OpenAPI 3.0)

---

## 📚 Documentation de l’API (Swagger)

L’API est entièrement documentée via **OpenAPI 3.0**.

Après lancement du serveur backend, la documentation est accessible à :

```
http://localhost:5001/api-docs
```

### 🔐 Authentification Swagger

* Cliquez sur **Authorize**
* Entrez votre token JWT au format :

```
Bearer <votre_token>
```

---

## 🔗 Endpoints principaux (extrait)

### Authentification

* `POST /api/auth/signup` — Inscription utilisateur
* `POST /api/auth/login` — Connexion utilisateur
* `POST /api/auth/logout` — Déconnexion
* `GET /api/auth/check` — Vérification de session
* `PUT /api/auth/update-profile` — Mise à jour du profil

---

### Messagerie

* `GET /api/messages/users` — Liste des utilisateurs
* `GET /api/messages/{receiverId}` — Historique des messages
* `POST /api/messages/send/{receiverId}` — Envoi de message

---

### Administration

* `POST /admin/login` — Connexion admin
* `GET /admin/users` — Liste des utilisateurs
* `DELETE /admin/users/{userId}` — Suppression utilisateur
* `GET /admin/images` — Liste des images
* `DELETE /admin/images/{imageId}` — Suppression image

---

## ⚙️ Installation & Lancement

### Prérequis

* Node.js (v18+ recommandé)
* npm
* MongoDB local ou MongoDB Atlas
* Compte Cloudinary

---

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/your-username/pingme.git
cd pingme
```

---

### 2️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Créer un fichier `.env` :

```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Utilisation

1. Créer un compte ou se connecter
2. Voir les utilisateurs dans la sidebar avec leur statut en temps réel
3. Cliquer sur un utilisateur pour démarrer une conversation
4. Envoyer des messages texte et/ou images
5. Personnaliser le thème et le profil
6. (Admin) Gérer utilisateurs et contenus

---

## 🧠 Architecture & bonnes pratiques

* Séparation claire frontend / backend
* API REST documentée (Swagger)
* Sécurité JWT + bcrypt
* Gestion centralisée de l’état (Zustand)
* Communication temps réel avec Socket.IO
* Code structuré et maintenable

---

## 🙏 Remerciements

* **Cloudinary** — stockage et gestion des images
* **DaisyUI** — thèmes UI
* **Socket.IO** — communication temps réel
* **Swagger / OpenAPI** — documentation API

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---


