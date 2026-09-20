import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Gavel, Menu, X, Search, Heart, ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Send, ArrowUp, Users, Clock3, IndianRupee, Package, ShieldCheck, Plus, Check, Ban, Eye, Filter, Upload, BarChart3, Tag, LayoutDashboard, TrendingUp, LogOut, Boxes, Percent, FileText, Bell, ShoppingBag, Wallet, UserRound, Settings, Trash2, Edit3, CircleDollarSign, CalendarDays, ImagePlus, Save } from "lucide-react";
import { auctions, categories, demos, products } from "../../data";
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import DataTable from "../../component/dashboard/DataTable";
import "./Discounts.css";

function AdminDiscounts() {
  const [d, setD] = useState([
    {
      name: "Weekend Collectibles",
      code: "WEEKEND20",
      value: "20%",
      status: true,
    },
    { name: "Home Special", code: "HOME15", value: "15%", status: true },
    { name: "New Customer", code: "WELCOME10", value: "10%", status: false },
  ]);
  return (
    <DashboardLayout role="admin" title="Discounts">
      <div className="mb-5">
        <button
          onClick={() =>
            setD((v) => [
              ...v,
              {
                name: "New Campaign",
                code: "NEW" + (v.length + 1),
                value: "10%",
                status: true,
              },
            ])
          }
          className="rounded-xl bg-ink px-4 py-2 font-bold text-white"
        >
          <Plus className="inline" size={16} /> Create Discount
        </button>
      </div>
      <DataTable
        headers={["Campaign", "Code", "Discount", "Status"]}
        rows={d.map((x) => [
          x.name,
          x.code,
          x.value,
          x.status ? "Active" : "Inactive",
        ])}
        actions={(r, i) => (
          <button
            onClick={() =>
              setD((v) =>
                v.map((x, j) => (j === i ? { ...x, status: !x.status } : x)),
              )
            }
            className="rounded-lg border px-3 py-2 text-xs font-bold"
          >
            {r[3] === "Active" ? "Disable" : "Enable"}
          </button>
        )}
      />
    </DashboardLayout>
  );
}

export default AdminDiscounts;
