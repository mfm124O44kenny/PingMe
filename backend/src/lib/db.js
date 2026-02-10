import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ Serveur connecté à sa Base de données [${process.env.MONGODB_URI}]`);
    } catch (error) {
        console.error("⛔ Problème de connection à la base de données : ", error);
    }
}