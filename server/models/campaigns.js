"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Campaigns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Campaigns.belongsTo(models.User, {});
      Campaigns.hasMany(models.Donation, {
        as: "donationList",
      });
    }
  }
  Campaigns.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      goals: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Campaigns",
    }
  );
  return Campaigns;
};
