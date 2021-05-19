"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Donation.belongsTo(models.User, {
        foreignKey: { allowNull: false },
      });
      Donation.belongsTo(models.Campaigns, {
        foreignKey: { allowNull: false },
      });
    }
  }
  Donation.init(
    {
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      proof: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Donation",
    }
  );
  return Donation;
};
