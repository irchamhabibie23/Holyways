const { User, Campaigns, Donation, sequelize } = require("../../models");
const { literal } = require("sequelize");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;
const path = process.env.FILE_PATH;

exports.userAuth = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const schema = joi.object({
      email: joi.string().email().min(6).required(),
      password: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }
    const auth = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["phone", "createdAt", "updatedAt", "thumbnail"],
      },
    });

    if (!auth) {
      return res.send({
        status: "failed",
        message: "Invalid Email or Password",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(password, auth.password);

    if (!isPasswordMatch) {
      return res.send({
        status: "failed",
        message: "Invalid Email or Password",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["phone", "password", "createdAt", "updatedAt", "thumbnail"],
      },
    });

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: JSON.stringify(user.id),
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          fullname: user.fullname,
          email: user.email,
          token: token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.userId;

    const dataUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.send({
      status: "success",
      message: "user valid",
      data: {
        user: {
          id: dataUser.id,
          fullname: dataUser.fullname,
          email: dataUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const schema = joi.object({
      email: joi.string().email().min(6).required(),
      password: joi.string().required(),
      fullname: joi.string().min(3).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }
    const isRegistered = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["phone", "createdAt", "updatedAt", "thumbnail"],
      },
    });

    if (!isRegistered) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      await User.create({ ...req.body, thumbnail: "conten.png" });

      const user = await User.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ["phone", "createdAt", "updatedAt", "thumbnail", "password"],
        },
      });

      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: JSON.stringify(user.id),
        },
        secretKey
      );

      return res.send({
        status: "success",
        data: {
          user: {
            email: user.email,
            token: token,
          },
        },
      });
    }
    return res.send({
      status: "failed",
      message: "Your email has been registred",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.readUsers = async (req, res) => {
  try {
    const dataUsers = await User.findAll({
      include: [
        {
          model: Donation,
          as: "donationList",
        },
        {
          model: Campaigns,
          as: "myfundlist",
          attributes: [
            "id",
            "title",
            "description",
            "goals",
            [
              literal(`(
              SELECT SUM(amount) FROM Donations
              WHERE Donations.CampaignId=myfundlist.id
            )`),
              "totaldonation",
            ],
          ],
        },
      ],
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    // console.log(JSON.stringify(kocam));

    res.send({
      status: "success",
      data: {
        users: dataUsers,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (user) {
      await User.destroy({
        where: {
          id,
        },
      });
      return res.send({
        status: "success",
        message: "resource has been deleted",
        data: {
          id: 1,
        },
      });
    }
    return res.send({
      status: "failed",
      message: "data not found",
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.userId;
    const profile = await User.findOne({
      where: { id },
      include: [
        {
          model: Donation,
          as: "donationList",
          attributes: [
            "amount",
            "status",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("donationList.updatedAt"),
                "%W, %d %M %Y"
              ),
              "updatedAt",
            ],
            [
              literal(`(
            SELECT Campaigns.title FROM Campaigns
            WHERE donationList.CampaignId=Campaigns.id
          )`),
              "title",
            ],
          ],
        },
        {
          model: Campaigns,
          as: "myfundlist",
          attributes: [
            "id",
            "title",
            "description",
            "thumbnail",
            "goals",
            [
              literal(`(
                SELECT SUM(amount) FROM Donations
                WHERE Donations.CampaignId=myfundlist.id 
                AND Donations.status="Finished"
              )`),
              "totaldonation",
            ],
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!profile) {
      return res.send({
        status: "failed",
        message: "User data not found",
      });
    }

    const parseJSON = JSON.parse(JSON.stringify(profile));
    const test = JSON.parse(JSON.stringify(profile.myfundlist));
    datamyfunds = test.map((item) => {
      return {
        ...item,
        thumbnail: path + item.thumbnail,
      };
    });
    data = [parseJSON].map((item) => {
      return {
        ...item,
        myfundlist: datamyfunds,
        thumbnail: path + item.thumbnail,
      };
    });

    res.send({
      status: "succes",
      data: {
        profile: data,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.userId;
    const campaign = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!campaign) {
      return res.send({
        status: "failed",
        message: "User data not found",
      });
    }

    const thumbnail = req.files.imageFile[0].filename;
    const path = process.env.PATH;

    const updateData = { ...req.body, thumbnail };

    await User.update(updateData, {
      where: { id },
    });
    res.send({
      status: "succes",
      data: {
        ...updateData,
        thumbnail: path + image,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
