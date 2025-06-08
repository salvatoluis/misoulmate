import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MessageCircle, Filter, Search, User, MapPin, Coffee, Music, BookOpen, Camera, Film, ChevronDown, ChevronUp, Sliders, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { conversationService, matchService } from '@/services';

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

interface Match {
    id: number;
    name: string;
    age: number;
    location: string;
    distance: number;
    matchPercentage: number;
    bio: string;
    photos: string[];
    interests: string[];
    lastActive: string;
    occupation: string;
}

const Matches: React.FC = () => {
    const [matches, setMatches] = useState<any>([]);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        ageRange: [20, 40],
        distance: 30,
        interests: [],
        showFilters: false,
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

    const toggleCardExpansion = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const navigatePhoto = (matchId: string, direction: 'next' | 'prev') => {
        const match: any = matches?.find((m: any) => m.id === matchId);
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

    const handleUnmatch = async (id: string) => {
        try {
            await matchService.unmatchUser(id);
            setMatches(matches.filter((match: any) => match.id !== id));
        } catch (error) {
            console.error(`Error unmatching ${id}:`, error);
        }
    };

    const handleMessage = async (matchId: string) => {
        try {
            const response = await conversationService.startConversation(Number(matchId));
            navigate(`/conversation/${response.conversationId}`, {
                state: { matchId }
            });
        } catch (error) {
            console.error(`Error starting conversation with match ${matchId}:`, error);
        }
    };

    interface OtherUserProfile {
        age: number;
        maxDistance: number;
        interests: string[];
        [key: string]: any;
    }

    interface OtherUser {
        profile: OtherUserProfile;
        id: string;
        [key: string]: any;
    }

    interface MatchWithOtherUser {
        id: string;
        otherUser: OtherUser;
        compatibilityScore: number;
        [key: string]: any;
    }

    const filteredMatches: MatchWithOtherUser[] = (matches as MatchWithOtherUser[]).filter((match: MatchWithOtherUser) => {
        const otherUserProfile: OtherUserProfile = match.otherUser.profile;
        const ageMatch: boolean = otherUserProfile.age >= filters.ageRange[0] && otherUserProfile.age <= filters.ageRange[1];

        const distanceMatch: boolean = otherUserProfile.maxDistance <= filters.distance;

        const interestMatch: boolean = filters.interests.length === 0 ||
            otherUserProfile.interests.some((interest: string) => filters.interests.includes(interest));

        return ageMatch && distanceMatch && interestMatch;
    });

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-16"
        >
            {/* Header remains unchanged */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    // Loading UI remains unchanged
                    <div className="flex flex-col items-center justify-center pt-10">
                        {/* Loading animation */}
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-800">
                                {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                            </h2>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Sliders size={14} />
                                Sort by: Recent
                            </div>
                        </div>

                        {filteredMatches.length === 0 ? (
                            // Empty state UI remains unchanged
                            <div className="text-center py-10">
                                {/* Empty state */}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMatches.map((match, index) => {
                                    const otherUser = match.otherUser;
                                    const profile = otherUser.profile;

                                    return (
                                        <div
                                            key={match.id}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden">
                                                <img
                                                    src={profile.photos[selectedPhoto[match.id] || 0]}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover"
                                                />

                                                {profile.photos.length > 1 && (
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

                                                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                                            {profile.photos.map((_: string, photoIndex: number) => (
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

                                                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-2.5 py-1 rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                                                    <Heart size={12} className="fill-white" /> {match.compatibilityScore}%
                                                </div>

                                                <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                    {new Date(profile.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800 cursor-pointer" onClick={() => navigate(`/profile/${otherUser.id}`)}>
                                                            {profile.name}, {profile.age}
                                                        </h3>
                                                        <div className="flex items-center text-gray-500 text-sm">
                                                            <MapPin size={14} className="mr-1" />
                                                            {profile.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-gray-700 text-sm mb-3">
                                                    {profile.occupation || 'No occupation listed'}
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {profile.interests.slice(0, 4).map(interest => (
                                                        <span
                                                            key={interest}
                                                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                        >
                                                            {interestIcons[interest] || <Heart size={16} />}
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="text-gray-600 text-sm">
                                                    {expandedCard === match.id ? (
                                                        profile.bio
                                                    ) : (
                                                        <>
                                                            {profile.bio && profile.bio.length > 100
                                                                ? `${profile.bio.slice(0, 100)}...`
                                                                : (profile.bio || 'No bio available')}
                                                            {profile.bio && profile.bio.length > 100 && (
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

                                                <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                                                    <button
                                                        className="w-16 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                        onClick={() => handleUnmatch(match.id)}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>

                                                    <button
                                                        className="flex-grow mx-2 h-12 flex items-center justify-center rounded-xl bg-[#FF6B81]/10 hover:bg-[#FF6B81]/20 text-[#FF6B81] transition-colors"
                                                        onClick={() => handleMessage(match.id)}
                                                    >
                                                        <MessageCircle className="w-5 h-5 mr-2" />
                                                        Message
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Matches;