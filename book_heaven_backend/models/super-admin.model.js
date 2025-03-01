const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },

  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isSuperAdmin: {
    type: Boolean,
    default: true, // Always true for superadmins
  },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
