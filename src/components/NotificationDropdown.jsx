import { useEffect, useRef, useState } from "react";
import { IoNotifications } from "react-icons/io5";

const NotificationDropdown = ({ employeeID }) => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : [];
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // WebSocket
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "register",
          employeeID: employeeID,
        })
      );
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type && data.message) {
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: data.type,
            message: data.message,
            data: data.data,
            read: false,
          },
          ...prev,
        ]);
      }
    });

    return () => socket.close();
  }, [employeeID]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    markAllAsRead();
  };

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        <IoNotifications className="w-[25px] h-[25px] hover:text-[#2EB67D]" />
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-0 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-[60px] w-[320px] bg-white shadow-lg rounded-lg z-50">
          <div className="p-2 border-b font-semibold text-gray-700 underline">
            Notification
          </div>
          <ul className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-sm text-center">
                No notifications
              </li>
            ) : (
              notifications.map((noti) => (
                <li
                  key={noti.id}
                  className="p-3 border-b hover:bg-gray-100 text-left"
                >
                  <div className="font-semibold text-[15px]">
                    {noti.message}
                  </div>
                  <div className="text-xs text-gray-500">{noti.type}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
