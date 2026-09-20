import React, { useEffect, useState } from "react";
import { Gavel, Users, IndianRupee, TrendingUp } from "lucide-react";
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import StatGrid from "../../component/dashboard/StatGrid";
import api from "../../api/axios";
import "./Reports.css";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");
        setReports(response.data.reports);
      } catch (error) {
        console.error("REPORTS ERROR:", error);
        alert(error.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin" title="Reports">
        <p>Loading reports...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Reports">
      <StatGrid
        items={[
          ["Total Sales", money(reports?.totalSales), IndianRupee],
          ["Bids This Month", reports?.bidsThisMonth || 0, Gavel],
          ["New Users", reports?.newUsers || 0, Users],
          ["Conversion", `${reports?.conversion || 0}%`, TrendingUp],
        ]}
      />

      <div className="mt-7 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="font-black">Monthly Performance</h2>

        <div className="mt-7 grid h-56 grid-cols-12 items-end gap-2">
          {(reports?.monthlyPerformance || []).map((item) => (
            <div
              key={item._id.month}
              className="rounded-t-lg bg-ink"
              style={{ height: "80%" }}
              title={`Month ${item._id.month}: ${money(item.sales)}`}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminReports;