import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        phone_number: Sequelize.STRING,
        acc_number: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: true,
        },
        password: Sequelize.VIRTUAL, // not saved in DB
        password_hash: Sequelize.STRING,
        balance: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
      }
    );

    this.addHook("beforeValidate", (user) => {
      if (user.password) {
        user.password_hash = bcrypt.hashSync(user.password, 8);
      }

      // generate 10-digit account number if not already set
      if (!user.acc_number) {
        user.acc_number = Math.floor(1000000000 + Math.random() * 9000000000);
      }
    });

    console.log("I am here accc ");
    return this;
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: "senderAccount",
      sourceKey: "acc_number",
      as: "sentTransactions",
    });
    this.hasMany(models.Transaction, {
      foreignKey: "receiverAccount",
      sourceKey: "acc_number",
      as: "receivedTransactions",
    });
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
