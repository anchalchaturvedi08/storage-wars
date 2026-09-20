import React, { useEffect, useState } from "react";
import BuyerLayout from "../../component/dashboard/BuyerLayout";
import api from "../../api/axios";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(
          "NOTIFICATIONS RESPONSE:",
          response.data
        );

        setNotifications(
          response.data.notifications || []
        );
      } catch (error) {
        console.log(
          "NOTIFICATIONS ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to fetch notifications"
        );
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const unreadNotifications =
        notifications.filter(
          (notification) => !notification.isRead
        );

      await Promise.all(
        unreadNotifications.map((notification) =>
          api.patch(
            `/notifications/${notification._id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.log(
        "MARK READ ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to mark notifications as read"
      );
    }
  };

  return (
    <BuyerLayout title="Notifications">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-soft"
            key={notification._id}
          >
            <div>
              <b>{notification.message}</b>

              <p className="mt-1 text-sm text-muted">
                {notification.type}
              </p>
            </div>

            {!notification.isRead && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={markAllAsRead}
        className="mt-5 rounded-xl border px-4 py-2 font-bold"
      >
        Mark all as read
      </button>
    </BuyerLayout>
  );
}

export default Notifications;