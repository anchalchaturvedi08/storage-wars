import React, { useEffect, useState } from "react";
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
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import DataTable from "../../component/dashboard/DataTable";
import api from "../../api/axios";

import "./Users.css";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

function AdminUsers() {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUsers(response.data.users);
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch users"
        );
      }
    };

    fetchUsers();
  }, []);


  // Block / Unblock user
  const toggleUserStatus = async (user) => {
    try {
      const newStatus =
        user.status === "active"
          ? "blocked"
          : "active";

      const response = await api.patch(
        `/users/${user._id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update frontend with updated user
      setUsers((currentUsers) =>
        currentUsers.map((u) =>
          u._id === user._id
            ? response.data.user
            : u
        )
      );

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    }
  };


  return (
    <DashboardLayout role="admin" title="Users">
      <DataTable
        headers={["Name", "Email", "Role", "Status"]}
        
        rows={users.map((u) => [
          u.name,
          u.email,
          u.role,
          u.status,
        ])}

        actions={(r, i) => {
          const user = users[i];

          return (
            <button
              onClick={() => toggleUserStatus(user)}
              className="rounded-lg border px-3 py-2 text-xs font-bold"
            >
              {user.status === "active"
                ? "Block"
                : "Unblock"}
            </button>
          );
        }}
      />
    </DashboardLayout>
  );
}

export default AdminUsers;