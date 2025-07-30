import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transactions/add", transactionController.create);

export default router;
