// server.js
import express from "express";
import { connectDB } from "./config/db.js";
import fileRouter from "./routes/fileRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors"
const app = express();
const port = 4000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors())
// Middleware to serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// Use the file router for handling file uploads
app.use("/api/file", fileRouter);
app.use("/api/user",userRouter);
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
