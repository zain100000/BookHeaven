const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const favoriteController = require("../controllers/favorite.controller");

// Route to add a book to the user's favorites (requires authentication)
router.post("/add-to-favorite", protect, favoriteController.addToFavorite);

// Route to remove a book from the user's favorites (requires authentication)
router.post("/remove-from-favorite", protect, favoriteController.removeFromFavorite);

// Export the router for use in the main application
module.exports = router;