import React from "react";
import { Link } from "react-router-dom";

import Timer from "../timer/Timer";

// "30 Sept, 7:30 pm" — short enough for a card footer.
const shortDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
      })
    : "--";
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
            {/* The APPROVED figure, not currentBid. currentBid tracks the
                highest bid placed, which may still be pending or get
                rejected - showing it would advertise a price nobody has
                accepted. */}
            <p className="text-xs text-muted">
              {a.highestApprovedBid > 0 ? "Highest bid" : "Starts at"}
            </p>

            <b>
              {money(
                a.highestApprovedBid > 0
                  ? a.highestApprovedBid
                  : a.startingPrice
              )}
            </b>
          </div>

          {/* Timing depends on the state:
                live      -> a running countdown to endTime
                upcoming  -> when bidding opens
                completed -> no countdown, just the date it closed
              A countdown on an ended auction would tick at zero forever. */}
          <span className="text-right text-xs text-muted">
            {a.status === "live" ? (
              <>
                Ends in
                <br />
                <b className="text-ink">
                  <Timer end={a.endTime} />
                </b>
              </>
            ) : a.status === "upcoming" ? (
              <>
                Starts
                <br />
                <b className="text-ink">{shortDateTime(a.startTime)}</b>
              </>
            ) : (
              <>
                Ended
                <br />
                <b className="text-ink">{shortDateTime(a.endTime)}</b>
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AuctionCard;