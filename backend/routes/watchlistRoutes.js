const express = require("express");

const {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
} = require("../controllers/watchlistController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    addToWatchlist
);

router.get(
    "/",
    protect,
    authorizeRoles("customer"),
    getWatchlist
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("customer"),
    removeFromWatchlist
);

module.exports = router;