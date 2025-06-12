import React, { useState, useEffect } from 'react';
import {
    Heart, X, MessageCircle, Search, User, MapPin, Coffee,
    Music, BookOpen, Camera, Film, ChevronDown, ChevronUp,
    Sliders, Check, Eye, Calendar, FilterX
} from 'lucide-react';
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

const Matches: React.FC = () => {
    const [matches, setMatches] = useState<any>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState(0);
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

    useEffect(() => {
        let count = 0;
        if (filters.ageRange[0] > 20 || filters.ageRange[1] < 40) count++;
        if (filters.distance < 30) count++;
        if (filters.interests.length > 0) count += 1;
        setActiveFilters(count);
    }, [filters]);


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
            const response = await conversationService.startConversation(matchId);
            navigate(`/conversation/${response.conversationId}`, {
                state: { matchId }
            });
        } catch (error) {
            console.error(`Error starting conversation with match ${matchId}:`, error);
        }
    };

    const toggleFilters = () => {
        setFilters({
            ...filters,
            showFilters: !filters.showFilters
        });
    };

    const resetFilters = () => {
        setFilters({
            ageRange: [20, 40],
            distance: 30,
            interests: [],
            showFilters: filters.showFilters
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

    const allInterests = Array.from(
        new Set(matches.flatMap((match: any) => match.otherUser?.profile?.interests || []))
    );

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

    const filteredMatches = (matches as MatchWithOtherUser[]).filter((match: MatchWithOtherUser) => {
        const otherUserProfile: OtherUserProfile = match.otherUser.profile;
        const ageMatch: boolean = otherUserProfile.age >= filters.ageRange[0] && otherUserProfile.age <= filters.ageRange[1];

        const distanceMatch: boolean = true;

        const interestMatch: boolean = filters.interests.length === 0 ||
            otherUserProfile.interests.some((interest: string) => filters.interests.includes(interest));

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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
            <header className="sticky top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-primary to-primary p-1.5 rounded-full mr-2">
                            <Heart size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-[#2B2B2A]">Your Matches</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`relative p-2 rounded-full ${filters.showFilters
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-600'}`}
                            onClick={toggleFilters}
                        >
                            <Sliders size={20} />
                            {activeFilters > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {activeFilters}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {filters.showFilters && (
                    <div className="bg-white border-t border-gray-100 py-4 shadow-sm animate-slideDown">
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Filter Matches</h3>
                                <button
                                    className="text-sm text-primary font-medium flex items-center gap-1"
                                    onClick={resetFilters}
                                >
                                    <FilterX size={14} />
                                    Reset All
                                </button>
                            </div>

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
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
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
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Interests:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allInterests.map(interest => (
                                            <button
                                                key={String(interest)}
                                                className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition-colors ${filters.interests.includes(interest as string)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                onClick={() => filterByInterest(interest as string)}
                                            >
                                                {interestIcons[interest as string] || <Heart size={14} />}
                                                {interest as string}
                                                {filters.interests.includes(interest as string) && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <div className="container mx-auto px-4 pt-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center pt-10">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Heart size={20} className="text-primary" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500">Finding your matches...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-800">
                                {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                            </h2>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar size={14} className="mr-1" />
                                Most recent
                            </div>
                        </div>

                        {filteredMatches.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="p-4 bg-primary/10 rounded-full inline-flex">
                                        <Heart size={32} className="text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No matches found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    {activeFilters > 0
                                        ? 'Try adjusting your filters to see more matches'
                                        : 'Keep swiping to find new matches'}
                                </p>
                                {activeFilters > 0 && (
                                    <button
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
                                        onClick={resetFilters}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredMatches.map((match) => {
                                    const otherUser = match.otherUser;
                                    const profile = otherUser.profile;

                                    return (
                                        <div
                                            key={match.id}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative aspect-square overflow-hidden">
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

                                                <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-primary text-white px-2.5 py-1 rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                                                    <Heart size={12} className="fill-white" /> {match.compatibilityScore}%
                                                </div>

                                                <div className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                                                    {getTimeAgo(profile.lastActive)}
                                                </div>
                                            </div>

                                            <div className="p-3 flex-grow">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-800">
                                                            {profile.name}, {profile.age}
                                                        </h3>
                                                        <div className="flex items-center text-gray-500 text-xs">
                                                            <MapPin size={12} className="mr-1" />
                                                            {profile.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1 my-2">
                                                    {profile.interests.slice(0, 3).map(interest => (
                                                        <span
                                                            key={interest}
                                                            className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full flex items-center"
                                                        >
                                                            {interestIcons[interest] || <Heart size={10} className="mr-0.5" />}
                                                            <span className="ml-0.5 truncate">{interest}</span>
                                                        </span>
                                                    ))}
                                                    {profile.interests.length > 3 && (
                                                        <span className="text-xs text-gray-500">+{profile.interests.length - 3} more</span>
                                                    )}
                                                </div>

                                                <div className="text-gray-600 text-xs line-clamp-2 mb-1">
                                                    {profile.bio || 'No bio available'}
                                                </div>
                                            </div>

                                            <div className="px-3 pb-3 flex flex-col space-y-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="flex-grow py-2 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                                                        onClick={() => navigate(`/match/${match.id}`)}
                                                    >
                                                        <Eye size={16} className="mr-1" />
                                                        View Profile
                                                    </button>

                                                    <button
                                                        className="flex-grow py-2 flex items-center justify-center rounded-lg bg-primary hover:bg-primary text-white text-sm font-medium transition-colors"
                                                        onClick={() => handleMessage(match.id)}
                                                    >
                                                        <MessageCircle size={16} className="mr-1" />
                                                        Message
                                                    </button>
                                                </div>

                                                <button
                                                    className="w-full py-1.5 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-100 transition-colors"
                                                    onClick={() => handleUnmatch(match.id)}
                                                >
                                                    <X size={14} className="mr-1" />
                                                    Unmatch
                                                </button>
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