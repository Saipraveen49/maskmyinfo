import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileData: { type: String, required: true }, // Use String to store encrypted data as a hex string
    iv: { type: String, required: true }, // Save IV as a string to use during decryption
    uploadDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

const fileModel = mongoose.models.file || mongoose.model("file", fileSchema);

export default fileModel;
