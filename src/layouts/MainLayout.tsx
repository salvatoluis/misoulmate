import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  LogOut,
  Compass,
  HeartHandshake,
  UserCircle,
  Settings,
  HelpCircle,
  Menu,
  Gift,
  X,
  Bell,
  GiftIcon,
  Ban,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const hideNavigation = ["/conversation/", "/onboarding"].some((path) =>
    location.pathname.includes(path)
  );

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {!hideNavigation && (
        <div className="fixed flex gap-1 top-4 left-4 z-50">
          <button
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-primary hover:bg-white transition-all duration-200"
            onClick={() => setMenuOpen(true)}
            title="Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      )}
      {!hideNavigation && (
        <div className="fixed flex gap-1 top-4 right-4 z-50">
          <Link
            to="/profile"
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-primary hover:bg-white transition-all duration-200"
            title="Profile"
          >
            <UserCircle size={16} />
          </Link>
        </div>
      )}
      <main>{children}</main>

      {!hideNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top border-t border-gray-200 z-40">
          <div className="max-w-screen-lg mx-auto px-4">
            <div className="flex justify-around relative">
              <Link
                to="/for-you"
                className={`py-3 px-4 flex flex-col items-center transition-colors ${
                  location.pathname === "/discover" ||
                  location.pathname === "/for-you"
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Compass size={24} />
                <span className="text-xs mt-1 font-medium">Discover</span>
              </Link>

              <Link
                to="/matches"
                className={`py-3 px-4 flex flex-col items-center transition-colors ${
                  location.pathname === "/matches"
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <HeartHandshake size={24} />
                <span className="text-xs mt-1 font-medium">Matches</span>
              </Link>

              <Link
                to="/messages"
                className={`py-3 px-4 flex flex-col items-center transition-colors ${
                  location.pathname === "/messages"
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="relative">
                  <MessageSquare size={24} />
                </div>
                <span className="text-xs mt-1 font-medium">Messages</span>
              </Link>

              <Link
                to="/referrals"
                className={`py-3 px-4 flex flex-col items-center transition-colors ${
                  location.pathname === "/referrals"
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users size={24} />
                <span className="text-xs mt-1 font-medium">Referrals</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 p-4 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <UserCircle size={18} /> Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <Settings size={18} /> Settings
              </Link>
              <Link
                to="/referrals"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <Gift size={18} /> Referral Program
              </Link>
              <Link
                to="/notifications"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <Bell size={18} /> Notifications
              </Link>
              <Link
                to="/date-planner"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <GiftIcon size={18} /> Date Planner
              </Link>
              <Link
                to="/icebreakers"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <Ban size={18} /> Ice Breakers
              </Link>
              <Link
                to="/help"
                className="flex items-center gap-3 text-gray-700 hover:text-primary"
              >
                <HelpCircle size={18} /> Help & Support
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-600 hover:text-red-700"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MainLayout;
