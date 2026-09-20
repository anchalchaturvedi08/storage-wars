import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Layout from "../../component/layout/Layout";
import AuctionCard from "../../component/auctioncard/AuctionCard";
import api from "../../api/axios";
import "./Auctions.css";

function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("ALL");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.get("/auctions");
        setAuctions(response.data.auctions || []);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
        setErrorMessage(error.response?.data?.message || "Failed to fetch auctions");
      }
    };

    fetchAuctions();
  }, []);

  const list = auctions.filter((auction) => {
    const productName = auction.product?.name || "Auction Item";
    const matchesSearch = productName.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = st === "ALL" || auction.status?.toUpperCase() === st;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <main className="container-x py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-gold">
              Marketplace
            </p>
            <h1 className="mt-2 text-4xl font-black">
              All Auctions
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center rounded-xl border bg-white px-3">
              <Search size={17} />
              <input
                className="w-40 py-3 outline-none"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            {["ALL", "LIVE", "UPCOMING"].map((x) => (
              <button
                onClick={() => setSt(x)}
                key={x}
                className={
                  "rounded-xl px-4 py-2 text-sm font-bold " +
                  (st === x ? "bg-ink text-white" : "border bg-white")
                }
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-bold text-red-600">{errorMessage}</p>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((auction) => (
            <AuctionCard
              a={auction}
              key={auction._id}
            />
          ))}
        </div>

        {list.length === 0 && !errorMessage && (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center">
            <p className="font-bold">
              No auctions found.
            </p>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Auctions;