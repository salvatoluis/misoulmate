// src/layouts/MainLayout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, User, Calendar } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    // Hide navigation for certain pages where it might not be needed
    const hideNavigation = [
        '/conversation/',
        '/onboarding',
    ].some(path => location.pathname.includes(path));

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Content */}
            <main>
                {children}
            </main>

            {/* Bottom Navigation */}
            {!hideNavigation && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top border-t border-gray-200 z-40">
                    <div className="max-w-screen-lg mx-auto px-4">
                        <div className="flex justify-around">
                            <Link
                                to="/matches"
                                className={`py-3 px-4 flex flex-col items-center ${location.pathname === '/matches'
                                        ? 'text-[#FF6B81]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Heart size={24} />
                                <span className="text-xs mt-1">Matches</span>
                            </Link>

                            <Link
                                to="/messages"
                                className={`py-3 px-4 flex flex-col items-center ${location.pathname === '/messages'
                                        ? 'text-[#FF6B81]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <MessageSquare size={24} />
                                <span className="text-xs mt-1">Messages</span>
                            </Link>

                            <Link
                                to="/date-planner"
                                className={`py-3 px-4 flex flex-col items-center ${location.pathname === '/date-planner'
                                        ? 'text-[#FF6B81]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Calendar size={24} />
                                <span className="text-xs mt-1">Dates</span>
                            </Link>

                            <Link
                                to="/profile"
                                className={`py-3 px-4 flex flex-col items-center ${['/profile', '/settings', '/blocked-users', '/help'].includes(location.pathname)
                                        ? 'text-[#FF6B81]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <User size={24} />
                                <span className="text-xs mt-1">Profile</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default MainLayout;