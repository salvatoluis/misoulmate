// src/pages/MatchProfilePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, ArrowLeft, Share, MoreHorizontal, MessageCircle, X,
    MapPin, Calendar, Briefcase, GraduationCap, Coffee, Music,
    BookOpen, Camera, Film, User, Globe, Instagram, Check, Star,
    Sparkles, Send
} from 'lucide-react';

// Extended dummy data for a single match
const matchProfile = {
    id: 1,
    name: 'Emma Wilson',
    age: 28,
    location: 'San Francisco, CA',
    distance: 3.2,
    matchPercentage: 96,
    bio: 'Coffee enthusiast, amateur photographer, and bookworm. I love exploring hidden gems in the city and finding new hiking trails on weekends. Always on the lookout for the next great read and the perfect latte art.\n\nLooking for someone who values genuine connection, has a sense of adventure, and doesn\'t mind getting lost in a good conversation.',
  photos: [
        '/images/profile-1.jpg',
        '/images/profile-1b.jpg',
        '/images/profile-1c.jpg',
        '/images/profile-1d.jpg',
        '/images/profile-1e.jpg'
    ],
    interests: ['Photography', 'Reading', 'Coffee', 'Hiking', 'Travel', 'Art', 'Museums'],
    lastActive: 'Just now',
    occupation: 'UX Designer at Creative Studio',
    education: 'MFA in Design, Stanford University',
    height: "5'7\"",
    languages: ['English', 'Spanish', 'French (Basic)'],
    lookingFor: 'Long-term relationship',
    drinking: 'Social drinker',
    smoking: 'Never',
    zodiac: 'Libra',
    instagram: '@emma_designs',
    spotifyArtists: ['Hozier', 'Phoebe Bridgers', 'The National'],
    questions: [
        {
            question: 'My ideal weekend includes...',
            answer: 'A morning hike, afternoon at a bookstore cafe, and dinner with friends at a new restaurant.'
        },
        {
            question: 'I value most in a relationship...',
            answer: 'Communication, mutual respect, and shared laughter.'
        },
        {
            question: 'My favorite travel memory is...',
            answer: 'Getting lost in Tokyo and stumbling upon a tiny jazz bar with incredible music.'
        }
    ],
    compatibility: {
        overall: 96,
        values: 92,
        interests: 88,
        communication: 98,
        lifestyle: 90
    },
    mutualConnections: 2,
    conversationStarters: [
        "I noticed you like photography. What's your favorite subject to capture?",
        "Which hiking trails around SF would you recommend?",
        "What book are you currently reading?"
    ]
};

