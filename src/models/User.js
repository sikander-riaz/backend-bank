import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone_number: Sequelize.STRING,
        acc_number: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: true,
        },
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: "User",
        timestamps: true,
      }
    );

    this.addHook("beforeCreate", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }

      user.acc_number = Math.floor(1000000000 + Math.random() * 9000000000);
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: "from_account",
      sourceKey: "acc_number",
      as: "sentTransactions",
    });

    this.hasMany(models.Transaction, {
      foreignKey: "to_account",
      sourceKey: "acc_number",
      as: "receivedTransactions",
    });
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.password_hash);
  }
}

export default User;
