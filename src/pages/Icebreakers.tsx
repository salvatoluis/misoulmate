// src/pages/Icebreakers.tsx
import React, { useState } from 'react';
import { ChevronRight, MessageSquare, Bookmark, RefreshCw, Send, Plus, Copy, Search, Copy as CopyIcon, ThumbsUp, ThumbsDown } from 'lucide-react';

interface IcebreakerCategory {
    id: string;
    name: string;
}

interface Icebreaker {
    id: string;
    text: string;
    categoryId: string;
    isSaved: boolean;
    isCustom: boolean;
}

interface Match {
    id: string;
    name: string;
    avatarUrl: string;
    lastActive: string;
}

const Icebreakers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'explore' | 'saved' | 'custom'>('explore');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newIcebreaker, setNewIcebreaker] = useState('');
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [selectedIcebreaker, setSelectedIcebreaker] = useState<Icebreaker | null>(null);

    // Icebreaker categories
    const categories: IcebreakerCategory[] = [
        { id: 'funny', name: 'Funny' },
        { id: 'thoughtful', name: 'Thoughtful' },
        { id: 'personal', name: 'Personal' },
        { id: 'deep', name: 'Deep Questions' },
        { id: 'playful', name: 'Playful' },
        { id: 'would-you-rather', name: 'Would You Rather' },
    ];

    // Mock icebreakers
    const [icebreakers, setIcebreakers] = useState<Icebreaker[]>([
        {
            id: '1',
            text: 'If you could travel anywhere right now, where would you go and why?',
            categoryId: 'thoughtful',
            isSaved: false,
            isCustom: false
        },
        {
            id: '2',
            text: 'What\'s the best book you\'ve read or show you\'ve watched recently?',
      categoryId: 'personal',
            isSaved: true,
            isCustom: false
        },
        {
            id: '3',
            text: 'Would you rather be able to fly or be invisible?',
            categoryId: 'would-you-rather',
            isSaved: false,
            isCustom: false
        },
        {
            id: '4',
            text: 'If you had to eat one food for the rest of your life, what would it be?',
            categoryId: 'funny',
            isSaved: true,
            isCustom: false
        },
        {
            id: '5',
            text: 'What\'s your favorite way to spend a weekend?',
      categoryId: 'personal',
            isSaved: false,
            isCustom: false
        },
        {
            id: '6',
            text: 'What\'s something you\'re looking forward to this year?',
            categoryId: 'thoughtful',
            isSaved: false,
            isCustom: false
        },
        {
            id: '7',
            text: 'If you could have dinner with anyone, living or dead, who would it be?',
            categoryId: 'deep',
            isSaved: true,
            isCustom: false
        },
        {
            id: '8',
            text: 'What\'s the most spontaneous thing you\'ve ever done?',
            categoryId: 'personal',
            isSaved: false,
            isCustom: false
        },
        {
            id: '9',
            text: 'Would you rather go camping in the woods or stay in a luxury hotel?',
            categoryId: 'would-you-rather',
            isSaved: false,
            isCustom: false
        },
        {
            id: '10',
            text: 'What\'s your go- to karaoke song ? ',
      categoryId: 'funny',
        isSaved: false,
        isCustom: false
    },
    {
        id: '11',
        text: 'If you were a character in a movie, what type of character would you be?',
        categoryId: 'playful',
        isSaved: true,
        isCustom: false
    },
    {
        id: '12',
        text: 'What was your childhood dream job?',
        categoryId: 'personal',
        isSaved: false,
        isCustom: false
    },
    {
        id: '13',
        text: 'My perfect date would include...',
        categoryId: 'personal',
        isSaved: false,
        isCustom: true
    }
  ]);

// Mock matches
const matches: Match[] = [
    { id: '1', name: 'Robin', avatarUrl: '/images/avatar-1.jpg', lastActive: '10m ago' },
    { id: '2', name: 'Morgan', avatarUrl: '/images/avatar-2.jpg', lastActive: '2h ago' },
    { id: '3', name: 'Taylor', avatarUrl: '/images/avatar-3.jpg', lastActive: 'Just now' },
    { id: '4', name: 'Jordan', avatarUrl: '/images/avatar-4.jpg', lastActive: '1d ago' }
];

// Toggle save status
const toggleSave = (id: string) => {
    setIcebreakers(prev =>
        prev.map(icebreaker =>
            icebreaker.id === id
                ? { ...icebreaker, isSaved: !icebreaker.isSaved }
                : icebreaker
        )
    );
};

