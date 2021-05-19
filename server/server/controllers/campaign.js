const { Campaigns, Donation, sequelize } = require("../../models");
const { literal } = require("sequelize");
const path = process.env.FILE_PATH;

exports.createCampaign = async (req, res) => {
  try {
    const id = req.userId;
    const thumbnail = req.files.imageFile[0].filename;

    const campaign = await Campaigns.create({
      ...req.body,
      thumbnail,
      UserId: id,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        campaign,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.readCampaign = async (req, res) => {
  try {
    let dataCampaign = await Campaigns.findAll({
      include: [
        {
          model: Donation,
          as: "donationList",
          attributes: [
            "id",
            [
              literal(`(
                  SELECT User.fullName
                  FROM Users AS User
                  WHERE User.id = donationList.UserId
                )`),
              "fullname",
            ],
            [
              literal(`(
                  SELECT User.email
                  FROM Users AS User
                  WHERE User.id = donationList.UserId
                )`),
              "email",
            ],
            "amount",
            "status",
            "proof",
          ],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "thumbnail",
        "goals",
        [
          literal(`(
            SELECT SUM(amount) FROM Donations
            WHERE Donations.CampaignId=Campaigns.id 
            AND Donations.status="Finished"
          )`),
          "totaldonation",
        ],
      ],
    });

    const parseJSON = JSON.parse(JSON.stringify(dataCampaign));

    data = parseJSON.map((item) => {
      return {
        ...item,
        thumbnail: path + item.thumbnail,
      };
    });

    res.send({
      status: "success",
      data: {
        funds: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.readDetailCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    let detailCampaign = await Campaigns.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Donation,
          as: "donationList",
          attributes: [
            "id",
            [
              literal(`(
              SELECT User.fullName
              FROM Users AS User
              WHERE User.id = donationList.UserId
            )`),
              "fullname",
            ],
            [
              literal(`(
              SELECT User.email
              FROM Users AS User
              WHERE User.id = donationList.UserId
            )`),
              "email",
            ],
            "amount",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("donationList.updatedAt"),
                "%W, %d %M %Y"
              ),
              "updatedAt",
            ],
            "status",
            "proof",
          ],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "thumbnail",
        "goals",
        [
          literal(`(
            SELECT SUM(amount) FROM Donations
            WHERE Donations.CampaignId=Campaigns.id 
            AND Donations.status="Finished"
          )`),
          "totaldonation",
        ],
      ],
    });

    const parseJSON = JSON.parse(JSON.stringify(detailCampaign));
    const test = JSON.parse(JSON.stringify(detailCampaign.donationList));

    datadonation = test.map((item) => {
      return {
        ...item,
        proof: path + item.proof,
      };
    });
    data = [parseJSON].map((item) => {
      return {
        ...item,
        donationList: datadonation,
        thumbnail: path + item.thumbnail,
      };
    });
    res.send({
      status: "success",
      data: {
        funds: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaigns.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!campaign) {
      return res.status(500).send({
        status: "failed",
        message: "fund data not found",
      });
    }

    const updateData = { ...req.body };

    await Campaigns.update(updateData, {
      where: { id },
    });
    res.send({
      status: "succes",
      data: {
        campaign,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Campaigns.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(500).send({
        status: "failed",
        message: "data not found",
      });
    }

    await Campaigns.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "success",
      message: "resource has been deleted",
      data: {
        id: 1,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.socketGetCampaign = async (id) => {
  try {
    console.log("test");
    let detailCampaign = await Campaigns.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Donation,
          as: "donationList",
          attributes: [
            "id",
            [
              literal(`(
              SELECT user.fullName
              FROM users AS user
              WHERE user.id = donationList.UserId
            )`),
              "fullname",
            ],
            [
              literal(`(
              SELECT user.email
              FROM users AS user
              WHERE user.id = donationList.UserId
            )`),
              "email",
            ],
            "amount",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("donationList.updatedAt"),
                "%W, %d %M %Y"
              ),
              "updatedAt",
            ],
            "status",
            "proof",
          ],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "thumbnail",
        "goals",
        [
          literal(`(
            SELECT SUM(amount) FROM Donations
            WHERE Donations.CampaignId=Campaigns.id 
            AND Donations.status="Finished"
          )`),
          "totaldonation",
        ],
      ],
    });
    const parseJSON = JSON.parse(JSON.stringify(detailCampaign));
    const test = JSON.parse(JSON.stringify(detailCampaign.donationList));

    datadonation = test.map((item) => {
      return {
        ...item,
        proof: path + item.proof,
      };
    });
    data = [parseJSON].map((item) => {
      return {
        ...item,
        donationList: datadonation,
        thumbnail: path + item.thumbnail,
      };
    });
    res.send({
      status: "success",
      data: {
        funds: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
