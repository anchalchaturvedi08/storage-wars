import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Gavel,
    Users,
    Clock3,
    IndianRupee,
    Check
} from "lucide-react";

import DashboardLayout from "../../component/dashboard/DashboardLayout";
import StatGrid from "../../component/dashboard/StatGrid";
import api from "../../api/axios";

import "./AdminDashboard.css";

const money = (n) =>
    "₹" + Number(n || 0).toLocaleString("en-IN");

function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        liveAuctions: 0,
        pendingBids: 0,
        revenue: null
    });

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const [
                    usersRes,
                    auctionsRes,
                    bidsRes
                ] = await Promise.all([
                    api.get("/users"),
                    api.get("/auctions"),
                    api.get("/bids")
                ]);

                const users =
                    usersRes.data.users || [];

                const auctions =
                    auctionsRes.data.auctions || [];

                const bids =
                    bidsRes.data.bids || [];

                const liveAuctions =
                    auctions.filter(
                        (auction) =>
                            auction.status === "live"
                    ).length;

                const pendingBids =
                    bids.filter(
                        (bid) =>
                            bid.status === "pending"
                    ).length;

                setStats({
                    users: users.length,
                    liveAuctions,
                    pendingBids,
                    revenue: null
                });

            } catch (error) {

                console.error(
                    "Failed to fetch admin stats:",
                    error
                );

            }
        };

        fetchStats();

    }, []);

    return (
        <DashboardLayout
            role="admin"
            title="Dashboard"
        >

            {/* STATISTICS */}
            <StatGrid
                items={[
                    [
                        "Users",
                        stats.users,
                        Users
                    ],
                    [
                        "Live Auctions",
                        stats.liveAuctions,
                        Gavel
                    ],
                    [
                        "Pending Bids",
                        stats.pendingBids,
                        Clock3
                    ],
                    [
                        "Revenue",
                        stats.revenue === null
                            ? "—"
                            : money(stats.revenue),
                        IndianRupee
                    ]
                ]}
            />

            {/* RECENT ACTIVITY + QUICK ACTIONS */}
            <div className="mt-7 grid gap-6 lg:grid-cols-2">

                {/* RECENT ACTIVITY */}
                <section className="rounded-2xl bg-white p-6 shadow-soft">

                    <h2 className="font-black">
                        Recent Activity
                    </h2>

                    <div className="mt-5 space-y-3">

                        {[
                            "New bid submitted on Motorcycle",
                            "Product awaiting approval",
                            "Customer account created",
                            "Discount campaign updated"
                        ].map((activity) => (

                            <div
                                className="flex items-center gap-3 rounded-xl bg-cream p-3 text-sm"
                                key={activity}
                            >
                                <Check size={16} />
                                {activity}
                            </div>

                        ))}

                    </div>

                </section>

                {/* QUICK ACTIONS */}
                <section className="rounded-2xl bg-white p-6 shadow-soft">

                    <h2 className="font-black">
                        Quick Actions
                    </h2>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                        <Link
                            to="/admin/auctions"
                            className="rounded-xl bg-ink p-4 text-center text-sm font-bold text-white"
                        >
                            Manage Auctions
                        </Link>

                        <Link
                            to="/admin/bids"
                            className="rounded-xl border p-4 text-center text-sm font-bold"
                        >
                            Review Bids
                        </Link>

                        <Link
                            to="/admin/discounts"
                            className="rounded-xl border p-4 text-center text-sm font-bold"
                        >
                            Create Discount
                        </Link>

                        <Link
                            to="/admin/reports"
                            className="rounded-xl border p-4 text-center text-sm font-bold"
                        >
                            View Reports
                        </Link>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}

export default AdminDashboard;