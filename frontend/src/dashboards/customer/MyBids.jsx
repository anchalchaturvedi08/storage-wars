import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BuyerLayout from "../../component/dashboard/BuyerLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./MyBids.css";

const money = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

function MyBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/bids/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("MY BIDS RESPONSE:", response.data);

        setBids(response.data.bids);
      } catch (error) {
        console.log("MY BIDS ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);

        alert(
          error.response?.data?.message ||
          "Failed to fetch my bids"
        );
      }
    };

    fetchMyBids();
  }, []);

  return (
    <BuyerLayout title="My Bids">
      <DataTable
        headers={[
          "Auction",
          "My Bid",
          "Current Bid",
          "Status",
        ]}
        rows={bids.map((bid) => [
          bid.auction?.product?.name ||
          bid.auction?.name ||
          bid.auction?._id ||
          "N/A",

          money(bid.amount),

          money(
            bid.auction?.currentBid || bid.amount
          ),

          bid.status === "pending"
            ? "Pending"
            : bid.status === "approved" && bid.amount === bid.auction?.currentBid
            ? "Winning"
            : "Outbid",
        ])}
        actions={() => (
          <Link
            to="/auctions"
            className="rounded-lg border px-3 py-2 text-xs font-bold"
          >
            Bid Again
          </Link>
        )}
      />
    </BuyerLayout>
  );
}

export default MyBids;