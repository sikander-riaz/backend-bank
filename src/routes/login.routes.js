import { Router } from "express";
import loginController from "../controllers/login.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
console.log("Login routes loaded");
const router = Router();
console.log(router);
router.post("/login", loginController.login);
router.get("/logout", authMiddleware, loginController.logout);

export default router;
