const Order = require("../models/Order.model");
const Auction = require("../models/Auction.model");
const Bid = require("../models/Bid.model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

// Create Order
const createOrder = async (req, res) => {
    try {
        const {
            auction,
            product,
            seller,
            amount
        } = req.body;

        const order = await Order.create({
            auction,
            product,
            seller,
            buyer: req.user.id,
            amount
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: error.message
        });
    }
};

// createPaymentOrder
const createPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (String(order.buyer) !== String(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You can only pay for your own order"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This order is not available for payment"
            });
        }

        const options = {
            amount: Math.round(order.amount * 100),
            currency: "INR",
            receipt: `order_${order._id}`
        };

        const paymentOrder = await razorpay.orders.create(options);

        order.razorpayOrderId = paymentOrder.id;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            paymentOrder
        });

    } catch (error) {
        console.error("RAZORPAY ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Payment order creation failed",
            error: error.message
        });
    }
};

// verifyPayment
const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (String(order.buyer) !== String(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.status = "confirmed";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order
        });

    } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const filter = req.user.role === "seller"
            ? { seller: req.user.id }
            : { buyer: req.user.id };

        const orders = await Order.find(filter)
            .populate("product", "name")
            .populate("auction")
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

//getMyWonAuctions
// Get My Won Auctions
const getMyWonAuctions = async (req, res) => {
    try {
        const orders = await Order.find({
            buyer: req.user.id
        })
            .populate("product", "name images startingPrice")
            .populate("auction")
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Won auctions fetched successfully",
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch won auctions",
            error: error.message
        });
    }
};

// Get Single Order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("product", "name")
            .populate("auction")
            .populate("seller", "name email")
            .populate("buyer", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Seller can only view their own orders
        if (
            req.user.role === "seller" &&
            order.seller._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Customer can only view their own orders
        if (
            req.user.role === "customer" &&
            order.buyer._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// Update Order
const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            req.user.role === "customer" &&
            String(order.buyer) !== String(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own orders"
            });
        }

        if (
            req.user.role === "seller" &&
            String(order.seller) !== String(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own orders"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order
        });

    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Order update failed",
            error: error.message
        });
    }
};

// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order deletion failed",
            error: error.message
        });
    }
};

// Create Order from Completed Auction
const createOrderFromAuction = async (req, res) => {
    try {
        // 1. Find auction
        const auction = await Auction.findById(req.params.auctionId);

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // 2. Auction must be completed
        if (auction.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Auction is not completed"
            });
        }

        // 3. Find highest approved bid
        const winningBid = await Bid.findOne({
            auction: auction._id,
            status: "approved"
        }).sort({ amount: -1 });

        if (!winningBid) {
            return res.status(404).json({
                success: false,
                message: "No approved bids found"
            });
        }

        // 4. Check if order already exists
        const existingOrder = await Order.findOne({
            auction: auction._id
        });

        if (existingOrder) {
            return res.status(400).json({
                success: false,
                message: "Order already exists for this auction"
            });
        }

        // 5. Create order
        const order = await Order.create({
            auction: auction._id,
            product: auction.product,
            buyer: winningBid.bidder,
            seller: auction.seller,
            amount: winningBid.amount,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Order created from auction successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create order from auction",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getMyWonAuctions,
    getOrderById,
    updateOrder,
    deleteOrder,
    createOrderFromAuction
};