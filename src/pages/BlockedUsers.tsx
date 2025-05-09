// src/pages/BlockedUsers.tsx
import React, { useState } from 'react';
import { ChevronRight, User, Search, XCircle, AlertTriangle } from 'lucide-react';

interface BlockedUser {
    id: string;
    name: string;
    avatarUrl: string;
    blockedDate: string;
    reason?: string;
}

const BlockedUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
        {
            id: '1',
            name: 'Alex Johnson',
            avatarUrl: '/images/avatar-1.jpg',
            blockedDate: '2024-04-15',
            reason: 'Inappropriate messages'
        },
        {
            id: '2',
            name: 'Jamie Smith',
            avatarUrl: '/images/avatar-2.jpg',
            blockedDate: '2024-04-10'
        },
        {
            id: '3',
            name: 'Taylor Wilson',
            avatarUrl: '/images/avatar-3.jpg',
            blockedDate: '2024-03-28',
            reason: 'Harassment'
        },
        {
            id: '4',
            name: 'Riley Andrews',
            avatarUrl: '/images/avatar-4.jpg',
            blockedDate: '2024-03-20'
        }
    ]);

    // Filter blocked users based on search
    const filteredUsers = searchTerm
        ? blockedUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : blockedUsers;

    // Unblock a user
    const unblockUser = (userId: string) => {
        setBlockedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                                onClick={() => window.history.back()}
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">Blocked Users</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">
                    {/* Info Banner */}
                    <div className="bg-[#FF6B81]/10 p-4 rounded-xl mb-6">
                        <div className="flex">
                            <AlertTriangle className="text-[#FF6B81] mr-3 flex-shrink-0" size={20} />
                            <p className="text-sm text-gray-700">
                                Blocked users cannot see your profile, send you messages, or match with you. You can unblock users at any time.
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="p-3 relative">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search blocked users"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Blocked Users List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <XCircle size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Blocked Users</h2>
                                <p className="text-sm text-gray-600">{blockedUsers.length} users blocked</p>
                            </div>
                        </div>

                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                                                    {user.avatarUrl ? (
                                                        <img
                                                            src={user.avatarUrl}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={24} className="w-full h-full p-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Blocked on {formatDate(user.blockedDate)}
                                                    </p>
                                                    {user.reason && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Reason: {user.reason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className="px-3 py-1.5 border border-[#FF6B81] text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/5 transition-colors"
                                                onClick={() => unblockUser(user.id)}
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-4 text-center">
                                {searchTerm ? (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search size={24} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-gray-700 font-medium mb-1">No results found</h3>
                                        <p className="text-gray-500 text-sm">
                                            No blocked users match your search for "{searchTerm}"
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User size={24} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-gray-700 font-medium mb-1">No blocked users</h3>
                                        <p className="text-gray-500 text-sm">
                                            You haven't blocked any users yet
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Block Management */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-2">About Blocking</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start">
                                    <div className="w-5 h-5 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-2 mt-0.5">
                                        <span className="text-xs text-[#FF6B81] font-bold">1</span>
                                    </div>
                                    Blocked users cannot see your profile or send you messages
                                </li>
                                <li className="flex items-start">
                                    <div className="w-5 h-5 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-2 mt-0.5">
                                        <span className="text-xs text-[#FF6B81] font-bold">2</span>
                                    </div>
                                    If you were matched, blocking will remove the match
                                </li>
                                <li className="flex items-start">
                                    <div className="w-5 h-5 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-2 mt-0.5">
                                        <span className="text-xs text-[#FF6B81] font-bold">3</span>
                                    </div>
                                    Blocked users cannot see your location or activity status
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockedUsers;