// routes/fileRoute.js
import express from "express";
import multer from "multer";
import { addFile, getUserFiles, downloadFile, deleteFile , recognizeTextFromFile} from "../controllers/fileController.js";
import authMiddleware from "../middleware/auth.js";

const fileRouter = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Route for file upload
fileRouter.post("/upload",authMiddleware, upload.single("file"), addFile);
fileRouter.get("/my-files", authMiddleware, getUserFiles);
fileRouter.get("/download/:fileId", authMiddleware, downloadFile);
fileRouter.delete("/delete/:fileId", authMiddleware, deleteFile);
fileRouter.get("/recognize-text/:fileId", authMiddleware, recognizeTextFromFile);  // Recognize text route
fileRouter.post("/recognize-text/:fileId", authMiddleware, recognizeTextFromFile);  // Mask text route

export default fileRouter;
