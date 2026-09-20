const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: [true, "Auction is required"]
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"]
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Buyer is required"]
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller is required"]
        },

        amount: {
            type: Number,
            required: [true, "Order amount is required"],
            min: 0
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        razorpayOrderId: {
            type: String
        },

        razorpayPaymentId: {
            type: String
        },

        razorpaySignature: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;


// Order tab create hoga jab customer auction jeetega.
// Isme mainly ye information rahegi:
// auction → kaunsi auction
// product → kaunsa product
// buyer → kis customer ne jeeta
// seller → kis seller ka product tha
// amount → winning bid amount
// status → order ki current condition