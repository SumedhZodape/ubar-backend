import express from 'express';
const router = express.Router();
import { register, login, bookCab } from '../controllers/userController.js';
import { userAuth } from '../middlewares/auth.js';



router.post("/register", register);
router.post("/login", login);
router.post("/book-cab", userAuth, bookCab)



export default router;