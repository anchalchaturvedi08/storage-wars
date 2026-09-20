const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"]
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller is required"]
        },

        startingPrice: {
            type: Number,
            required: [true, "Starting price is required"],
            min: 0
        },

        startTime: {
            type: Date,
            required: [true, "Auction start time is required"]
        },

        endTime: {
            type: Date,
            required: [true, "Auction end time is required"]
        },

        currentBid: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["upcoming", "live", "completed", "cancelled"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;