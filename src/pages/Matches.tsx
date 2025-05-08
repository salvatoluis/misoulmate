import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MessageCircle, Filter, Search, User, MapPin, Coffee, Music, BookOpen, Camera, Film, ChevronDown, ChevronUp, Sliders, Check } from 'lucide-react';

const dummyMatches = [
    {
        id: 1,
        name: 'Emma',
        age: 28,
        location: 'San Francisco',
        distance: 3.2,
        matchPercentage: 96,
        bio: 'Coffee enthusiast, amateur photographer, and bookworm. Looking for someone to explore the city with!',
        photos: ['/images/profile-1.jpg', '/images/profile-1b.jpg', '/images/profile-1c.jpg'],
        interests: ['Photography', 'Reading', 'Coffee', 'Hiking'],
        lastActive: 'Just now',
        occupation: 'UX Designer',
    },
    {
        id: 2,
        name: 'Michael',
        age: 31,
        location: 'Berkeley',
        distance: 5.8,
        matchPercentage: 92,
        bio: 'Music lover, tech geek, and fitness enthusiast. Looking for someone with similar interests and a good sense of humor.',
        photos: ['/images/profile-2.jpg', '/images/profile-2b.jpg'],
        interests: ['Music', 'Technology', 'Fitness', 'Cooking'],
        lastActive: '5 minutes ago',
        occupation: 'Software Engineer',
    },
    {
        id: 3,
        name: 'Sophia',
        age: 26,
        location: 'Oakland',
        distance: 7.1,
        matchPercentage: 89,
        bio: 'Art lover, foodie, and travel enthusiast. Let\'s explore new restaurants and plan weekend getaways!',
        photos: ['/images/profile-3.jpg', '/images/profile-3b.jpg', '/images/profile-3c.jpg'],
        interests: ['Travel', 'Art', 'Food', 'Yoga'],
        lastActive: '1 hour ago',
        occupation: 'Marketing Manager',
    },
    {
        id: 4,
        name: 'James',
        age: 32,
        location: 'San Jose',
        distance: 12.4,
        matchPercentage: 87,
        bio: 'Movie buff, amateur chef, and dog lover. Looking for someone to share movie nights and cooking adventures.',
        photos: ['/images/profile-4.jpg', '/images/profile-4b.jpg'],
        interests: ['Movies', 'Cooking', 'Dogs', 'Tennis'],
        lastActive: '3 hours ago',
        occupation: 'Product Manager',
    },
    {
        id: 5,
        name: 'Olivia',
        age: 29,
        location: 'Palo Alto',
        distance: 15.7,
        matchPercentage: 85,
        bio: 'Book lover, pianist, and nature enthusiast. Looking for someone to share quiet evenings and weekend hikes.',
        photos: ['/images/profile-5.jpg', '/images/profile-5b.jpg'],
        interests: ['Reading', 'Music', 'Hiking', 'Yoga'],
        lastActive: 'Yesterday',
        occupation: 'Clinical Psychologist',
    },
    {
        id: 6,
        name: 'Daniel',
        age: 27,
        location: 'Mountain View',
        distance: 18.2,
        matchPercentage: 83,
        bio: 'Photographer, rock climber, and coffee addict. Looking for someone to join my adventures!',
        photos: ['/images/profile-6.jpg', '/images/profile-6b.jpg'],
        interests: ['Photography', 'Rock Climbing', 'Coffee', 'Travel'],
        lastActive: 'Yesterday',
        occupation: 'Photographer',
    },
];

// Interest icons mapping
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
    showFilters: boolean;
}

