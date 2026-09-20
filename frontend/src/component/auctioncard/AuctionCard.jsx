import React from "react";
import { Link } from "react-router-dom";

import Timer from "../timer/Timer";
import "./AuctionCard.css";

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

function AuctionCard({ a }) {
  const product = a.product;

  const productName =
    product?.name || "Auction Item";

  const category =
    product?.category?.name || "Auction";

  const image =
    product?.images?.[0] || null;

  return (
    <Link
      to={"/auction/" + a._id}
      className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1"
    >
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={productName}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-sm text-muted">
            No image available
          </div>
        )}

        <span
          className={
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold " +
            (a.status === "live"
              ? "bg-red-500 text-white"
              : "bg-white")
          }
        >
          {a.status === "live" ? "Live" : a.status}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase text-muted">
          {category}
        </p>

        <h3 className="mt-1 font-black">
          {productName}
        </h3>

        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-xs text-muted">
              Last bid
            </p>

            <b>{money(a.currentBid)}</b>
          </div>

          <span className="text-xs text-muted">
            {a.bids || 0} bids
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AuctionCard;