// importation d'images et de fonctions
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";
import cloudinary from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*------------ S'inscrire ------------*/
export const signup = async (req, res) => {
    const {email, fullName, password} = req.body;
    console.log(email, fullName, password);

    try {
        if(!email || !fullName || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: 'User already exists'});

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if(newUser){
            console.log("✅ Nouveau utilisateur [" + fullName + "] !");
            await newUser.save(); // d'abord sauvegarder
            // générer token après sauvegarde
            generateToken(newUser._id, res);
            return res.status(201).json({
                message: 'User created !',
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
            });
        }
        else{
            console.log("⛔ Impossible d'ajouter [" + fullName + "] comme utilisateur !");
            return res.status(400).json({message: 'Failed to create new user'});
        }

    } catch (error) {
        console.log("⛔ Impossible d'ajouter [" + fullName + "] comme utilisateur !");
        return res.status(500).json({message: 'Something went wrong, please try again'});
    }
};

/*------------ Se connecter ------------*/
export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) return res.status(400).json({message: 'Invalid credentials'});

        // generate jwt token
        generateToken(user._id, res);
        console.log("✅ L'user s'est connecte à son compte [" + user._id + "] !");
        return res.status(200).json({
            message: 'User login successfully !',
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("⛔ Impossible de se connecter comme utilisateur :", error.message);
        return res.status(500).json({message: 'Internal server error'});
    }
};

/*------------ Se déconnecter ------------*/
export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        console.log("✅ L'user s'est déconnecte à son compte !");
        return res.status(200).json({message: 'Logged out successfully !'});
    } catch (error) {
        console.log("⛔ L'user n'arrive pas à se déconnecter de son compte !");
        return res.status(500).json({message: 'Internal server error'});
    }
};

/*------------ Mettre à jour son profile ------------*/
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Vérifier le base64
    const matches = profilePic.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const base64Data = matches[2];

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
      folder: `users/${userId}`,
      public_id: `avatar`,
      overwrite: true,
    });

    // Update DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    console.log(`✅ L'user [${userId}] a mis à jour son profile sur Cloudinary !`);
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log(`⛔ L'user [${req.user._id}] n'a pas pu mettre à jour son profile : `, error);
    res.status(500).json({ message: "Image upload failed" });
  }
};
  
/*------------ Vérifier si c'est bien un utilisateur qui envoie une requête ------------*/
export const checkAuth =  (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller" , error.message);
        return res.status(500).json({message: 'Internal server error'});
    }
}