const express = require("express");

const {
    placeBid,
    getBids,
    getAllBids,
    getMyBids,
    updateBidStatus
} = require("../controllers/bidController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();


// Place Bid
router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    placeBid
);


// Get All Bids - Admin, Seller
router.get(
    "/",
    protect,
    authorizeRoles("admin", "seller"),
    getAllBids
);


// Get My Bids - Customer
router.get(
    "/my",
    protect,
    authorizeRoles("customer"),
    getMyBids
);


// Get Bids of One Auction
router.get(
    "/:auctionId",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getBids
);

// Update Bid Status - Seller/Admin
router.patch(
    "/:bidId/status",
    protect,
    authorizeRoles("admin", "seller"),
    updateBidStatus
);

module.exports = router;