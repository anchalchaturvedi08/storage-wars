import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import BuyerLayout from "../../component/dashboard/BuyerLayout";
import api from "../../api/axios";

import "./WonAuctions.css";

const money = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

function WonAuctions() {
  const [wonAuctions, setWonAuctions] = useState([]);

  useEffect(() => {
    const fetchWonAuctions = async () => {
      try {
        const response = await api.get("/orders/won", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(
          "WON AUCTIONS RESPONSE:",
          response.data
        );

        setWonAuctions(response.data.orders || []);
      } catch (error) {
        console.log("WON AUCTIONS ERROR:", error);

        alert(
          error.response?.data?.message ||
          "Failed to fetch won auctions"
        );
      }
    };

    fetchWonAuctions();
  }, []);

  return (
    <BuyerLayout title="Won Auctions">
      <div className="grid gap-4 md:grid-cols-2">
        {wonAuctions.map((order) => (
          <div
            className="rounded-2xl bg-white p-6 shadow-soft"
            key={order._id}
          >
            <ShieldCheck className="text-green-600" />

            <h3 className="mt-4 font-black">
              {order.product?.name || "N/A"}
            </h3>

            <p className="mt-2 text-sm text-muted">
              Winning bid
            </p>

            <b className="text-2xl">
              {money(order.amount)}
            </b>

            <p className="mt-2 text-sm text-muted">
              Order Status: {order.status}
            </p>

            <button
              onClick={async () => {
                try {
                  const response = await api.patch(`/orders/${order._id}`, {
                    status: "confirmed"
                  });

                  alert(response.data.message || "Order completed successfully");

                  window.location.reload();
                } catch (error) {
                  console.error("COMPLETE ORDER ERROR:", error);
                  alert(error.response?.data?.message || "Failed to complete order");
                }
              }}
              className="mt-5 block rounded-xl bg-ink px-4 py-2 font-bold text-white"
            >
              Complete Order
            </button>
          </div>
        ))}
      </div>
    </BuyerLayout>
  );
}

export default WonAuctions;