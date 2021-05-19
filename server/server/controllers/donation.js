const { Donation, Campaigns, User } = require("../../models");

exports.createUserDonation = async (req, res) => {
  try {
    const fundid = req.params.fundid;
    const id = req.userId;
    const proof = req.files.imageFile[0].filename;

    const donation = await Donation.create({
      ...req.body,
      UserId: id,
      CampaignId: fundid,
      proof: proof,
      status: "Pending",
    });

    res.status(200).send({
      status: "success",
      data: {
        donation,
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

exports.readUserDonation = async (req, res) => {
  try {
    const dataCampaign = await Donation.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        userDonations: dataCampaign,
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

exports.updateUserDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Donation.findOne({
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

    await Donation.update(updateData, {
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

exports.approveUserDonation = async (req, res) => {
  try {
    const { fundid, donateid } = req.params;
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    const campaign = await Donation.findOne({
      where: { id: donateid, CampaignId: fundid, UserId: user.id },
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

    const updateData = { status: req.body.status };

    await Donation.update(updateData, {
      where: { id: donateid, CampaignId: fundid, UserId: user.id },
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

exports.deleteUserDonation = async (req, res) => {
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
