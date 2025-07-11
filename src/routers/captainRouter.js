import express from "express";
import { registerCaptain, login, getRideInfo, approveRequest,
    otpVerification, endRideorRejectRide, getAcceptedRide,
    updateRideStatus
 } from "../controllers/captainController.js";
import { uploadMiddleware } from "../utils/upload.js";
import { captainAuth } from "../middlewares/auth.js";

const router = express.Router();



// register api

router.post("/register", uploadMiddleware, registerCaptain);
router.post("/login", login);
router.get("/get-ride-info/:id", captainAuth, getRideInfo);
router.put("/approved-request/:id", captainAuth, approveRequest);
router.put("/otp-verification/:id", captainAuth, otpVerification);
router.put("/endride-rejectride/:id", captainAuth, endRideorRejectRide);
router.get("/get-accepted-ride/:status", captainAuth, getAcceptedRide);

router.put("/update-ride-status/:id", captainAuth, updateRideStatus)


export default router;