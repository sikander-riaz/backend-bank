import { BadRequestError, ValidationError } from "../utils/ApiError.js";
import { Op } from "sequelize";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const transactionController = {
  // DEPOSIT
  deposit: async (req, res, next) => {
    try {
      console.log("Incoming deposit request body:", req.body);

      const { accountNumber, amount } = req.body;

      if (!accountNumber || isNaN(amount) || parseFloat(amount) <= 0) {
        console.log("Validation failed for:", { accountNumber, amount });
        throw new ValidationError("Valid account number and amount required");
      }

      const user = await User.findOne({ where: { accountNumber } });
      if (!user) {
        console.log("User not found for accountNumber:", accountNumber);
        throw new BadRequestError("User not found");
      }

      const depositAmount = parseFloat(amount);
      console.log("Depositing amount:", depositAmount, "to user:", user.name);

      user.balance += depositAmount;
      await user.save();

      await Transaction.create({
        type: "deposit",
        amount: depositAmount,
        receiverAccount: accountNumber,
      });

      console.log("Deposit successful. New balance:", user.balance);

      return res.status(200).json({
        message: "Deposit successful",
        newBalance: user.balance,
      });
    } catch (err) {
      console.error("Deposit error:", err);
      next(err);
    }
  },

  // TRANSFER
  transfer: async (req, res, next) => {
    try {
      console.log("Incoming transfer request body:", req.body);

      const { senderAccount, receiverAccount, amount } = req.body;

      if (
        !senderAccount ||
        !receiverAccount ||
        senderAccount === receiverAccount ||
        isNaN(amount) ||
        parseFloat(amount) <= 0
      ) {
        throw new ValidationError(
          "Valid sender, receiver, and amount required"
        );
      }

      const sender = await User.findOne({
        where: { accountNumber: senderAccount },
      });
      const receiver = await User.findOne({
        where: { accountNumber: receiverAccount },
      });

      if (!sender || !receiver) {
        throw new BadRequestError("Sender or receiver not found");
      }

      const transferAmount = parseFloat(amount);

      if (sender.balance < transferAmount) {
        throw new BadRequestError("Insufficient balance");
      }

      // Perform transfer
      sender.balance -= transferAmount;
      receiver.balance += transferAmount;

      await sender.save();
      await receiver.save();

      await Transaction.create({
        type: "transfer",
        amount: transferAmount,
        senderAccount,
        receiverAccount,
      });

      return res.status(200).json({
        message: "Transfer successful",
        updatedSenderBalance: sender.balance,
      });
    } catch (err) {
      console.error("Transfer error:", err);
      next(err);
    }
  },

  // HISTORY
  getUserTransactions: async (req, res, next) => {
    try {
      const user = req.user;
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { senderAccount: user.accountNumber },
            { receiverAccount: user.accountNumber },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  },
};

export default transactionController;
