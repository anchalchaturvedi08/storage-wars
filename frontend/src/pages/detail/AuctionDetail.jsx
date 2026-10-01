import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, FileText, Download, History, ListChecks, Truck } from "lucide-react";
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
    const [activeImage, setActiveImage] = useState(0);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await api.get(`/auctions/${id}`);

                // Bid history. Its own try/catch because a logged-out visitor
                // gets a 401 here, and that must not blank the whole page.
                try {
                    const bidResponse = await api.get(`/bids/${id}`);
                    setBids(bidResponse.data.bids || []);
                } catch {
                    setBids([]);
                }
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

    // Filter out any empty strings so a stray blank entry does not render
    // an broken thumbnail.
    const images = (product?.images || []).filter(Boolean);

    const documents = product?.documents || [];

    // Only APPROVED bids count. A pending bid is not a price, and a rejected
    // one never was. Sorted newest first for the history list.
    const approvedBids = bids
        .filter((bid) => bid.status === "approved")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // highestApprovedBid is maintained server-side on approval. Falling back
    // to the computed value keeps auctions created before that field existed
    // displaying correctly.
    const highestApproved =
        auction.highestApprovedBid ||
        approvedBids.reduce((max, bid) => Math.max(max, bid.amount), 0);

    const displayPrice = highestApproved > 0
        ? highestApproved
        : auction.startingPrice;

    const subcategory = product?.category;
    const parentCategory = subcategory?.parent;

    const hasEnded = new Date(auction.endTime) <= new Date();

    const specifications = product?.specifications || [];

    // Condition is stored as a slug; this is the label shown to users.
    const CONDITION_LABEL = {
        "new": "New",
        "like-new": "Like new",
        "good": "Good",
        "fair": "Fair",
        "for-parts": "For parts"
    };

    // Beats the highest bid PLACED, since the server's atomic guard compares
    // against currentBid. Using the approved figure here would let a client
    // submit a bid the server is bound to reject.
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

                    {/* GALLERY */}
                    <div>
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[activeImage]}
                                    alt={`${productName} — view ${activeImage + 1}`}
                                    className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft"
                                />

                                {/* Thumbnails only appear when there is more
                                    than one photo, so a single-image product
                                    looks the same as it always did. */}
                                {images.length > 1 && (
                                    <div className="mt-3 grid grid-cols-5 gap-2">
                                        {images.map((url, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setActiveImage(index)}
                                                className={
                                                    "overflow-hidden rounded-xl border-2 transition " +
                                                    (index === activeImage
                                                        ? "border-gold"
                                                        : "border-transparent opacity-70 hover:opacity-100")
                                                }
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="aspect-[4/3] w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gray-100 text-muted shadow-soft">
                                No image available
                            </div>
                        )}

                        {/* DOCUMENTS */}
                        {documents.length > 0 && (
                            <div className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
                                <h3 className="flex items-center gap-2 font-black">
                                    <FileText size={18} />
                                    Documents
                                </h3>

                                <p className="mt-1 text-xs text-muted">
                                    Available to view before bidding.
                                </p>

                                <ul className="mt-4 space-y-2">
                                    {documents.map((doc, index) => (
                                        <li key={index}>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-xl border p-3 text-sm transition hover:bg-cream"
                                            >
                                                <FileText size={16} />

                                                <span className="flex-1 truncate font-semibold">
                                                    {doc.name}
                                                </span>

                                                {doc.size && (
                                                    <span className="text-xs text-muted">
                                                        {(doc.size / 1024).toFixed(0)} KB
                                                    </span>
                                                )}

                                                <Download size={15} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
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

                        {/* Breadcrumb. product.category points at the LEAF,
                            so the parent comes from the nested populate. */}
                        <p className="mt-6 text-xs font-black uppercase tracking-widest text-gold">
                            {parentCategory ? (
                                <>
                                    <Link
                                        to={`/auctions?category=${parentCategory._id}`}
                                        className="hover:underline"
                                    >
                                        {parentCategory.name}
                                    </Link>
                                    {" / "}
                                    <Link
                                        to={`/auctions?category=${subcategory._id}`}
                                        className="hover:underline"
                                    >
                                        {subcategory.name}
                                    </Link>
                                </>
                            ) : subcategory ? (
                                <Link
                                    to={`/auctions?category=${subcategory._id}`}
                                    className="hover:underline"
                                >
                                    {subcategory.name}
                                </Link>
                            ) : (
                                "Auction"
                            )}
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
                                    {highestApproved > 0
                                        ? "Highest accepted bid"
                                        : "No accepted bids yet"}
                                </p>

                                <b className="text-2xl">
                                    {money(displayPrice)}
                                </b>

                                <p className="mt-1 text-xs text-muted">
                                    {approvedBids.length} accepted bid
                                    {approvedBids.length === 1 ? "" : "s"}
                                </p>
                            </div>

                        </div>

                        {/* Shown only while bidding is possible. A pending bid
                            is not a price, so the figure above never moves
                            until a seller approves it. */}
                        {!hasEnded && auction.status === "live" && (
                            <p className="mt-3 text-sm text-muted">
                                Minimum next bid{" "}
                                <b className="text-ink">{money(minimumBid)}</b>
                            </p>
                        )}

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

                        {/* SPECIFICATIONS */}
                        {(specifications.length > 0 ||
                          product?.brand ||
                          product?.model ||
                          product?.condition) && (
                            <div className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
                                <h3 className="flex items-center gap-2 font-black">
                                    <ListChecks size={18} />
                                    Specifications
                                </h3>

                                <dl className="mt-4 divide-y text-sm">
                                    {product?.brand && (
                                        <div className="flex justify-between gap-4 py-2.5">
                                            <dt className="text-muted">Brand</dt>
                                            <dd className="text-right font-semibold">
                                                {product.brand}
                                            </dd>
                                        </div>
                                    )}

                                    {product?.model && (
                                        <div className="flex justify-between gap-4 py-2.5">
                                            <dt className="text-muted">Model</dt>
                                            <dd className="text-right font-semibold">
                                                {product.model}
                                            </dd>
                                        </div>
                                    )}

                                    {product?.condition && (
                                        <div className="flex justify-between gap-4 py-2.5">
                                            <dt className="text-muted">Condition</dt>
                                            <dd className="text-right font-semibold">
                                                {CONDITION_LABEL[product.condition] ||
                                                    product.condition}
                                            </dd>
                                        </div>
                                    )}

                                    {specifications.map((row, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between gap-4 py-2.5"
                                        >
                                            <dt className="text-muted">{row.label}</dt>
                                            <dd className="text-right font-semibold">
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {/* COLLECTION */}
                        {product?.collectionDetails && (
                            <div className="mt-6 rounded-2xl bg-cream p-5">
                                <h3 className="flex items-center gap-2 font-black">
                                    <Truck size={18} />
                                    Collection &amp; Shipping
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted">
                                    {product.collectionDetails}
                                </p>
                            </div>
                        )}

                        {/* BID HISTORY */}
                        {approvedBids.length > 0 && (
                            <div className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
                                <h3 className="flex items-center gap-2 font-black">
                                    <History size={18} />
                                    Bid History
                                </h3>

                                <p className="mt-1 text-xs text-muted">
                                    Accepted bids only, newest first.
                                </p>

                                <ul className="mt-4 divide-y">
                                    {approvedBids.map((bid, index) => (
                                        <li
                                            key={bid._id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="min-w-0">
                                                <b className="block">
                                                    {money(bid.amount)}
                                                </b>

                                                <span className="text-xs text-muted">
                                                    {new Date(bid.createdAt).toLocaleString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        hour: "numeric",
                                                        minute: "2-digit"
                                                    })}
                                                </span>
                                            </div>

                                            {index === 0 && (
                                                <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold">
                                                    Leading
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default AuctionDetail;