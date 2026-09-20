const Notification = require("../models/Notification.model");
const Bid = require("../models/Bid.model");
const Auction = require("../models/Auction.model");

// place bid
const placeBid = async (req, res) => {
    try {
        const { auction, amount } = req.body;

        // 1. Check auction
        const existingAuction = await Auction.findById(auction);

        if (!existingAuction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // 2. Seller cannot bid on own auction
        if (
            existingAuction.seller.toString() ===
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Seller cannot bid on own auction"
            });
        }

        // 3. Auction must be live
        if (existingAuction.status !== "live") {
            return res.status(400).json({
                success: false,
                message: "Auction is not live"
            });
        }

        // 4. Auction must not be expired
        if (
            new Date() >
            new Date(existingAuction.endTime)
        ) {
            return res.status(400).json({
                success: false,
                message: "Auction has ended"
            });
        }

        // 5. Validate bid amount
        if (
            !amount ||
            Number(amount) <=
                Number(existingAuction.currentBid)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Bid amount must be greater than current bid"
            });
        }

        // 6. Create bid
        const bid = await Bid.create({
            auction,
            bidder: req.user.id,
            amount: Number(amount),
            status: "pending"
        });

        // 7. Update current bid
        existingAuction.currentBid = Number(amount);

        await existingAuction.save();

        res.status(201).json({
            success: true,
            message: "Bid placed successfully",
            bid
        });

    } catch (error) {
        console.error(
            "PLACE BID ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to place bid",
            error: error.message
        });
    }
};

// get bids on one auction
const getBids = async (req, res) => {
    try {
        const bids = await Bid.find({
            auction: req.params.auctionId
        })
            .populate(
                "bidder",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            message: "Bids fetched successfully",
            bids
        });

    } catch (error) {
        console.error(
            "GET BIDS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch bids",
            error: error.message
        });
    }
};

// get all bids - admin, seller 
const getAllBids = async (req, res) => {
    try {
        const bids = await Bid.find()
            .populate({
                path: "auction",
                populate: [
                    {
                        path: "product",
                        select: "name"
                    },
                    {
                        path: "seller",
                        select: "name email"
                    }
                ]
            })
            .populate(
                "bidder",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        let filteredBids = bids;

        // Seller sees only bids
        // on their own auctions
        if (req.user.role === "seller") {
            filteredBids = bids.filter(
                (bid) =>
                    bid.auction &&
                    bid.auction.seller &&
                    String(
                        bid.auction.seller._id
                    ) === String(req.user.id)
            );
        }

        res.status(200).json({
            success: true,
            message: "Bids fetched successfully",
            bids: filteredBids
        });

    } catch (error) {
        console.error(
            "GET ALL BIDS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch bids",
            error: error.message
        });
    }
};

// get my bids - customer
const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({
            bidder: req.user.id
        })
            .populate({
                path: "auction",
                populate: {
                    path: "product",
                    select: "name"
                }
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            message: "My bids fetched successfully",
            bids
        });

    } catch (error) {
        console.error(
            "GET MY BIDS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch my bids",
            error: error.message
        });
    }
};

// update bid status - admin, seller 
const updateBidStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // 1. Validate status
        if (
            !["approved", "rejected"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be approved or rejected"
            });
        }

        // 2. Find bid
        const bid = await Bid.findById(
            req.params.bidId
        ).populate({
            path: "auction",
            populate: {
                path: "seller",
                select: "name email"
            }
        });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: "Bid not found"
            });
        }

        // 3. Check auction exists
        if (!bid.auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // 4. Seller can manage only own auction bids
        if (
            req.user.role === "seller" &&
            String(
                bid.auction.seller?._id
            ) !== String(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only manage bids on your own auctions"
            });
        }

        // 5. Update status
        bid.status = status;

        await bid.save();

        // 6. Notification
        await Notification.create({
            user: bid.bidder,
            message:
                status === "approved"
                    ? "Your bid has been approved."
                    : "Your bid has been rejected.",
            type: "bid"
        });

        res.status(200).json({
            success: true,
            message:
                status === "approved"
                    ? "Bid approved successfully"
                    : "Bid rejected successfully",
            bid
        });

    } catch (error) {
        console.error(
            "UPDATE BID STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update bid status",
            error: error.message
        });
    }
};

// exports
module.exports = {
    placeBid,
    getBids,
    getAllBids,
    getMyBids,
    updateBidStatus
};