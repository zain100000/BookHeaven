const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const orderController = require("../controllers/order.controller");

router.post("/place-order", protect, orderController.placeOrder);
router.get("/get-all-orders", protect, orderController.getAllOrders);
router.put("/cancel-order/:id", protect, orderController.cancelOrder);
router.patch(
  "/update-order-status/:id",
  protect,
  orderController.updateOrderStatus
);

module.exports = router;
