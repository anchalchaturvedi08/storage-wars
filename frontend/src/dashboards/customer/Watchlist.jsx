import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import BuyerLayout from "../../component/dashboard/BuyerLayout";
import AuctionCard from "../../component/auctioncard/AuctionCard";
import api from "../../api/axios";

import "./Watchlist.css";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/watchlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("WATCHLIST RESPONSE:", response.data);

        setWatchlist(response.data.watchlist || []);
      } catch (error) {
        console.log("WATCHLIST ERROR:", error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch watchlist"
        );
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/watchlist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWatchlist((currentWatchlist) =>
        currentWatchlist.filter(
          (item) => item._id !== id
        )
      );

      alert("Removed from watchlist.");
    } catch (error) {
      console.log("REMOVE WATCHLIST ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove from watchlist"
      );
    }
  };

  return (
    <BuyerLayout title="Watchlist">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {watchlist.map((item) => (
          <div
            className="relative"
            key={item._id}
          >
            <AuctionCard a={item.auction} />

            <button
              onClick={() =>
                removeFromWatchlist(item._id)
              }
              className="absolute right-3 top-3 rounded-full bg-white p-2 shadow"
            >
              <Heart size={16} />
            </button>
          </div>
        ))}
      </div>
    </BuyerLayout>
  );
}

export default Watchlist;