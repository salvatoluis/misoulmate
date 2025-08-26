import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Search, User, MapPin, Coffee,
    Music, BookOpen, Camera, Film,
    Sliders, Check, Eye, Calendar, FilterX, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '@/services';

const interestIcons = {
    Photography: <Camera size={16} />,
    Reading: <BookOpen size={16} />,
    Coffee: <Coffee size={16} />,
    Hiking: <MapPin size={16} />,
    Music: <Music size={16} />,
    Technology: <Search size={16} />,
    Fitness: <User size={16} />,
    Cooking: <Coffee size={16} />,
    Travel: <MapPin size={16} />,
    Art: <Camera size={16} />,
    Food: <Coffee size={16} />,
    Yoga: <User size={16} />,
    Movies: <Film size={16} />,
    Dogs: <Heart size={16} />,
    Tennis: <User size={16} />,
    "Rock Climbing": <MapPin size={16} />,
};

type Match = {
    id: string;
    compatibilityScore: number;
    otherUser: {
        profile: {
            name: string;
            age: number;
            location: string;
            lastActive: string;
            interests: string[];
            photos: string[];
        };
    };
};

const Matches: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<{ [matchId: string]: number }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<{
        ageRange: [number, number];
        distance: number;
        interests: string[];
    }>({
        ageRange: [20, 40],
        distance: 30,
        interests: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setIsLoading(true);
                const response = await matchService.getMatches();
                setMatches(response.matches);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, []);

    useEffect(() => {
        let count = 0;
        if (filters.ageRange[0] > 20 || filters.ageRange[1] < 40) count++;
        if (filters.distance < 30) count++;
        if (filters.interests.length > 0) count += 1;
        setActiveFilters(count);
    }, [filters]);

    const navigatePhoto = (matchId: string, direction: 'next' | 'prev') => {
        const match = matches?.find(m => m.id === matchId);
        if (!match) return;

        const currentIndex = selectedPhoto[matchId] || 0;
        const photos = match.otherUser.profile.photos;
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % photos.length
            : (currentIndex - 1 + photos.length) % photos.length;

        setSelectedPhoto({
            ...selectedPhoto,
            [matchId]: newIndex
        });
    };

    const toggleFilters = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const resetFilters = () => {
        setFilters({
            ageRange: [20, 40],
            distance: 30,
            interests: [],
        });
    };

    const filterByInterest = (interest: string) => {
        const newInterests = filters.interests.includes(interest as string)
            ? filters.interests.filter(i => i !== interest)
            : [...filters.interests, interest];

        setFilters({
            ...filters,
            interests: newInterests
        });
    };

    const allInterests = Array.from(
        new Set(matches.flatMap(match => match.otherUser?.profile?.interests || []))
    );

    const filteredMatches = matches.filter(match => {
        const otherUserProfile = match.otherUser.profile;
        const ageMatch = otherUserProfile.age >= filters.ageRange[0] && otherUserProfile.age <= filters.ageRange[1];

        const distanceMatch = true;

        const interestMatch = filters.interests.length === 0 ||
            otherUserProfile.interests.some(interest => filters.interests.includes(interest));

        return ageMatch && distanceMatch && interestMatch;
    });

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-white pt-16 pb-16">
            <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm border-b border-gray-100 pt-safe">
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] p-1.5 rounded-full mr-2">
                            <Heart size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Your Matches</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isFilterOpen 
                                ? 'bg-gradient-to-r from-[#FF6B81]/10 to-[#B75BFF]/10 text-[#FF6B81]' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={toggleFilters}
                        >
                            <Sliders size={20} />
                            {activeFilters > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {activeFilters}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        className="fixed top-[calc(env(safe-area-inset-top)+56px)] left-0 right-0 bg-white z-30 border-b border-gray-100 shadow-md"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="p-4 space-y-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-800">Filter Matches</h3>
                                <button
                                    className="text-sm text-[#FF6B81] font-medium flex items-center gap-1"
                                    onClick={resetFilters}
                                >
                                    <FilterX size={14} />
                                    Reset All
                                </button>
                            </div>

                            {/* Age Range */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Age Range</label>
                                    <span className="text-sm text-[#FF6B81] font-medium">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">Min</span>
                                        <input
                                            type="range"
                                            min="18"
                                            max="60"
                                            value={filters.ageRange[0]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                                            })}
                                            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">Max</span>
                                        <input
                                            type="range"
                                            min="18"
                                            max="60"
                                            value={filters.ageRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [filters.ageRange[0], parseInt(e.target.value)]
                                            })}
                                            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#B75BFF]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Interests */}
                            {allInterests.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allInterests.map(interest => (
                                            <button
                                                key={interest}
                                                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1.5 transition-colors ${
                                                    filters.interests.includes(interest)
                                                        ? 'bg-gradient-to-r from-[#FF6B81]/90 to-[#B75BFF]/90 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                                onClick={() => filterByInterest(interest)}
                                            >
                                                {interestIcons[interest as keyof typeof interestIcons] || <Heart size={14} />}
                                                {interest}
                                                {filters.interests.includes(interest) && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Apply/Close button */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>
                                <button
                                    className="flex-1 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white rounded-full font-medium hover:shadow-md transition-all"
                                    onClick={toggleFilters}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className={`px-4 pt-[calc(env(safe-area-inset-top)+56px+${isFilterOpen ? '0px' : '0px'})] pb-4`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-[#FF6B81] border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Heart size={20} className="text-[#FF6B81]" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500">Finding your matches...</p>
                    </div>
                ) : (
                    <>
                        <div className="my-4 flex justify-between items-center">
                            <h2 className="text-base font-medium text-gray-800">
                                {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                            </h2>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} className="mr-0.5" />
                                Most recent
                            </div>
                        </div>

                        {filteredMatches.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-gradient-to-r from-[#FF6B81]/10 to-[#B75BFF]/10 rounded-full inline-flex">
                                        <Heart size={28} className="text-[#FF6B81]" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No matches found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm px-4">
                                    {activeFilters > 0
                                        ? 'Try adjusting your filters to see more matches'
                                        : 'Keep swiping to find new matches'}
                                </p>
                                {activeFilters > 0 && (
                                    <button
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white rounded-full hover:shadow-md transition-all"
                                        onClick={resetFilters}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {filteredMatches.map(match => {
                                    const otherUser = match.otherUser;
                                    const profile = otherUser.profile;

                                    return (
                                        <motion.div
                                            key={match.id}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 flex flex-col"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Photo */}
                                            <div 
                                                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                                                onClick={() => navigate(`/match/${match.id}`)}
                                            >
                                                <img
                                                    src={profile.photos[selectedPhoto[match.id] || 0]}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />

                                                {profile.photos.length > 1 && (
                                                    <>
                                                        <button
                                                            className="absolute top-1/2 left-1 p-1 bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigatePhoto(match.id, 'prev');
                                                            }}
                                                        >
                                                            <ArrowLeft className="text-white w-4 h-4 drop-shadow-md" />
                                                        </button>
                                                        <button
                                                            className="absolute top-1/2 right-1 p-1 bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigatePhoto(match.id, 'next');
                                                            }}
                                                        >
                                                            <ArrowRight className="text-white w-4 h-4 drop-shadow-md" />
                                                        </button>

                                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                                            {profile.photos.map((_, photoIndex) => (
                                                                <div
                                                                    key={photoIndex}
                                                                    className={`h-1 rounded-full ${(selectedPhoto[match.id] || 0) === photoIndex
                                                                        ? 'w-4 bg-white'
                                                                        : 'w-1 bg-white/50'
                                                                        } transition-all`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Compatibility score */}
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                                    <Heart size={10} className="fill-white" /> {match.compatibilityScore}%
                                                </div>

                                                {/* Activity status */}
                                                <div className="absolute bottom-2 left-2 bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm flex items-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></div>
                                                    {getTimeAgo(profile.lastActive)}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                <div className="mb-1">
                                                    <h3 className="text-base font-bold text-gray-800 truncate">{profile.name}, {profile.age}</h3>
                                                    <div className="flex items-center text-gray-500 text-xs">
                                                        <MapPin size={10} className="mr-0.5 flex-shrink-0" />
                                                        <span className="truncate">{profile.location}</span>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex justify-between mt-3 gap-2">
                                                    <button
                                                        className="flex-1 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B81]/10 to-[#B75BFF]/10 text-[#FF6B81] text-xs font-medium hover:shadow-sm transition-all"
                                                        onClick={() => navigate(`/match/${match.id}`)}
                                                    >
                                                        <Eye size={14} className="mr-1" />
                                                        View
                                                    </button>

                                                    <button
                                                        className="flex-1 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white text-xs font-medium hover:shadow-md transition-all"
                                                        onClick={() => navigate(`/messages/${match.id}`)}
                                                    >
                                                        <MessageCircle size={14} className="mr-1" />
                                                        Message
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>

            <style>{`
                /* Custom range input styling */
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 4px;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #FF6B81, #B75BFF);
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #FF6B81, #B75BFF);
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default Matches;