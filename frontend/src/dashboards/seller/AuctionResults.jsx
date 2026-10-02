import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import SellerLayout from "../../component/dashboard/SellerLayout";
import api from "../../api/axios";
import "./AuctionResults.css";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

function AuctionResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "null");

                // Orders are fetched alongside the auctions so the seller can
                // see whether the winner has actually paid. GET /api/orders
                // filters by seller for a seller account, so this is already
                // scoped to their own sales.
                const [auctionResponse, orderResponse] = await Promise.all([
                    api.get("/auctions"),
                    api.get("/orders").catch(() => ({ data: { orders: [] } }))
                ]);

                const orders = orderResponse.data.orders || [];

                const myCompletedAuctions = (auctionResponse.data.auctions || []).filter(
                    (auction) =>
                        auction.seller?._id === (user?._id || user?.id) &&
                        auction.status === "completed"
                );

                const resultData = await Promise.all(
                    myCompletedAuctions.map(async (auction) => {
                        // Each winner call gets its own catch: a completed
                        // auction with no approved bid returns 404, and inside
                        // Promise.all one rejection would blank the whole page.
                        let winner = null;

                        try {
                            const winnerResponse = await api.get(
                                `/auctions/${auction._id}/winner`
                            );

                            winner = winnerResponse.data.winner;
                        } catch {
                            winner = null;
                        }

                        const order = orders.find(
                            (o) =>
                                String(o.auction?._id || o.auction) ===
                                String(auction._id)
                        );

                        return { auction, winner, order };
                    })
                );

                setResults(resultData);
            } catch (error) {
                console.error("AUCTION RESULTS ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return (
            <SellerLayout title="Auction Results">
                <p className="text-muted">Loading results...</p>
            </SellerLayout>
        );
    }

    if (results.length === 0) {
        return (
            <SellerLayout title="Auction Results">
                <div className="rounded-2xl bg-white p-8 text-center shadow-soft">
                    <p className="font-bold">No completed auctions yet</p>
                    <p className="mt-2 text-sm text-muted">
                        Results appear here once your auctions close.
                    </p>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Auction Results">
            <div className="grid gap-4 md:grid-cols-2">
                {results.map(({ auction, winner, order }) => {
                    const isPaid = order?.status === "confirmed";
                    const awaitingPayment = order && order.status === "pending";

                    return (
                        <div
                            className="rounded-2xl bg-white p-5 shadow-soft"
                            key={auction._id}
                        >
                            <p className="text-xs text-muted">Completed Auction</p>

                            <h3 className="mt-1 font-black">
                                {auction.product?.name || "Auction Item"}
                            </h3>

                            <p className="mt-4 text-sm text-muted">Winning bid</p>

                            <b className="text-2xl">
                                {money(
                                    winner?.amount ||
                                    auction.highestApprovedBid ||
                                    auction.currentBid
                                )}
                            </b>

                            {winner ? (
                                <p className="mt-2 text-sm">
                                    Winner: <b>{winner.bidder?.name || "Winner"}</b>
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-muted">
                                    No approved winner
                                </p>
                            )}

                            {/* Worded from the SELLER's side - they receive the
                                payment. The customer's Won Auctions page shows
                                "Payment done" for the same order. */}
                            <div className="mt-4 border-t pt-4">
                                {isPaid ? (
                                    <p className="flex items-center gap-2 text-sm font-bold text-green-700">
                                        <CheckCircle2 size={16} />
                                        Payment received
                                    </p>
                                ) : awaitingPayment ? (
                                    <p className="flex items-center gap-2 text-sm font-bold text-amber-700">
                                        <Clock size={16} />
                                        Awaiting payment from buyer
                                    </p>
                                ) : winner ? (
                                    <p className="flex items-center gap-2 text-sm text-muted">
                                        <Clock size={16} />
                                        Waiting for an admin to create the order
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-2 text-sm text-muted">
                                        <XCircle size={16} />
                                        No sale — nothing was approved
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SellerLayout>
    );
}

export default AuctionResults;