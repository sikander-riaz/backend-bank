import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

console.log("transaction.routes.js loaded");

router.post(
  "/deposit", // ✅ fixed
  authMiddleware,
  transactionController.deposit
);

router.post("/transfer", authMiddleware, transactionController.transfer);

router.get(
  "/history", //
  authMiddleware,
  transactionController.getUserTransactions
);

export default router;
