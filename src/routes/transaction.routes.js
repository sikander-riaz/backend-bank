// transaction.routes.js
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.post("/deposit", authMiddleware, transactionController.deposit);
router.post("/transfer", authMiddleware, transactionController.transfer);

export default Router().use("/transactions", router);
