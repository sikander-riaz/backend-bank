import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.post("/user", userController.add);
userRoutes.get("/user", userController.get);
userRoutes.get("/user/:id", userController.find);
userRoutes.put("/user", authMiddleware, userController.update);
userRoutes.delete("/user/:id", userController.delete);

export { userRoutes };
