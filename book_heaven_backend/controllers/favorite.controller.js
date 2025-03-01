const User = require("../models/user.model");
const Book = require("../models/book.model");

exports.addToFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Check if book is already in favorites
    const existingFavorite = user.favorites.find(
      (fav) => fav.favoriteId.toString() === bookId
    );

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Book is already in favorites",
      });
    }

    user.favorites.push({ favoriteId: bookId, userId });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Book added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeFromFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Check if book exists in favorites
    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.favoriteId.toString() === bookId
    );

    if (favoriteIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Book not found in favorites",
      });
    }

    // Remove the book from favorites
    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Book removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
