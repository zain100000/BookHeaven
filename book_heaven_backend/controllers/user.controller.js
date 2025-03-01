const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      phone,
      address,
      cart,
      favorites,
      orders,
    } = req.body;

    const existingUser = await User.findOne({
      email,
      role: "USER",
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    let userProfileImageUrl = null;
    if (req.files?.profilePicture) {
      const uploadResult = await profilePictureUpload.uploadToCloudinary(
        req.files.profilePicture[0],
        "profilePicture"
      );
      userProfileImageUrl = uploadResult.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      profilePicture: userProfileImageUrl,
      userName,
      email,
      password: hashedPassword,
      phone,
      address,
      cart,
      favorites,
      orders,
      role: "USER",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const payload = {
      role: "USER",
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error Generating Token!",
          });
        }

        res.json({
          success: true,
          message: "User Login Successfully",
          data: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Logging In!",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the userId from the request parameters

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    res.json({
      success: true,
      message: "User Fetched Successfully",
      user: user, // Return the single super admin
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting User!",
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Resetting Password!",
    });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout SuccessFully!",
      token: null,
    });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
