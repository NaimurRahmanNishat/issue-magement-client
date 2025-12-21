import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../../assets/user.png";
import type { RootState } from "@/redux/store";
import { IoNotificationsOutline } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "@/redux/features/auth/authSlice";
import ProfileCard from "./ProfileCard";
import {resetNotification,setNotificationCount} from "@/redux/features/emergency/notificationSlice";
import { useGetUnreadCountQuery } from "@/redux/features/emergency/emergencyApi";

const DashboardHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const notificationCount = useSelector(
    (state: RootState) => state.notification.count
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useGetUnreadCountQuery(undefined, { skip: user?.role !== "category-admin"});

  useEffect(() => {
    if (data?.count !== undefined) {
      dispatch(setNotificationCount(data.count));
    }
  }, [data, dispatch]);

  // ✅ Notification icon click handler
  const handleNotificationClick = () => {
    // Reset notification count
    dispatch(resetNotification());
    navigate("/dashboard/receive-message");
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      if (res.success) {
        dispatch(logout());
        navigate("/", { state: { isLogout: true }, replace: true });
        toast.success(res.message || "Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <header className="relative mx-4 md:mx-12 bg-gray-200 dark:bg-gray-800 text-gray-800 rounded-lg p-4 flex justify-between items-center transition-all duration-300">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Language */}
        <TbWorld className="w-6 h-6 cursor-pointer hover:text-blue-500 transition" />

        {/* Notifications - only category-admin will see */}
        {user?.role === "category-admin" && (
          <div
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <IoNotificationsOutline className="relative w-6 h-6 hover:text-blue-500 transition" />

            {/* 🔥 Notification Count Badge */}
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="relative">
            <img
              src={user.avatar?.url || userIcon}
              alt="User avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-400 transition"
            />

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                onMouseLeave={() => setMenuOpen(false)}
                className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-all"
              >
                <ProfileCard setMenuOpen={setMenuOpen} />
                <button
                  onClick={handleLogout}
                  className="w-full text-red-500 font-semibold text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
