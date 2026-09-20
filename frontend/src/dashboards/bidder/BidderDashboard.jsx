import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gavel, IndianRupee, Package, Plus, TrendingUp } from "lucide-react";
import api from "../../api/axios";
import SellerLayout from "../../component/dashboard/SellerLayout";
import StatGrid from "../../component/dashboard/StatGrid";
import "./BidderDashboard.css";

function BidderDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [liveAuctionCount, setLiveAuctionCount] = useState(0);
  const [bidCount, setBidCount] = useState(0);
  const [sales, setSales] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const [productResponse, auctionResponse, bidResponse, orderResponse] =
          await Promise.all([
            api.get("/products"),
            api.get("/auctions"),
            api.get("/bids"),
            api.get("/orders")
          ]);

        const myProducts = productResponse.data.products.filter(
          (product) => product.seller?._id === user?.id
        );

        const myLiveAuctions = auctionResponse.data.auctions.filter(
          (auction) =>
            auction.seller?._id === user?.id &&
            auction.status === "live"
        );

        const sellerOrders = orderResponse.data.orders;

        const totalSales = sellerOrders.reduce(
          (total, order) => total + Number(order.amount || 0),
          0
        );

        setProductCount(myProducts.length);
        setLiveAuctionCount(myLiveAuctions.length);
        setBidCount(bidResponse.data.bids.length);
        setSales(totalSales);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SellerLayout>
      <StatGrid
        items={[
          ["Products", productCount, Package],
          ["Live Auctions", liveAuctionCount, Gavel],
          ["Bids Received", bidCount, TrendingUp],
          ["Sales", `₹${sales.toLocaleString("en-IN")}`, IndianRupee],
        ]}
      />
      <div className="mt-7 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black">Seller Quick Actions</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/seller/add-product"
            className="rounded-xl bg-ink px-5 py-3 font-bold text-white"
          >
            <Plus className="mr-1 inline" size={16} />
            Add Product
          </Link>
          <Link
            to="/seller/bids"
            className="rounded-xl border px-5 py-3 font-bold"
          >
            View Bids
          </Link>
        </div>
      </div>
    </SellerLayout>
  );
}

export default BidderDashboard;