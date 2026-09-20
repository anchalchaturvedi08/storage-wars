import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuyerLayout from "../../component/dashboard/BuyerLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";
import "./Orders.css";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");

        console.log("ORDERS RESPONSE:", response.data);

        setOrders(response.data.orders);
      } catch (error) {
        console.log("ORDER ERROR:", error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch orders"
        );
      }
    };

    fetchOrders();
  }, []);

  return (
    <BuyerLayout title="Orders">
      <DataTable
        headers={[
          "Order",
          "Item",
          "Amount",
          "Status",
          "Actions"
        ]}
        rows={orders.map((order) => [
          "#ORD-" + order._id.slice(-6).toUpperCase(),
          order.product?.name ||
            order.product ||
            "N/A",
          money(order.amount),
          order.status,
          ""
        ])}
        actions={(row, index) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(
                  `Order Amount: ${money(
                    orders[index].amount
                  )}\nStatus: ${orders[index].status}`
                );
              }}
              className="rounded-lg border px-3 py-2 text-xs font-bold"
            >
              <Eye size={16} />
            </button>

            {orders[index].status === "pending" && (
              <button
                onClick={() =>
                  navigate(`/payment/${orders[index]._id}`)
                }
                className="rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white"
              >
                Pay Now
              </button>
            )}
          </div>
        )}
      />
    </BuyerLayout>
  );
}

export default Orders;