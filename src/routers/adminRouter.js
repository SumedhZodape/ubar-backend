import express from 'express';
import {Admin} from '../models/index.js';
import { login, register } from '../controllers/adminController.js';

const router = express.Router();


router.post("/register", register);
router.post("/login", login)

export default router;