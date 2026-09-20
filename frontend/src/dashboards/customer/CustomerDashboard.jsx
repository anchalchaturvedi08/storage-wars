import React, { useEffect, useState } from "react";
import { Gavel, Heart, ShieldCheck, Package } from "lucide-react";

import BuyerLayout from "../../component/dashboard/BuyerLayout";
import StatGrid from "../../component/dashboard/StatGrid";
import BuyerCard from "../../component/buyercard/BuyerCard";
import api from "../../api/axios";

import "./CustomerDashboard.css";

function CustomerDashboard() {
  const [stats, setStats] = useState({
    activeBids: 0,
    watchlist: 0,
    wonAuctions: 0,
    orders: 0,
  });

  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          bidsResponse,
          watchlistResponse,
          wonResponse,
          ordersResponse,
          auctionsResponse,
        ] = await Promise.all([
          api.get("/bids/my", { headers }),
          api.get("/watchlist", { headers }),
          api.get("/orders/won", { headers }),
          api.get("/orders", { headers }),
          api.get("/auctions", { headers }),
        ]);

        // Dashboard statistics
        setStats({
          activeBids: bidsResponse.data.bids?.length || 0,
          watchlist: watchlistResponse.data.watchlist?.length || 0,
          wonAuctions: wonResponse.data.orders?.length || 0,
          orders: ordersResponse.data.orders?.length || 0,
        });

        // All auctions
        setAuctions(
          auctionsResponse.data.auctions || []
        );
      } catch (error) {
        console.log("DASHBOARD ERROR:", error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch dashboard data"
        );
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <BuyerLayout>
      {/* Dashboard Stats */}
      <StatGrid
        items={[
          ["Active Bids", stats.activeBids, Gavel],
          ["Watchlist", stats.watchlist, Heart],
          ["Won Auctions", stats.wonAuctions, ShieldCheck],
          ["Orders", stats.orders, Package],
        ]}
      />

      {/* Active Bidding */}
      <div className="mt-7 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black">
          Active Bidding
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {auctions
            .filter(
              (auction) => auction.status === "live"
            )
            .map((auction) => (
              <BuyerCard
                a={auction}
                key={auction._id}
              />
            ))}
        </div>
      </div>
    </BuyerLayout>
  );
}

export default CustomerDashboard;