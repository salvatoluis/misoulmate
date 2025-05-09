// src/pages/DatePlanner.tsx
import React, { useState } from 'react';
import { ChevronRight, Calendar, MapPin, Clock, Filter, Heart, Coffee, Utensils, Ticket, Bike, GlassWater, BookOpen, Send } from 'lucide-react';

interface DateIdea {
    id: string;
    title: string;
    description: string;
    category: string;
    time: string;
    location: string;
    cost: 1 | 2 | 3; // 1 = $, 2 = $$, 3 = $$$
    imageSrc: string;
    liked: boolean;
}

interface DateCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const DatePlanner: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ideas' | 'saved' | 'custom'>('ideas');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [costFilter, setCostFilter] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [matchId, setMatchId] = useState<string | null>(null);
    const [customDatePlan, setCustomDatePlan] = useState('');

    // Date categories
    const categories: DateCategory[] = [
        { id: 'cafe', name: 'Café', icon: <Coffee size={18} /> },
        { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={18} /> },
        { id: 'entertainment', name: 'Entertainment', icon: <Ticket size={18} /> },
        { id: 'outdoors', name: 'Outdoors', icon: <Bike size={18} /> },
        { id: 'drinks', name: 'Drinks', icon: <GlassWater size={18} /> },
        { id: 'cultural', name: 'Cultural', icon: <BookOpen size={18} /> }
    ];

    // Mock matches for suggesting date
    const matches = [
        { id: '1', name: 'Jordan', avatarUrl: '/images/avatar-1.jpg' },
        { id: '2', name: 'Taylor', avatarUrl: '/images/avatar-2.jpg' },
        { id: '3', name: 'Alex', avatarUrl: '/images/avatar-3.jpg' },
        { id: '4', name: 'Casey', avatarUrl: '/images/avatar-4.jpg' }
    ];

    // Date ideas
    const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([
        {
            id: '1',
            title: 'Cozy Coffee Chat',
            description: 'Get to know each other over artisanal coffee in a relaxed atmosphere.',
            category: 'cafe',
            time: '1-2 hours',
            location: 'Local coffee shop',
            cost: 1,
            imageSrc: '/images/date-coffee.jpg',
            liked: false
        },
        {
            id: '2',
            title: 'Sunset Picnic',
            description: 'Enjoy a scenic picnic with snacks and drinks as the sun sets.',
            category: 'outdoors',
            time: '2-3 hours',
            location: 'Park or viewpoint',
            cost: 1,
            imageSrc: '/images/date-picnic.jpg',
            liked: true
        },
        {
            id: '3',
            title: 'Jazz & Cocktails',
            description: 'Listen to live jazz while enjoying craft cocktails in a sophisticated setting.',
            category: 'drinks',
            time: '2-3 hours',
            location: 'Jazz bar',
            cost: 2,
            imageSrc: '/images/date-jazz.jpg',
            liked: false
        },
        {
            id: '4',
            title: 'Art Gallery Tour',
            description: 'Explore contemporary art exhibits and discuss your impressions.',
            category: 'cultural',
            time: '1-2 hours',
            location: 'Local art gallery',
            cost: 1,
            imageSrc: '/images/date-gallery.jpg',
            liked: true
        },
        {
            id: '5',
            title: 'Gourmet Dining Experience',
            description: 'Indulge in a chef-curated tasting menu at an upscale restaurant.',
            category: 'restaurant',
            time: '2-3 hours',
            location: 'Fine dining restaurant',
            cost: 3,
            imageSrc: '/images/date-dining.jpg',
            liked: false
        },
        {
            id: '6',
            title: 'Comedy Show Night',
            description: 'Share laughs at a live stand-up comedy performance.',
            category: 'entertainment',
            time: '2 hours',
            location: 'Comedy club',
            cost: 2,
            imageSrc: '/images/date-comedy.jpg',
            liked: false
        },
        {
            id: '7',
            title: 'Bike Trail Adventure',
            description: 'Enjoy nature and exercise with a scenic bike ride.',
            category: 'outdoors',
            time: '2-4 hours',
            location: 'Bike trail',
            cost: 1,
            imageSrc: '/images/date-biking.jpg',
            liked: false
        },
        {
            id: '8',
            title: 'Wine Tasting Tour',
            description: 'Sample different wines while learning about wine making.',
            category: 'drinks',
            time: '2-3 hours',
            location: 'Winery or wine bar',
            cost: 2,
            imageSrc: '/images/date-wine.jpg',
            liked: true
        }
    ]);

    // Toggle like status for date idea
    const toggleLike = (id: string) => {
        setDateIdeas(prevIdeas =>
            prevIdeas.map(idea =>
                idea.id === id ? { ...idea, liked: !idea.liked } : idea
            )
        );
    };

    // Filter date ideas based on active filters
    const filteredDateIdeas = dateIdeas.filter(idea => {
        const matchesCategory = !selectedCategory || idea.category === selectedCategory;
        const matchesCost = !costFilter || idea.cost === costFilter;
        const matchesSearch = !searchTerm ||
            idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'saved') {
            return idea.liked && matchesCategory && matchesCost && matchesSearch;
        }

        return matchesCategory && matchesCost && matchesSearch;
    });

    // Render cost indicators
    const renderCost = (cost: 1 | 2 | 3) => {
        return (
            <div className="flex items-center">
                <span className={`text-xs ${cost >= 1 ? 'text-[#FF6B81]' : 'text-gray-300'}`}>$</span>
                <span className={`text-xs ${cost >= 2 ? 'text-[#FF6B81]' : 'text-gray-300'}`}>$</span>
                <span className={`text-xs ${cost >= 3 ? 'text-[#FF6B81]' : 'text-gray-300'}`}>$</span>
            </div>
        );
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
                            <h1 className="text-xl font-bold text-gray-800">Date Planner</h1>
                        </div>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-4">
                        <button
                            className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'ideas'
                                    ? 'border-[#FF6B81] text-[#FF6B81]'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('ideas')}
                        >
                            Date Ideas
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
                            Custom Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 py-3">
                    <div className="container mx-auto px-4">
                        <div className="max-w-lg mx-auto">
                            {/* Category filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700 mb-2">Category</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        className={`py-2 px-3 rounded-lg text-sm border ${selectedCategory === null
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            } transition-colors`}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        All
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            className={`py-2 px-3 rounded-lg text-sm border flex items-center justify-center ${selectedCategory === category.id
                                                    ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                } transition-colors`}
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            <span className="mr-1">{category.icon}</span>
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cost filter */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-700 mb-2">Budget</label>
                                <div className="flex space-x-2">
                                    <button
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm border ${costFilter === null
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            } transition-colors`}
                                        onClick={() => setCostFilter(null)}
                                    >
                                        Any
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm border ${costFilter === 1
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            } transition-colors`}
                                        onClick={() => setCostFilter(1)}
                                    >
                                        $
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm border ${costFilter === 2
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            } transition-colors`}
                                        onClick={() => setCostFilter(2)}
                                    >
                                        $$
                                    </button>
                                    <button
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm border ${costFilter === 3
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            } transition-colors`}
                                        onClick={() => setCostFilter(3)}
                                    >
                                        $$$
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="mb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search date ideas"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">

                    {/* Date Ideas Tab */}
                    {activeTab === 'ideas' && (
                        <>
                            {filteredDateIdeas.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredDateIdeas.map(idea => (
                                        <div key={idea.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            <div className="h-40 relative">
                                                <img
                                                    src={idea.imageSrc}
                                                    alt={idea.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    className={`absolute top-3 right-3 p-2 rounded-full ${idea.liked ? 'bg-[#FF6B81]' : 'bg-white/80 backdrop-blur-sm'
                                                        }`}
                                                    onClick={() => toggleLike(idea.id)}
                                                >
                                                    <Heart
                                                        size={20}
                                                        className={idea.liked ? 'text-white' : 'text-gray-600'}
                                                        fill={idea.liked ? 'white' : 'none'}
                                                    />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
                                                    {renderCost(idea.cost)}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <MapPin size={16} className="mr-2 text-[#FF6B81]" />
                                                        {idea.location}
                                                    </div>
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <Clock size={16} className="mr-2 text-[#FF6B81]" />
                                                        {idea.time}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex space-x-2">
                                                    <button className="flex-1 py-2 px-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors">
                                                        Plan This Date
                                                    </button>
                                                    <button className="py-2 px-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                                                        Share
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-gray-700 font-medium mb-1">No date ideas found</h3>
                                    <p className="text-gray-500 text-sm">
                                        Try adjusting your filters or search terms
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Saved Tab */}
                    {activeTab === 'saved' && (
                        <>
                            {filteredDateIdeas.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredDateIdeas.map(idea => (
                                        <div key={idea.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            <div className="h-40 relative">
                                                <img
                                                    src={idea.imageSrc}
                                                    alt={idea.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    className="absolute top-3 right-3 p-2 rounded-full bg-[#FF6B81]"
                                                    onClick={() => toggleLike(idea.id)}
                                                >
                                                    <Heart size={20} className="text-white" fill="white" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
                                                    {renderCost(idea.cost)}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <MapPin size={16} className="mr-2 text-[#FF6B81]" />
                                                        {idea.location}
                                                    </div>
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <Clock size={16} className="mr-2 text-[#FF6B81]" />
                                                        {idea.time}
                                                    </div>
                                                </div>

                                                {/* Suggest to match */}
                                                <div className="mt-4">
                                                    <button
                                                        className="w-full py-2 px-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors"
                                                        onClick={() => setMatchId(null)}
                                                    >
                                                        Suggest to a Match
                                                    </button>

                                                    {matchId === null && (
                                                        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-2">
                                                            <p className="text-sm text-gray-600 mb-2">Choose a match:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {matches.map(match => (
                                                                    <button
                                                                        key={match.id}
                                                                        className="flex items-center py-1.5 px-3 rounded-full border border-gray-200 hover:border-[#FF6B81] hover:bg-[#FF6B81]/5 transition-colors"
                                                                        onClick={() => setMatchId(match.id)}
                                                                    >
                                                                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                                                            <img
                                                                                src={match.avatarUrl}
                                                                                alt={match.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <span className="text-sm">{match.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {matchId && (
                                                        <div className="mt-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                                                        <img
                                                                            src={matches.find(m => m.id === matchId)?.avatarUrl}
                                                                            alt={matches.find(m => m.id === matchId)?.name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-medium">
                                                                        {matches.find(m => m.id === matchId)?.name}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    className="text-xs text-[#FF6B81]"
                                                                    onClick={() => setMatchId(null)}
                                                                >
                                                                    Change
                                                                </button>
                                                            </div>
                                                            <div className="flex mt-2">
                                                                <button className="flex-1 py-2 px-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                                                                    <Send size={16} className="mr-2" />
                                                                    Send Suggestion
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-gray-700 font-medium mb-1">No saved date ideas</h3>
                                    <p className="text-gray-500 text-sm">
                                        Like date ideas to save them for later
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Custom Date Plan Tab */}
                    {activeTab === 'custom' && (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                    <Calendar size={20} className="text-[#FF6B81]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800">Create Custom Date Plan</h2>
                                    <p className="text-sm text-gray-600">
                                        Plan something special for your match
                                    </p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-1">Choose a match</label>
                                    <div className="flex overflow-x-auto pb-2 -mx-1">
                                        {matches.map(match => (
                                            <button
                                                key={match.id}
                                                className={`flex flex-col items-center mx-1 p-2 rounded-lg transition-colors ${matchId === match.id
                                                        ? 'bg-[#FF6B81]/10 text-[#FF6B81]'
                                                        : 'hover:bg-gray-100'
                                                    }`}
                                                onClick={() => setMatchId(match.id)}
                                            >
                                                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-transparent transition-colors">
                                                    <img
                                                        src={match.avatarUrl}
                                                        alt={match.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm">{match.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-1">
                                        Describe your date plan
                                    </label>
                                    <textarea
                                        placeholder="Describe what you'd like to do... (e.g. 'Let's grab coffee at that new café downtown this Saturday at 2pm')"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-32"
                                        value={customDatePlan}
                                        onChange={(e) => setCustomDatePlan(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            />
                                            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Time</label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            />
                                            <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Where will you meet?"
                                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                        />
                                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-3 rounded-lg text-white font-medium ${matchId && customDatePlan.trim().length > 0
                                            ? 'bg-[#FF6B81] hover:bg-[#D86D72]'
                                            : 'bg-gray-300 cursor-not-allowed'
                                        } transition-colors`}
                                    disabled={!matchId || customDatePlan.trim().length === 0}
                                >
                                    Send Date Proposal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatePlanner;