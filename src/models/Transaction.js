import { Model, DataTypes } from "sequelize";

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        // Define fields
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        acc_number: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        from_account: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        to_account: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Transaction",
        tableName: "transactions",
        timestamps: false, // ✅ This line must be here
      }
    );

    return this;
  }
}

export default Transaction;
