const User = require("../models/user.model");
const Book = require("../models/book.model");

// Add a book to the user's cart
exports.addToCart = async (req, res) => {
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

    // Check if the book is already in the user's cart
    const bookIndex = user.cart.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (bookIndex !== -1) {
      // If the book is already in the cart, increment its quantity
      user.cart[bookIndex].quantity += 1;
    } else {
      // If the book is not in the cart, add it with a quantity of 1
      user.cart.push({ bookId, quantity: 1, userId });
    }

    // Save the updated user document
    await user.save();

    // Return success response with the updated cart
    res
      .status(200)
      .json({ success: true, message: "Book added to cart", cart: user.cart });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a book from the user's cart
exports.removeFromCart = async (req, res) => {
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

    // Find the book in the user's cart
    const bookIndex = user.cart.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (bookIndex !== -1) {
      // If the book is in the cart, decrement its quantity or remove it
      if (user.cart[bookIndex].quantity > 1) {
        // If quantity is more than 1, decrement the quantity
        user.cart[bookIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove the book from the cart
        user.cart.splice(bookIndex, 1);
      }
    } else {
      // If the book is not in the cart, return an error
      return res
        .status(400)
        .json({ success: false, message: "Book not in cart" });
    }

    // Save the updated user document
    await user.save();

    // Return success response with the updated cart
    res.status(200).json({
      success: true,
      message: "Book removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};
