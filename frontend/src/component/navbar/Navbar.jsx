import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Gavel,
  Menu,
  X,
  Search,
  LayoutDashboard,
  UserCog,
  LogOut,
  ChevronDown
} from "lucide-react";
import "./Navbar.css";

const DASHBOARD_PATH = {
  admin: "/admin",
  seller: "/seller",
  customer: "/buyer"
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Read on every render so the navbar reflects a login or logout that
  // happened on another page, without needing global state.
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token && user);
  const dashboard = DASHBOARD_PATH[user?.role] || "/buyer";

  // Close every menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the dropdown on any click outside it.
  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const firstName = (user?.name || "").split(" ")[0];

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

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/auctions" className="p-2">
            <Search size={19} />
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl bg-ink py-2 pl-2 pr-3 text-sm font-bold text-white"
              >
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/15 text-xs uppercase">
                  {firstName.charAt(0)}
                </span>
                <span className="capitalize">{firstName}</span>
                <ChevronDown size={15} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-soft">
                  <div className="border-b px-4 py-3">
                    <p className="truncate text-sm font-bold capitalize">
                      {user.name}
                    </p>
                    <p className="truncate text-xs capitalize text-muted">
                      {user.role}
                    </p>
                  </div>

                  <Link
                    to={dashboard}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-cream"
                  >
                    <LayoutDashboard size={16} />
                    My Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-cream"
                  >
                    <UserCog size={16} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmingLogout(true);
                    }}
                    className="flex w-full items-center gap-2 border-t px-4 py-3 text-left text-sm font-semibold hover:bg-cream"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ---------- mobile ---------- */}
      {mobileOpen && (
        <div className="space-y-3 border-t bg-white p-4 md:hidden">
          <Link className="block" to="/">Home</Link>
          <Link className="block" to="/auctions">Auctions</Link>
          <Link className="block" to="/categories">Categories</Link>
          <Link className="block" to="/about">About Us</Link>
          <Link className="block" to="/contact">Contact Us</Link>

          {!isLoggedIn ? (
            <Link className="block font-bold" to="/login">Login</Link>
          ) : (
            <>
              <div className="border-t pt-3">
                <p className="text-sm font-bold capitalize">{user.name}</p>
                <p className="text-xs capitalize text-muted">{user.role}</p>
              </div>

              <Link className="block font-bold" to={dashboard}>
                My Dashboard
              </Link>

              <Link className="block font-bold" to="/profile">
                My Profile
              </Link>

              <button
                type="button"
                onClick={() => setConfirmingLogout(true)}
                className="block text-left font-bold"
              >
                Log out
              </button>
            </>
          )}
        </div>
      )}

      {/* ---------- logout confirmation ---------- */}
      {confirmingLogout && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setConfirmingLogout(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-black">Log out?</h2>

            <p className="mt-2 text-sm text-muted">
              You will need to sign in again to reach your dashboard.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmingLogout(false)}
                className="flex-1 rounded-xl border p-3 font-bold"
                autoFocus
              >
                Stay
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-ink p-3 font-bold text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;