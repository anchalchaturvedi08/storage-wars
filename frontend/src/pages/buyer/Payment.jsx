import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BuyerLayout from "../../component/dashboard/BuyerLayout";
import api from "../../api/axios";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState("UPI");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.log("PAYMENT ORDER ERROR:", error);
        alert(error.response?.data?.message || "Failed to fetch order");
        navigate("/orders");
      }
    };

    fetchOrder();

    return () => {
      document.body.removeChild(script);
    };
  }, [orderId, navigate]);

  const handlePayment = async () => {
    try {
      if (!window.Razorpay) {
        alert("Payment system is still loading. Please try again.");
        return;
      }

      const response = await api.post("/orders/create-payment", {
        orderId: orderId
      });

      const paymentOrder = response.data.paymentOrder;
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Storage Wars",
        description: `Payment for Order #ORD-${order._id.slice(-6).toUpperCase()}`,
        order_id: paymentOrder.id,
        handler: async function (paymentResponse) {
          try {
            console.log("PAYMENT RESPONSE:", paymentResponse);

            const verifyResponse = await api.post("/orders/verify-payment", {
              orderId: orderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature
            });

            console.log("VERIFY RESPONSE:", verifyResponse.data);

            if (verifyResponse.data.success) {
              alert("Payment successful! Order confirmed.");
              navigate("/orders");
            }
          } catch (error) {
            console.log("VERIFICATION ERROR:", error);

            alert(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        theme: {
          color: "#111111"
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log("PAYMENT FAILED:", response.error);
        alert("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      console.log("PAYMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Payment failed"
      );
    }
  };

  if (!order) {
    return (
      <BuyerLayout title="Payment">
        <p>Loading...</p>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout title="Payment">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold">
                {order.product?.name || "Product"}
              </p>

              <p className="text-sm text-gray-500">
                Order #ORD-{order._id.slice(-6).toUpperCase()}
              </p>
            </div>

            <p className="text-lg font-bold">
              {money(order.amount)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            Select Payment Method
          </h2>

          <div className="space-y-3">
            {["UPI", "Credit / Debit Card", "Net Banking"].map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4"
              >
                <input
                  type="radio"
                  name="payment"
                  value={item}
                  checked={method === item}
                  onChange={(e) => setMethod(e.target.value)}
                />

                <span className="font-medium">
                  {item}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            Proceed to Pay {money(order.amount)}
          </button>
        </div>
      </div>
    </BuyerLayout>
  );
}

export default Payment;