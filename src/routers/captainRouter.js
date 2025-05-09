import express from "express";
import { registerCaptain } from "../controllers/captainController.js";
import { uploadMiddleware } from "../utils/upload.js"

const router = express.Router();



// register api

router.post("/register", uploadMiddleware, registerCaptain)


export default router;