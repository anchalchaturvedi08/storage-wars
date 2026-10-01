import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { money } from "../../utils/formatters";
import "./Hero.css";

/* The carousel shows REAL auctions, passed down from Home so the page makes
   one request rather than two. With nothing to show it falls back to a static
   panel instead of rendering an empty slot. */

function Hero({ auctions = [] }) {
  const [slide, setSlide] = useState(0);

  const slides = auctions.slice(0, 5);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      4000
    );

    return () => clearInterval(timer);
  }, [slides.length]);

  // An auction could be removed between renders; clamp rather than crash.
  const current = slides[slide] || slides[0];

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
          {current ? (
            <>
              <Link
                to={`/auction/${current._id}`}
                className="block overflow-hidden rounded-3xl"
              >
                {current.product?.images?.[0] ? (
                  <img
                    src={current.product.images[0]}
                    alt={current.product?.name || "Auction"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center bg-white/5 text-white/40">
                    No image
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-6 pt-24">
                  <p className="text-xs font-bold uppercase text-gold">
                    {current.status}
                  </p>

                  <h2 className="text-2xl font-black">
                    {current.product?.name || "Auction Item"}
                  </h2>

                  <p className="text-white/60">
                    {current.currentBid > 0
                      ? `Last bid ${money(current.currentBid)}`
                      : `Starts at ${money(current.startingPrice)}`}
                  </p>
                </div>
              </Link>

              {slides.length > 1 && (
                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 rounded-full bg-white p-2 text-ink shadow">
                  <button
                    type="button"
                    onClick={() =>
                      setSlide((slide + slides.length - 1) % slides.length)
                    }
                    className="p-1"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-2 text-xs font-bold">
                    {slide + 1} / {slides.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSlide((slide + 1) % slides.length)}
                    className="p-1"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl bg-white/5 text-center">
              <div className="px-6">
                <p className="font-black text-white/80">
                  No auctions running yet
                </p>
                <p className="mt-2 text-sm text-white/50">
                  New lots are listed regularly. Check back soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;