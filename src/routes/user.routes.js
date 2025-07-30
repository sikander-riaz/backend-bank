import { Router } from "express";
import loginController from "../controllers/login.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginController.login);
router.get("/logout", authMiddleware, loginController.logout);

export default router;
