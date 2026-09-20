const Order = require("../models/Order.model");
const Bid = require("../models/Bid.model");
const User = require("../models/User.model");
const Auction = require("../models/Auction.model");

const getReports = async (req, res) => {
    try {
        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const startOfYear = new Date(
            now.getFullYear(),
            0,
            1
        );

        const totalSalesResult = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalSales =
            totalSalesResult[0]?.total || 0;

        const bidsThisMonth = await Bid.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        });

        const newUsers = await User.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        });

        const completedAuctions =
            await Auction.countDocuments({
                status: "completed"
            });

        const totalOrders = await Order.countDocuments({
            status: { $ne: "cancelled" }
        });

        const conversion =
            completedAuctions > 0
                ? Math.round(
                      (totalOrders /
                          completedAuctions) *
                          100
                  )
                : 0;

        const monthlyPerformance =
            await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfYear
                        },
                        status: {
                            $ne: "cancelled"
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: "$createdAt"
                            }
                        },
                        sales: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $sort: {
                        "_id.month": 1
                    }
                }
            ]);

        res.status(200).json({
            success: true,
            reports: {
                totalSales,
                bidsThisMonth,
                newUsers,
                conversion,
                monthlyPerformance
            }
        });

    } catch (error) {
        console.error(
            "GET REPORTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch reports",
            error: error.message
        });
    }
};

module.exports = {
    getReports
};