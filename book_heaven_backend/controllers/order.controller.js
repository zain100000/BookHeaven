const User = require("../models/user.model");
const Order = require("../models/order.model");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // items = [{ bookId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      status: "PENDING",
    });

    await newOrder.save();

    // Add order reference to user
    const user = await User.findById(userId);
    user.orders.push({ orderId: newOrder._id, status: "PENDING" });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    if (role === "SUPERADMIN") {
      // Super Admin: Fetch all orders from all users
      const allOrders = await Order.find().populate("userId items.bookId");
      return res.status(200).json({ success: true, orders: allOrders });
    }

    // Normal User: Fetch only their orders
    const user = await User.findById(userId).populate("orders.orderId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, orders: user.orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be canceled after it has been shipped",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    // Update user's order status
    const userOrder = user.orders.find((o) => o.orderId.toString() === id);
    if (userOrder) {
      userOrder.status = "CANCELLED";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const userRole = req.user.role; // Extract role from token

    if (userRole !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admin can update order status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      !["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    order.status = status;
    await order.save();

    // Update status in User's orders array
    const user = await User.findById(order.userId);
    if (user) {
      const userOrder = user.orders.find((o) => o.orderId.toString() === id);
      if (userOrder) {
        userOrder.status = status;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
