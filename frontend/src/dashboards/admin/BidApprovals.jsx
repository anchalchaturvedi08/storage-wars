import React, { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";

import DashboardLayout from "../../component/dashboard/DashboardLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./BidApprovals.css";

const money = (n) =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function AdminBids() {
    const [bids, setBids] = useState([]);

    // Fetch all bids
    const fetchBids = async () => {
        try {
            const response = await api.get("/bids");

            console.log("BIDS RESPONSE:", response.data);

            setBids(response.data.bids || []);

        } catch (error) {
            console.log("BID ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to fetch bids"
            );
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    // Update bid status
    const updateBidStatus = async (bidId, status) => {
        try {
            const response = await api.patch(
                `/bids/${bidId}/status`,
                {
                    status
                }
            );

            alert(
                response.data.message ||
                `Bid ${status} successfully`
            );

            // Refresh bids after update
            fetchBids();

        } catch (error) {
            console.error(
                "UPDATE BID ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update bid status"
            );
        }
    };

    return (
        <DashboardLayout
            role="admin"
            title="Bid Approvals"
        >
            <p className="mb-5 text-sm text-muted">
                Review and approve customer bids placed on auctions.
            </p>

            <DataTable
                headers={[
                    "Auction",
                    "Bidder",
                    "Amount",
                    "Status",
                    "Date"
                ]}
                rows={bids.map((bid) => [
                    bid.auction?.product?.name ||
                    bid.auction?._id ||
                    "N/A",

                    bid.bidder?.email ||
                    "N/A",

                    money(bid.amount),

                    bid.status,

                    new Date(
                        bid.createdAt
                    ).toLocaleDateString("en-IN")
                ])}
                actions={(row, index) => {
                    const bid = bids[index];

                    return (
                        <div className="flex gap-2">

                            {/* View */}
                            <button
                                className="rounded-lg bg-gray-100 p-2"
                                title="View Bid"
                                onClick={() =>
                                    alert(
                                        `Bid Amount: ${money(
                                            bid.amount
                                        )}\nStatus: ${bid.status}`
                                    )
                                }
                            >
                                <Eye size={16} />
                            </button>

                            {/* Approve */}
                            {bid.status === "pending" && (
                                <button
                                    className="rounded-lg bg-green-100 p-2 text-green-700"
                                    title="Approve Bid"
                                    onClick={() =>
                                        updateBidStatus(
                                            bid._id,
                                            "approved"
                                        )
                                    }
                                >
                                    <Check size={16} />
                                </button>
                            )}

                            {/* Reject */}
                            {bid.status === "pending" && (
                                <button
                                    className="rounded-lg bg-red-100 p-2 text-red-600"
                                    title="Reject Bid"
                                    onClick={() =>
                                        updateBidStatus(
                                            bid._id,
                                            "rejected"
                                        )
                                    }
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>
                    );
                }}
            />
        </DashboardLayout>
    );
}

export default AdminBids;