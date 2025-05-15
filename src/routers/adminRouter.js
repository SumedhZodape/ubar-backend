import express from 'express';
import {Admin} from '../models/index.js';
import { login, register, getCaptains, updateStatus } from '../controllers/adminController.js';
import {adminAuth} from '../middlewares/auth.js'

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/getcaptains", adminAuth, getCaptains);
router.put("/updatestatus/:captainId", adminAuth, updateStatus)

export default router;