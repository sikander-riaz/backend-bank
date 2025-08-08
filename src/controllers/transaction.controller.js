import { BadRequestError, ValidationError } from "../utils/ApiError.js";
import { Op } from "sequelize";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const transactionController = {
  // DEPOSIT
  deposit: async (req, res, next) => {
    try {
      const { acc_number, amount } = req.body;

      if (!acc_number || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new ValidationError("Valid account number and amount required");
      }

      const user = await User.findOne({ where: { acc_number } });
      if (!user) throw new BadRequestError("User not found");

      const depositAmount = parseFloat(amount);
      user.balance += depositAmount;
      await user.save();

      await Transaction.create({
        type: "deposit",
        amount: depositAmount,
        receiverAccount: accountNumber,
      });

      return res.status(200).json({
        message: "Deposit successful",
        newBalance: user.balance,
      });
    } catch (err) {
      next(err);
    }
  },

  // TRANSFER
  transfer: async (req, res, next) => {
    try {
      const { senderAccount, receiverAccount, amount } = req.body;

      if (
        !senderAccount ||
        !receiverAccount ||
        isNaN(amount) ||
        parseFloat(amount) <= 0
      ) {
        throw new ValidationError(
          "Valid sender, receiver and amount are required"
        );
      }

      const sender = await User.findOne({
        where: { acc_number: senderAccount },
      });
      const receiver = await User.findOne({
        where: { acc_number: receiverAccount },
      });

      if (!sender || !receiver)
        throw new BadRequestError("Sender or receiver not found");

      const transferAmount = parseFloat(amount);
      if (sender.balance < transferAmount)
        throw new BadRequestError("Insufficient balance");

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
      next(err);
    }
  },

  // TRANSACTION HISTORY
  getUserTransactions: async (req, res, next) => {
    try {
      const user = req.user;
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { senderAccount: user.acc_number },
            { receiverAccount: user.acc_number },
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
