// src/pages/Activity.tsx
import React, { useState } from 'react';
import { ChevronRight, User, Eye, Heart, MessageSquare, Star, Clock, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityItem {
    id: string;
    type: 'view' | 'like' | 'match' | 'message' | 'interaction';
    userName: string;
    userAvatar: string;
    timestamp: string;
    date: string;
    read: boolean;
    actionTaken?: boolean;
    details?: string;
}

const Activity: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'views' | 'likes' | 'matches'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

    // Sample activity data
    const activityItems: ActivityItem[] = [
        {
            id: '1',
            type: 'view',
            userName: 'Emma',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '10:30 AM',
            date: 'Today',
            read: false,
            details: 'Viewed your profile twice'
        },
        {
            id: '2',
            type: 'like',
            userName: 'Michael',
            userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '9:15 AM',
            date: 'Today',
            read: false,
            actionTaken: false
        },
        {
            id: '3',
            type: 'match',
            userName: 'Sophia',
            userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '5:45 PM',
            date: 'Yesterday',
            read: true,
            actionTaken: true
        },
        {
            id: '4',
            type: 'message',
            userName: 'James',
            userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '3:20 PM',
            date: 'Yesterday',
            read: true,
            details: 'Sent you a new message'
        },
        {
            id: '5',
            type: 'view',
            userName: 'Olivia',
            userAvatar: 'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '2:10 PM',
            date: 'Yesterday',
            read: true
        },
        {
            id: '6',
            type: 'like',
            userName: 'Daniel',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '11:30 AM',
            date: '2 days ago',
            read: true,
            actionTaken: true
        },
        {
            id: '7',
            type: 'interaction',
            userName: 'Jasmine',
            userAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '5:00 PM',
            date: '3 days ago',
            read: true,
            details: 'Responded to your icebreaker'
        },
        {
            id: '8',
            type: 'view',
            userName: 'Ryan',
            userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            timestamp: '2:45 PM',
            date: 'Last week',
            read: true
        }
    ];

    // Filter activity items based on active tab and time filter
    const filteredItems = activityItems.filter(item => {
        // Filter by type
        if (activeTab === 'views' && item.type !== 'view') return false;
        if (activeTab === 'likes' && item.type !== 'like') return false;
        if (activeTab === 'matches' && item.type !== 'match') return false;

        // Filter by time
        if (timeFilter === 'today' && item.date !== 'Today') return false;
        if (timeFilter === 'week' && (item.date === 'Last week' || item.date === 'Last month')) return false;
        if (timeFilter === 'month' && item.date === 'Last month') return false;

        return true;
    });

    // Function to get appropriate icon based on activity type
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'view':
                return <Eye size={18} className="text-green-500" />;
            case 'like':
                return <Heart size={18} className="text-[#FF6B81]" />;
            case 'match':
                return <Star size={18} className="text-yellow-500" />;
            case 'message':
                return <MessageSquare size={18} className="text-green-500" />;
            case 'interaction':
                return <MessageSquare size={18} className="text-purple-500" />;
            default:
                return <User size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/profile"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Activity</h1>
                        </div>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setShowFilters(!showFilters)}
                            aria-label="Filter activities"
                        >
                            <Filter size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-medium text-gray-700">Filter by time</h2>
                        </div>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            <button
                                className={`px-4 py-2 rounded-full text-sm ${timeFilter === 'all'
                                    ? 'bg-[#FF6B81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } transition-colors`}
                                onClick={() => setTimeFilter('all')}
                            >
                                All time
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full text-sm flex items-center ${timeFilter === 'today'
                                    ? 'bg-[#FF6B81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } transition-colors`}
                                onClick={() => setTimeFilter('today')}
                            >
                                <Clock size={14} className="mr-1" />
                                Today
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full text-sm flex items-center ${timeFilter === 'week'
                                    ? 'bg-[#FF6B81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } transition-colors`}
                                onClick={() => setTimeFilter('week')}
                            >
                                <Calendar size={14} className="mr-1" />
                                This week
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full text-sm flex items-center ${timeFilter === 'month'
                                    ? 'bg-[#FF6B81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } transition-colors`}
                                onClick={() => setTimeFilter('month')}
                            >
                                <Calendar size={14} className="mr-1" />
                                This month
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-2 overflow-x-auto">
                        <button
                            className={`py-3 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'all'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Activity
                        </button>
                        <button
                            className={`py-3 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'views'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('views')}
                        >
                            Profile Views
                        </button>
                        <button
                            className={`py-3 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'likes'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('likes')}
                        >
                            Likes
                        </button>
                        <button
                            className={`py-3 px-4 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'matches'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('matches')}
                        >
                            Matches
                        </button>
                    </div>
                </div>
            </div>

            {/* Activity List */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">
                    {filteredItems.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 transition-colors ${!item.read ? 'bg-[#FF6B81]/5' : ''}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                                    <img
                                                        src={item.userAvatar}
                                                        alt={item.userName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -right-1 -bottom-1 p-1 rounded-full bg-white">
                                                    {getActivityIcon(item.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {item.userName}
                                                            {!item.read && (
                                                                <span className="ml-2 bg-[#FF6B81] text-white text-xs px-1.5 py-0.5 rounded-full">
                                                                    New
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {item.type === 'view' && 'Viewed your profile'}
                                                            {item.type === 'like' && 'Liked your profile'}
                                                            {item.type === 'match' && 'New match'}
                                                            {item.type === 'message' && 'Sent you a message'}
                                                            {item.type === 'interaction' && item.details}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex flex-col items-end">
                                                        <span>{item.timestamp}</span>
                                                        <span>{item.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons for likes and matches */}
                                        {(item.type === 'like' || item.type === 'match') && !item.actionTaken && (
                                            <div className="mt-3 flex space-x-2 ml-14">
                                                <Link
                                                    to={`/match/${item.id}`}
                                                    className="flex-1 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors text-center"
                                                >
                                                    View Profile
                                                </Link>
                                                {item.type === 'match' && (
                                                    <Link
                                                        to={`/conversation/${item.id}`}
                                                        className="flex-1 py-2 border border-[#FF6B81] text-[#FF6B81] bg-white hover:bg-[#FF6B81]/5 rounded-lg text-sm font-medium transition-colors text-center"
                                                    >
                                                        Message
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                                {activeTab === 'views' && <Eye size={28} className="text-gray-400" />}
                                {activeTab === 'likes' && <Heart size={28} className="text-gray-400" />}
                                {activeTab === 'matches' && <Star size={28} className="text-gray-400" />}
                                {activeTab === 'all' && <Clock size={28} className="text-gray-400" />}
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No activity found</h3>
                            <p className="text-gray-500 mb-4">
                                {activeTab === 'views' && "No one has viewed your profile yet."}
                                {activeTab === 'likes' && "No one has liked your profile yet."}
                                {activeTab === 'matches' && "You don't have any matches yet."}
                                {activeTab === 'all' && "No activity found for the selected time period."}
                            </p>
                            <Link
                                to="/discover"
                                className="inline-block px-4 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Discover New People
                            </Link>
                        </div>
                    )}

                    {/* Stats Card */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-medium text-gray-800">Your Profile Stats</h2>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-gray-100">
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-800">32</div>
                                <div className="text-sm text-gray-600">Profile Views</div>
                            </div>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-[#FF6B81]">18</div>
                                <div className="text-sm text-gray-600">Likes</div>
                            </div>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-500">5</div>
                                <div className="text-sm text-gray-600">Matches</div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Profile Completion</span>
                                <span className="text-[#FF6B81] font-medium">85%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                <div className="h-full bg-[#FF6B81] rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <div className="mt-4 text-sm text-center">
                                <Link to="/profile" className="text-[#FF6B81] hover:underline">
                                    Complete your profile for better matches
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;