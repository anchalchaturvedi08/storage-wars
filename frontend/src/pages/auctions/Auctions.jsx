import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import Layout from "../../component/layout/Layout";
import AuctionCard from "../../component/auctioncard/AuctionCard";
import api from "../../api/axios";
import "./Auctions.css";

function Auctions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [auctions, setAuctions] = useState([]);
  const [tree, setTree] = useState([]);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("ALL");
  const [errorMessage, setErrorMessage] = useState("");

  const categoryId = searchParams.get("category") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const [auctionRes, categoryRes] = await Promise.all([
          api.get("/auctions"),
          api.get("/categories?tree=true")
        ]);

        setAuctions(auctionRes.data.auctions || []);
        setTree(categoryRes.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch auctions"
        );
      }
    };

    load();
  }, []);

  // Selecting a ROOT category must also match everything beneath it, so build
  // the set of ids to accept: the category itself plus its children.
  const acceptedCategoryIds = useMemo(() => {
    if (!categoryId) return null;

    const ids = new Set([String(categoryId)]);

    tree.forEach((root) => {
      if (String(root._id) === String(categoryId)) {
        (root.children || []).forEach((child) => ids.add(String(child._id)));
      }
    });

    return ids;
  }, [categoryId, tree]);

  // Name of whatever is selected, for the heading and the clear chip.
  const selectedName = useMemo(() => {
    if (!categoryId) return "";

    for (const root of tree) {
      if (String(root._id) === String(categoryId)) return root.name;

      for (const child of root.children || []) {
        if (String(child._id) === String(categoryId)) return child.name;
      }
    }

    return "";
  }, [categoryId, tree]);

  const list = auctions.filter((auction) => {
    const productName = auction.product?.name || "Auction Item";

    const matchesSearch = productName
      .toLowerCase()
      .includes(q.toLowerCase());

    const matchesStatus =
      st === "ALL" || auction.status?.toUpperCase() === st;

    // product.category is now POPULATED, so it arrives as an object rather
    // than a bare ObjectId. Read _id when present and fall back to the raw
    // value, so this works either way and will not break again if the
    // populate changes.
    const productCategory = auction.product?.category;

    const categoryId = productCategory?._id || productCategory;

    const matchesCategory =
      !acceptedCategoryIds ||
      acceptedCategoryIds.has(String(categoryId));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Ended auctions stay visible - they show what things actually sold for and
  // prove the platform is active - but they belong at the bottom. Live first,
  // then upcoming, then completed; newest first inside each group.
  const STATUS_ORDER = { live: 0, upcoming: 1, completed: 2, cancelled: 3 };

  const sorted = [...list].sort((a, b) => {
    const byStatus =
      (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);

    if (byStatus !== 0) return byStatus;

    return new Date(b.createdAt) - new Date(a.createdAt);
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
              {selectedName || "All Auctions"}
            </h1>

            {selectedName && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-xs font-bold transition hover:bg-ink hover:text-white"
              >
                <X size={13} />
                Clear filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center rounded-xl border bg-white px-3">
              <Search size={17} />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search auctions"
                className="w-48 bg-transparent p-2.5 text-sm outline-none"
              />
            </div>

            <select
              value={categoryId}
              onChange={(event) => {
                const value = event.target.value;
                setSearchParams(value ? { category: value } : {});
              }}
              className="rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold"
            >
              <option value="">All categories</option>
              {tree.map((root) =>
                root.children && root.children.length > 0 ? (
                  <optgroup key={root._id} label={root.name}>
                    <option value={root._id}>All {root.name}</option>
                    {root.children.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={root._id} value={root._id}>
                    {root.name}
                  </option>
                )
              )}
            </select>

            {["ALL", "LIVE", "UPCOMING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setSt(status)}
                className={
                  "rounded-xl px-4 py-2.5 text-sm font-bold " +
                  (st === status ? "bg-ink text-white" : "border bg-white")
                }
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className="mt-6 rounded-xl bg-white p-4 text-sm font-bold text-red-600 shadow-soft">
            {errorMessage}
          </p>
        )}

        {sorted.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-soft">
            <p className="font-bold">No auctions found</p>
            <p className="mt-2 text-sm text-muted">
              {selectedName
                ? `Nothing listed under ${selectedName} right now.`
                : "Try a different search or filter."}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((auction) => (
              <AuctionCard key={auction._id} a={auction} />
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Auctions;