const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const cartController = require("../controllers/cart.controller");

// Route to add a book to the user's cart (requires authentication)
router.post("/add-to-cart", protect, cartController.addToCart);

// Route to remove a book from the user's cart (requires authentication)
router.post("/remove-from-cart", protect, cartController.removeFromCart);

// Export the router for use in the main application
module.exports = router;