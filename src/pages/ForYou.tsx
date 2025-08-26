import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, X, Filter, Search, User, MapPin, Coffee, 
    Music, BookOpen, Camera, Film, 
    Sliders, Check, ArrowLeft, ArrowRight
} from 'lucide-react';
import { recommendationService } from '@/services';
import { useNavigate } from 'react-router-dom';

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

type Recommendation = {
    id: string;
    name: string;
    age: number;
    distance: number;
    interests: string[];
    photos: string[];
    compatibilityScore: number;
    hasLikedYou?: boolean;
    lastActive: string;
};

const ForYou: React.FC = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<{ [key: string]: number }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        ageRange: [20, 40],
        distance: 30,
        interests: [] as string[],
        lookingFor: '',
    });

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);

                const params = {
                    minAge: filters.ageRange[0],
                    maxAge: filters.ageRange[1],
                    maxDistance: filters.distance,
                    interests: filters.interests.length > 0 ? filters.interests : undefined,
                    lookingFor: filters.lookingFor || undefined
                };

                const response = await recommendationService.getRecommendations(params);
                setRecommendations(response.recommendations);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [filters.ageRange, filters.distance, filters.lookingFor]);

    const navigatePhoto = (recommendationId: string, direction: 'next' | 'prev') => {
        const recommendation = recommendations?.find(r => r.id === recommendationId);
        if (!recommendation) return;

        const currentIndex = selectedPhoto[recommendationId] || 0;
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % recommendation.photos.length
            : (currentIndex - 1 + recommendation.photos.length) % recommendation.photos.length;

        setSelectedPhoto({
            ...selectedPhoto,
            [recommendationId]: newIndex
        });
    };

    const handleLike = async (id: string) => {
        try {
            await recommendationService.createInteraction(id, 'like');
            removeRecommendation(id);
        } catch (error) {
            console.error(`Error liking profile ${id}:`, error);
        }
    };

    const handlePass = async (id: string) => {
        try {
            await recommendationService.createInteraction(id, 'dislike');
            removeRecommendation(id);
        } catch (error) {
            console.error(`Error passing on profile ${id}:`, error);
        }
    };

    const removeRecommendation = (id: string) => {
        setRecommendations(recommendations.filter(rec => rec.id !== id));
    };

    const toggleFilters = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const filterByInterest = (interest: string) => {
        const newInterests = filters.interests.includes(interest)
            ? filters.interests.filter(i => i !== interest)
            : [...filters.interests, interest];

        setFilters({
            ...filters,
            interests: newInterests
        });
    };

    const refreshRecommendations = async () => {
        try {
            setIsLoading(true);
            const response = await recommendationService.refreshRecommendations();
            setRecommendations(response.recommendations);
            setIsLoading(false);
        } catch (error) {
            console.error('Error refreshing recommendations:', error);
            setIsLoading(false);
        }
    };

    const allInterests = Array.from(
        new Set(recommendations.flatMap(rec => rec.interests))
    );

    const relationshipTypes = ['Relationship', 'Casual', 'Friendship', 'Not sure yet'];

    const viewProfile = (id: string) => {
        navigate(`/matches/${id}`);
    };

    return (
        <div className="min-h-screen bg-white pt-safe pb-safe">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm border-b border-gray-100 pt-safe">
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] p-1.5 rounded-full mr-2">
                            <Heart size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Discover</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isFilterOpen 
                                ? 'bg-gradient-to-r from-[#FF6B81]/10 to-[#B75BFF]/10 text-[#FF6B81]' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={toggleFilters}
                        >
                            <Filter size={20} />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                            onClick={refreshRecommendations}
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters Panel */}
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

                            {/* Distance */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Distance</label>
                                    <span className="text-sm text-[#FF6B81] font-medium">Up to {filters.distance} miles</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={filters.distance}
                                    onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                />
                            </div>

                            {/* Looking For */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Looking For</label>
                                <div className="flex flex-wrap gap-2">
                                    {relationshipTypes.map(type => (
                                        <button
                                            key={type}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                                filters.lookingFor === type
                                                    ? 'bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                            onClick={() => setFilters({
                                                ...filters,
                                                lookingFor: filters.lookingFor === type ? '' : type
                                            })}
                                        >
                                            {type}
                                            {filters.lookingFor === type && <Check size={14} className="ml-1 inline" />}
                                        </button>
                                    ))}
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
                                                {interestIcons[interest]}
                                                {interest}
                                                {filters.interests.includes(interest) && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Apply/Reset buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setFilters({
                                            ageRange: [20, 40],
                                            distance: 30,
                                            interests: [],
                                            lookingFor: ''
                                        });
                                    }}
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

            {/* Main Content */}
            <main className={`px-4 pt-[calc(env(safe-area-inset-top)+56px+${isFilterOpen ? '0px' : '0px'})] pb-4`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-[#FF6B81] border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Heart size={20} className="text-[#FF6B81]" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500">Finding people for you...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-base font-medium text-gray-800">
                                {recommendations.length} recommendations
                            </h2>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Sliders size={12} />
                                Sort by: Compatibility
                            </div>
                        </div>

                        {recommendations.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-gray-100 rounded-full inline-flex">
                                        <Heart size={28} className="text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No recommendations found</h3>
                                <p className="text-gray-500 max-w-md mx-auto text-sm">
                                    Try adjusting your filters or check back later for new recommendations.
                                </p>
                                <button
                                    className="mt-4 px-5 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white rounded-full hover:shadow-md transition-all"
                                    onClick={() => setFilters({ 
                                        ageRange: [20, 40], 
                                        distance: 30, 
                                        interests: [], 
                                        lookingFor: '' 
                                    })}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                {recommendations.map((recommendation) => (
                                    <motion.div
                                        key={recommendation.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                    >
                                        {/* Photo */}
                                        <div 
                                            className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                                            onClick={() => viewProfile(recommendation.id)}
                                        >
                                            <img
                                                src={recommendation.photos[selectedPhoto[recommendation.id] || 0]}
                                                alt={recommendation.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />

                                            {recommendation.photos.length > 1 && (
                                                <>
                                                    <button
                                                        className="absolute top-1/2 left-1 p-1 bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(recommendation.id, 'prev');
                                                        }}
                                                    >
                                                        <ArrowLeft className="text-white w-4 h-4 drop-shadow-md" />
                                                    </button>
                                                    <button
                                                        className="absolute top-1/2 right-1 p-1 bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(recommendation.id, 'next');
                                                        }}
                                                    >
                                                        <ArrowRight className="text-white w-4 h-4 drop-shadow-md" />
                                                    </button>

                                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                                        {recommendation.photos.map((_, photoIndex) => (
                                                            <div
                                                                key={photoIndex}
                                                                className={`h-1 rounded-full ${(selectedPhoto[recommendation.id] || 0) === photoIndex
                                                                    ? 'w-4 bg-white'
                                                                    : 'w-1 bg-white/50'
                                                                    } transition-all`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {/* Match percentage */}
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                                <Heart size={10} className="fill-white" /> {recommendation.compatibilityScore}%
                                            </div>

                                            {/* Likes you badge */}
                                            {recommendation.hasLikedYou && (
                                                <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-[#FF6B81] text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                                    <Heart size={10} className="fill-white" /> Likes you
                                                </div>
                                            )}

                                            {/* Last active */}
                                            <div className="absolute bottom-2 left-2 bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                {recommendation.lastActive}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3">
                                            <div className="mb-1">
                                                <h3 className="text-base font-bold text-gray-800 truncate">{recommendation.name}, {recommendation.age}</h3>
                                                <div className="flex items-center text-gray-500 text-xs">
                                                    <MapPin size={10} className="mr-0.5 flex-shrink-0" />
                                                    <span className="truncate">{recommendation.distance} miles away</span>
                                                </div>
                                            </div>

                                            {/* Interests */}
                                            {recommendation.interests && recommendation.interests.length > 0 && (
                                                <div className="flex flex-wrap gap-1 my-2">
                                                    {recommendation.interests.slice(0, 2).map(interest => (
                                                        <span
                                                            key={interest}
                                                            className="bg-gradient-to-r from-[#FF6B81]/5 to-[#B75BFF]/5 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-[#FF6B81]/10"
                                                        >
                                                            {interestIcons[interest]}
                                                            <span className="truncate max-w-[60px]">{interest}</span>
                                                        </span>
                                                    ))}
                                                    {recommendation.interests.length > 2 && (
                                                        <span className="text-[10px] text-gray-500">+{recommendation.interests.length - 2} more</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="flex justify-between mt-2">
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                                    onClick={() => handlePass(recommendation.id)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>

                                                <button
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white hover:shadow-md transition-all"
                                                    onClick={() => handleLike(recommendation.id)}
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ForYou;