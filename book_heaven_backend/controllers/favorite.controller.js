const User = require("../models/user.model");
const Book = require("../models/book.model");

// Add a book to the user's favorites
exports.addToFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Check if the book is already in the user's favorites
    const existingFavorite = user.favorites.find(
      (fav) => fav.favoriteId.toString() === bookId
    );

    if (existingFavorite) {
      // If the book is already in favorites, return an error
      return res.status(400).json({
        success: false,
        message: "Book is already in favorites",
      });
    }

    // Add the book to the user's favorites
    user.favorites.push({ favoriteId: bookId, userId });

    // Save the updated user document
    await user.save();

    // Return success response with the updated favorites
    res.status(200).json({
      success: true,
      message: "Book added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a book from the user's favorites
exports.removeFromFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Check if the book exists in the user's favorites
    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.favoriteId.toString() === bookId
    );

    if (favoriteIndex === -1) {
      // If the book is not in favorites, return an error
      return res.status(400).json({
        success: false,
        message: "Book not found in favorites",
      });
    }

    // Remove the book from the user's favorites
    user.favorites.splice(favoriteIndex, 1);

    // Save the updated user document
    await user.save();

    // Return success response with the updated favorites
    res.status(200).json({
      success: true,
      message: "Book removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};
