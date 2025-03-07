const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");

// Register a new user
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

    // Check if a user with the same email already exists
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

    // Upload profile picture to Cloudinary if provided
    let userProfileImageUrl = null;
    if (req.files?.profilePicture) {
      const uploadResult = await profilePictureUpload.uploadToCloudinary(
        req.files.profilePicture[0],
        "profilePicture"
      );
      userProfileImageUrl = uploadResult.url;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
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

    // Save the user to the database
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    // Handle server errors
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    // Generate a JWT token
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
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error Generating Token!",
          });
        }

        // Return success response with the token
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
    // Handle server errors
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Logging In!",
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from the request parameters

    // Find the user by ID and exclude the password field
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    // Return success response with the user details
    res.json({
      success: true,
      message: "User Fetched Successfully",
      user: user,
    });
  } catch (err) {
    // Handle server errors
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting User!",
    });
  }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    // Handle server errors
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Resetting Password!",
    });
  }
};

// Logout user
exports.logoutUser = async (req, res, next) => {
  try {
    // Return success response with a null token
    res.status(200).json({
      success: true,
      message: "Logout SuccessFully!",
      token: null,
    });
  } catch (err) {
    // Handle server errors
    console.error("Error Logging Out:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
