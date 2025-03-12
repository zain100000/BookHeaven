const User = require("../models/user.model");
const Order = require("../models/order.model");
const Book = require("../models/book.model");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    // Validate cart
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate stock and process items
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: `Book ${item.bookId} not found` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}`,
        });
      }
      // Reduce stock immediately
      book.stock -= item.quantity;
      await book.save();
    }

    // Create and save order
    const newOrder = new Order({ userId, items, status: "PENDING" });
    await newOrder.save();

    // Only add order reference to user (NOT library)
    user.orders.push({ orderId: newOrder._id, status: "PENDING" });
    await user.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { role } = req.user;
    let orders;

    if (role === "SUPERADMIN") {
      orders = await Order.find()
        .populate("userId") // All user fields
        .populate("items.bookId"); // All book fields
    } else {
      const user = await User.findById(req.user.id).populate({
        path: "orders.orderId",
        populate: [
          { path: "userId" }, // All user fields
          { path: "items.bookId" }, // All book fields
        ],
      });
      orders = user.orders;
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get order by id
exports.getOrderById = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params; // Order ID from URL params

    // Authorization check
    if (role !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admin can view orders",
      });
    }

    // Find order with full details
    const order = await Order.findById(id)
      .populate("userId") // All user fields
      .populate("items.bookId"); // All book fields

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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
    const { status } = req.body;
    const { id } = req.params;
    const userRole = req.user.role;

    // Authorization check
    if (userRole !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admin can update order status",
      });
    }

    // Find order with populated items
    const order = await Order.findById(id).populate("items.bookId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Prevent invalid transitions
    if (
      status === "CANCELLED" &&
      ["SHIPPED", "DELIVERED"].includes(order.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel shipped/delivered orders",
      });
    }

    const previousStatus = order.status;
    order.status = status;

    // Restore stock if cancelling
    if (status === "CANCELLED") {
      for (const item of order.items) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.stock += item.quantity;
          await book.save();
        }
      }
    }

    // Add to library ONLY when delivered
    if (status === "DELIVERED") {
      const user = await User.findById(order.userId);
      if (user) {
        for (const item of order.items) {
          const exists = user.library.some(
            (lib) => lib.bookId.toString() === item.bookId._id.toString()
          );

          if (!exists) {
            user.library.push({
              bookId: item.bookId._id,
              bookFile: item.bookId.bookFile,
              purchasedAt: new Date(),
            });
          }
        }
        await user.save();
      }
    }

    await order.save();

    // Update user's order status
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
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update payment status of an order (only for SuperAdmin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment } = req.body; // Get payment status from request body
    const { id } = req.params;
    const userRole = req.user.role;

    // Authorization check
    if (userRole !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only Super Admin can update payment status",
      });
    }

    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate payment status
    const validPaymentStatuses = ["PENDING", "PAID"];
    if (!validPaymentStatuses.includes(payment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status. Allowed values: PENDING, PAID",
      });
    }

    // Update payment status
    order.payment = payment;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Payment Status Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
