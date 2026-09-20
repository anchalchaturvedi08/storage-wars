import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Auctions from "./pages/auctions/Auctions";
import AuctionDetail from "./pages/detail/AuctionDetail";
import Categories from "./pages/categories/Categories";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
// Page Not Found
import NotFound from "./pages/notfound/NotFound";
// VerifyEmail
import VerifyEmail from "./pages/verifyemail/VerifyEmail";
import Payment from "./pages/buyer/Payment";
import ProtectedRoute from "./component/protectedroute/ProtectedRoute";

// Admin
import AdminDashboard from "./dashboards/admin/AdminDashboard";
import AuctionListings from "./dashboards/admin/AuctionListings";
import BidApprovals from "./dashboards/admin/BidApprovals";
import Users from "./dashboards/admin/Users";
import Products from "./dashboards/admin/Products";
import AdminCategories from "./dashboards/admin/Categories";
import Discounts from "./dashboards/admin/Discounts";
import Reports from "./dashboards/admin/Reports";

// Seller
import BidderDashboard from "./dashboards/bidder/BidderDashboard";
import AddProduct from "./dashboards/bidder/AddProduct";
import MyProducts from "./dashboards/bidder/MyProducts";
import MyAuctions from "./dashboards/bidder/MyAuctions";
import BidsReceived from "./dashboards/bidder/BidsReceived";
import AuctionResults from "./dashboards/bidder/AuctionResults";

// Customer
import CustomerDashboard from "./dashboards/customer/CustomerDashboard";
import MyBids from "./dashboards/customer/MyBids";
import Watchlist from "./dashboards/customer/Watchlist";
import WonAuctions from "./dashboards/customer/WonAuctions";
import Orders from "./dashboards/customer/Orders";
import Notifications from "./dashboards/customer/Notifications";

function App() {
    return (
        <>
            <Routes>

                {/* Public Routes */}

                <Route path="/" element={<Home />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/auction/:id" element={<AuctionDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />}></Route>
                <Route path="/payment/:orderId" element={<Payment />} />
                <Route path="*" element={<NotFound />} />

                {/* Admin Routes */}

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/auctions" element={<AuctionListings />} />
                    <Route path="/admin/bids" element={<BidApprovals />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/discounts" element={<Discounts />} />
                    <Route path="/admin/reports" element={<Reports />} />
                </Route>


                {/* Seller Routes */}

                <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
                    <Route path="/seller" element={<BidderDashboard />} />
                    <Route path="/seller/add-product" element={<AddProduct />} />
                    <Route path="/seller/products" element={<MyProducts />} />
                    <Route path="/seller/auctions" element={<MyAuctions />} />
                    <Route path="/seller/bids" element={<BidsReceived />} />
                    <Route path="/seller/results" element={<AuctionResults />} />
                </Route>

                {/* Customer Routes */}

                <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                    <Route path="/buyer" element={<CustomerDashboard />} />
                    <Route path="/buyer/bids" element={<MyBids />} />
                    <Route path="/buyer/watchlist" element={<Watchlist />} />
                    <Route path="/buyer/won" element={<WonAuctions />} />
                    <Route path="/buyer/orders" element={<Orders />} />
                    <Route path="/buyer/notifications" element={<Notifications />} />
                </Route>
                
            </Routes>
        </>
    );
}

export default App;