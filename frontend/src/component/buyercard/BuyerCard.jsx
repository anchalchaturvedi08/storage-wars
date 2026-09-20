import React, { useState } from "react";
import Timer from "../timer/Timer";
import api from "../../api/axios";
import "./BuyerCard.css";

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

function BuyerCard({ a }) {
  const [cur, setCur] = useState(a.currentBid || 0);
  const [v, setV] = useState("");
  const [loading, setLoading] = useState(false);

  const productName =
    a.product?.name || "Auction Item";

  const startingPrice =
    a.startingPrice || 0;

  const handleBid = async () => {
    if (!v) {
      return alert("Please enter a bid amount.");
    }

    if (Number(v) <= cur) {
      return alert("Bid must be higher.");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/bids",
        {
          auction: a._id,
          amount: Number(v),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("BID RESPONSE:", response.data);

      setCur(Number(v));
      setV("");

      alert("Bid placed successfully!");

    } catch (error) {
      console.log("BID ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to place bid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border p-4">
      <b>{productName}</b>

      <p className="mt-2 text-sm text-muted">
        Starting: {money(startingPrice)} · Last bid:{" "}
        {money(cur)}
      </p>

      <p className="mt-2 text-sm font-bold">
        Ends in <Timer end={a.endTime} />
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          type="number"
          min={cur + 1}
          className="min-w-0 flex-1 rounded-xl border p-3"
          placeholder={`Min ${money(cur + 1)}`}
          disabled={loading}
        />

        <button
          onClick={handleBid}
          disabled={loading}
          className="rounded-xl bg-ink px-4 font-bold text-white"
        >
          {loading ? "..." : "Bid"}
        </button>
      </div>
    </div>
  );
}

export default BuyerCard;