import express from 'express';
const router = express.Router();
import { register, login, bookCab, rejectRide } from '../controllers/userController.js';
import { userAuth } from '../middlewares/auth.js';



router.post("/register", register);
router.post("/login", login);
router.post("/book-cab", userAuth, bookCab);
router.put("/rejectride/:id", userAuth, rejectRide)



export default router;