const express = require("express");

const {
    createAuction,
    getAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
    getAuctionWinner
} = require("../controllers/auctionController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();


// Create Auction → Seller + Admin
router.post(
    "/",
    protect,
    authorizeRoles("seller", "admin"),
    createAuction
);


// Get All Auctions → Admin, Seller, Customer
router.get(
    "/",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getAuctions
);


// Get Auction Winner
router.get(
    "/:id/winner",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getAuctionWinner
);


// Get Single Auction
router.get(
    "/:id",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getAuctionById
);


// Update Auction → Seller + Admin
router.patch(
    "/:id",
    protect,
    authorizeRoles("seller", "admin"),
    updateAuction
);


// Delete Auction → Seller + Admin
router.delete(
    "/:id",
    protect,
    authorizeRoles("seller", "admin"),
    deleteAuction
);


module.exports = router;