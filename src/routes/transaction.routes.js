import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.post("/transactions/add", transactionController.create);
router.get("/transactions/:accountNumber", transactionController.getByAccount);

export default router;