// Add custom icebreaker
const addCustomIcebreaker = () => {
    if (newIcebreaker.trim().length === 0) return;

    const newId = String(Date.now());
    setIcebreakers(prev => [
        ...prev,
        {
            id: newId,
            text: newIcebreaker.trim(),
            categoryId: 'personal', // Default category
            isSaved: true,
            isCustom: true
        }
    ]);

    setNewIcebreaker('');
};

// Delete custom icebreaker
const deleteIcebreaker = (id: string) => {
    setIcebreakers(prev => prev.filter(icebreaker => icebreaker.id !== id));
};

// Open send dialog
const openSendDialog = (icebreaker: Icebreaker) => {
    setSelectedIcebreaker(icebreaker);
    setShowSendDialog(true);
};

// Copy to clipboard
const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
};

// Get random icebreaker
const getRandomIcebreaker = () => {
    const filteredIcebreakers = icebreakers.filter(
        icebreaker => !selectedCategory || icebreaker.categoryId === selectedCategory
    );

    if (filteredIcebreakers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredIcebreakers.length);
    return filteredIcebreakers[randomIndex];
};

// Filter icebreakers based on active tab, category, and search
const filteredIcebreakers = icebreakers.filter(icebreaker => {
    const matchesCategory = !selectedCategory || icebreaker.categoryId === selectedCategory;
    const matchesSearch = !searchTerm ||
        icebreaker.text.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'saved') {
        return icebreaker.isSaved && matchesCategory && matchesSearch;
    } else if (activeTab === 'custom') {
        return icebreaker.isCustom && matchesCategory && matchesSearch;
    } else {
        return !icebreaker.isCustom && matchesCategory && matchesSearch;
    }
});

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
                        <h1 className="text-xl font-bold text-gray-800">Icebreakers</h1>
                    </div>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => {
                            const randomIcebreaker = getRandomIcebreaker();
                            if (randomIcebreaker) {
                                openSendDialog(randomIcebreaker);
                            }
                        }}
                    >
                        <RefreshCw size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>
        </header>

        {/* Tabs */}
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex space-x-4">
                    <button
                        className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'explore'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('explore')}
                    >
                        Explore
                    </button>
                    <button
                        className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'saved'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Saved
                    </button>
                    <button
                        className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'custom'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('custom')}
                    >
                        Your Own
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-lg mx-auto">

                {/* Search and Categories */}
                <div className="mb-6">
                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm mb-4">
                        <div className="p-3 relative">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search icebreakers"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="overflow-x-auto pb-2">
                        <div className="flex space-x-2 min-w-max">
                            <button
                                className={`px-4 py-2 rounded-full text-sm ${selectedCategory === null
                                        ? 'bg-[#FF6B81] text-white'
                                        : 'bg-white text-gray-700 border border-gray-200'
                                    }`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                All Categories
                            </button>

                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`px-4 py-2 rounded-full text-sm ${selectedCategory === category.id
                                            ? 'bg-[#FF6B81]/10 text-[#FF6B81] border border-[#FF6B81]'
                                            : 'bg-white text-gray-700 border border-gray-200'
                                        }`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Icebreakers List */}
                {activeTab !== 'custom' && (
                    <>
                        <div className="space-y-4">
                            {filteredIcebreakers.length > 0 ? (
                                filteredIcebreakers.map(icebreaker => (
                                    <div key={icebreaker.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-4">
                                                    <p className="text-gray-800">{icebreaker.text}</p>
                                                    <div className="mt-1">
                                                        <span className="inline-block text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                                                            {categories.find(c => c.id === icebreaker.categoryId)?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`p-2 rounded-full ${icebreaker.isSaved
                                                            ? 'text-[#FF6B81]'
                                                            : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                    onClick={() => toggleSave(icebreaker.id)}
                                                >
                                                    <Bookmark
                                                        size={20}
                                                        fill={icebreaker.isSaved ? '#FF6B81' : 'none'}
                                                    />
                                                </button>
                                            </div>
                                            <div className="mt-3 flex justify-between">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                                                        onClick={() => copyToClipboard(icebreaker.text)}
                                                    >
                                                        <CopyIcon size={18} />
                                                    </button>
                                                    <div className="flex space-x-1">
                                                        <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                                                            <ThumbsUp size={18} />
                                                        </button>
                                                        <button className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                                                            <ThumbsDown size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    className="px-3 py-1 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm font-medium flex items-center"
                                                    onClick={() => openSendDialog(icebreaker)}
                                                >
                                                    <Send size={14} className="mr-1" />
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-gray-700 font-medium mb-1">No icebreakers found</h3>
                                    <p className="text-gray-500 text-sm">
                                        {activeTab === 'saved'
                                            ? 'Save some icebreakers or try different filters'
                                            : 'Try adjusting your filters or search terms'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {activeTab === 'explore' && (
                            <div className="mt-8 text-center">
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    onClick={() => {
                                        const randomIcebreaker = getRandomIcebreaker();
                                        if (randomIcebreaker) {
                                            openSendDialog(randomIcebreaker);
                                        }
                                    }}
                                >
                                    <RefreshCw size={16} className="inline mr-2" />
                                    Get Random Icebreaker
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Custom Icebreakers */}
                {activeTab === 'custom' && (
                    <>
                        {/* Add new */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="p-4 border-b border-gray-100 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                    <Plus size={20} className="text-[#FF6B81]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800">Create Your Own</h2>
                                    <p className="text-sm text-gray-600">
                                        Add personalized conversation starters
                                    </p>
                                </div>
                            </div>

                            <div className="p-4">
                                <textarea
                                    placeholder="Write your own icebreaker..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-24"
                                    value={newIcebreaker}
                                    onChange={(e) => setNewIcebreaker(e.target.value)}
                                />
                                <div className="mt-3 flex justify-end">
                                    <button
                                        className={`px-4 py-2 rounded-lg text-white ${newIcebreaker.trim().length > 0
                                                ? 'bg-[#FF6B81] hover:bg-[#D86D72]'
                                                : 'bg-gray-300 cursor-not-allowed'
                                            } transition-colors`}
                                        onClick={addCustomIcebreaker}
                                        disabled={newIcebreaker.trim().length === 0}
                                    >
                                        Save Icebreaker
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Saved custom icebreakers */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Your Icebreakers</h3>

                            {filteredIcebreakers.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredIcebreakers.map(icebreaker => (
                                        <div key={icebreaker.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-gray-800 flex-1 mr-4">{icebreaker.text}</p>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        onClick={() => deleteIcebreaker(icebreaker.id)}
                                                    >
                                                        <ThumbsDown size={18} />
                                                    </button>
                                                </div>
                                                <div className="mt-3 flex justify-between">
                                                    <button
                                                        className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                                                        onClick={() => copyToClipboard(icebreaker.text)}
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm font-medium flex items-center"
                                                        onClick={() => openSendDialog(icebreaker)}
                                                    >
                                                        <Send size={14} className="mr-1" />
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-gray-700 font-medium mb-1">No custom icebreakers yet</h3>
                                    <p className="text-gray-500 text-sm">
                                        Create your own conversation starters
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Send Dialog Modal */}
        {showSendDialog && selectedIcebreaker && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-medium text-gray-800">Send Icebreaker</h3>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setShowSendDialog(false)}
                        >
                            <ChevronRight size={24} className="transform rotate-90" />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="bg-[#FF6B81]/5 p-3 rounded-lg mb-4 border border-[#FF6B81]/10">
                            <p className="text-gray-800">{selectedIcebreaker.text}</p>
                        </div>

                        <h4 className="font-medium text-gray-700 mb-3">Choose a match:</h4>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {matches.map(match => (
                                <button
                                    key={match.id}
                                    className={`flex items-center p-3 rounded-lg border ${selectedMatchId === match.id
                                            ? 'border-[#FF6B81] bg-[#FF6B81]/5'
                                            : 'border-gray-200'
                                        } transition-colors`}
                                    onClick={() => setSelectedMatchId(match.id)}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <img
                                            src={match.avatarUrl}
                                            alt={match.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-800">{match.name}</p>
                                        <p className="text-xs text-gray-500">{match.lastActive}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                onClick={() => setShowSendDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`flex-1 py-2.5 rounded-lg text-white font-medium ${selectedMatchId
                                        ? 'bg-[#FF6B81] hover:bg-[#D86D72]'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    } transition-colors`}
                                disabled={!selectedMatchId}
                                onClick={() => {
                                    // In a real app, send the message to the match
                                    setShowSendDialog(false);
                                    setSelectedMatchId(null);
                                    // Could show a success toast
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default Icebreakers;