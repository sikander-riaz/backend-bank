import { Router } from "express";
import addressController from "../controllers/transaction.controller";

const addressRoutes = Router();
addressRoutes.post("/transaction", addressController.add);

export { addressRoutes };
