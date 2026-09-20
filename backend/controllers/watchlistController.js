const Watchlist = require("../models/Watchlist.model");

// Add to Watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { auction } = req.body;

        const watchlist = await Watchlist.create({
            user: req.user.id,
            auction
        });

        res.status(201).json({
            success: true,
            message: "Auction added to watchlist",
            watchlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add auction to watchlist",
            error: error.message
        });
    }
};

// Get My Watchlist
const getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({
            user: req.user.id
        })
            .populate({
                path: "auction",
                populate: [
                    {
                        path: "product",
                        select: "name images description category",
                        populate: {
                            path: "category",
                            select: "name"
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Watchlist fetched successfully",
            watchlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch watchlist",
            error: error.message
        });
    }
};

// Remove from Watchlist
const removeFromWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!watchlist) {
            return res.status(404).json({
                success: false,
                message: "Watchlist item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Auction removed from watchlist"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove from watchlist",
            error: error.message
        });
    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
};