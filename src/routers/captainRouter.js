import express from "express";
import { registerCaptain, login } from "../controllers/captainController.js";
import { uploadMiddleware } from "../utils/upload.js";
import { captainAuth } from "../middlewares/auth.js";

const router = express.Router();



// register api

router.post("/register", uploadMiddleware, registerCaptain);
router.post("/login", login)


export default router;