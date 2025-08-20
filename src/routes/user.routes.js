import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
console.log(Router());

router.post("/signup", userController.add);
router.get("/verify/:token", userController.verify);
router.post("/login", userController.login);
router.get("/verify/:token", userController.verify);

router.post("/user", userController.add);
router.get("/user", userController.get);
router.get("/user/:id", userController.find);
router.put("/user", authMiddleware, userController.update);
router.delete("/user/:id", userController.delete);

export default router;
