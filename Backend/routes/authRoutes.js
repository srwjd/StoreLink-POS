import express from "express";
import { registerUser, login, getProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);

export default router;
