import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, X, Filter, Menu, User, MapPin, Sparkles, Info, Users, MessageSquare
} from 'lucide-react';
import { recommendationService } from '@/services';
import { useNavigate } from 'react-router-dom';

type Recommendation = {
    id: string;
    name: string;
    age: number;
    distance: number;
    location?: string;
    interests: string[];
    photos: string[];
    compatibilityScore: number;
    hasLikedYou?: boolean;
    lastActive: string;
};

const ForYou: React.FC = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [showCompatibility, setShowCompatibility] = useState(false);
    const [userInterests, setUserInterests] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        ageRange: [18, 50] as [number, number],
        distance: 50,
    });

    // Calculate compatibility score based on shared interests
    const calculateCompatibility = (theirInterests: string[], myInterests: string[]): number => {
        if (!myInterests.length || !theirInterests.length) {
            return 50; // Default score if no interests available
        }

        // Count shared interests
        const sharedInterests = myInterests.filter(interest =>
            theirInterests.some(theirInterest =>
                theirInterest.toLowerCase() === interest.toLowerCase()
            )
        );

        const sharedCount = sharedInterests.length;

        // Base score from shared interests (0-70%)
        const interestScore = Math.min(70, (sharedCount / Math.max(myInterests.length, theirInterests.length)) * 100);

        // Add bonus points for multiple shared interests (up to 30%)
        const bonusScore = Math.min(30, sharedCount * 5);

        // Final score capped at 95% (we keep some mystery!)
        return Math.min(95, Math.round(interestScore + bonusScore));
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);

                // Get user's interests from localStorage
                const authData = localStorage.getItem('auth');
                let currentUserInterests: string[] = [];

                if (authData) {
                    const { profile } = JSON.parse(authData);
                    if (profile?.interests) {
                        currentUserInterests = profile.interests;
                        setUserInterests(profile.interests);
                    }
                }

                const response = await recommendationService.getRecommendations({});

                // Calculate compatibility for each recommendation
                const recommendationsWithScore = response.recommendations.map(rec => ({
                    ...rec,
                    compatibilityScore: calculateCompatibility(rec.interests || [], currentUserInterests)
                }));

                setRecommendations(recommendationsWithScore);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const currentRecommendation = recommendations[currentIndex];

    const handleLike = async () => {
        if (!currentRecommendation) return;

        try {
            setSwipeDirection('right');
            await recommendationService.createInteraction(currentRecommendation.id, 'like');
            setTimeout(() => {
                moveToNext();
                setSwipeDirection(null);
            }, 300);
        } catch (error) {
            console.error('Error liking profile:', error);
            setSwipeDirection(null);
        }
    };

    const handlePass = async () => {
        if (!currentRecommendation) return;

        try {
            setSwipeDirection('left');
            await recommendationService.createInteraction(currentRecommendation.id, 'dislike');
            setTimeout(() => {
                moveToNext();
                setSwipeDirection(null);
            }, 300);
        } catch (error) {
            console.error('Error passing profile:', error);
            setSwipeDirection(null);
        }
    };

    const moveToNext = () => {
        if (currentIndex < recommendations.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedPhotoIndex(0);
            setShowCompatibility(false);
        } else {
            // Reload recommendations when we reach the end
            setCurrentIndex(0);
            setSelectedPhotoIndex(0);
            setShowCompatibility(false);
        }
    };

    const handleCompatibilityCheck = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowCompatibility(!showCompatibility);
    };

    const handleCardClick = () => {
        if (!currentRecommendation) return;

        // Cycle through photos on tap
        if (selectedPhotoIndex < currentRecommendation.photos.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1);
        } else {
            setSelectedPhotoIndex(0);
        }
    };

    const viewProfile = () => {
        if (currentRecommendation) {
            navigate(`/matches/${currentRecommendation.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-[#FF6B9D] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Heart size={24} className="text-[#FF6B9D] fill-[#FF6B9D] animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentRecommendation || recommendations.length === 0) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="p-6 bg-gray-800 rounded-full inline-flex">
                            <Heart size={40} className="text-[#FF6B9D]" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No more profiles</h3>
                    <p className="text-gray-400 max-w-md mx-auto text-base mb-6">
                        Check back later for new recommendations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-40 border-b border-gray-800">
                <div className="px-4 py-4 flex justify-between items-center">
                    {/* Left side - Menu & Filter */}
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition-all">
                            <Menu size={20} className="text-gray-300" />
                        </button>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition-all"
                        >
                            <Filter size={20} className="text-gray-300" />
                        </button>
                    </div>

                    {/* Center - Title */}
                    <div className="flex items-center gap-2">
                        <div className="bg-[#FF6B9D] p-1.5 rounded-full">
                            <Heart size={16} className="text-white fill-white" />
                        </div>
                        <h1 className="text-lg font-bold text-white">for you</h1>
                    </div>

                    {/* Right side - Profile */}
                    <button
                        className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition-all"
                        onClick={() => navigate('/profile')}
                    >
                        <User size={20} className="text-gray-300" />
                    </button>
                </div>
            </header>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50"
                            onClick={() => setShowFilters(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-50 p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-all"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>

                            {/* Age Range */}
                            <div className="mb-6">
                                <label className="block text-white font-medium mb-3">
                                    Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                                </label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-400 text-sm mb-2">Min Age</label>
                                        <input
                                            type="range"
                                            min="18"
                                            max="80"
                                            value={filters.ageRange[0]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                                            })}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B9D]"
                                        />
                                        <div className="text-center text-gray-400 text-sm mt-1">{filters.ageRange[0]}</div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-gray-400 text-sm mb-2">Max Age</label>
                                        <input
                                            type="range"
                                            min="18"
                                            max="80"
                                            value={filters.ageRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                ageRange: [filters.ageRange[0], parseInt(e.target.value)]
                                            })}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B9D]"
                                        />
                                        <div className="text-center text-gray-400 text-sm mt-1">{filters.ageRange[1]}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Distance */}
                            <div className="mb-6">
                                <label className="block text-white font-medium mb-3">
                                    Maximum Distance: {filters.distance} miles
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={filters.distance}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        distance: parseInt(e.target.value)
                                    })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B9D]"
                                />
                                <div className="flex justify-between text-gray-400 text-sm mt-2">
                                    <span>1 mi</span>
                                    <span>100 mi</span>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-4 bg-[#FF6B9D] hover:bg-[#FF4D88] text-white font-semibold rounded-xl transition-all shadow-lg"
                            >
                                Apply Filters
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setFilters({
                                        ageRange: [18, 50],
                                        distance: 50,
                                    });
                                }}
                                className="w-full py-3 mt-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all"
                            >
                                Reset to Default
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Card */}
            <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                            rotate: swipeDirection === 'right' ? 20 : swipeDirection === 'left' ? -20 : 0
                        }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-sm"
                    >
                        {/* Card */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            {/* Photo */}
                            <div
                                className="relative aspect-[3/4] cursor-pointer"
                                onClick={handleCardClick}
                            >
                                <img
                                    src={currentRecommendation.photos[selectedPhotoIndex]}
                                    alt={currentRecommendation.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Photo indicators */}
                                {currentRecommendation.photos.length > 1 && (
                                    <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4">
                                        {currentRecommendation.photos.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    index === selectedPhotoIndex
                                                        ? 'bg-white'
                                                        : 'bg-white/40'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Compatibility badge - Always visible */}
                                <button
                                    onClick={handleCompatibilityCheck}
                                    className={`absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-transform shadow-lg ${
                                        currentRecommendation.compatibilityScore >= 80
                                            ? 'bg-[#FF6B9D]'
                                            : 'bg-gray-700/80'
                                    }`}
                                >
                                    <Sparkles size={16} className="text-white fill-white" />
                                </button>

                                {/* Compatibility Score Popup */}
                                <AnimatePresence>
                                    {showCompatibility && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute top-20 right-4 bg-white rounded-2xl shadow-2xl p-6 z-10"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="text-center">
                                                <div className="mb-3">
                                                    <Sparkles size={32} className={`mx-auto fill-current ${
                                                        currentRecommendation.compatibilityScore >= 80 ? 'text-[#FF6B9D]' :
                                                        currentRecommendation.compatibilityScore >= 60 ? 'text-amber-500' :
                                                        'text-gray-400'
                                                    }`} />
                                                </div>
                                                <h3 className="text-sm font-medium text-gray-600 mb-1">Compatibility Match</h3>
                                                <p className={`text-xs font-medium mb-3 ${
                                                    currentRecommendation.compatibilityScore >= 80 ? 'text-[#FF6B9D]' :
                                                    currentRecommendation.compatibilityScore >= 60 ? 'text-amber-600' :
                                                    'text-gray-500'
                                                }`}>
                                                    {currentRecommendation.compatibilityScore >= 80 ? 'Excellent Match!' :
                                                     currentRecommendation.compatibilityScore >= 60 ? 'Good Match' :
                                                     'Moderate Match'}
                                                </p>
                                                <div className="relative w-24 h-24 mx-auto mb-3">
                                                    <svg className="w-24 h-24 transform -rotate-90">
                                                        <circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke="#f0f0f0"
                                                            strokeWidth="8"
                                                            fill="none"
                                                        />
                                                        <motion.circle
                                                            cx="48"
                                                            cy="48"
                                                            r="40"
                                                            stroke={
                                                                currentRecommendation.compatibilityScore >= 80 ? '#FF6B9D' :
                                                                currentRecommendation.compatibilityScore >= 60 ? '#f59e0b' :
                                                                '#9ca3af'
                                                            }
                                                            strokeWidth="8"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                                                            animate={{
                                                                strokeDashoffset: 251.2 - (251.2 * (currentRecommendation.compatibilityScore / 100))
                                                            }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <motion.span
                                                            className="text-2xl font-bold text-gray-800"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.5 }}
                                                        >
                                                            {currentRecommendation.compatibilityScore}%
                                                        </motion.span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 max-w-[200px]">
                                                    Based on shared interests, values, and preferences
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Info Section - Overlaid on bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    {/* Name and age */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-3xl font-bold">{currentRecommendation.name}, {currentRecommendation.age}</h2>
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1 mb-4">
                                        <MapPin size={16} className="text-gray-300" />
                                        <span className="text-gray-300 text-sm">
                                            {currentRecommendation.location || `${currentRecommendation.distance} miles away`}
                                        </span>
                                    </div>

                                    {/* Interests */}
                                    {currentRecommendation.interests && currentRecommendation.interests.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {currentRecommendation.interests.slice(0, 3).map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/30"
                                                >
                                                    #{interest.toLowerCase()}
                                                </span>
                                            ))}
                                            {currentRecommendation.interests.length > 3 && (
                                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/30">
                                                    +{currentRecommendation.interests.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Info button */}
                                    <button
                                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewProfile();
                                        }}
                                    >
                                        <Info size={18} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Action Buttons */}
            <div className="fixed bottom-24 left-0 right-0 z-30">
                <div className="flex items-center justify-center gap-6">
                    {/* Pass Button */}
                    <button
                        onClick={handlePass}
                        disabled={swipeDirection !== null}
                        className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
                    >
                        <X size={28} className="text-white" />
                    </button>

                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        disabled={swipeDirection !== null}
                        className="w-20 h-20 rounded-full bg-[#FF6B9D] hover:bg-[#FF4D88] flex items-center justify-center transition-all shadow-lg shadow-[#FF6B9D]/25 disabled:opacity-50"
                    >
                        <Heart size={32} className="text-white fill-white" />
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 pb-safe z-40">
                <div className="flex items-center justify-around py-3 px-4">
                    {/* Discover */}
                    <button className="flex flex-col items-center gap-1 py-2 px-4">
                        <div className="text-[#FF6B9D]">
                            <Heart size={24} className="fill-[#FF6B9D]" />
                        </div>
                        <span className="text-xs text-[#FF6B9D] font-medium">Discover</span>
                    </button>

                    {/* Matches */}
                    <button
                        onClick={() => navigate('/matches')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Matches</span>
                    </button>

                    {/* Messages */}
                    <button
                        onClick={() => navigate('/messages')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <MessageSquare size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Messages</span>
                    </button>

                    {/* Referrals (You) */}
                    <button
                        onClick={() => navigate('/referrals')}
                        className="flex flex-col items-center gap-1 py-2 px-4"
                    >
                        <div className="text-gray-400">
                            <Users size={24} />
                        </div>
                        <span className="text-xs text-gray-400">Referrals</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForYou;
