import { Model, DataTypes } from "sequelize";

class Transaction extends Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: DataTypes.ENUM("deposit", "transfer"),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        from_acc: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        to_acc: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Transaction",
        tableName: "Transactions",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // Optional: link to User model if needed
    // Example:
    // this.belongsTo(models.User, {
    //   foreignKey: "senderAccount",
    //   targetKey: "accountNumber",
    //   as: "Sender",
    // });
    // this.belongsTo(models.User, {
    //   foreignKey: "receiverAccount",
    //   targetKey: "accountNumber",
    //   as: "Receiver",
    // });
  }
}

export default Transaction;
