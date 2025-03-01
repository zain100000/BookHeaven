const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const favoriteController = require("../controllers/favorite.controller");

router.post("/add-to-favorite", protect, favoriteController.addToFavorite);
router.post("/remove-from-favorite", protect, favoriteController.removeFromFavorite);

module.exports = router;
