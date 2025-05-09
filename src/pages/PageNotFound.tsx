import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';

const PageNotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] p-6 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
                    <p className="text-white/80">
                        It seems the connection we were looking for doesn't exist
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-[#FF6B81]/5 border border-[#FF6B81]/10 rounded-lg p-4 mb-6">
                        <p className="text-gray-600 text-center">
                            The page you're looking for might have been moved, deleted, or perhaps never existed - just like some matches that aren't meant to be.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 w-full p-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg transition-colors font-medium"
                        >
                            <Home size={18} />
                            Return Home
                        </Link>

                        <Link
                            to="/matches"
                            className="flex items-center justify-center gap-2 w-full p-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            <Heart size={18} />
                            Go to Matches
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional suggestions */}
            <div className="mt-8 text-center text-gray-500 max-w-md">
                <h3 className="font-medium text-gray-700 mb-3">Looking for something specific?</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    <Link to="/help" className="text-[#FF6B81] hover:underline">Help Center</Link>
                    <span>•</span>
                    <Link to="/settings" className="text-[#FF6B81] hover:underline">Settings</Link>
                    <span>•</span>
                    <Link to="/messages" className="text-[#FF6B81] hover:underline">Messages</Link>
                    <span>•</span>
                    <Link to="/date-planner" className="text-[#FF6B81] hover:underline">Date Planner</Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;