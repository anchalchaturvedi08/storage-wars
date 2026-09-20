import React, { useEffect, useState } from "react";
import SellerLayout from "../../component/dashboard/SellerLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";
import "./MyAuctions.css";

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const response = await api.get("/auctions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allAuctions =
          response.data.auctions || [];

        const myAuctions = allAuctions.filter(
          (auction) =>
            String(
              auction.seller?._id || auction.seller
            ) ===
            String(user?._id || user?.id)
        );

        setAuctions(myAuctions);

      } catch (error) {
        console.log(
          "MY AUCTIONS ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to fetch auctions"
        );
      }
    };

    fetchMyAuctions();
  }, []);

  return (
    <SellerLayout title="My Auctions">

      <DataTable
        headers={[
          "Auction",
          "Status",
          "Start",
          "End",
          "Current Bid",
        ]}
        rows={auctions.map((auction) => [
          auction.product?.name ||
          "Auction Item",

          auction.status,

          formatDate(auction.startTime),

          formatDate(auction.endTime),

          money(auction.currentBid),
        ])}

        actions={(row, index) => {
          const auction = auctions[index];

          return (
            <button
              className="rounded-lg border px-3 py-2 text-xs font-bold"
              onClick={() =>
                setSelectedAuction(auction)
              }
            >
              Manage
            </button>
          );
        }}
      />

      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-black">
                Auction Details
              </h2>

              <button
                onClick={() =>
                  setSelectedAuction(null)
                }
                className="rounded-lg bg-gray-100 px-3 py-2 font-bold"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-3 text-sm">

              <p>
                <b>Product:</b>{" "}
                {selectedAuction.product?.name ||
                  "Auction Item"}
              </p>

              <p>
                <b>Status:</b>{" "}
                {selectedAuction.status}
              </p>

              <p>
                <b>Starting Price:</b>{" "}
                {money(
                  selectedAuction.startingPrice
                )}
              </p>

              <p>
                <b>Current Bid:</b>{" "}
                {money(
                  selectedAuction.currentBid
                )}
              </p>

              <p>
                <b>Start:</b>{" "}
                {formatDate(
                  selectedAuction.startTime
                )}
              </p>

              <p>
                <b>End:</b>{" "}
                {formatDate(
                  selectedAuction.endTime
                )}
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedAuction(null)
              }
              className="mt-6 rounded-xl bg-ink px-4 py-2 font-bold text-white"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </SellerLayout>
  );
}

export default MyAuctions;