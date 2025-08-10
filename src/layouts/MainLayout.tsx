import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut, Compass, HeartHandshake, UserCircle, Settings, HelpCircle } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    const hideNavigation = [
        '/conversation/',
        '/onboarding',
    ].some(path => location.pathname.includes(path));

    const handleLogout = () => {
        localStorage.removeItem('auth');
        window.location.href = '/login';
    };

    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        {!hideNavigation && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleLogout}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-200"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
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
                    {/* {unreadMessages > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )} */}
                  </div>
                  <span className="text-xs mt-1 font-medium">Messages</span>
                </Link>

                <div className="relative">
                  <Link
                    to="/profile"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowLogoutMenu(!showLogoutMenu);
                    }}
                    onTouchStart={(e) => {
                      const timer = setTimeout(() => {
                        setShowLogoutMenu(!showLogoutMenu);
                      }, 500);
                      e.currentTarget.dataset.timer = timer.toString();
                    }}
                    onTouchEnd={(e) => {
                      if (e.currentTarget.dataset.timer) {
                        clearTimeout(parseInt(e.currentTarget.dataset.timer));
                      }
                    }}
                    className={`py-3 px-4 flex flex-col items-center transition-colors ${
                      [
                        "/profile",
                        "/settings",
                        "/blocked-users",
                        "/help",
                      ].includes(location.pathname)
                        ? "text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <UserCircle size={24} />
                    <span className="text-xs mt-1 font-medium">You</span>
                  </Link>

                  {showLogoutMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 px-3 min-w-[150px] animate-fadeIn">
                      <div className="divide-y divide-gray-100">
                        <div className="pb-2">
                          <Link
                            to="/settings"
                            className="flex items-center gap-2 text-gray-700 hover:text-primary text-sm py-1.5"
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                          <Link
                            to="/help"
                            className="flex items-center gap-2 text-gray-700 hover:text-primary text-sm py-1.5"
                          >
                            <HelpCircle size={16} />
                            Help & Support
                          </Link>
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm py-1.5 w-full text-left"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {showLogoutMenu && (
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowLogoutMenu(false)}
                  />
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    );
};

export default MainLayout;