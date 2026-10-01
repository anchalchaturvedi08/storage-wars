import React, { useEffect, useState } from "react";
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

                const response = await api.get("/auctions");

                const myCompletedAuctions = (response.data.auctions || []).filter(
                    (auction) =>
                        auction.seller?._id === user?.id &&
                        auction.status === "completed"
                );

                const resultData = await Promise.all(
                    myCompletedAuctions.map(async (auction) => {
                        try {
                            const winnerResponse = await api.get(
                                `/auctions/${auction._id}/winner`
                            );

                            return {
                                auction,
                                winner: winnerResponse.data.winner
                            };
                        } catch {
                            return {
                                auction,
                                winner: null
                            };
                        }
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
                <p>Loading results...</p>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Auction Results">
            <div className="grid gap-4 md:grid-cols-2">
                {results.map(({ auction, winner }) => (
                    <div
                        className="rounded-2xl bg-white p-5 shadow-soft"
                        key={auction._id}
                    >
                        <p className="text-xs text-muted">Completed Auction</p>

                        <h3 className="mt-1 font-black">
                            {auction.product?.name || "Auction Item"}
                        </h3>

                        <p className="mt-4 text-sm">Winning bid</p>

                        <b className="text-2xl">
                            {money(winner?.amount || auction.currentBid)}
                        </b>

                        {winner ? (
                            <>
                                <p className="mt-2 text-sm">
                                    Winner: <b>{winner.bidder?.name || "Winner"}</b>
                                </p>
                                <p className="mt-2 text-xs text-green-600">
                                    Result available
                                </p>
                            </>
                        ) : (
                            <p className="mt-2 text-xs text-gray-500">
                                No approved winner
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </SellerLayout>
    );
}

export default AuctionResults;