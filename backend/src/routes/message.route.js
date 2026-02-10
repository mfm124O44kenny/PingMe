// importation de fonctions et d'un module
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessages, getUsersForSidebar , sendMessage} from '../controllers/message.controller.js';

import express from 'express';

const router = express.Router();

/* ===============================
   Routes liées aux messages
   =============================== */
router.get('/users',protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;