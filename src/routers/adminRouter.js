import express from 'express';
import {Admin} from '../models/index.js';
import { register } from '../controllers/adminController.js';

const router = express.Router();


router.post("/register", register)

export default router;