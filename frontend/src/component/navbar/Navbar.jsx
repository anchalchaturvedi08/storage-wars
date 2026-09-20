import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Gavel, Menu, X, Search } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [m, setM] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
            <Gavel size={18} />
          </span>
          StorageWars
        </Link>
        <nav className="hidden gap-7 text-sm font-semibold md:flex">
          <Link to="/">Home</Link>
          <Link to="/auctions">Auctions</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/auctions" className="p-2">
            <Search size={19} />
          </Link>
          <Link
            to="/login"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white"
          >
            Login
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setM(!m)}>
          {m ? <X /> : <Menu />}
        </button>
      </div>
      {m && (
        <div className="space-y-3 border-t bg-white p-4 md:hidden">
          <Link className="block" to="/">
            Home
          </Link>
          <Link className="block" to="/auctions">
            Auctions
          </Link>
          <Link className="block" to="/categories">
            Categories
          </Link>
          <Link className="block" to="/about">
            About Us
          </Link>
          <Link className="block" to="/contact">
            Contact Us
          </Link>
          <Link className="block font-bold" to="/login">
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
export default Navbar;
