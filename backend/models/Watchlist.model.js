const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },

        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: [true, "Auction is required"]
        }
    },
    {
        timestamps: true
    }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;

// Watchlist me hum store karenge:

// user → kis customer ne watchlist me add kiya
// auction → kaunsi auction watchlist me add ki

// Example: Customer ko koi auction pasand aayi → Add to Watchlist → ye document save hoga.