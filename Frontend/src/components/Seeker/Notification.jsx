// src/components/Seeker/Notification.jsx
import React, { useState, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");
      if (role !== "job_seeker") return;

      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  if (localStorage.getItem("role") !== "job_seeker") return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <IoNotifications size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showPopup && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          {error && <p className="text-red-600">{error}</p>}
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 border-b ${
                  msg.is_read ? "text-gray-500" : "text-black font-medium"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-gray-400">
                  From Employer (Job ID: {msg.job_application}) -{" "}
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
