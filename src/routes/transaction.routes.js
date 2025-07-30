import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const addressRoutes = Router();
addressRoutes.post("/transaction", addressController.add);

export { addressRoutes };
