import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Gavel,
  Menu,
  X,
  Search,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  ArrowUp,
  Users,
  Clock3,
  IndianRupee,
  Package,
  ShieldCheck,
  Plus,
  Check,
  Ban,
  Eye,
  Filter,
  Upload,
  BarChart3,
  Tag,
  LayoutDashboard,
  TrendingUp,
  LogOut,
  Boxes,
  Percent,
  FileText,
  Bell,
  ShoppingBag,
  Wallet,
  UserRound,
  Settings,
  Trash2,
  Edit3,
  CircleDollarSign,
  CalendarDays,
  ImagePlus,
  Save,
} from "lucide-react";
import { auctions, categories, demos, products } from "../../data";
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
import "./DataTable.css";

function DataTable({ headers, rows, actions }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b text-muted">
            {headers.map((h) => (
              <th className="p-4" key={h}>
                {h}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr className="border-b last:border-0" key={i}>
              {r.map((c, j) => (
                <td className="p-4" key={j}>
                  {c}
                </td>
              ))}
              {actions && <td className="p-4">{actions(r, i)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
