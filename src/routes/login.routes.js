import { Router } from "express";

import loginController from "../controllers/login.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const loginRoutes = Router();

loginRoutes.post("/login", loginController.login);
loginRoutes.get("/logout", authMiddleware, loginController.logout);

export { loginRoutes };
