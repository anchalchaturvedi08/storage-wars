const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Auction = require("./models/Auction.model");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const orderRoutes = require("./routes/orderRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");

const protect = require("./middlewares/authMiddleware");
const authorizeRoles = require("./middlewares/roleMiddleware");

const aiRoutes = require("./routes/aiRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Root route
app.get("/", (req, res) => {
    res.send("Storage Wars Backend is running...");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected test route
app.get("/api/test-protected", protect, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed successfully",
        user: req.user
    });
});

// Admin test route
app.get("/api/admin-test", protect, authorizeRoles("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin route accessed successfully"
        });
    }
);

// Category routes
app.use("/api/categories", categoryRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Auction routes
app.use("/api/auctions", auctionRoutes);

// Bid routes
app.use("/api/bids", bidRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Watchlist routes
app.use("/api/watchlist", watchlistRoutes);

// Notification routes
app.use("/api/notifications", notificationRoutes);

// User routes
app.use("/api/users", userRoutes);

// Report routes
app.use("/api/reports", reportRoutes);

// Ai routes
app.use("/api/ai", aiRoutes);

//Contact routes
app.use("/api/contact", contactRoutes);

// automatic auction status update
const updateAuctionStatuses = async () => {
    try {
        const now = new Date();

        // Upcoming → Live
        await Auction.updateMany(
            {
                status: "upcoming",
                startTime: { $lte: now },
                endTime: { $gt: now }
            },
            {
                $set: {
                    status: "live"
                }
            }
        );

        // Live → Completed
        await Auction.updateMany(
            {
                status: "live",
                endTime: { $lte: now }
            },
            {
                $set: {
                    status: "completed"
                }
            }
        );

        console.log(
            "Auction statuses updated:",
            now.toLocaleString()
        );

    } catch (error) {
        console.error(
            "AUCTION STATUS UPDATE ERROR:",
            error.message
        );
    }
};

// Run immediately when server starts
updateAuctionStatuses();

// Run every 1 minute
setInterval(
    updateAuctionStatuses,
    60 * 1000
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});