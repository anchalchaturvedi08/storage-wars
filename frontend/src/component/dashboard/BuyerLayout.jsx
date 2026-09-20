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
import DashboardLayout from "./DashboardLayout";
import "./BuyerLayout.css";

function BuyerLayout({ title = "Dashboard", children }) {
  return (
    <DashboardLayout role="buyer" title={title}>
      {children}
    </DashboardLayout>
  );
}

export default BuyerLayout;
