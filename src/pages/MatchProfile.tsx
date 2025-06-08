import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Heart, ArrowLeft, Share, MoreHorizontal, MessageCircle, X,
    MapPin, Briefcase, GraduationCap, Coffee, Music,
    BookOpen, Camera, Film, User, Globe, Instagram, Star,
    Sparkles, Send, AlertTriangle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchService, conversationService } from '@/services';

interface MatchProfileProps {
    id?: string;
}

const MatchProfilePage: React.FC<MatchProfileProps> = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [match, setMatch] = useState<any>(null);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCompatibility, setShowCompatibility] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const photosRef = useRef<HTMLDivElement>(null);
    const [dragStartX, setDragStartX] = useState(0);

    const fetchMatchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await matchService.getMatchById(id as string);
            setMatch(data);

            setOtherUser(data?.otherUser);
            setIsLoading(false);

        } catch (err) {
            console.error('Error fetching match:', err);

            let errorMessage = 'Unable to load profile. Please try again later.';

            if (err instanceof Error) {
                if (err.message.includes('No match ID')) {
                    errorMessage = 'Invalid match ID provided.';
                } else if (err.message.includes('No data received') || err.message.includes('No otherUser data')) {
                    errorMessage = 'No match data found. This match may no longer exist.';
                } else if (err.message.includes('profile data is missing') || err.message.includes('name is missing') || err.message.includes('photos are missing')) {
                    errorMessage = 'This profile is incomplete or unavailable.';
                } else if (err.message.includes('Network Error') || err.message.includes('fetch')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchData();
    }, [id]);

    const handlePhotoChange = (newIndex: number) => {
        if (isAnimating || !otherUser?.profile?.photos) return;

        if (newIndex < 0 || newIndex >= otherUser.profile.photos.length) return;

        setIsAnimating(true);
        setCurrentPhotoIndex(newIndex);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragStartX(clientX);
    };

    const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (!otherUser?.profile?.photos) return;

        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
        const delta = clientX - dragStartX;

        if (Math.abs(delta) > 50) {
            if (delta > 0 && currentPhotoIndex > 0) {
                handlePhotoChange(currentPhotoIndex - 1);
            } else if (delta < 0 && currentPhotoIndex < otherUser.profile.photos.length - 1) {
                handlePhotoChange(currentPhotoIndex + 1);
            }
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !id) return;

        try {
            const response = await conversationService.startConversation(id, messageText);
            navigate(`/conversation/${response.conversationId}`);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleUnmatch = async () => {
        if (!id) return;

        const confirmed = window.confirm('Are you sure you want to unmatch? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await matchService.unmatchUser(id);
            navigate('/matches');
        } catch (err) {
            console.error('Error unmatching:', err);
            alert('Failed to unmatch. Please try again.');
        }
    };

    const getInterestIcon = (interest: string) => {
        switch (interest) {
            case 'Photography': return <Camera size={16} />;
            case 'Reading': return <BookOpen size={16} />;
            case 'Coffee': return <Coffee size={16} />;
            case 'Hiking': return <MapPin size={16} />;
            case 'Travel': return <Globe size={16} />;
            case 'Art': return <Camera size={16} />;
            case 'Museums': return <Briefcase size={16} />;
            case 'Music': return <Music size={16} />;
            case 'Film': return <Film size={16} />;
            case 'Yoga': return <User size={16} />;
            case 'Cooking': return <Coffee size={16} />;
            case 'Technology': return <Briefcase size={16} />;
            default: return <User size={16} />;
        }
    };

    // Generate conversation starters based on profile data
    const generateConversationStarters = () => {
        const starters = [];

        if (otherUser?.profile?.interests?.length > 0) {
            const randomInterest = otherUser.profile.interests[Math.floor(Math.random() * otherUser.profile.interests.length)];
            starters.push(`I noticed you're into ${randomInterest}. What got you interested in that?`);
        }

        if (otherUser?.profile?.occupation) {
            starters.push(`I'd love to hear more about your work as a ${otherUser.profile.occupation}. What's that like?`);
        }

        if (otherUser?.profile?.location) {
            const city = otherUser.profile.location.split(',')[0];
            starters.push(`How do you like living in ${city}?`);
        }

        // Add a generic one if we don't have enough
        if (starters.length < 3) {
            const firstName = otherUser?.profile?.name?.split(' ')[0] || 'there';
            starters.push(`Hey ${firstName}! I'm glad we matched. How's your day going?`);
        }

        return starters.slice(0, 3);
    };

    // Get time ago from date string
    const getTimeAgo = (dateString: string) => {
        if (!dateString) return 'Recently';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch (err) {
            console.error('Error parsing date:', err);
            return 'Recently';
        }
    };

    // Calculate compatibility details
    const generateCompatibilityDetails = () => {
        const compatibilityScore = match?.compatibilityScore || 0;

        return {
            overall: compatibilityScore,
            values: Math.min(100, Math.max(0, compatibilityScore + Math.floor(Math.random() * 10) - 5)),
            interests: Math.min(100, Math.max(0, compatibilityScore + Math.floor(Math.random() * 10) - 5)),
            communication: Math.min(100, Math.max(0, compatibilityScore + Math.floor(Math.random() * 10) - 5)),
            lifestyle: Math.min(100, Math.max(0, compatibilityScore + Math.floor(Math.random() * 10) - 5))
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Heart size={20} className="text-green-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !otherUser || !otherUser.profile) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle size={40} className="text-green-600 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {error || "Profile not found"}
                </h2>
                <p className="text-gray-600 mb-6">
                    {error || "We couldn't load this profile. Please try again later."}
                </p>
                <div className="flex gap-3">
                    <button
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors"
                        onClick={() => navigate('/matches')}
                    >
                        Back to Matches
                    </button>
                    <button
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const profile = otherUser.profile;
    const compatibilityDetails = generateCompatibilityDetails();
    const conversationStarters = generateConversationStarters();

    // Ensure we have photos and valid photo index
    if (!profile.photos || profile.photos.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle size={40} className="text-green-600 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    No photos available
                </h2>
                <p className="text-gray-600 mb-6">
                    This profile doesn't have any photos yet.
                </p>
                <button
                    className="px-5 py-2 bg-green-600 text-white rounded-lg"
                    onClick={() => navigate('/matches')}
                >
                    Back to Matches
                </button>
            </div>
        );
    }

    // Ensure currentPhotoIndex is within bounds
    const safePhotoIndex = Math.min(currentPhotoIndex, profile.photos.length - 1);

    return (
        <div className="bg-white min-h-screen relative">
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent pt-safe">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                        onClick={() => navigate('/matches')}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        <button
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                            onClick={() => {/* Share functionality */ }}
                        >
                            <Share size={18} />
                        </button>
                        <button
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                            onClick={() => {/* More options */ }}
                        >
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="relative h-[70vh] bg-gray-100 overflow-hidden"
                ref={photosRef}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={safePhotoIndex}
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={profile.photos[safePhotoIndex]}
                            alt={`${profile.name} photo ${safePhotoIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => {
                                console.error('Image failed to load:', profile.photos[safePhotoIndex]);
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4 pt-12">
                    {profile.photos.map((_: any, index: any) => (
                        <button
                            key={index}
                            className={`h-1 rounded-full transition-all ${index === safePhotoIndex
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/50 hover:bg-white/80'
                                }`}
                            onClick={() => handlePhotoChange(index)}
                            aria-label={`View photo ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="absolute top-24 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5">
                    <Heart size={14} className="fill-white" /> {match?.compatibilityScore || 0}% Match
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-1">{profile.name}, {profile.age}</h1>
                        <div className="flex items-center text-white/90 text-sm">
                            <MapPin size={14} className="mr-1" />
                            {profile.location}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
                    <div className="md:col-span-2 space-y-6">
                        {/* About section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                About {profile.name.split(' ')[0]}
                            </h2>
                            <div className="space-y-3 text-gray-600">
                                {profile.bio ? (
                                    profile.bio.split('\n\n').map((paragraph: any, idx: any) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No bio provided yet.</p>
                                )}
                            </div>
                        </motion.section>

                        {/* Basics section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Basics
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.occupation && (
                                    <div className="flex items-center text-gray-700">
                                        <Briefcase size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Work</div>
                                            <div>{profile.occupation}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.education && (
                                    <div className="flex items-center text-gray-700">
                                        <GraduationCap size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Education</div>
                                            <div>{profile.education}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.height && (
                                    <div className="flex items-center text-gray-700">
                                        <User size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Height</div>
                                            <div>{profile.height}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.lookingFor && (
                                    <div className="flex items-center text-gray-700">
                                        <Heart size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Looking for</div>
                                            <div>{profile.lookingFor}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.languages && profile.languages.length > 0 && (
                                    <div className="flex items-center text-gray-700">
                                        <Globe size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Languages</div>
                                            <div>{profile.languages.join(', ')}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.instagram && (
                                    <div className="flex items-center text-gray-700">
                                        <Instagram size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Instagram</div>
                                            <div>{profile.instagram}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.drinking && (
                                    <div className="flex items-center text-gray-700">
                                        <Coffee size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Drinking</div>
                                            <div>{profile.drinking}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.smoking && (
                                    <div className="flex items-center text-gray-700">
                                        <User size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Smoking</div>
                                            <div>{profile.smoking}</div>
                                        </div>
                                    </div>
                                )}

                                {profile.zodiac && (
                                    <div className="flex items-center text-gray-700">
                                        <Star size={18} className="mr-3 text-gray-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Zodiac</div>
                                            <div>{profile.zodiac}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Interests section */}
                        {profile.interests && profile.interests.length > 0 && (
                            <motion.section
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Interests
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((interest: any, index: any) => (
                                        <span
                                            key={`${interest}-${index}`}
                                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                                        >
                                            {getInterestIcon(interest)}
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Questions section - Only show if profile has questions */}
                        {profile.questions && profile.questions.length > 0 && (
                            <motion.section
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Getting to know {profile.name.split(' ')[0]}
                                </h2>
                                <div className="space-y-5">
                                    {profile.questions.map((item: any, idx: any) => (
                                        <div key={idx} className="border-l-2 border-green-600 pl-4 py-1">
                                            <div className="text-gray-500 mb-1">{item.question}</div>
                                            <div className="text-gray-800">{item.answer}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Spotify section - Only show if profile has spotify artists */}
                        {profile.spotifyArtists && profile.spotifyArtists.length > 0 && (
                            <motion.section
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Music size={18} />
                                    Top Artists
                                </h2>
                                <div className="space-y-3">
                                    {profile.spotifyArtists.map((artist: any, idx: any) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                                <Music size={16} className="text-gray-500" />
                                            </div>
                                            <div className="text-gray-800">{artist}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Action buttons and messaging */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <button
                                    className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    onClick={handleUnmatch}
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>
                                <button
                                    className="flex-grow h-14 rounded-full bg-green-600/10 hover:bg-green-600/20 text-green-600 flex items-center justify-center gap-2 transition-colors font-medium"
                                    onClick={() => {
                                        const textarea = document.getElementById('message-textarea');
                                        if (textarea) textarea.focus();
                                    }}
                                >
                                    <MessageCircle size={20} />
                                    Message
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500">Start a conversation</h3>
                                <div className="relative">
                                    <textarea
                                        id="message-textarea"
                                        placeholder="Type your message..."
                                        className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 resize-none h-24"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    ></textarea>
                                    <button
                                        className={`absolute bottom-3 right-3 p-1.5 rounded-full ${messageText.trim()
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                        onClick={handleSendMessage}
                                        disabled={!messageText.trim()}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-[#FFE066]" />
                                        Conversation starters
                                    </h4>
                                    {conversationStarters.map((starter, idx) => (
                                        <button
                                            key={idx}
                                            className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                                            onClick={() => setMessageText(starter)}
                                        >
                                            {starter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Compatibility section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-green-600">{compatibilityDetails.overall}%</span> Compatibility
                                </h2>
                                <button
                                    className="text-green-600 text-sm font-medium"
                                    onClick={() => setShowCompatibility(!showCompatibility)}
                                >
                                    {showCompatibility ? 'Hide' : 'Show'} details
                                </button>
                            </div>

                            <motion.div
                                className="bg-gradient-to-r from-green-600 to-green-700 h-2.5 rounded-full mb-4"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            />

                            <AnimatePresence>
                                {showCompatibility && (
                                    <motion.div
                                        className="space-y-3 mt-5"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {Object.entries(compatibilityDetails)
                                            .filter(([key]) => key !== 'overall')
                                            .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="capitalize text-gray-600">{key}</span>
                                                        <span className="font-medium text-gray-800">{value}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-green-600/70 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${value}%` }}
                                                            transition={{ delay: 0.4, duration: 0.8 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>

                        {/* Last active info */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                Activity Status
                            </h2>
                            <p className="text-gray-600">
                                {profile.name.split(' ')[0]} was last active {getTimeAgo(profile.lastActive)}.
                            </p>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchProfilePage;