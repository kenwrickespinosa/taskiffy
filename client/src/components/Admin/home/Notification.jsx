import React, { useEffect, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching notifications from the backend
    const fetchNotifications = async () => {
      try {
        // Fetch notifications (replace with your actual API endpoint)
        const response = await fetch("http://localhost:8000/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data); // Assuming the API returns a list of notifications
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p className="text-white">Loading notifications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="notifications-container">
      <h2 className="text-white">Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li
              key={index}
              className={`bg-custom-grey p-4 rounded-md shadow-lg mb-4 ${
                notification.is_late ? "border-red-500" : "border-green-500"
              }`}
            >
              <p className="font-semibold">{notification.message}</p>
              <p className="text-sm">Task: {notification.task_title}</p>
              <p className="text-xs">Submitted by: {notification.submitted_by}</p>
              <p className="text-xs">Time: {new Date(notification.submitted_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
}

export default Notification;
