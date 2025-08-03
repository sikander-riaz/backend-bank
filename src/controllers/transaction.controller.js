import { BadRequestError, ValidationError } from "../utils/ApiError.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const transactionController = {
  deposit: async (req, res, next) => {
    try {
      const { accountNumber, amount } = req.body;

      if (!accountNumber || !amount || amount <= 0) {
        throw new ValidationError("Valid account number and amount required");
      }

      const user = await User.findOne({ where: { accountNumber } });
      if (!user) throw new BadRequestError("User not found");

      user.balance += parseFloat(amount);
      await user.save();

      await Transaction.create({
        type: "deposit",
        amount,
        receiverAccount: accountNumber,
      });

      res
        .status(200)
        .json({ message: "Deposit successful", newBalance: user.balance });
    } catch (err) {
      next(err);
    }
  },

  transfer: async (req, res, next) => {
    try {
      const { senderAccount, receiverAccount, amount } = req.body;

      if (!senderAccount || !receiverAccount || !amount || amount <= 0) {
        throw new ValidationError("Required fields missing or invalid");
      }

      if (senderAccount === receiverAccount) {
        throw new BadRequestError("Cannot transfer to same account");
      }

      const sender = await User.findOne({
        where: { accountNumber: senderAccount },
      });
      const receiver = await User.findOne({
        where: { accountNumber: receiverAccount },
      });

      if (!sender || !receiver) throw new BadRequestError("Invalid account(s)");

      if (sender.balance < amount)
        throw new BadRequestError("Insufficient balance");

      sender.balance -= parseFloat(amount);
      receiver.balance += parseFloat(amount);

      await sender.save();
      await receiver.save();

      await Transaction.create({
        type: "transfer",
        amount,
        senderAccount,
        receiverAccount,
      });

      res.status(200).json({ message: "Transfer successful" });
    } catch (err) {
      next(err);
    }
  },
};

export default transactionController;
