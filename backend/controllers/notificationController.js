const Notification = require("../models/Notification.model");
const Bid = require("../models/Bid.model");
const Auction = require("../models/Auction.model");

// Create Notification
const createNotification = async (req, res) => {
    try {
        const { user, message, type } = req.body;

        const notification = await Notification.create({
            user,
            message,
            type
        });

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Notification creation failed",
            error: error.message
        });
    }
};

// Get My Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            notifications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

// Mark Notification as Read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};