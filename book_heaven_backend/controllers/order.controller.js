const User = require("../models/user.model");
const Order = require("../models/order.model");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const { items } = req.body; // items = [{ bookId, quantity }]

    // Check if the cart is empty
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      status: "PENDING", // Default status is PENDING
    });

    // Save the new order to the database
    await newOrder.save();

    // Add the order reference to the user's orders array
    const user = await User.findById(userId);
    user.orders.push({ orderId: newOrder._id, status: "PENDING" });

    // Save the updated user document
    await user.save();

    // Return success response with the new order
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all orders (for SuperAdmin or the logged-in user)
exports.getAllOrders = async (req, res) => {
  try {
    const { id: userId, role } = req.user; // Extract user ID and role from the authenticated request

    if (role === "SUPERADMIN") {
      // If the user is a SuperAdmin, fetch all orders from all users
      const allOrders = await Order.find().populate("userId items.bookId");
      return res.status(200).json({ success: true, orders: allOrders });
    }

    // If the user is not a SuperAdmin, fetch only their orders
    const user = await User.findById(userId).populate("orders.orderId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return success response with the user's orders
    res.status(200).json({ success: true, orders: user.orders });
  } catch (error) {
    // Handle server errors
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const { id } = req.params; // Extract order ID from the request parameters

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if the order can be canceled (only PENDING orders can be canceled)
    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be canceled after it has been shipped",
      });
    }

    // Update the order status to CANCELLED
    order.status = "CANCELLED";
    await order.save();

    // Update the order status in the user's orders array
    const userOrder = user.orders.find((o) => o.orderId.toString() === id);
    if (userOrder) {
      userOrder.status = "CANCELLED";
      await user.save();
    }

    // Return success response with the canceled order
    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      order,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update the status of an order (only for SuperAdmin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // Extract the new status from the request body
    const { id } = req.params; // Extract order ID from the request parameters
    const userRole = req.user.role; // Extract user role from the authenticated request

    // Check if the user is a SuperAdmin
    if (userRole !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admin can update order status",
      });
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Validate the new status
    if (
      !["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Update the order status in the user's orders array
    const user = await User.findById(order.userId);
    if (user) {
      const userOrder = user.orders.find((o) => o.orderId.toString() === id);
      if (userOrder) {
        userOrder.status = status;
        await user.save();
      }
    }

    // Return success response with the updated order
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: "Server error" });
  }
};
