import express from 'express';
const router = express.Router();
import { register, login, bookCab, rejectRide, getRideInfo } from '../controllers/userController.js';
import { userAuth } from '../middlewares/auth.js';



router.post("/register", register);
router.post("/login", login);
router.post("/book-cab", userAuth, bookCab);
router.put("/rejectride/:id", userAuth, rejectRide);
router.get("/get-ride-info", userAuth, getRideInfo);



export default router;