import React, { useState } from 'react';
import { Search, Settings, Heart, ArrowLeft } from 'lucide-react';

const messagesList = [
    {
        id: 'm1',
        matchId: 1,
        name: 'Emma Wilson',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        lastMessage: 'So what coffee shop would you recommend?',
        lastMessageTime: '12:45 PM',
        unreadCount: 2,
        isOnline: true,
        matchPercentage: 96
    },
    {
        id: 'm2',
        matchId: 2,
        name: 'Michael Chen',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
        lastMessage: 'That sounds great! I\'ll check it out.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
        matchPercentage: 92
    },
    {
        id: 'm3',
        matchId: 3,
        name: 'Sophia Rodriguez',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
        lastMessage: 'You: Thanks for the restaurant recommendation!',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
        matchPercentage: 89
    },
    {
        id: 'm4',
        matchId: 4,
        name: 'James Wilson',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        lastMessage: 'I love that movie too! Have you seen the sequel?',
        lastMessageTime: 'Tuesday',
        unreadCount: 0,
        isOnline: true,
        matchPercentage: 87
    }
];

const newMatches = [
    {
        id: 9,
        name: 'Zoe',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop',
        matchTime: '2 hours ago',
        matchPercentage: 94
    },
    {
        id: 10,
        name: 'Ryan',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
        matchTime: '5 hours ago',
        matchPercentage: 91
    },
    {
        id: 11,
        name: 'Mia',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop',
        matchTime: '1 day ago',
        matchPercentage: 88
    },
    {
        id: 12,
        name: 'Lucas',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        matchTime: '2 days ago',
        matchPercentage: 87
    }
];

const Messages: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('inbox');

    const filteredMessages = messagesList.filter(message =>
        message.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatMessagePreview = (message: string) => {
        return message.length > 40 ? message.substring(0, 40) + '...' : message;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="mr-2 md:hidden">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <Settings size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* Search bar */}
                <div className="container mx-auto px-4 pb-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full bg-gray-100 border-none rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 text-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="container mx-auto px-4 flex">
                        <button
                            className={`py-3 px-4 text-sm font-medium relative ${activeTab === 'inbox'
                                    ? 'text-[#FF6B81]'
                                    : 'text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                            onClick={() => setActiveTab('inbox')}
                        >
                            Inbox
                            {activeTab === 'inbox' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                            )}
                        </button>
                        <button
                            className={`py-3 px-4 text-sm font-medium relative ${activeTab === 'new-matches'
                                    ? 'text-[#FF6B81]'
                                    : 'text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                            onClick={() => setActiveTab('new-matches')}
                        >
                            New Matches
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-[#FF6B81] text-white rounded-full">
                                {newMatches.length}
                            </span>
                            {activeTab === 'new-matches' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-4">
                {activeTab === 'inbox' ? (
                    /* Inbox tab */
                    <>
                        {filteredMessages.length === 0 ? (
                            /* Empty state */
                            <div className="text-center py-10">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-gray-100 rounded-full inline-flex">
                                        <Heart size={32} className="text-gray-400" />
                                    </div>
                                </div>
                                {searchQuery ? (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">No matches found</h3>
                                        <p className="text-gray-500">
                                            We couldn't find any messages matching "{searchQuery}"
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">No messages yet</h3>
                                        <p className="text-gray-500">
                                            When you match and message with others, you'll see your conversations here.
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Messages list */
                            <div className="space-y-2">
                                {filteredMessages.map(message => (
                                    <a
                                        key={message.id}
                                        href={`/messages/${message.id}`}
                                        className="flex items-center p-3 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        {/* Profile photo with online indicator */}
                                        <div className="relative mr-4">
                                            <div className="w-14 h-14 rounded-full overflow-hidden">
                                                <img
                                                    src={message.photo}
                                                    alt={message.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {message.isOnline && (
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>

                                        {/* Message content */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-medium text-gray-800">{message.name}</h3>
                                                <span className="text-xs text-gray-500">{message.lastMessageTime}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <p
                                                    className={`text-sm text-gray-600 flex-grow ${message.unreadCount > 0 ? 'font-medium' : ''
                                                        }`}
                                                >
                                                    {formatMessagePreview(message.lastMessage)}
                                                </p>
                                                {message.unreadCount > 0 && (
                                                    <span className="ml-2 bg-[#FF6B81] text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                                                        {message.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* New matches tab */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                        {newMatches.map(match => (
                            <div key={match.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Match photo */}
                                <div className="aspect-square relative">
                                    <img
                                        src={match.photo}
                                        alt={match.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#FF6B81]/90 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                                        {match.matchPercentage}%
                                    </div>
                                </div>

                                {/* Match info */}
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-800 mb-1">{match.name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">Matched {match.matchTime}</p>

                                    <div className="flex space-x-2">
                                        <button className="flex-grow py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors">
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;