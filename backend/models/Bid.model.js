const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: [true, "Auction is required"]
        },

        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Bidder is required"]
        },

        amount: {
            type: Number,
            required: [true, "Bid amount is required"],
            min: 0
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;

// Isme 3 main fields hain
// 1. auction
// Ye batayega ki bid kis auction par lagayi gayi hai.
// 2. bidder
// Ye batayega ki bid kis customer ne lagayi.
// 3. amount
// Ye actual bid amount hai, jaise ₹5,000.