import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div>
          <b className="text-xl">StorageWars</b>
          <p className="mt-3 text-sm text-muted">
            Discover unique items, compete fairly and win.
          </p>
        </div>
        <div>
          <b>Marketplace</b>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <Link className="block" to="/auctions">
              Auctions
            </Link>
            <Link className="block" to="/categories">
              Categories
            </Link>
          </div>
        </div>
        <div>
          <b>Company</b>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <Link className="block" to="/about">
              About Us
            </Link>
            <Link className="block" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>
        <div>
          <b>Trust & Safety</b>
          <p className="mt-3 text-sm text-muted">
            Transparent listings and bid approval controls.
          </p>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted">
        © 2026 StorageWars
      </div>
    </footer>
  );
}
export default Footer;
