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

        // Highest bid PLACED, regardless of approval.
        //
        // This is deliberately NOT the display price. Its job is to make the
        // atomic guard in placeBid work: the conditional findOneAndUpdate
        // filters on currentBid < amount, which is what stops two simultaneous
        // bids of the same value both being accepted. If this field only moved
        // on approval, that guard would have nothing to compare against.
        currentBid: {
            type: Number,
            default: 0,
            min: 0
        },

        // Highest APPROVED bid - the price shown to users.
        //
        // Maintained by updateBidStatus: raised on approval, recomputed on
        // rejection. Zero means no bid has been approved yet, so the UI falls
        // back to startingPrice.
        highestApprovedBid: {
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