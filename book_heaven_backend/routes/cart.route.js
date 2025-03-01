const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const cartController = require("../controllers/cart.controller");

router.post("/add-to-cart", protect, cartController.addToCart);
router.post("/remove-from-cart", protect, cartController.removeFromCart);

module.exports = router;
