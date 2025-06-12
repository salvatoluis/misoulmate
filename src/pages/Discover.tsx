// src/pages/Discover.tsx
import React, { useState, useRef } from 'react';
import { ChevronRight, Search, Filter, Heart, X, Zap, Coffee, MapPin, Music, Film, Book, Utensils, Briefcase, GraduationCap, Wine, Check, Bookmark, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
    id: string;
    name: string;
    age: number;
    location: string;
    distance: number;
    bio: string;
    photos: string[];
    interests: string[];
    occupation?: string;
    education?: string;
    compatibility?: number;
    isOnline?: boolean;
    isVerified?: boolean;
    lastActive?: string;
    height?: string;
}

interface SearchFilters {
    distance: number;
    ageRange: [number, number];
    interests: string[];
    height?: string;
    education?: string;
    verified?: boolean;
    hasPhotos?: number;
}

const Discover: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Search filters
    const [filters, setFilters] = useState<SearchFilters>({
        distance: 25,
        ageRange: [21, 45],
        interests: [],
        verified: false,
        hasPhotos: 3
    });

    const profiles: Profile[] = [
        {
            id: '1',
            name: 'Emma',
            age: 28,
            location: 'San Francisco',
            distance: 3.2,
            bio: 'Coffee enthusiast, amateur photographer, and bookworm. Looking for someone to explore the city with!',
            photos: [
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1560535733-540e0b0068b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Photography', 'Reading', 'Coffee', 'Hiking'],
            occupation: 'UX Designer',
            education: 'Stanford University',
            compatibility: 96,
            isOnline: true,
            isVerified: true,
            height: "5'7\""
        },
        {
            id: '2',
            name: 'Michael',
            age: 31,
            location: 'Berkeley',
            distance: 5.8,
            bio: 'Music lover, tech geek, and fitness enthusiast. Looking for someone with similar interests and a good sense of humor.',
            photos: [
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Music', 'Technology', 'Fitness', 'Cooking'],
            occupation: 'Software Engineer',
            education: 'UC Berkeley',
            compatibility: 92,
            isOnline: false,
            isVerified: true,
            lastActive: '5 minutes ago',
            height: "6'0\""
        },
        {
            id: '3',
            name: 'Sophia',
            age: 26,
            location: 'Oakland',
            distance: 7.1,
            bio: 'Art lover, foodie, and travel enthusiast. Let\'s explore new restaurants and plan weekend getaways!',
            photos: [
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Travel', 'Art', 'Food', 'Yoga'],
            occupation: 'Marketing Manager',
            education: 'NYU',
            compatibility: 89,
            isOnline: true,
            isVerified: true,
            height: "5'5\""
        },
        {
            id: '4',
            name: 'James',
            age: 32,
            location: 'San Jose',
            distance: 12.4,
            bio: 'Movie buff, amateur chef, and dog lover. Looking for someone to share movie nights and cooking adventures.',
            photos: [
                'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1568990545613-aa37e9353eb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Movies', 'Cooking', 'Dogs', 'Tennis'],
            occupation: 'Product Manager',
            education: 'Santa Clara University',
            compatibility: 87,
            isOnline: false,
            isVerified: false,
            lastActive: '3 hours ago',
            height: "5'11\""
        },
        {
            id: '5',
            name: 'Olivia',
            age: 29,
            location: 'Palo Alto',
            distance: 15.7,
            bio: 'Book lover, pianist, and nature enthusiast. Looking for someone to share quiet evenings and weekend hikes.',
            photos: [
                'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Reading', 'Music', 'Hiking', 'Yoga'],
            occupation: 'Clinical Psychologist',
            education: 'Stanford University',
            compatibility: 85,
            isOnline: false,
            isVerified: true,
            lastActive: 'Yesterday',
            height: "5'6\""
        },
        {
            id: '6',
            name: 'Daniel',
            age: 27,
            location: 'Mountain View',
            distance: 18.2,
            bio: 'Photographer, rock climber, and coffee addict. Looking for someone to join my adventures!',
            photos: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Photography', 'Rock Climbing', 'Coffee', 'Travel'],
            occupation: 'Photographer',
            education: 'Art Institute of San Francisco',
            compatibility: 83,
            isOnline: true,
            isVerified: false,
            height: "5'10\""
        },
        {
            id: '7',
            name: 'Jasmine',
            age: 25,
            location: 'Fremont',
            distance: 20.3,
            bio: 'Dance instructor by day, stargazer by night. Looking for someone who appreciates both art and science. Let\'s dance under the stars!',
            photos: [
                'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Dancing', 'Astronomy', 'Painting', 'Poetry'],
            occupation: 'Dance Instructor',
            education: 'Juilliard School',
            compatibility: 81,
            isOnline: false,
            isVerified: true,
            lastActive: '2 days ago',
            height: "5'4\""
        },
        {
            id: '8',
            name: 'Ryan',
            age: 33,
            location: 'Cupertino',
            distance: 22.5,
            bio: 'Former chef turned tech enthusiast. I still cook a mean pasta carbonara. Looking for someone to share good food and meaningful conversations.',
            photos: [
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            interests: ['Cooking', 'Technology', 'Philosophy', 'Wine Tasting'],
            occupation: 'Solution Architect',
            education: 'Culinary Institute of America',
            compatibility: 78,
            isOnline: false,
            isVerified: true,
            lastActive: '3 days ago',
            height: "6'1\""
        }
    ];

    // Available interest categories for filtering
    const interestCategories = [
        { id: 'activities', name: 'Activities', interests: ['Hiking', 'Yoga', 'Running', 'Cycling', 'Swimming', 'Rock Climbing', 'Dancing', 'Tennis', 'Fitness'] },
        { id: 'arts', name: 'Arts & Culture', interests: ['Art', 'Photography', 'Music', 'Reading', 'Writing', 'Theater', 'Museums', 'Design', 'Fashion'] },
        { id: 'food', name: 'Food & Drink', interests: ['Cooking', 'Coffee', 'Wine Tasting', 'Foodie', 'Baking', 'Craft Beer', 'Restaurants', 'Vegetarian'] },
        { id: 'entertainment', name: 'Entertainment', interests: ['Movies', 'TV Shows', 'Gaming', 'Concerts', 'Comedy', 'Board Games', 'Podcasts'] },
        { id: 'outdoors', name: 'Outdoors', interests: ['Travel', 'Camping', 'Backpacking', 'Beach', 'Mountains', 'Fishing', 'Gardening'] }
    ];

    // Icons for common interests
    const getInterestIcon = (interest: string) => {
        const interestLower = interest.toLowerCase();
        if (interestLower.includes('coffee')) return <Coffee size={14} />;
        if (interestLower.includes('food') || interestLower.includes('cooking') || interestLower.includes('restaurant')) return <Utensils size={14} />;
        if (interestLower.includes('music')) return <Music size={14} />;
        if (interestLower.includes('movie') || interestLower.includes('film')) return <Film size={14} />;
        if (interestLower.includes('book') || interestLower.includes('reading')) return <Book size={14} />;
        if (interestLower.includes('wine') || interestLower.includes('beer') || interestLower.includes('drink')) return <Wine size={14} />;
        return null;
    };

    // Height options for filter
    const heightOptions = [
        "Under 5'0\"", "5'0\" - 5'3\"", "5'4\" - 5'7\"", "5'8\" - 5'11\"", "6'0\" - 6'3\"", "Over 6'3\""
    ];

    // Education options for filter
    const educationOptions = [
        'High School', 'Some College', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Professional Degree'
    ];

    // Toggle an interest in the filter
    const toggleInterestFilter = (interest: string) => {
        setFilters(prev => {
            if (prev.interests.includes(interest)) {
                return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...prev.interests, interest] };
            }
        });
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            distance: 25,
            ageRange: [21, 45],
            interests: [],
            verified: false,
            hasPhotos: 3
        });
    };

    // Filter profiles based on search and filters
    const filteredProfiles = profiles.filter(profile => {
        // Search query filter
        if (searchQuery &&
            !profile.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !profile.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !profile.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return false;
        }

        // Distance filter
        if (profile.distance > filters.distance) {
            return false;
        }

        // Age filter
        if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) {
            return false;
        }

        // Interests filter
        if (filters.interests.length > 0 &&
            !filters.interests.some(interest => profile.interests.includes(interest))) {
            return false;
        }

        // Verified filter
        if (filters.verified && !profile.isVerified) {
            return false;
        }

        // Photo count filter
        if (filters.hasPhotos && profile.photos.length < filters.hasPhotos) {
            return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/matches"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Discover</h1>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
                                onClick={() => setShowMobileSearch(!showMobileSearch)}
                                aria-label={showMobileSearch ? "Close search" : "Open search"}
                            >
                                <Search size={20} className="text-gray-600" />
                            </button>

                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => setShowFilters(!showFilters)}
                                aria-label={showFilters ? "Close filters" : "Open filters"}
                            >
                                <Filter size={20} className="text-gray-600" />
                            </button>

                            <div className="hidden md:flex border border-gray-300 rounded-full overflow-hidden">
                                <button
                                    className={`px-3 py-1.5 ${activeView === 'grid' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'} transition-colors`}
                                    onClick={() => setActiveView('grid')}
                                    aria-label="Grid view"
                                >
                                    Grid
                                </button>
                                <button
                                    className={`px-3 py-1.5 ${activeView === 'list' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'} transition-colors`}
                                    onClick={() => setActiveView('list')}
                                    aria-label="List view"
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Input */}
                    {showMobileSearch && (
                        <div className="mt-3 relative md:hidden">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, location, interests..."
                                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                autoFocus
                            />
                            <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            {searchQuery && (
                                <button
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Desktop Search */}
            <div className="hidden md:block bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, location, interests..."
                            className="w-full py-2.5 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                        />
                        <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {searchQuery && (
                            <button
                                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-gray-800">Filters</h2>
                                <button
                                    className="text-[#FF6B81] text-sm hover:underline"
                                    onClick={resetFilters}
                                >
                                    Reset All
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Distance Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Distance: {filters.distance} miles
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={filters.distance}
                                        onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>1 mile</span>
                                        <span>50 miles</span>
                                        <span>100 miles</span>
                                    </div>
                                </div>

                                {/* Age Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="range"
                                            min="18"
                                            max="70"
                                            value={filters.ageRange[0]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [
                                                    parseInt(e.target.value),
                                                    Math.max(parseInt(e.target.value), filters.ageRange[1])
                                                ]
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                        />
                                        <span className="text-gray-600 font-medium w-10 text-center">{filters.ageRange[0]}</span>
                                    </div>
                                    <div className="flex gap-4 items-center mt-4">
                                        <input
                                            type="range"
                                            min="18"
                                            max="70"
                                            value={filters.ageRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [
                                                    Math.min(filters.ageRange[0], parseInt(e.target.value)),
                                                    parseInt(e.target.value)
                                                ]
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                        />
                                        <span className="text-gray-600 font-medium w-10 text-center">{filters.ageRange[1]}</span>
                                    </div>
                                </div>

                                {/* Height Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Height
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {heightOptions.map(height => (
                                            <button
                                                key={height}
                                                className={`py-2 px-3 rounded-lg text-sm border ${filters.height === height
                                                    ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    } transition-colors`}
                                                onClick={() => setFilters({
                                                    ...filters,
                                                    height: filters.height === height ? undefined : height
                                                })}
                                            >
                                                {height}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Education Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Education
                                    </label>
                                    <select
                                        value={filters.education || ''}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            education: e.target.value || undefined
                                        })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    >
                                        <option value="">Any education level</option>
                                        {educationOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Photo Count Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Photos
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="has-photos"
                                            checked={!!filters.hasPhotos}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                hasPhotos: e.target.checked ? 3 : undefined
                                            })}
                                            className="h-4 w-4 text-[#FF6B81] border-gray-300 rounded focus:ring-[#FF6B81]"
                                        />
                                        <label htmlFor="has-photos" className="ml-2 text-gray-700">
                                            At least 3 photos
                                        </label>
                                    </div>
                                </div>

                                {/* Verified Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="verified-only"
                                            checked={!!filters.verified}
                                            onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                                            className="h-4 w-4 text-[#FF6B81] border-gray-300 rounded focus:ring-[#FF6B81]"
                                        />
                                        <label htmlFor="verified-only" className="ml-2 text-gray-700">
                                            Verified profiles only
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Interests Section */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Interests
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                                    {interestCategories.map(category => (
                                        <div key={category.id}>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {category.interests.slice(0, 4).map(interest => (
                                                    <button
                                                        key={interest}
                                                        className={`text-xs px-2.5 py-1.5 rounded-full ${filters.interests.includes(interest)
                                                            ? 'bg-[#FF6B81]/10 text-[#FF6B81] border border-[#FF6B81]/20'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                                                            } transition-colors`}
                                                        onClick={() => toggleInterestFilter(interest)}
                                                    >
                                                        {interest}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    className="px-6 py-2.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors"
                                    onClick={() => setShowFilters(false)}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Results Count & Sort */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-gray-600">
                        {filteredProfiles.length} {filteredProfiles.length === 1 ? 'person' : 'people'} found
                    </div>

                    <div className="flex items-center">
                        <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2">Sort by</label>
                        <select
                            id="sort-by"
                            className="text-sm border border-gray-300 rounded-lg py-1.5 px-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                        >
                            <option>Recommended</option>
                            <option>Distance</option>
                            <option>Activity</option>
                            <option>Newest</option>
                        </select>
                    </div>
                </div>

                {/* Profile Grid View */}
                {activeView === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProfiles.map(profile => (
                            <div key={profile.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Profile Image */}
                                <div className="relative h-80 sm:h-64 md:h-72">
                                    <img
                                        src={profile.photos[0]}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Online Status */}
                                    {profile.isOnline && (
                                        <div className="absolute top-3 left-3 bg-primary rounded-full p-1">
                                            <div className="h-2 w-2 rounded-full bg-white"></div>
                                        </div>
                                    )}

                                    {/* Verified Badge */}
                                    {profile.isVerified && (
                                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                                            <Check size={14} />
                                        </div>
                                    )}

                                    {/* Compatibility Score */}
                                    {profile.compatibility && (
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                            <span className="text-[#FF6B81] font-bold">{profile.compatibility}%</span> Match
                                        </div>
                                    )}

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm transition-colors">
                                            <Bookmark size={20} className="text-gray-700" />
                                        </button>
                                        <button className="p-2 bg-[#FF6B81]/90 backdrop-blur-sm hover:bg-[#FF6B81] rounded-full shadow-sm transition-colors">
                                            <Heart size={20} className="text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800">
                                                {profile.name}, {profile.age}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <MapPin size={14} className="mr-1 text-gray-400" />
                                                {profile.location} • {profile.distance} miles away
                                            </p>
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {profile.interests.slice(0, 3).map(interest => (
                                            <span
                                                key={interest}
                                                className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                            >
                                                {getInterestIcon(interest) && (
                                                    <span className="mr-1">{getInterestIcon(interest)}</span>
                                                )}
                                                {interest}
                                            </span>
                                        ))}
                                        {profile.interests.length > 3 && (
                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                +{profile.interests.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* View Profile Link */}
                                    <Link
                                        to={`/match/${profile.id}`}
                                        className="mt-3 block w-full py-2 text-center text-[#FF6B81] hover:text-[#D86D72] text-sm font-medium rounded-lg border border-[#FF6B81] hover:bg-[#FF6B81]/5 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Profile List View */}
                {activeView === 'list' && (
                    <div className="space-y-4">
                        {filteredProfiles.map(profile => (
                            <div key={profile.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Profile Image */}
                                    <div className="relative w-full sm:w-1/3 h-60 sm:h-auto">
                                        <img
                                            src={profile.photos[0]}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Online Status */}
                                        {profile.isOnline && (
                                            <div className="absolute top-3 left-3 bg-primary rounded-full p-1">
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            </div>
                                        )}

                                        {/* Verified Badge */}
                                        {profile.isVerified && (
                                            <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                                                <Check size={14} />
                                            </div>
                                        )}

                                        {/* Compatibility Score */}
                                        {profile.compatibility && (
                                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                                <span className="text-[#FF6B81] font-bold">{profile.compatibility}%</span> Match
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Info */}
                                    <div className="p-4 flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">
                                                    {profile.name}, {profile.age}
                                                </h3>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <MapPin size={14} className="mr-1 text-gray-400" />
                                                    {profile.location} • {profile.distance} miles away
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                                    <Bookmark size={16} className="text-gray-700" />
                                                </button>
                                                <button className="p-1.5 bg-[#FF6B81] text-white rounded-full hover:bg-[#D86D72] transition-colors">
                                                    <Heart size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{profile.bio}</p>

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-sm">
                                            {profile.occupation && (
                                                <div className="flex items-center">
                                                    <Briefcase size={14} className="mr-1.5 text-gray-500" />
                                                    <span className="text-gray-700">{profile.occupation}</span>
                                                </div>
                                            )}
                                            {profile.education && (
                                                <div className="flex items-center">
                                                    <GraduationCap size={14} className="mr-1.5 text-gray-500" />
                                                    <span className="text-gray-700">{profile.education}</span>
                                                </div>
                                            )}
                                            {profile.height && (
                                                <div className="flex items-center">
                                                    <User size={14} className="mr-1.5 text-gray-500" />
                                                    <span className="text-gray-700">{profile.height}</span>
                                                </div>
                                            )}
                                            {(profile.isOnline || profile.lastActive) && (
                                                <div className="flex items-center">
                                                    <div className={`h-2 w-2 rounded-full ${profile.isOnline ? 'bg-primary' : 'bg-gray-300'} mr-1.5`}></div>
                                                    <span className="text-gray-700">{profile.isOnline ? 'Online now' : profile.lastActive}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Interests */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {profile.interests.map(interest => (
                                                <span
                                                    key={interest}
                                                    className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {getInterestIcon(interest) && (
                                                        <span className="mr-1">{getInterestIcon(interest)}</span>
                                                    )}
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            to={`/match/${profile.id}`}
                                            className="inline-block px-4 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredProfiles.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No matches found</h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your filters or search criteria to find more people.
                        </p>
                        <button
                            className="px-4 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg text-sm font-medium transition-colors"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Premium Banner */}
                <div className="mt-8 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] rounded-xl shadow-sm text-white overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="mb-6 sm:mb-0 sm:mr-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                                    <Zap size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="text-center sm:text-left sm:flex-1">
                                <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                                <p className="text-white/90 mb-4">
                                    See who likes you, access advanced filters, and get boosted in search results!
                                </p>
                                <Link
                                    to="/subscription"
                                    className="inline-block px-6 py-2.5 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
                                >
                                    Get Premium
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;