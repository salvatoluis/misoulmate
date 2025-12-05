import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Search, User, MapPin, Coffee,
    Music, BookOpen, Camera, Film, Sparkles,
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
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-40 border-b border-gray-800">
                <div className="px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#FF6B9D] p-1.5 rounded-full">
                            <Sparkles size={16} className="text-white fill-white" />
                        </div>
                        <h1 className="text-lg font-bold text-white">matches</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isFilterOpen
                                ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                            }`}
                            onClick={toggleFilters}
                        >
                            <Sliders size={20} />
                            {activeFilters > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FF6B9D] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                                    {activeFilters}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        className="fixed top-[60px] left-0 right-0 bg-gray-900 z-30 border-b border-gray-800 shadow-lg"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="p-4 space-y-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-white">Filter Matches</h3>
                                <button
                                    className="text-sm text-[#FF6B9D] font-medium flex items-center gap-1 hover:text-[#FF4D88] transition-colors"
                                    onClick={resetFilters}
                                >
                                    <FilterX size={14} />
                                    Reset All
                                </button>
                            </div>

                            {/* Age Range */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-medium text-gray-300">Age Range</label>
                                    <span className="text-sm text-[#FF6B9D] font-medium">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-8">Min</span>
                                        <input
                                            type="range"
                                            min="18"
                                            max="60"
                                            value={filters.ageRange[0]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                                            })}
                                            className="flex-1 h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-[#FF6B9D]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-8">Max</span>
                                        <input
                                            type="range"
                                            min="18"
                                            max="60"
                                            value={filters.ageRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [filters.ageRange[0], parseInt(e.target.value)]
                                            })}
                                            className="flex-1 h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-[#FF6B9D]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Interests */}
                            {allInterests.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-3">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allInterests.map(interest => (
                                            <button
                                                key={interest}
                                                className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1.5 transition-all ${
                                                    filters.interests.includes(interest)
                                                        ? 'bg-[#FF6B9D] text-white shadow-sm'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                                    className="flex-1 py-2.5 border border-gray-700 rounded-full text-gray-300 font-medium hover:bg-gray-800 transition-colors"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>
                                <button
                                    className="flex-1 py-2.5 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-full font-medium transition-all shadow-lg shadow-[#FF6B9D]/25"
                                    onClick={toggleFilters}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 px-4 pt-20 pb-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-[#FF6B9D] animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Heart size={24} className="text-[#FF6B9D] fill-[#FF6B9D] animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-400">Finding your matches...</p>
                    </div>
                ) : (
                    <>
                        <div className="my-4 flex justify-between items-center">
                            <h2 className="text-base font-medium text-white">
                                {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                            </h2>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar size={12} className="mr-0.5" />
                                Most recent
                            </div>
                        </div>

                        {filteredMatches.length === 0 ? (
                            <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800 mt-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-[#FF6B9D]/10 rounded-full inline-flex">
                                        <Heart size={28} className="text-[#FF6B9D]" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
                                <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm px-4">
                                    {activeFilters > 0
                                        ? 'Try adjusting your filters to see more matches'
                                        : 'Keep swiping to find new matches'}
                                </p>
                                {activeFilters > 0 && (
                                    <button
                                        className="px-5 py-2.5 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white rounded-full transition-all shadow-lg shadow-[#FF6B9D]/25"
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
                                            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 flex flex-col"
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
                                                            className="absolute top-1/2 left-1 p-1 bg-black/30 hover:bg-black/40 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigatePhoto(match.id, 'prev');
                                                            }}
                                                        >
                                                            <ArrowLeft className="text-white w-4 h-4 drop-shadow-md" />
                                                        </button>
                                                        <button
                                                            className="absolute top-1/2 right-1 p-1 bg-black/30 hover:bg-black/40 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
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
                                                <div className="absolute top-2 right-2 bg-[#FF6B9D] text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                                    <Heart size={10} className="fill-white" /> {match.compatibilityScore}%
                                                </div>

                                                {/* Activity status */}
                                                <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm flex items-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></div>
                                                    {getTimeAgo(profile.lastActive)}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                <div className="mb-1">
                                                    <h3 className="text-base font-bold text-white truncate">{profile.name}, {profile.age}</h3>
                                                    <div className="flex items-center text-gray-400 text-xs">
                                                        <MapPin size={10} className="mr-0.5 flex-shrink-0" />
                                                        <span className="truncate">{profile.location}</span>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex justify-between mt-3 gap-2">
                                                    <button
                                                        className="flex-1 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                                                        onClick={() => navigate(`/match/${match.id}`)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    <button
                                                        className="flex-1 h-9 flex items-center justify-center rounded-full bg-[#FF6B9D] hover:bg-[#FF4D88] text-white transition-all shadow-sm shadow-[#FF6B9D]/25"
                                                        onClick={() => navigate(`/messages/${match.id}`)}
                                                    >
                                                        <MessageCircle size={18} />
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

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 pb-safe z-40">
                <div className="flex items-center justify-around py-3 px-4">
                    {/* Discover */}
                    <button
                        onClick={() => navigate('/for-you')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <Heart size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Discover</span>
                    </button>

                    {/* Matches */}
                    <button className="flex flex-col items-center gap-1 py-2 px-4">
                        <div className="text-[#FF6B9D]">
                            <Sparkles size={24} className="fill-[#FF6B9D]" />
                        </div>
                        <span className="text-xs text-[#FF6B9D] font-medium">Matches</span>
                    </button>

                    {/* Messages */}
                    <button
                        onClick={() => navigate('/messages')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <MessageCircle size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Messages</span>
                    </button>

                    {/* Referrals */}
                    <button
                        onClick={() => navigate('/referrals')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <User size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Referrals</span>
                    </button>
                </div>
            </div>

            <style>{`
                /* Custom range input styling */
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: #374151;
                    border-radius: 4px;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #FF6B9D;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #FF6B9D;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default Matches;
