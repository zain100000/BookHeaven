const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const superAdminController = require("../controllers/super-admin.controller");

router.post(
  "/signup-super-admin",
  profilePictureUpload.upload,
  superAdminController.registerSuperAdmin
);

router.post("/signin-super-admin", superAdminController.loginSuperAdmin);

router.get(
  "/get-super-admin-by-id/:id",
  protect,
  superAdminController.getSuperAdminById
);

router.patch(
  "/reset-super-admin-password",
  protect,
  superAdminController.resetSuperAdminPassword
);

router.post(
  "/logout-super-admin",
  protect,
  superAdminController.logoutSuperAdmin
);

router.get("/get-all-users", protect, superAdminController.getUsers);

module.exports = router;
