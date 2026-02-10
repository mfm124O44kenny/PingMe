import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    {timestamps: true}
)

const Message = mongoose.model('Message', messageSchema);

export default Message; // Schéma ou Structure des documents de la collection messages dans mongoDB