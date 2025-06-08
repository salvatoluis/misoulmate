import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Filter, Search, User, MapPin, Coffee, Music, BookOpen, Camera, Film, ChevronDown, ChevronUp, Sliders, Check } from 'lucide-react';
import { recommendationService } from '@/services';

const interestIcons: Record<string, React.ReactNode> = {
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

interface FilterState {
    ageRange: [number, number];
    distance: number;
    interests: string[];
    lookingFor: string;
    showFilters: boolean;
}

interface Recommendation {
    id: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    distance: number;
    compatibilityScore: number;
    bio: string;
    photos: string[];
    interests: string[];
    lastActive: string;
    occupation: string;
    hasLikedYou: boolean;
}

const ForYou: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        ageRange: [20, 40],
        distance: 30,
        interests: [],
        lookingFor: '',
        showFilters: false,
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
                console.log(response);
                setRecommendations(response.recommendations);
                setCurrentIndex(0);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [filters.ageRange, filters.distance, filters.lookingFor]);

    const toggleCardExpansion = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

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

    const handleSuperLike = async (id: string) => {
        try {
            await recommendationService.createInteraction(id, 'superlike');
            removeRecommendation(id);
        } catch (error) {
            console.error(`Error super-liking profile ${id}:`, error);
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
        if (currentIndex >= recommendations.length - 1) {
            setCurrentIndex(Math.max(0, recommendations.length - 2));
        }
    };

    const toggleFilters = () => {
        setFilters({
            ...filters,
            showFilters: !filters.showFilters
        });
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
            setCurrentIndex(0);
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

    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3, when: "beforeChildren" }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.25,
                delay: i * 0.05,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }),
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-16"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
        >
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 shadow-sm border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-green-700 p-1.5 rounded-full mr-2">
                            <Heart size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-[#2B2B2A]">Discover</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`p-2 rounded-full ${filters.showFilters ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 text-gray-600'}`}
                            onClick={toggleFilters}
                        >
                            <Filter size={20} />
                        </button>
                        <button
                            className="p-2 rounded-full bg-gray-100 text-gray-600"
                            onClick={refreshRecommendations}
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {filters.showFilters && (
                        <motion.div
                            className="bg-white border-t border-gray-100 py-4 shadow-sm"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="space-y-4">
                                    {/* Age Range */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-medium text-gray-700">Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</label>
                                        </div>
                                        <div className="flex gap-4">
                                            <input
                                                type="range"
                                                min="18"
                                                max="60"
                                                value={filters.ageRange[0]}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
                                            />
                                            <input
                                                type="range"
                                                min="18"
                                                max="60"
                                                value={filters.ageRange[1]}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    ageRange: [filters.ageRange[0], parseInt(e.target.value)]
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Distance */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-sm font-medium text-gray-700">Distance: Up to {filters.distance} miles</label>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={filters.distance}
                                            onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500"
                                        />
                                    </div>

                                    {/* Looking For */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Looking For:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {relationshipTypes.map(type => (
                                                <button
                                                    key={type}
                                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filters.lookingFor === type
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => setFilters({
                                                        ...filters,
                                                        lookingFor: filters.lookingFor === type ? '' : type
                                                    })}
                                                >
                                                    {type}
                                                    {filters.lookingFor === type && <Check size={14} className="ml-1" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Interests:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allInterests.map(interest => (
                                                <button
                                                    key={interest}
                                                    className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1.5 transition-colors ${filters.interests.includes(interest)
                                                        ? 'bg-green-500 text-white'
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
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center pt-10">
                        <div className="relative w-16 h-16">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                <Heart size={20} className="text-green-500" />
                            </motion.div>
                        </div>
                        <p className="mt-4 text-gray-500">Finding people for you...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-800">
                                {recommendations.length} recommendations
                            </h2>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Sliders size={14} />
                                Sort by: Compatibility
                            </div>
                        </div>

                        {recommendations.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-gray-100 rounded-full inline-flex">
                                        <Heart size={32} className="text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No recommendations found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Try adjusting your filters or check back later for new recommendations.
                                </p>
                                <button
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    onClick={() => setFilters({ ...filters, interests: [], ageRange: [20, 40], distance: 30, lookingFor: '' })}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                                {recommendations.map((recommendation, index) => (
                                    <motion.div
                                        key={recommendation.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                                        custom={index}
                                        variants={cardVariants}
                                        layout
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={recommendation.photos[selectedPhoto[recommendation.id] || 0]}
                                                alt={recommendation.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {recommendation.photos.length > 1 && (
                                                <>
                                                    <button
                                                        className="absolute top-1/2 left-2 p-1.5 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(recommendation.id, 'prev');
                                                        }}
                                                    >
                                                        <ChevronUp className="transform -rotate-90 text-white w-5 h-5 drop-shadow-md" />
                                                    </button>
                                                    <button
                                                        className="absolute top-1/2 right-2 p-1.5 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(recommendation.id, 'next');
                                                        }}
                                                    >
                                                        <ChevronDown className="transform -rotate-90 text-white w-5 h-5 drop-shadow-md" />
                                                    </button>

                                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                                        {recommendation.photos.map((_, photoIndex) => (
                                                            <div
                                                                key={photoIndex}
                                                                className={`h-1 rounded-full ${(selectedPhoto[recommendation.id] || 0) === photoIndex
                                                                    ? 'w-5 bg-white'
                                                                    : 'w-1.5 bg-white/50'
                                                                    } transition-all`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-700 text-white px-2.5 py-1 rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                                                <Heart size={12} className="fill-white" /> {recommendation.compatibilityScore}%
                                            </div>

                                            {recommendation.hasLikedYou && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1">
                                                    <Heart size={12} className="fill-white" /> Likes you
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                {recommendation.lastActive}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">{recommendation.name}, {recommendation.age}</h3>
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <MapPin size={14} className="mr-1" />
                                                        {recommendation.location} • {recommendation.distance} miles away
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-gray-700 text-sm mb-3">
                                                {recommendation.occupation || 'Occupation not specified'}
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {recommendation.interests.slice(0, 4).map(interest => (
                                                    <span
                                                        key={interest}
                                                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                    >
                                                        {interestIcons[interest]}
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="text-gray-600 text-sm">
                                                {expandedCard === recommendation.id ? (
                                                    recommendation.bio
                                                ) : (
                                                    <>
                                                        {recommendation.bio && recommendation.bio.length > 100
                                                            ? `${recommendation.bio.slice(0, 100)}...`
                                                            : (recommendation.bio || 'No bio available')}
                                                        {recommendation.bio && recommendation.bio.length > 100 && (
                                                            <button
                                                                className="text-green-500 font-medium ml-1 focus:outline-none"
                                                                onClick={() => toggleCardExpansion(recommendation.id)}
                                                            >
                                                                more
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                                                <button
                                                    className="w-16 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    onClick={() => handlePass(recommendation.id)}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>

                                                <button
                                                    className="w-16 h-12 flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                                                    onClick={() => handleSuperLike(recommendation.id)}
                                                >
                                                    <Star className="w-5 h-5" />
                                                </button>

                                                <button
                                                    className="w-16 h-12 flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-700 text-white transition-colors"
                                                    onClick={() => handleLike(recommendation.id)}
                                                >
                                                    <Heart className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default ForYou;