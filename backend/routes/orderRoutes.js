const express = require("express");

const {
    createOrder,
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getMyWonAuctions,
    getOrderById,
    updateOrder,
    deleteOrder,
    createOrderFromAuction,
    razorpayWebhook
} = require("../controllers/orderController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// PUBLIC - Razorpay calls this server-to-server and is not logged in.
// It is authenticated by the x-razorpay-signature header instead.
// Declared first so no auth middleware can intercept it.
router.post("/webhook", razorpayWebhook);

router.post("/", protect, authorizeRoles("customer"), createOrder);

router.post("/create-payment", protect, authorizeRoles("customer"), createPaymentOrder);

router.post("/verify-payment", protect, authorizeRoles("customer"), verifyPayment);

router.get("/", protect, authorizeRoles("admin", "seller", "customer"), getOrders);

router.get("/won", protect, authorizeRoles("customer"), getMyWonAuctions);

router.post("/from-auction/:auctionId", protect, authorizeRoles("admin"), createOrderFromAuction);

router.get("/:id", protect, authorizeRoles("admin", "seller", "customer"), getOrderById);

router.patch("/:id", protect, authorizeRoles("admin", "seller", "customer"), updateOrder);

router.delete("/:id", protect, authorizeRoles("admin"), deleteOrder);

module.exports = router;