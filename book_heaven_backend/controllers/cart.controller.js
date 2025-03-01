const User = require("../models/user.model");
const Book = require("../models/book.model");

exports.addToCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // ✅ Now correctly using user ID

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

    // Check if book is already in cart
    const bookIndex = user.cart.findIndex(
      (item) => item.bookId.toString() === bookId
    );
    if (bookIndex !== -1) {
      user.cart[bookIndex].quantity += 1;
    } else {
      user.cart.push({ bookId, quantity: 1, userId });
    }

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Book added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // ✅ Use req.user.id

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

    // Find book in the cart
    const bookIndex = user.cart.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (bookIndex !== -1) {
      // If quantity is more than 1, decrement; otherwise, remove from cart
      if (user.cart[bookIndex].quantity > 1) {
        user.cart[bookIndex].quantity -= 1;
      } else {
        user.cart.splice(bookIndex, 1); // Remove book if quantity is 1
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Book not in cart" });
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Book removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