const MatchProfilePage: React.FC = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCompatibility, setShowCompatibility] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const photosRef = useRef<HTMLDivElement>(null);
    const [dragStartX, setDragStartX] = useState(0);

    // Simulate loading state
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }, []);

    // Navigate between photos
    const handlePhotoChange = (newIndex: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentPhotoIndex(newIndex);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Handle drag interactions for photos
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragStartX(clientX);
    };

    const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
        const delta = clientX - dragStartX;

        if (Math.abs(delta) > 50) { // Minimum drag distance
            if (delta > 0 && currentPhotoIndex > 0) {
                // Dragged right -> previous photo
                handlePhotoChange(currentPhotoIndex - 1);
            } else if (delta < 0 && currentPhotoIndex < matchProfile.photos.length - 1) {
                // Dragged left -> next photo
                handlePhotoChange(currentPhotoIndex + 1);
            }
        }
    };

    // Handle message sending
    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        // In a real app, you'd send the message to an API
        alert(`Message sent: ${messageText}`);
        setMessageText('');
    };

    // Interest icon mapping
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
            default: return <User size={16} />;
        }
    };

    // Animation variants for smoother loading
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.25, when: "beforeChildren" }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    // Smoother transitions for content sections
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    // Section variants with staggered children
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    // Item variants for staggered entries
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
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
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white min-h-screen relative"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent pt-safe">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.button
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>

                    <div className="flex gap-2">
                        <motion.button
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share size={18} />
                        </motion.button>
                        <motion.button
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MoreHorizontal size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Photo Gallery */}
            <div
                className="relative h-[70vh] bg-gray-100 overflow-hidden"
                ref={photosRef}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
            >
                {/* Photos */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPhotoIndex}
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={matchProfile.photos[currentPhotoIndex]}
                            alt={`${matchProfile.name} photo ${currentPhotoIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Photo navigation indicators */}
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4 pt-12">
                    {matchProfile.photos.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1 rounded-full transition-all ${index === currentPhotoIndex
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                                }`}
                            onClick={() => handlePhotoChange(index)}
                            aria-label={`View photo ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Match percentage badge */}
                <div className="absolute top-24 right-4 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5">
                    <Heart size={14} className="fill-white" /> {matchProfile.matchPercentage}% Match
                </div>

                {/* Profile name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-1">{matchProfile.name}, {matchProfile.age}</h1>
                        <div className="flex items-center text-white/90 text-sm">
                            <MapPin size={14} className="mr-1" />
                            {matchProfile.location} • {matchProfile.distance} miles away
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 py-6">
                <motion.div
                    className="grid md:grid-cols-3 gap-6 lg:gap-10"
                    variants={contentVariants}
                >
                    {/* Left column: Main profile info */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Bio section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-800 mb-4 flex items-center"
                                variants={itemVariants}
                            >
                                About {matchProfile.name.split(' ')[0]}
                            </motion.h2>
                            <motion.div
                                className="space-y-3 text-gray-600"
                                variants={itemVariants}
                            >
                                {matchProfile.bio.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </motion.div>
                        </motion.section>

                        {/* Basics section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-800 mb-4"
                                variants={itemVariants}
                            >
                                Basics
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-2 gap-4"
                                variants={itemVariants}
                            >
                                <div className="flex items-center text-gray-700">
                                    <Briefcase size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Work</div>
                                        <div>{matchProfile.occupation}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <GraduationCap size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Education</div>
                                        <div>{matchProfile.education}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <User size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Height</div>
                                        <div>{matchProfile.height}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Heart size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Looking for</div>
                                        <div>{matchProfile.lookingFor}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Globe size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Languages</div>
                                        <div>{matchProfile.languages.join(', ')}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Instagram size={18} className="mr-3 text-gray-500" />
                                    <div>
                                        <div className="text-sm text-gray-500">Instagram</div>
                                        <div>{matchProfile.instagram}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.section>

                        {/* Interests section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-800 mb-4"
                                variants={itemVariants}
                            >
                                Interests
                            </motion.h2>
                            <motion.div
                                className="flex flex-wrap gap-2"
                                variants={itemVariants}
                            >
                                {matchProfile.interests.map(interest => (
                                    <span
                                        key={interest}
                                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                                    >
                                        {getInterestIcon(interest)}
                                        {interest}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.section>

                        {/* Q&A section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-800 mb-4"
                                variants={itemVariants}
                            >
                                Getting to know {matchProfile.name.split(' ')[0]}
                            </motion.h2>
                            <motion.div
                                className="space-y-5"
                                variants={itemVariants}
                            >
                                {matchProfile.questions.map((item, idx) => (
                                    <div key={idx} className="border-l-2 border-[#FF6B81] pl-4 py-1">
                                        <div className="text-gray-500 mb-1">{item.question}</div>
                                        <div className="text-gray-800">{item.answer}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.section>

                        {/* Music section */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"
                                variants={itemVariants}
                            >
                                <Music size={18} />
                                Top Artists
                            </motion.h2>
                            <motion.div
                                className="space-y-3"
                                variants={itemVariants}
                            >
                                {matchProfile.spotifyArtists.map((artist, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                            <Music size={16} className="text-gray-500" />
                                        </div>
                                        <div className="text-gray-800">{artist}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.section>
                    </div>

                    {/* Right column: Actions and compatibility */}
                    <div className="space-y-6">
                        {/* Action buttons card */}
                        <motion.section
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4"
                            variants={contentVariants}
                        >
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <button
                                    className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    onClick={() => { }}
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>
                                <button
                                    className="flex-grow h-14 rounded-full bg-[#FF6B81]/10 hover:bg-[#FF6B81]/20 text-[#FF6B81] flex items-center justify-center gap-2 transition-colors font-medium"
                                    onClick={() => { }}
                                >
                                    <MessageCircle size={20} />
                                    Message
                                </button>
                                <button
                                    className="w-14 h-14 rounded-full bg-[#FF6B81] hover:bg-[#D86D72] text-white flex items-center justify-center transition-colors"
                                    onClick={() => { }}
                                >
                                    <Heart size={24} />
                                </button>
                            </div>

                            {/* Quick message section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500">Start a conversation</h3>
                                <div className="relative">
                                    <textarea
                                        placeholder="Type your message..."
                                        className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] resize-none h-24"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    ></textarea>
                                    <button
                                        className={`absolute bottom-3 right-3 p-1.5 rounded-full ${messageText.trim()
                                                ? 'bg-[#FF6B81] text-white'
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
                                    {matchProfile.conversationStarters.map((starter, idx) => (
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
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <motion.h2
                                    className="text-xl font-bold text-gray-800 flex items-center gap-2"
                                    variants={itemVariants}
                                >
                                    <span className="text-[#FF6B81]">{matchProfile.compatibility.overall}%</span> Compatibility
                                </motion.h2>
                                <motion.button
                                    className="text-[#FF6B81] text-sm font-medium"
                                    onClick={() => setShowCompatibility(!showCompatibility)}
                                    variants={itemVariants}
                                >
                                    {showCompatibility ? 'Hide' : 'Show'} details
                                </motion.button>
                            </div>

                            <motion.div
                                className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] h-2.5 rounded-full mb-4"
                                initial={{ width: 0 }}
                                animate={{ width: `${matchProfile.compatibility.overall}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />

                            <AnimatePresence>
                                {showCompatibility && (
                                    <motion.div
                                        className="space-y-3 mt-5"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {Object.entries(matchProfile.compatibility)
                                            .filter(([key]) => key !== 'overall')
                                            .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="capitalize text-gray-600">{key}</span>
                                                        <span className="font-medium text-gray-800">{value}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-[#FF6B81]/70 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${value}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>

                        {/* Mutual connections */}
                        {matchProfile.mutualConnections > 0 && (
                            <motion.section
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                variants={contentVariants}
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Star size={18} className="text-[#FFE066]" />
                                    Mutual Connections
                                </h2>
                                <p className="text-gray-600">
                                    You have {matchProfile.mutualConnections} mutual {matchProfile.mutualConnections === 1 ? 'connection' : 'connections'} with {matchProfile.name.split(' ')[0]}.
                                </p>
                            </motion.section>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default MatchProfilePage;