import React, { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";

import SellerLayout from "../../component/dashboard/SellerLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./BidsReceived.css";

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

function BidsReceived() {
  const [status, setStatus] = useState("All");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const token = localStorage.getItem("token");

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await api.get("/bids", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allBids = response.data.bids || [];

      // Only show bids received on this seller's auctions
      const myBids = allBids.filter(
        (bid) =>
          String(
            bid.auction?.seller?._id ||
              bid.auction?.seller
          ) ===
          String(user?._id || user?.id)
      );

      setBids(myBids);
    } catch (error) {
      console.log("BIDS RECEIVED ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch bids"
      );
    }
  };

  // APPROVE / REJECT BID
  const updateStatus = async (bidId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/bids/${bidId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI immediately
      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid._id === bidId
            ? {
                ...bid,
                status: newStatus,
              }
            : bid
        )
      );

      alert(
        `Bid ${newStatus} successfully`
      );
    } catch (error) {
      console.log(
        "UPDATE BID STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update bid status"
      );
    }
  };

  const filteredBids = bids.filter(
    (bid) =>
      status === "All" ||
      bid.status?.toLowerCase() ===
        status.toLowerCase()
  );

  const rows = filteredBids.map((bid) => [
    bid.auction?.product?.name ||
      "Auction Item",

    bid.bidder?.email ||
      bid.bidder?.name ||
      "Unknown",

    money(bid.amount),

    bid.status || "Pending",
  ]);

  return (
    <SellerLayout title="Bids Received">

      {/* FILTER BUTTONS */}
      <div className="mb-5 flex gap-2">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
        ].map((x) => (
          <button
            onClick={() => setStatus(x)}
            className={
              "rounded-xl px-4 py-2 text-sm font-bold " +
              (status === x
                ? "bg-ink text-white"
                : "bg-white border")
            }
            key={x}
          >
            {x}
          </button>
        ))}
      </div>

      <DataTable
        headers={[
          "Auction",
          "Bidder",
          "Bid Amount",
          "Status",
        ]}
        rows={rows}
        actions={(row, index) => {
          const bid = filteredBids[index];

          return (
            <div className="flex gap-2">

              {/* VIEW */}
              <button
                className="rounded-lg bg-gray-100 p-2"
                onClick={() =>
                  alert(
                    `Auction: ${
                      bid.auction?.product?.name ||
                      "Auction Item"
                    }\nBidder: ${
                      bid.bidder?.email ||
                      bid.bidder?.name ||
                      "Unknown"
                    }\nBid Amount: ${money(
                      bid.amount
                    )}\nStatus: ${
                      bid.status || "Pending"
                    }`
                  )
                }
              >
                <Eye size={16} />
              </button>

              {/* APPROVE */}
              {bid.status !== "approved" && (
                <button
                  className="rounded-lg bg-green-100 p-2 text-green-700"
                  onClick={() =>
                    updateStatus(
                      bid._id,
                      "approved"
                    )
                  }
                  title="Approve Bid"
                >
                  <Check size={16} />
                </button>
              )}

              {/* REJECT */}
              {bid.status !== "rejected" && (
                <button
                  className="rounded-lg bg-red-100 p-2 text-red-700"
                  onClick={() =>
                    updateStatus(
                      bid._id,
                      "rejected"
                    )
                  }
                  title="Reject Bid"
                >
                  <X size={16} />
                </button>
              )}

            </div>
          );
        }}
      />

    </SellerLayout>
  );
}

export default BidsReceived;