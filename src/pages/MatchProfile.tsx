import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Heart, ArrowLeft, MessageCircle, X,
    MapPin, Briefcase, GraduationCap, Coffee, Music,
    BookOpen, Camera, Film, User, Globe, Instagram, Star,
    Sparkles, Send, AlertTriangle, ArrowRightCircle, ArrowLeftCircle,
    Ban, ChevronDown, ChevronUp, Clock, Share2, Diamond,
    Info, Users, MessageSquare, Settings, ChevronRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchService, conversationService, profileService } from '@/services';
import toast from 'react-hot-toast';

const MatchProfilePage = () => {
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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('about');
    const [photosFullscreen, setPhotosFullscreen] = useState(false);
    const [openBanModal, setOpenBanModal] = useState(false);
    const [openUnblockModal, setOpenUnblockModal] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [expandedBio, setExpandedBio] = useState(false);
    
    const photosRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const [dragStartX, setDragStartX] = useState(0);
    
    // Expand/collapse bio
    const toggleBio = () => {
        setExpandedBio(!expandedBio);
    };

    const fetchMatchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await matchService.getMatchById(id as string);
        setMatch(data);
        setOtherUser(data?.otherUser);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching match:", err);

        let errorMessage = "Unable to load profile. Please try again later.";

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as any).response === "object" &&
          (err as any).response !== null &&
          "data" in (err as any).response &&
          typeof (err as any).response.data === "object" &&
          (err as any).response.data !== null &&
          "message" in (err as any).response.data
        ) {
          const message = (err as any).response.data.message;
          if (message === "This match is no longer available") {
            errorMessage = "This match is no longer available.";
          } else {
            errorMessage = message;
          }
        } else if (err instanceof Error) {
          if (err.message.includes("No match ID")) {
            errorMessage = "Invalid match ID provided.";
          } else if (
            err.message.includes("No data received") ||
            err.message.includes("No otherUser data")
          ) {
            errorMessage = "No match data found. This match may no longer exist.";
          } else if (
            err.message.includes("profile data is missing") ||
            err.message.includes("name is missing") ||
            err.message.includes("photos are missing")
          ) {
            errorMessage = "This profile is incomplete or unavailable.";
          } else if (
            err.message.includes("Network Error") ||
            err.message.includes("fetch")
          ) {
            errorMessage = "Network error. Please check your connection and try again.";
          } else if (
            err.message.includes("This match is no longer available")
          ) {
            errorMessage = "This match is no longer available.";
          }
        }

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchMatchData();
    }, [id]);

    useEffect(() => {
        if (otherUser?.profile?.photos && otherUser.profile.photos.length > 0) {
            setImageLoaded(false);
            const img = new Image();
            img.src = otherUser.profile.photos[currentPhotoIndex];
            img.onload = () => setImageLoaded(true);
        }
    }, [currentPhotoIndex, otherUser]);

    const handlePhotoChange = (newIndex: number) => {
        if (isAnimating || !otherUser?.profile?.photos) return;

        if (newIndex < 0) {
            newIndex = otherUser.profile.photos.length - 1;
        } else if (newIndex >= otherUser.profile.photos.length) {
            newIndex = 0;
        }

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
            if (delta > 0) {
                handlePhotoChange(currentPhotoIndex - 1);
            } else {
                handlePhotoChange(currentPhotoIndex + 1);
            }
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !id) return;

        try {
            setIsSendingMessage(true);
            await conversationService.startConversation(id, messageText);
            setIsSendingMessage(false);
            navigate(`/messages`);
        } catch (err) {
            console.error('Error sending message:', err);
            toast.error('Failed to send message. Please try again.');
            setIsSendingMessage(false);
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
            toast.error('Failed to unmatch. Please try again.');
        }
    };

    const handleBlockUser = async (id: string) => {
        if (!id) return;

        try {
            await profileService.blockUser(id);
            toast.success('User blocked successfully.');
            window.location.reload();
        } catch (err) {
            console.error('Error blocking user:', err);
            toast.error('Failed to block user. Please try again.');
        }
    };

    const handleUnblockUser = async (id: string) => {
        if (!id) return;

        try {
            await profileService.unblockUser(id);
            toast.success('User unblocked successfully.');
            window.location.reload();
        } catch (err) {
            console.error('Error unblocking user:', err);
            toast.error('Failed to unblock user. Please try again.');
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

        if (starters.length < 3) {
            const firstName = otherUser?.profile?.name?.split(' ')[0] || 'there';
            starters.push(`Hey ${firstName}! I'm glad we matched. How's your day going?`);
        }

        return starters.slice(0, 3);
    };

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

    // Renders for loading state and errors
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-[#FF6B81] border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Heart size={20} className="text-[#FF6B81]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !otherUser || !otherUser.profile) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle size={40} className="text-[#FF6B81] mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {error || "Profile not found"}
                </h2>
                <p className="text-gray-600 mb-6">
                    {error || "We couldn't load this profile. Please try again later."}
                </p>
                <div className="flex gap-3">
                    <button
                        className="px-5 py-2.5 bg-[#FF6B81] text-white rounded-full hover:bg-[#FF6B81]/90 transition-colors"
                        onClick={() => navigate('/matches')}
                    >
                        Back to Matches
                    </button>
                    <button
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!otherUser.profile.photos || otherUser.profile.photos.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle size={40} className="text-[#FF6B81] mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    No photos available
                </h2>
                <p className="text-gray-600 mb-6">
                    This profile doesn't have any photos yet.
                </p>
                <button
                    className="px-5 py-2.5 bg-[#FF6B81] text-white rounded-full"
                    onClick={() => navigate('/matches')}
                >
                    Back to Matches
                </button>
            </div>
        );
    }

    const profile = otherUser.profile;
    const compatibilityDetails = generateCompatibilityDetails();
    const conversationStarters = generateConversationStarters();
    const safePhotoIndex = Math.min(currentPhotoIndex, profile.photos.length - 1);

    // Main render
    return (
        <div className="bg-white min-h-screen relative">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent pt-safe">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <button
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                        onClick={() => navigate("/matches")}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        <button
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                            onClick={() => {/* Share functionality */}}
                        >
                            <Share2 size={18} />
                        </button>
                        
                        {match.isBlocked ? (
                            <button
                                className="px-3 py-1.5 flex items-center gap-1.5 bg-white/20 text-white rounded-full text-[13px] backdrop-blur-sm hover:bg-white/30 transition-colors"
                                onClick={() => setOpenUnblockModal(true)}
                            >
                                <Ban size={14} />
                                Unblock
                            </button>
                        ) : (
                            <button
                                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                                onClick={() => setOpenBanModal(true)}
                            >
                                <Ban size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="relative pt-safe">
                {/* Photos section */}
                <div
                    className={`relative ${photosFullscreen ? 'h-screen' : 'h-[60vh] md:h-[50vh]'} bg-black overflow-hidden transition-all duration-300`}
                    ref={photosRef}
                    onMouseDown={handleDragStart}
                    onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                    onClick={() => setPhotosFullscreen(!photosFullscreen)}
                >
                    {/* Navigation buttons */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePhotoChange(currentPhotoIndex - 1);
                        }}
                        aria-label="Previous photo"
                    >
                        <ArrowLeftCircle size={20} />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePhotoChange(currentPhotoIndex + 1);
                        }}
                        aria-label="Next photo"
                    >
                        <ArrowRightCircle size={20} />
                    </button>

                    {/* Loading indicator */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                            <div className="w-12 h-12 border-2 border-[#FF6B81] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Photo animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={safePhotoIndex}
                            className="absolute inset-0 flex items-center justify-center bg-black"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={profile.photos[safePhotoIndex]}
                                alt={`${profile.name} photo ${safePhotoIndex + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={() => setImageLoaded(true)}
                                onError={(e) => {
                                    console.error(
                                        "Image failed to load:",
                                        profile.photos[safePhotoIndex]
                                    );
                                    setImageLoaded(true);
                                    (e.target as HTMLImageElement).src =
                                        "https://via.placeholder.com/400x600?text=Image+Not+Available";
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Photo pagination */}
                    <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4 pt-16">
                        {profile.photos.map((_: any, index: number) => (
                            <button
                                key={index}
                                className={`h-1 rounded-full transition-all ${
                                    index === safePhotoIndex
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/50 hover:bg-white/80"
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePhotoChange(index);
                                }}
                                aria-label={`View photo ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Compatibility badge */}
                    <div className="absolute top-24 right-4 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5">
                        <Heart size={14} className="fill-white" />{" "}
                        {match?.compatibilityScore || 0}% Match
                    </div>

                    {/* Bottom gradient and info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-start"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg">
                                    <img 
                                        src={profile.photos[0]} 
                                        alt={profile.name} 
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {profile.name}, {profile.age}
                                    </h1>
                                    <div className="flex items-center text-white/90 text-sm">
                                        <MapPin size={14} className="mr-1" />
                                        {profile.location}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.occupation && (
                                    <div className="inline-flex items-center text-white/90 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Briefcase size={12} className="mr-1.5" />
                                        {profile.occupation}
                                    </div>
                                )}
                                
                                {profile.education && (
                                    <div className="inline-flex items-center text-white/90 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <GraduationCap size={12} className="mr-1.5" />
                                        {profile.education}
                                    </div>
                                )}
                            </div>

                            {/* Message & Unmatch buttons */}
                            <div className="flex w-full gap-3 mt-4">
                                <button
                                    className="flex-grow h-12 rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:shadow-[#FF6B81]/20 transition-all"
                                    onClick={() => {
                                        setActiveTab('message');
                                        setTimeout(() => {
                                            if (messageRef.current) messageRef.current.focus();
                                        }, 100);
                                    }}
                                >
                                    <MessageCircle size={18} />
                                    Message
                                </button>
                                
                                <button
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    onClick={handleUnmatch}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content tabs */}
                <div className="px-1 bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm">
                    <div className="flex max-w-lg mx-auto">
                        <button
                            className={`flex-1 py-4 px-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'about' 
                                ? 'text-[#FF6B81]' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('about')}
                        >
                            <div className="flex items-center justify-center gap-1.5">
                                <User size={16} />
                                About
                            </div>
                            {activeTab === 'about' && (
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                    layoutId="activeTabIndicator"
                                ></motion.div>
                            )}
                        </button>
                        
                        <button
                            className={`flex-1 py-4 px-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'compatibility' 
                                ? 'text-[#FF6B81]' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('compatibility')}
                        >
                            <div className="flex items-center justify-center gap-1.5">
                                <Heart size={16} />
                                Match
                            </div>
                            {activeTab === 'compatibility' && (
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                    layoutId="activeTabIndicator"
                                ></motion.div>
                            )}
                        </button>
                        
                        <button
                            className={`flex-1 py-4 px-3 text-sm font-medium transition-colors relative ${
                                activeTab === 'message' 
                                ? 'text-[#FF6B81]' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('message')}
                        >
                            <div className="flex items-center justify-center gap-1.5">
                                <MessageSquare size={16} />
                                Message
                            </div>
                            {activeTab === 'message' && (
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                    layoutId="activeTabIndicator"
                                ></motion.div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content area */}
                <div className="max-w-lg mx-auto pb-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'about' && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-4"
                            >
                                {/* Bio section */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">About {profile.name.split(" ")[0]}</h2>
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        {profile.bio ? (
                                            <>
                                                <div className={`${expandedBio ? '' : 'line-clamp-3'} transition-all duration-300 text-gray-600 leading-relaxed`}>
                                                    {profile.bio
                                                        .split("\n\n")
                                                        .map((paragraph: any, idx: any) => (
                                                            <p key={idx} className="mb-3">{paragraph}</p>
                                                        ))}
                                                </div>
                                                {profile.bio.split("\n\n").length > 1 && (
                                                    <button 
                                                        className="text-[#FF6B81] font-medium flex items-center gap-1 mt-2 hover:text-[#B75BFF] transition-colors group text-sm"
                                                        onClick={toggleBio}
                                                    >
                                                        {expandedBio ? (
                                                            <>Read less <ChevronUp size={14} className="group-hover:translate-y-[-2px] transition-transform" /></>
                                                        ) : (
                                                            <>Read more <ChevronDown size={14} className="group-hover:translate-y-[2px] transition-transform" /></>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-400 italic">No bio provided yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Interests section */}
                                {profile.interests && profile.interests.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-800 mb-3">Interests</h2>
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            <div className="flex flex-wrap gap-2">
                                                {profile.interests.map((interest: any, index: any) => (
                                                    <span
                                                        key={`${interest}-${index}`}
                                                        className="bg-gradient-to-r from-[#FF6B81]/10 to-[#B75BFF]/10 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#FF6B81]/10"
                                                    >
                                                        {getInterestIcon(interest)}
                                                        <span className="font-medium text-sm">{interest}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Basics section */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">Basics</h2>
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="grid grid-cols-2 gap-3">
                                            {profile.height && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <User size={16} className="mr-3 text-[#FF6B81]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Height</div>
                                                        <div className="font-medium text-sm">{profile.height}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.lookingFor && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <Heart size={16} className="mr-3 text-[#B75BFF]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Looking for</div>
                                                        <div className="font-medium text-sm">{profile.lookingFor}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.languages && profile.languages.length > 0 && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <Globe size={16} className="mr-3 text-[#FF6B81]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Languages</div>
                                                        <div className="font-medium text-sm">{profile.languages.join(", ")}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.instagram && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <Instagram size={16} className="mr-3 text-[#B75BFF]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Instagram</div>
                                                        <div className="font-medium text-sm">{profile.instagram}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.drinking && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <Coffee size={16} className="mr-3 text-[#FF6B81]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Drinking</div>
                                                        <div className="font-medium text-sm">{profile.drinking}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.smoking && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <User size={16} className="mr-3 text-[#B75BFF]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Smoking</div>
                                                        <div className="font-medium text-sm">{profile.smoking}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {profile.zodiac && (
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                                                    <Star size={16} className="mr-3 text-[#FF6B81]" />
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium">Zodiac</div>
                                                        <div className="font-medium text-sm">{profile.zodiac}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Questions section */}
                                {profile.questions && profile.questions.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                                            Getting to know {profile.name.split(" ")[0]}
                                        </h2>
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            <div className="space-y-4">
                                                {profile.questions.slice(0, 3).map((item: any, idx: any) => (
                                                    <div
                                                        key={idx}
                                                        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF6B81]/5 to-[#B75BFF]/5 p-4"
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF6B81] to-[#B75BFF]"></div>
                                                        <div className="pl-3">
                                                            <div className="text-gray-500 mb-1 font-medium text-sm">
                                                                {item.question}
                                                            </div>
                                                            <div className="text-gray-800 font-medium">{item.answer}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {profile.questions.length > 3 && (
                                                    <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[#FF6B81] hover:text-[#B75BFF] font-medium transition-colors text-sm">
                                                        See all {profile.questions.length} questions
                                                        <ChevronRight size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Music section */}
                                {profile.spotifyArtists && profile.spotifyArtists.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Music size={18} />
                                            Top Artists
                                        </h2>
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            <div className="space-y-3">
                                                {profile.spotifyArtists.slice(0, 3).map((artist: any, idx: any) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B81]/20 to-[#B75BFF]/20 rounded-md flex items-center justify-center">
                                                            <Music size={16} className="text-[#B75BFF]" />
                                                        </div>
                                                        <div className="text-gray-800 font-medium">{artist}</div>
                                                    </div>
                                                ))}
                                                
                                                {profile.spotifyArtists.length > 3 && (
                                                    <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[#FF6B81] hover:text-[#B75BFF] font-medium transition-colors text-sm">
                                                        See all {profile.spotifyArtists.length} artists
                                                        <ChevronRight size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Activity status */}
                                <div className="mb-6">
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            <p className="text-gray-600 text-sm">
                                                {profile.name.split(" ")[0]} was last active{" "}
                                                <span className="font-medium">{getTimeAgo(profile.lastActive)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'compatibility' && (
                            <motion.div
                                key="compatibility"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-4"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <Heart size={18} className="text-[#FF6B81]" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]">
                                                {compatibilityDetails.overall}%
                                            </span>{" "}
                                            Compatibility
                                        </h2>
                                    </div>

                                    <div className="bg-gray-100 h-3 rounded-full mb-6 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${compatibilityDetails.overall}%` }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        />
                                    </div>

                                    <div className="space-y-4 mt-6">
                                        {Object.entries(compatibilityDetails)
                                            .filter(([key]) => key !== "overall")
                                            .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="capitalize text-gray-600 font-medium">
                                                            {key}
                                                        </span>
                                                        <span className="font-bold text-gray-800">
                                                            {value}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full bg-gradient-to-r from-[#FF6B81]/70 to-[#B75BFF]/70"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${value}%` }}
                                                            transition={{ delay: 0.4, duration: 0.8 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Diamond size={18} className="text-[#FF6B81]" />
                                        <span className="font-bold text-gray-800">What this means</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Based on your profiles, preferences, and activity, our algorithm predicts you'd have a strong connection with {profile.name.split(" ")[0]}. You share similar values and interests, which suggests you'll have plenty to talk about and enjoy together.
                                    </p>
                                    
                                    <div className="mt-6 p-4 bg-gradient-to-r from-[#FF6B81]/5 to-[#B75BFF]/5 rounded-xl">
                                        <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} className="text-[#B75BFF]" />
                                            Conversation tip
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            You both share an interest in {
                                                profile.interests && profile.interests.length > 0 
                                                ? profile.interests[0] 
                                                : "similar activities"
                                            }. Try asking about their favorite experiences with this!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'message' && (
                            <motion.div
                                key="message"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-4"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MessageCircle size={18} className="text-[#FF6B81]" />
                                        Message {profile.name.split(" ")[0]}
                                    </h2>
                                    
                                    <div className="relative">
                                        <textarea
                                            ref={messageRef}
                                            placeholder={`Say something to ${profile.name.split(" ")[0]}...`}
                                            className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] resize-none h-28"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                        ></textarea>
                                        <button
                                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                                                messageText.trim() && !isSendingMessage
                                                    ? "bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white hover:shadow-md"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim() || isSendingMessage}
                                        >
                                            {isSendingMessage ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                                        <Sparkles size={16} className="text-[#FF6B81]" />
                                        Conversation starters
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        {conversationStarters.map((starter, idx) => (
                                            <button
                                                key={idx}
                                                className="block w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-[#FF6B81]/5 to-[#B75BFF]/5 hover:from-[#FF6B81]/10 hover:to-[#B75BFF]/10 rounded-lg text-gray-700 transition-colors"
                                                onClick={() => {
                                                    setMessageText(starter);
                                                    if (messageRef.current) messageRef.current.focus();
                                                }}
                                            >
                                                {starter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Block modal */}
            {openBanModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <motion.div 
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">Block User</h2>
                            <button
                                onClick={() => setOpenBanModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to block{" "}
                                <span className="font-semibold">{profile.name}</span>?
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                They won't be able to see your profile, message you, or
                                interact with your content. You can unblock them at any time
                                from your settings.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setOpenBanModal(false)}
                                    className="px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleBlockUser(otherUser?.id);
                                    }}
                                    className="px-4 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                                >
                                    Block User
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Unblock modal */}
            {openUnblockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <motion.div 
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">
                                Unblock User
                            </h2>
                            <button
                                onClick={() => setOpenUnblockModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to unblock{" "}
                                <span className="font-semibold">{profile.name}</span>?
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                They will be able to see your profile, message you, and
                                interact with your content again.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setOpenUnblockModal(false)}
                                    className="px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleUnblockUser(otherUser?.id);
                                    }}
                                    className="px-4 py-2.5 rounded-full bg-[#FF6B81] text-white font-medium hover:bg-[#FF6B81]/90 transition-colors"
                                >
                                    Unblock User
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default MatchProfilePage;