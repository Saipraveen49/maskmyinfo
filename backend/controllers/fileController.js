import fileModel from "../models/fileModel.js";
import crypto from "crypto";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use the environment variables for encryption key and IV
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');

const addFile = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.userId; // Assumes userId is set by auth middleware

        // Check if the file is uploaded
        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Encrypt the file data
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
        let encryptedData = cipher.update(file.buffer, 'binary', 'hex');
        encryptedData += cipher.final('hex');

        // Create a new file document
        const newFile = new fileModel({
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: encryptedData,
            iv: iv.toString('hex'), // Save the IV to use during decryption
            user: userId
        });

        // Save the file document
        const savedFile = await newFile.save();

        // Update user document to include the file reference
        await userModel.findByIdAndUpdate(userId, { $push: { files: savedFile._id } });

        res.json({ success: true, message: "Document added successfully", file: savedFile });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error adding document" });
    }
};

const getUserFiles = async (req, res) => {
    try {
        const userId = req.userId; // Assumes userId is set by auth middleware

        // Find user and populate files
        const user = await userModel.findById(userId).populate('files');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, files: user.files });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error retrieving files" });
    }
};

const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await fileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(file.iv, 'hex'));
        let decryptedData = decipher.update(file.fileData, 'hex', 'binary');
        decryptedData += decipher.final('binary');

        const tempDirPath = path.join(__dirname, 'temp');
        const tempFilePath = path.join(tempDirPath, file.fileName);
        const maskedFilePath = path.join(tempDirPath, `masked_${file.fileName}`);

        if (!fs.existsSync(tempDirPath)) {
            fs.mkdirSync(tempDirPath);
        }

        fs.writeFileSync(tempFilePath, decryptedData, 'binary');

        // Run Python script to mask PII in the file
        const pythonScriptPath = path.join(__dirname, 'mask_pii.py');
        const pythonProcess = spawn('python', [pythonScriptPath, tempFilePath, maskedFilePath]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python script output: ${data.toString()}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script failed with exit code ${code}`);
                return res.status(500).json({ success: false, message: 'Error processing file with Python script' });
            }

            if (fs.existsSync(maskedFilePath)) {
                res.download(maskedFilePath, file.fileName, (err) => {
                    if (err) {
                        console.error("Error sending file:", err);
                        return res.status(500).json({ success: false, message: "Error sending file" });
                    }

                    // Clean up the temporary files
                    fs.unlinkSync(tempFilePath);
                    fs.unlinkSync(maskedFilePath);
                });
            } else {
                console.error("Masked file does not exist");
                res.status(500).json({ success: false, message: "Masked file not found" });
            }
        });

        pythonProcess.on('error', (err) => {
            console.error("Error executing Python script:", err);
            res.status(500).json({ success: false, message: "Error executing Python script" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error retrieving file" });
    }
};

const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await fileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // Remove the file from the user’s file list and delete the file
        await userModel.findByIdAndUpdate(file.user, { $pull: { files: fileId } });
        await fileModel.findByIdAndDelete(fileId);

        // Fetch updated file list and return it directly
        const user = await userModel.findById(file.user).populate('files');
        res.json({ success: true, message: "File deleted successfully", files: user.files });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error deleting file" });
    }
};

const recognizeTextFromFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await fileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // Decrypt the file
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(file.iv, 'hex'));
        let decryptedData = decipher.update(file.fileData, 'hex', 'binary');
        decryptedData += decipher.final('binary');

        const tempDirPath = path.join(__dirname, 'temp');
        const tempFilePath = path.join(tempDirPath, file.fileName);

        if (!fs.existsSync(tempDirPath)) {
            fs.mkdirSync(tempDirPath);
        }

        fs.writeFileSync(tempFilePath, decryptedData, 'binary');

        const pythonScriptPath = path.join(__dirname, 'mask_pii1.py');
        let pythonProcess;

        if (req.method === 'POST') {
            // Handle masking: Get the selected labels from the request body
            const selectedLabels = req.body.selectedLabels || [];
            pythonProcess = spawn('python', [pythonScriptPath, tempFilePath, '--mask', ...selectedLabels]);
        } else {
            // Handle text recognition for GET request
            pythonProcess = spawn('python', [pythonScriptPath, tempFilePath, '--get-sensitive']);
        }

        let pythonOutput = '';
        let isResponseSent = false;

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stdout.on('end', () => {
            if (isResponseSent) return;

            if (req.method === 'POST') {
                // Masking: return the masked file as a download
                res.setHeader('Content-Disposition', 'attachment; filename=masked_file.pdf');
                res.setHeader('Content-Type', 'application/pdf');
                isResponseSent = true;
                return res.send(Buffer.from(pythonOutput));  // Send the masked file as binary
            } else {
                // Recognize text: return the sensitive data
                try {
                    const sensitiveData = JSON.parse(pythonOutput);
                    isResponseSent = true;
                    return res.status(200).json({ success: true, sensitiveData });
                } catch (err) {
                    return res.status(500).json({ success: false, message: 'Error parsing JSON from Python script' });
                }
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data.toString()}`);
            if (!isResponseSent) {
                isResponseSent = true;
                return res.status(500).json({ success: false, message: 'Error processing file' });
            }
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0 && !isResponseSent) {
                return res.status(500).json({ success: false, message: `Python script failed with exit code ${code}` });
            }
        });
    } catch (error) {
        console.error("Error processing file:", error);
        return res.status(500).json({ success: false, message: "Error processing file" });
    }
};



export { addFile, getUserFiles, downloadFile,deleteFile, recognizeTextFromFile };