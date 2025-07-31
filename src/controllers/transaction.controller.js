import Transaction from "../models/Transaction.js";
import { BadRequestError } from "../utils/ApiError.js";

const transactionController = {
  create: async (req, res, next) => {
    try {
      const { from_account, to_account, amount } = req.body;

      if (!from_account || !to_account || !amount) {
        throw new BadRequestError("Missing required fields");
      }

      const transaction = await Transaction.create({
        from_account,
        to_account,
        amount,
      });

      return res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  },

  getByAccount: async (req, res, next) => {
    try {
      const accountNumber = req.params.accountNumber;

      const transactions = await Transaction.findAll({
        where: {
          [Sequelize.Op.or]: [
            { from_account: accountNumber },
            { to_account: accountNumber },
          ],
        },
        order: [["date", "DESC"]],
      });

      res.json(transactions);
    } catch (err) {
      next(err);
    }
  },
};

export default transactionController;
