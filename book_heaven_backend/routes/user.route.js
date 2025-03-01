const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const userController = require("../controllers/user.controller");

router.post(
  "/signup-user",
  profilePictureUpload.upload,
  userController.registerUser
);

router.post("/signin-user", userController.loginUser);

router.get("/get-user-by-id/:id", protect, userController.getUserById);

router.patch("/reset-user-password", protect, userController.resetUserPassword);

router.post("/logout-user", protect, userController.logoutUser);

module.exports = router;
