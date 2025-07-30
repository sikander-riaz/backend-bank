import Sequelize, { Model } from "sequelize";

class Transactions extends Model {
  static init(sequelize) {
    super.init(
      {
        trans_id: Sequelize.INT,
        acc_number: Sequelize.INT, //fk
        to_account: Sequelize.INT,
        from_account: Sequelize.INT,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: "acc_number",
      foreignKey: "acc_number",
    });
  }
}

export default Address;
