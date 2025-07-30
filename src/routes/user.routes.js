import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/user", userController.add);
router.get("/user", userController.get);
router.get("/user/:id", userController.find);
router.put("/user", authMiddleware, userController.update);
router.delete("/user/:id", userController.delete);

export default router;
