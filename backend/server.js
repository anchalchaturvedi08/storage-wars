const express = require("express");
const cors = require("cors");
const path = require("path");
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
// The Razorpay webhook signature is computed over the RAW request body.
// Once express.json() parses the stream the original bytes are gone, so
// the verify hook keeps a copy on req.rawBody for that one route.
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

connectDB();

// Serve the built React app from ./client
// Only matches files that exist; anything else falls through to the
// API routes below, then to the SPA fallback at the bottom.
app.use(express.static(path.join(__dirname, "client")));

// Health check. The old "/" text route moved here so that "/" can
// serve the React homepage instead.
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Storage Wars Backend is running...",
        time: new Date().toISOString()
    });
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

// Passenger (cPanel) idles the process when there is no traffic, so
// setInterval is unreliable in production. Locally it still runs; in
// production a cron job calls the endpoint below every minute.
if (process.env.NODE_ENV !== "production") {
    updateAuctionStatuses();

    setInterval(
        updateAuctionStatuses,
        60 * 1000
    );
}

// Cron endpoint, protected by a shared secret header
app.get("/api/cron/update-statuses", async (req, res) => {
    if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    await updateAuctionStatuses();

    res.json({
        success: true,
        ranAt: new Date().toISOString()
    });
});

// SPA fallback - MUST be the last route.
// Any GET that is not /api/* and did not match a real file returns
// index.html so React Router can handle the path on the client.
// Note: Express 5 throws on app.get("*"), so this uses middleware form.
app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();

    res.sendFile(
        path.join(__dirname, "client", "index.html"),
        (err) => {
            if (err) next();
        }
    );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});