const express = require("express");

const jwt = require("express-jwt");
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const router = express.Router();

const {
  createUser,
  readUsers,
  deleteUser,
  userAuth,
  checkAuth,
  getProfile,
  updateProfile,
} = require("../controllers/user");
const {
  createCampaign,
  readCampaign,
  updateCampaign,
  deleteCampaign,
  readDetailCampaign,
} = require("../controllers/campaign");
const {
  updateUserDonation,
  createUserDonation,
  readUserDonation,
  approveUserDonation,
} = require("../controllers/donation");

router.post("/login", userAuth);
router.get("/check-auth", auth, checkAuth);
router.post("/register", createUser);
router.get("/users", readUsers);
router.get("/profile", auth, getProfile);
router.patch("/updateprofile", auth, uploadFile("imageFile"), updateProfile);
router.delete("/user/:id", auth, deleteUser);

router.post("/fund", auth, uploadFile("imageFile"), createCampaign);
router.get("/funds", readCampaign);
router.get("/fund/:id", readDetailCampaign);
router.patch("/fund/:id", auth, updateCampaign);
router.delete("/fund/:id", auth, deleteCampaign);

router.post(
  "/donate/:fundid",
  auth,
  uploadFile("imageFile"),
  createUserDonation
);
router.patch("/donate/:fundid", auth, updateUserDonation);
router.patch("/donate/:fundid/:donateid", auth, approveUserDonation);
router.get("/donations", readUserDonation);

module.exports = router;
