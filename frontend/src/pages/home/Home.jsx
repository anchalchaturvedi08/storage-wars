import React from "react";
import { Link } from "react-router-dom";
import { auctions, categories } from "../../data";
import Layout from "../../component/layout/Layout";
import Hero from "../../component/hero/Hero";
import AuctionCard from "../../component/auctioncard/AuctionCard";
import CategoryCard from "../../component/categorycard/CategoryCard";
import "./Home.css";

function Home() {
  return (
    <Layout>
      <main id="top">
        <Hero />
        <section className="container-x py-16">
          <p className="text-xs font-black uppercase tracking-[.2em] text-gold">Right now</p>
          <h2 className="mt-2 text-3xl font-black">Live Auctions</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {auctions.filter((a) => a.status === "LIVE").map((a) => (
              <AuctionCard a={a} key={a.id} />
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="container-x">
            <p className="text-xs font-black uppercase tracking-[.2em] text-gold">Explore</p>
            <h2 className="mt-2 text-3xl font-black">Categories</h2>
            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((c) => <CategoryCard category={c} key={c} />)}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
