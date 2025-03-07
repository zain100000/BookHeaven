const mongoose = require("mongoose");

// Define the schema for the Order model
const orderSchema = new mongoose.Schema(
  {
    // ID of the user who placed the order (references the User model, required)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Array of items in the order
    items: [
      {
        // ID of the book in the order (references the Book model)
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        // Quantity of the book in the order (default: 1)
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // Status of the order (enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, default: PENDING)
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    // Timestamp of when the order was placed (default: current time)
    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Order model
module.exports = mongoose.model("Order", orderSchema);
