import { Model, DataTypes } from "sequelize";

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        from_account: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        to_account: {
          type: DataTypes.BIGINT,
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
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "from_account",
      targetKey: "acc_number",
      as: "sender",
    });

    this.belongsTo(models.User, {
      foreignKey: "to_account",
      targetKey: "acc_number",
      as: "receiver",
    });
  }
}

export default Transaction;
