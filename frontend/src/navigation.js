import { Gavel, Heart, Users, Package, ShieldCheck, Plus, Check, Boxes, Percent, FileText, LayoutDashboard, TrendingUp, CircleDollarSign, ShoppingBag, Bell, Tag, } from "lucide-react";

export const demoNav = {
    admin: [
        ["Dashboard", "/admin", LayoutDashboard],
        ["Auction Listings", "/admin/auctions", Gavel],
        ["Bid Approvals", "/admin/bids", Check],
        ["Users", "/admin/users", Users],
        ["Products", "/admin/products", Boxes],
        ["Categories", "/admin/categories", Tag],
        ["Discounts", "/admin/discounts", Percent],
        ["Reports", "/admin/reports", FileText],
    ],
    seller: [
        ["Dashboard", "/seller", LayoutDashboard],
        ["Add Product", "/seller/add-product", Plus],
        ["My Products", "/seller/products", Package],
        ["My Auctions", "/seller/auctions", Gavel],
        ["Bids Received", "/seller/bids", TrendingUp],
        ["Auction Results", "/seller/results", CircleDollarSign],
    ],
    buyer: [
        ["Dashboard", "/buyer", LayoutDashboard],
        ["My Bids", "/buyer/bids", Gavel],
        ["Watchlist", "/buyer/watchlist", Heart],
        ["Won Auctions", "/buyer/won", ShieldCheck],
        ["Orders", "/buyer/orders", ShoppingBag],
        ["Notifications", "/buyer/notifications", Bell],
    ],
};