const Matches: React.FC = () => {
    const [matches, setMatches] = useState(dummyMatches);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        ageRange: [20, 40],
        distance: 30,
        interests: [],
        showFilters: false,
    });

    // Simulate loading state
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    // Handle card expansion
    const toggleCardExpansion = (id: number) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    // Handle photo navigation
    const navigatePhoto = (matchId: number, direction: 'next' | 'prev') => {
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        const currentIndex = selectedPhoto[matchId] || 0;
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % match.photos.length
            : (currentIndex - 1 + match.photos.length) % match.photos.length;

        setSelectedPhoto({
            ...selectedPhoto,
            [matchId]: newIndex
        });
    };

    // Like/Pass handlers
    const handleLike = (id: number) => {
        // In a real app, you'd call an API here
        // For now, we'll just remove the match from the list
        setMatches(matches.filter(match => match.id !== id));
    };

    const handlePass = (id: number) => {
        // Similar to like, just removing from the list
        setMatches(matches.filter(match => match.id !== id));
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setFilters({
            ...filters,
            showFilters: !filters.showFilters
        });
    };

    // Filter matches by interest
    const filterByInterest = (interest: string) => {
        const newInterests = filters.interests.includes(interest)
            ? filters.interests.filter(i => i !== interest)
            : [...filters.interests, interest];

        setFilters({
            ...filters,
            interests: newInterests
        });
    };

    // Get all unique interests
    const allInterests = Array.from(
        new Set(matches.flatMap(match => match.interests))
    );

    // Filter matches based on current filters
    const filteredMatches = matches.filter(match => {
        const ageMatch = match.age >= filters.ageRange[0] && match.age <= filters.ageRange[1];
        const distanceMatch = match.distance <= filters.distance;
        const interestMatch = filters.interests.length === 0 ||
            match.interests.some(interest => filters.interests.includes(interest));
        return ageMatch && distanceMatch && interestMatch;
    });

    // Page variants for smoother loading
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3, when: "beforeChildren" }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    // Card variants for staggered entry
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.25,
                delay: i * 0.05, // Reduced stagger delay for faster loading
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
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 shadow-sm border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] p-1.5 rounded-full mr-2">
                            <Heart size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-[#2B2B2A]">Your Matches</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`p-2 rounded-full ${filters.showFilters ? 'bg-[#FF6B81]/10 text-[#FF6B81]' : 'bg-gray-100 text-gray-600'}`}
                            onClick={toggleFilters}
                        >
                            <Filter size={20} />
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 text-gray-600">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters section */}
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
                                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
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
                                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
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
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                        />
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Interests:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allInterests.map(interest => (
                                                <button
                                                    key={interest}
                                                    className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-1.5 transition-colors ${filters.interests.includes(interest)
                                                            ? 'bg-[#FF6B81] text-white'
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
                {/* Loading state */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center pt-10">
                        <div className="relative w-16 h-16">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[#FF6B81] border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                <Heart size={20} className="text-[#FF6B81]" />
                            </motion.div>
                        </div>
                        <p className="mt-4 text-gray-500">Finding your matches...</p>
                    </div>
                ) : (
                    <>
                        {/* Match count */}
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-800">
                                {filteredMatches.length} potential {filteredMatches.length === 1 ? 'match' : 'matches'}
                            </h2>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Sliders size={14} />
                                Sort by: Match %
                            </div>
                        </div>

                        {/* Matches grid */}
                        {filteredMatches.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-gray-100 rounded-full inline-flex">
                                        <Heart size={32} className="text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No matches found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Try adjusting your filters or expanding your search criteria to find more matches.
                                </p>
                                <button
                                    className="mt-4 px-4 py-2 bg-[#FF6B81] text-white rounded-lg hover:bg-[#D86D72] transition-colors"
                                    onClick={() => setFilters({ ...filters, interests: [], ageRange: [20, 40], distance: 30 })}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMatches.map((match, index) => (
                                    <motion.div
                                        key={match.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                                        custom={index}
                                        variants={cardVariants}
                                        layout
                                    >
                                        {/* Profile photo */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={match.photos[selectedPhoto[match.id] || 0]}
                                                alt={match.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Photo navigation - only show if there are multiple photos */}
                                            {match.photos.length > 1 && (
                                                <>
                                                    <button
                                                        className="absolute top-1/2 left-2 p-1.5 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(match.id, 'prev');
                                                        }}
                                                    >
                                                        <ChevronUp className="transform -rotate-90 text-white w-5 h-5 drop-shadow-md" />
                                                    </button>
                                                    <button
                                                        className="absolute top-1/2 right-2 p-1.5 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transform -translate-y-1/2 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigatePhoto(match.id, 'next');
                                                        }}
                                                    >
                                                        <ChevronDown className="transform -rotate-90 text-white w-5 h-5 drop-shadow-md" />
                                                    </button>

                                                    {/* Photo indicators */}
                                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                                        {match.photos.map((_, photoIndex) => (
                                                            <div
                                                                key={photoIndex}
                                                                className={`h-1 rounded-full ${(selectedPhoto[match.id] || 0) === photoIndex
                                                                        ? 'w-5 bg-white'
                                                                        : 'w-1.5 bg-white/50'
                                                                    } transition-all`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {/* Match percentage badge */}
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-2.5 py-1 rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                                                <Heart size={12} className="fill-white" /> {match.matchPercentage}%
                                            </div>

                                            {/* Last active indicator */}
                                            <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                {match.lastActive}
                                            </div>
                                        </div>

                                        {/* Profile info */}
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">{match.name}, {match.age}</h3>
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <MapPin size={14} className="mr-1" />
                                                        {match.location} • {match.distance} miles away
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Occupation */}
                                            <div className="text-gray-700 text-sm mb-3">
                                                {match.occupation}
                                            </div>

                                            {/* Interests */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {match.interests.slice(0, 4).map(interest => (
                                                    <span
                                                        key={interest}
                                                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                    >
                                                        {interestIcons[interest]}
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Bio - truncated unless expanded */}
                                            <div className="text-gray-600 text-sm">
                                                {expandedCard === match.id ? (
                                                    match.bio
                                                ) : (
                                                    <>
                                                        {match.bio.length > 100 ? `${match.bio.slice(0, 100)}...` : match.bio}
                                                        {match.bio.length > 100 && (
                                                            <button
                                                                className="text-[#FF6B81] font-medium ml-1 focus:outline-none"
                                                                onClick={() => toggleCardExpansion(match.id)}
                                                            >
                                                                more
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                                                <button
                                                    className="w-16 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    onClick={() => handlePass(match.id)}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>

                                                <button
                                                    className="flex-grow mx-2 h-12 flex items-center justify-center rounded-xl bg-[#FF6B81]/10 hover:bg-[#FF6B81]/20 text-[#FF6B81] transition-colors"
                                                    onClick={() => { }}
                                                >
                                                    <MessageCircle className="w-5 h-5 mr-2" />
                                                    Message
                                                </button>

                                                <button
                                                    className="w-16 h-12 flex items-center justify-center rounded-xl bg-[#FF6B81] hover:bg-[#D86D72] text-white transition-colors"
                                                    onClick={() => handleLike(match.id)}
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

export default Matches;