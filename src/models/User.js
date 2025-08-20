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
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        balance: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        // 🔹 New fields for verification
        isVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        verificationToken: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        verificationTokenExpire: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
      }
    );

    this.addHook("beforeValidate", (user) => {
      if (!user.acc_number) {
        user.acc_number = Math.floor(1000000000 + Math.random() * 9000000000);
      }
    });

    this.addHook("beforeSave", (user) => {
      if (user.password) {
        user.password_hash = bcrypt.hashSync(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: "from_acc",
      sourceKey: "acc_number",
      as: "sentTransactions",
    });
    this.hasMany(models.Transaction, {
      foreignKey: "to_acc",
      sourceKey: "acc_number",
      as: "receivedTransactions",
    });
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
