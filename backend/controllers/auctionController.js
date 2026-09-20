const Auction = require("../models/Auction.model");
const Bid = require("../models/Bid.model");

// Automatically update auction status
const updateAuctionStatuses = async () => {
  try {
    const now = new Date();
    await Auction.updateMany(
      {
        startTime: { $lte: now },
        endTime: { $gt: now },
        status: "upcoming",
      },
      {
        $set: { status: "live" },
      },
    );
    await Auction.updateMany(
      {
        endTime: { $lte: now },
        status: { $ne: "completed" },
      },
      {
        $set: { status: "completed" },
      },
    );
  } catch (error) {
    console.error("AUTO STATUS UPDATE ERROR:", error.message);
  }
};

// create auction
const createAuction = async (req, res) => {
  try {
    const { product, startingPrice, startTime, endTime } = req.body;
    const auction = await Auction.create({
      product,
      seller: req.user.id,
      startingPrice,
      startTime,
      endTime,
      currentBid: 0,
      status: "upcoming",
    });
    res.status(201).json({
      success: true,
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    console.error("CREATE AUCTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Auction creation failed",
      error: error.message,
    });
  }
};

// get all auction
const getAuctions = async (req, res) => {
  try {
    await updateAuctionStatuses();

    const auctions = await Auction.find()
      .populate("product", "name images description category")
      .populate("seller", "name email");

    res.status(200).json({
      success: true,
      message: "Auctions fetched successfully",
      auctions,
    });
  } catch (error) {
    console.error("GET AUCTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch auctions",
      error: error.message,
    });
  }
};

// get single auction
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("product", "name images description category")
      .populate("seller", "name email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Auction fetched successfully",
      auction,
    });
  } catch (error) {
    console.error("GET AUCTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch auction",
      error: error.message,
    });
  }
};

// update auction
const updateAuction = async (req, res) => {
  try {
    const { product, startingPrice, startTime, endTime, status } = req.body;

    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    if (
      req.user.role === "seller" &&
      String(auction.seller) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own auctions",
      });
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    auction.product = product;
    auction.startingPrice = startingPrice;
    auction.startTime = startTime;
    auction.endTime = endTime;
    auction.status = status;

    await auction.save();

    res.status(200).json({
      success: true,
      message: "Auction updated successfully",
      auction,
    });
  } catch (error) {
    console.error("UPDATE AUCTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Auction update failed",
      error: error.message,
    });
  }
};

// delete auction
const deleteAuction = async (req, res) => {
  try {
    // Find auction first
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Seller can delete only own auction
    if (
      req.user.role === "seller" &&
      String(auction.seller) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own auctions",
      });
    }

    await auction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AUCTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Auction deletion failed",
      error: error.message,
    });
  }
};

// Get Auction Winner
const getAuctionWinner = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      "product",
      "name",
    );

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Find highest approved bid
    const winningBid = await Bid.findOne({
      auction: req.params.id,
      status: "approved",
    })
      .sort({ amount: -1 })
      .populate("bidder", "name email");

    // No approved bid
    if (!winningBid) {
      return res.status(404).json({
        success: false,
        message: "No approved bids found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Auction winner found",
      winner: {
        bidder: winningBid.bidder,
        amount: winningBid.amount,
        auction: auction.product,
      },
    });
  } catch (error) {
    console.error("GET AUCTION WINNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to find auction winner",
      error: error.message,
    });
  }
};

// exports
module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  getAuctionWinner,
};
