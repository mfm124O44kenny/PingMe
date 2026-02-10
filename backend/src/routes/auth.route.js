// inportation de fonctions et d'un module
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

import express from 'express';

const router = express.Router();

/* ============================================
   Routes liées à l'authentification
   ============================================ */
router.post('/signup', signup); 
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute , updateProfile);
router.get('/check' , protectRoute, checkAuth);

export default router;