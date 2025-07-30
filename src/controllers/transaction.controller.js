// src/controllers/transaction.controller.js

import Transaction from "../models/Transaction.js";
import { BadRequestError } from "../utils/ApiError.js";

const transactionController = {
  create: async (req, res, next) => {
    try {
      const { acc_number, from_account, to_account, amount } = req.body;

      if (!acc_number || !from_account || !to_account || !amount) {
        throw new BadRequestError("Missing required fields");
      }

      const transaction = await Transaction.create({
        acc_number,
        from_account,
        to_account,
        amount,
      });

      return res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  },
};

export default transactionController;
