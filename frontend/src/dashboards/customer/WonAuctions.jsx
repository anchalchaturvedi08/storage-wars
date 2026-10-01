import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";

import BuyerLayout from "../../component/dashboard/BuyerLayout";
import api from "../../api/axios";

import "./WonAuctions.css";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

function WonAuctions() {
  const navigate = useNavigate();

  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWonAuctions = async () => {
      try {
        const response = await api.get("/orders/won");
        setWonAuctions(response.data.orders || []);
      } catch (error) {
        console.error("WON AUCTIONS ERROR:", error);
        alert(
          error.response?.data?.message || "Failed to fetch won auctions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWonAuctions();
  }, []);

  if (loading) {
    return (
      <BuyerLayout title="Won Auctions">
        <p className="text-muted">Loading...</p>
      </BuyerLayout>
    );
  }

  if (wonAuctions.length === 0) {
    return (
      <BuyerLayout title="Won Auctions">
        <div className="rounded-2xl bg-white p-8 text-center shadow-soft">
          <p className="font-bold">No won auctions yet</p>
          <p className="mt-2 text-sm text-muted">
            Win an auction and the order will appear here for payment.
          </p>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout title="Won Auctions">
      <div className="grid gap-4 md:grid-cols-2">
        {wonAuctions.map((order) => {
          const isPaid = order.status === "confirmed";

          return (
            <div
              className="rounded-2xl bg-white p-6 shadow-soft"
              key={order._id}
            >
              {isPaid ? (
                <CheckCircle2 className="text-green-600" />
              ) : (
                <ShieldCheck className="text-gold" />
              )}

              <h3 className="mt-4 font-black">
                {order.product?.name || "Product unavailable"}
              </h3>

              <p className="mt-2 text-sm text-muted">Winning bid</p>

              <b className="text-2xl">{money(order.amount)}</b>

              <p className="mt-2 text-sm text-muted">
                Order status:{" "}
                <span
                  className={
                    isPaid ? "font-bold text-green-700" : "font-bold text-ink"
                  }
                >
                  {order.status}
                </span>
              </p>

              {/* Payment is the ONLY way an order becomes confirmed. This
                  button used to PATCH the status directly, which let a buyer
                  mark their own order paid without paying. It now routes to
                  the Razorpay flow, and the server refuses a manual confirm. */}
              {isPaid ? (
                <div className="mt-5 rounded-xl bg-cream p-3 text-center text-sm font-bold text-green-700">
                  Payment received
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/payment/${order._id}`)}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-bold text-white transition hover:opacity-90"
                >
                  <CreditCard size={17} />
                  Pay {money(order.amount)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </BuyerLayout>
  );
}

export default WonAuctions;