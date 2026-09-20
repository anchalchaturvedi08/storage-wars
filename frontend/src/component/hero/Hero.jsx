import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { auctions } from "../../data";
import { money } from "../../utils/formatters";
import "./Hero.css";

function Hero() {
  const [s, setS] = useState(0);
  const f = auctions;
  useEffect(() => {
    const x = setInterval(() => setS((v) => (v + 1) % f.length), 4000);
    return () => clearInterval(x);
  }, [f.length]);
  const a = f[s];
  return (
    <section className="hero text-white">
      <div className="container-x grid min-h-[590px] items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold">
            LIVE AUCTIONS EVERY DAY
          </span>
          <h1 className="mt-6 text-5xl font-black leading-none md:text-7xl">
            Discover.
            <br />
            Bid.
            <br />
            <span className="text-gold">Win.</span>
          </h1>
          <p className="mt-6 max-w-lg text-white/65">
            A modern marketplace for rare finds, collectibles and one-of-a-kind
            treasures.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to="/auctions"
              className="rounded-xl bg-gold px-5 py-3 font-black text-ink"
            >
              Explore Auctions <ArrowRight className="ml-1 inline" size={17} />
            </Link>
            <Link
              to="/about"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <img src={a.image} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-6 pt-24">
              <p className="text-xs text-gold">{a.category}</p>
              <h2 className="text-2xl font-black">{a.name}</h2>
              <p className="text-white/60">Last bid {money(a.currentBid)}</p>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 rounded-full bg-white p-2 text-ink shadow">
            <button
              onClick={() => setS((s + f.length - 1) % f.length)}
              className="p-1"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-2 text-xs font-bold">
              {s + 1} / {f.length}
            </span>
            <button onClick={() => setS((s + 1) % f.length)} className="p-1">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
