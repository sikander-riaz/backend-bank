// src/routes/transaction.routes.js

import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.post("/add", transactionController.create); // ✅ matches controller

export default router;
