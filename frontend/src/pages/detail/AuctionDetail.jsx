import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import Layout from "../../component/layout/Layout";
import Timer from "../../component/timer/Timer";
import api from "../../api/axios";

import "./AuctionDetail.css";

const money = (n) =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function AuctionDetail() {
    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [winner, setWinner] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [placingBid, setPlacingBid] = useState(false);
    const [addingToWatchlist, setAddingToWatchlist] = useState(false);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await api.get(`/auctions/${id}`);
                const auctionData = response.data.auction;

                setAuction(auctionData);

                // Fetch winner only when auction is completed
                if (auctionData.status === "completed") {
                    try {
                        const winnerResponse = await api.get(
                            `/auctions/${id}/winner`
                        );

                        setWinner(
                            winnerResponse.data.winner
                        );
                    } catch (winnerError) {
                        console.log("WINNER ERROR:", winnerError);

                        alert(
                            winnerError.response?.data?.message ||
                            "Winner API failed"
                        );
                    }
                }

            } catch (error) {
                console.error(
                    "AUCTION DETAIL ERROR:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to fetch auction"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id]);

    const handlePlaceBid = async () => {
        if (!auction) return;

        const minimumBid =
            Math.max(
                auction.startingPrice,
                auction.currentBid
            ) + 1;

        if (Number(bidAmount) < minimumBid) {
            return alert(
                `Bid must be at least ${money(minimumBid)}`
            );
        }

        try {
            setPlacingBid(true);

            await api.post("/bids", {
                auction: auction._id,
                amount: Number(bidAmount)
            });

            alert(
                "Bid submitted successfully! Waiting for approval."
            );

            setBidAmount("");

        } catch (error) {
            console.error(
                "PLACE BID ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to place bid"
            );
        } finally {
            setPlacingBid(false);
        }
    };

    const handleAddToWatchlist = async () => {
        if (!auction) return;
        try {
            setAddingToWatchlist(true);
            await api.post("/watchlist", { auction: auction._id });
            alert("Added to watchlist successfully.");
        } catch (error) {
            console.error("ADD WATCHLIST ERROR:", error);
            alert(error.response?.data?.message || "Failed to add to watchlist");
        } finally {
            setAddingToWatchlist(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <main className="container-x py-10">
                    <p>Loading auction...</p>
                </main>
            </Layout>
        );
    }

    if (!auction) {
        return (
            <Layout>
                <main className="container-x py-10">
                    <p className="font-bold">
                        Auction not found.
                    </p>
                </main>
            </Layout>
        );
    }

    const product = auction.product;

    const productName =
        product?.name || "Auction Item";

    const image =
        product?.images?.[0] || null;

    const minimumBid =
        Math.max(
            auction.startingPrice,
            auction.currentBid
        ) + 1;

    return (
        <Layout>
            <main className="container-x py-10">

                <Link
                    to="/auctions"
                    className="text-sm font-bold"
                >
                    ← Back
                </Link>

                <div className="mt-7 grid gap-10 lg:grid-cols-2">

                    {/* IMAGE */}
                    <div>
                        {image ? (
                            <img
                                src={image}
                                alt={productName}
                                className="aspect-square w-full rounded-3xl object-cover shadow-soft"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-gray-100 text-muted shadow-soft">
                                No image available
                            </div>
                        )}
                    </div>

                    {/* DETAILS */}
                    <div>

                        <span
                            className={
                                "rounded-full px-3 py-1 text-xs font-bold " +
                                (auction.status === "live"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100")
                            }
                        >
                            {auction.status}
                        </span>

                        <p className="mt-6 text-xs font-black uppercase tracking-widest text-gold">
                            Auction
                        </p>

                        <h1 className="mt-2 text-4xl font-black">
                            {productName}
                        </h1>

                        <p className="mt-4 text-muted">
                            {product?.description ||
                                "No description available."}
                        </p>

                        <p className="mt-3 text-sm text-muted">
                            Listed by{" "}
                            {auction.seller?.name ||
                                "Seller"}
                        </p>

                        {/* PRICES */}
                        <div className="mt-8 grid grid-cols-2 gap-3">

                            <div className="rounded-2xl bg-white p-5 shadow-soft">
                                <p className="text-xs text-muted">
                                    Bid starts at
                                </p>

                                <b className="text-2xl">
                                    {money(
                                        auction.startingPrice
                                    )}
                                </b>
                            </div>

                            <div className="rounded-2xl bg-white p-5 shadow-soft">
                                <p className="text-xs text-muted">
                                    Last bid
                                </p>

                                <b className="text-2xl">
                                    {money(
                                        auction.currentBid
                                    )}
                                </b>
                            </div>

                        </div>

                        {/* Button */}
                        <button
                            onClick={handleAddToWatchlist}
                            disabled={addingToWatchlist}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border bg-white p-4 font-bold"
                        >
                            <Heart size={18} />
                            {addingToWatchlist ? "Adding..." : "Add to Watchlist"}
                        </button>

                        {/* TIMER */}
                        <div className="mt-4 rounded-2xl bg-ink p-5 text-white">

                            <p className="text-xs text-white/50">
                                Auction ends
                            </p>

                            <b className="text-2xl">
                                <Timer
                                    end={auction.endTime}
                                />
                            </b>

                        </div>

                        {/* WINNER */}
                        {auction.status === "completed" &&
                            winner && (
                                <div className="mt-4 rounded-2xl bg-green-100 p-5">

                                    <p className="text-xs font-black uppercase tracking-widest text-green-700">
                                        🏆 Auction Winner
                                    </p>

                                    <h2 className="mt-2 text-xl font-black">
                                        {winner.bidder?.name ||
                                            "Winner"}
                                    </h2>

                                    <p className="mt-1 text-sm text-green-700">
                                        Winning Bid:{" "}
                                        <b>
                                            {money(
                                                winner.amount
                                            )}
                                        </b>
                                    </p>

                                </div>
                            )}

                        {/* BID FORM */}
                        {auction.status === "live" && (
                            <div className="mt-4 flex gap-2">

                                <input
                                    value={bidAmount}
                                    onChange={(e) =>
                                        setBidAmount(
                                            e.target.value
                                        )
                                    }
                                    type="number"
                                    min={minimumBid}
                                    className="min-w-0 flex-1 rounded-xl border p-4"
                                    placeholder={`Minimum ${money(
                                        minimumBid
                                    )}`}
                                />

                                <button
                                    onClick={handlePlaceBid}
                                    disabled={placingBid}
                                    className="rounded-xl bg-gold px-5 font-black text-ink disabled:opacity-50"
                                >
                                    {placingBid
                                        ? "Bidding..."
                                        : "Place Bid"}
                                </button>

                            </div>
                        )}

                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default AuctionDetail;