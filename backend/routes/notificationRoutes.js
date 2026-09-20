const express = require("express");

const {
    createNotification,
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create Notification
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createNotification
);

// Get My Notifications
router.get(
    "/",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getNotifications
);

// Mark Notification as Read
router.patch(
    "/:id/read",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    markAsRead
);

module.exports = router;