import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../component/layout/Layout";
import Hero from "../../component/hero/Hero";
import AuctionCard from "../../component/auctioncard/AuctionCard";
import CategoryCard from "../../component/categorycard/CategoryCard";
import api from "../../api/axios";
import "./Home.css";

function Home() {
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Two independent requests, so fire them together rather than
        // waiting for the first to finish.
        const [auctionRes, categoryRes] = await Promise.all([
          api.get("/auctions"),
          api.get("/categories?tree=true")
        ]);

        setAuctions(auctionRes.data.auctions || []);

        setCategories(
          (categoryRes.data.categories || []).filter(
            (root) => root.status !== "inactive"
          )
        );
      } catch (error) {
        // The homepage must still render for a logged-out visitor even if
        // a request fails - GET /auctions currently requires a token.
        console.error("HOME FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const liveAuctions = auctions
    .filter((auction) => auction.status === "live")
    .slice(0, 8);

  return (
    <Layout>
      <main id="top">

        <Hero auctions={liveAuctions.length > 0 ? liveAuctions : auctions} />

        {/* ---------- LIVE AUCTIONS ---------- */}
        <section className="container-x py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-gold">
                Right now
              </p>

              <h2 className="mt-2 text-3xl font-black">Live Auctions</h2>
            </div>

            <Link to="/auctions" className="text-sm font-bold text-gold">
              View all auctions &rarr;
            </Link>
          </div>

          {loading ? (
            <p className="mt-7 text-muted">Loading auctions...</p>
          ) : liveAuctions.length === 0 ? (
            <div className="mt-7 rounded-2xl bg-white p-10 text-center shadow-soft">
              <p className="font-bold">No live auctions at the moment</p>

              <p className="mt-2 text-sm text-muted">
                New lots are listed regularly.{" "}
                <Link to="/auctions" className="font-bold text-gold">
                  Browse everything
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {liveAuctions.map((auction) => (
                <AuctionCard a={auction} key={auction._id} />
              ))}
            </div>
          )}
        </section>

        {/* ---------- CATEGORIES ---------- */}
        <section className="bg-white py-16">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-gold">
                  Explore
                </p>

                <h2 className="mt-2 text-3xl font-black">Categories</h2>
              </div>

              <Link to="/categories" className="text-sm font-bold text-gold">
                View all categories &rarr;
              </Link>
            </div>

            {loading ? (
              <p className="mt-7 text-muted">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="mt-7 text-muted">No categories available yet.</p>
            ) : (
              <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.slice(0, 8).map((category) => (
                  <CategoryCard category={category} key={category._id} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;