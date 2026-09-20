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
import "./StatGrid.css";

function StatGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map(([x, v, I]) => (
        <div className="rounded-2xl bg-white p-5 shadow-soft" key={x}>
          <I />
          <p className="mt-5 text-sm text-muted">{x}</p>
          <b className="text-2xl">{v}</b>
        </div>
      ))}
    </div>
  );
}

export default StatGrid;
