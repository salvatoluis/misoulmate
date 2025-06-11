import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Heart, X, Star, MessageCircle, User, Bell, Sparkles, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhoneAppProps {
    rotateX?: number;
    rotateY?: number;
}

const PhoneApp: React.FC<PhoneAppProps> = ({ rotateX = 25, rotateY = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Transform values for enhanced 3D movement
    const tiltX = useTransform(y, [-100, 100], [8, -8]);
    const tiltY = useTransform(x, [-100, 100], [-8, 8]);

    // Add springiness to the movement
    const springTiltX = useSpring(tiltX, { stiffness: 150, damping: 25 });
    const springTiltY = useSpring(tiltY, { stiffness: 150, damping: 25 });

    // Add subtle floating effect
    const floatY = useMotionValue(0);
    const springFloatY = useSpring(floatY, { stiffness: 100, damping: 10 });

    useEffect(() => {
        // Automatic floating animation
        const interval = setInterval(() => {
            floatY.set(Math.random() * 6 - 3);
        }, 2000);

        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate normalized position relative to center
                const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 100;
                const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 100;

                x.set(moveX);
                y.set(moveY);

                setMousePosition({
                    x: moveX / 40, // Enhance the effect
                    y: moveY / 40
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
        };
    }, [x, y, floatY]);

    // User profile data
    const profiles = [
        {
            id: 1,
            name: "Sophia",
            age: 29,
            bio: "Adventure seeker and nature lover. Looking for someone who enjoys exploring the outdoors and meaningful conversations.",
            distance: "1.5 miles away",
            compatibility: 97,
            tags: ["Hiking", "Photography", "Yoga", "Travel"],
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
            verified: true,
            activeStatus: "Online now"
        }
    ];

    const [activeProfile, setActiveProfile] = useState(0);

    // Floating elements in green theme
    const FloatingElements = () => {
        const elements = Array.from({ length: 15 }, (_, i) => {
            const size = Math.random() * 8 + 4;
            const xPos = Math.random() * 100;
            const yPos = Math.random() * 100;
            const opacity = Math.random() * 0.15 + 0.05;
            const animationDuration = Math.random() * 15 + 20;
            const animationDelay = Math.random() * 5;
            const blur = Math.random() * 2 + 0.5;

            return (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0 ? 'bg-emerald-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-teal-400'}`}
                    style={{
                        width: size,
                        height: size,
                        left: `${xPos}%`,
                        top: `${yPos}%`,
                        opacity: opacity,
                        filter: `blur(${blur}px)`
                    }}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0, -10, 0],
                        opacity: [opacity, opacity * 2, opacity],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: animationDuration,
                        delay: animationDelay,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
            );
        });

        return <>{elements}</>;
    };

    const profile = profiles[activeProfile];

    // Generate app menu icons
    const AppMenu = () => {
        const menuItems = [
            { icon: <Heart size={18} />, active: false },
            { icon: <MessageCircle size={18} />, active: true, notification: 3 },
            { icon: <User size={18} />, active: false },
            { icon: <Bell size={18} />, active: false, notification: 1 }
        ];

        return (
            <div className="absolute bottom-0 left-0 right-0 z-30 px-6 py-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="flex justify-between items-center">
                    {menuItems.map((item, index) => (
                        <div key={index} className="relative">
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.active ? 'bg-gradient-to-tr from-emerald-600 to-green-500' : 'bg-white/15 backdrop-blur-md'}`}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <div className={`${item.active ? 'text-white' : 'text-white/80'}`}>
                                    {item.icon}
                                </div>
                            </motion.div>
                            {item.notification && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{item.notification}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Create subtle shine reflection effect for the device
    const Reflection = () => (
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[32px] z-30 pointer-events-none"
            initial={{ opacity: 0.4 }}
            animate={{
                opacity: [0.2, 0.1, 0.2],
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
    );

    return (
        <div className="relative w-full h-full flex justify-center items-center py-10" ref={containerRef}>
            {/* Desk surface reflection with green theme */}
            <div className="absolute w-[600px] h-[600px] bg-gradient-radial from-emerald-600/15 via-teal-500/5 to-transparent -bottom-72 blur-2xl"></div>
            <div className="absolute w-[400px] h-[400px] bg-gradient-radial from-green-500/10 via-emerald-400/5 to-transparent -bottom-60 left-1/2 transform -translate-x-1/2 blur-2xl"></div>

            {/* Ambient light glow */}
            <div className="absolute w-96 h-96 rounded-full bg-gradient-radial from-emerald-500/20 via-green-500/10 to-transparent blur-3xl"></div>

            {/* Phone container with enhanced 3D effects */}
            <motion.div
                className="relative z-10"
                style={{
                    transformStyle: 'preserve-3d',
                    transformPerspective: '1500px',
                    rotateX: springTiltX,
                    rotateY: springTiltY,
                    rotateZ: -15, // More dramatic rotation
                    y: springFloatY, // Add subtle floating
                }}
                initial={{ rotateX: rotateX, rotateY: rotateY }}
                whileHover={{ scale: 1.02, rotateZ: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Phone device with shadow */}
                <div className="relative w-80 transform-gpu">
                    {/* Multiple shadows for more dramatic effect */}
                    <div className="absolute inset-0 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(16,185,129,0.25),0_30px_60px_-30px_rgba(52,211,153,0.3)] -z-10 scale-[1.02] translate-y-3 opacity-80 blur-md"></div>
                    <div className="absolute inset-0 rounded-[40px] shadow-[0_50px_50px_-20px_rgba(0,0,0,0.5)] -z-10 scale-[1.03] translate-y-5 opacity-50 blur-lg"></div>

                    {/* Phone frame - more rounded corners */}
                    <div className="absolute inset-0 bg-[#0A0A0A] rounded-[40px] shadow-2xl border-[8px] border-[#1A1A1A] overflow-hidden"></div>

                    {/* Power button */}
                    <div className="absolute right-[-3px] top-[120px] w-[3px] h-[30px] bg-gray-800 rounded-r-md"></div>

                    {/* Volume buttons */}
                    <div className="absolute left-[-3px] top-[100px] w-[3px] h-[25px] bg-gray-800 rounded-l-md"></div>
                    <div className="absolute left-[-3px] top-[140px] w-[3px] h-[25px] bg-gray-800 rounded-l-md"></div>

                    {/* Camera bump */}
                    <div className="absolute top-[70px] right-[25px] w-3 h-24 bg-[#1d1d1d] rounded-full flex flex-col justify-around items-center p-1">
                        <div className="w-2 h-2 rounded-full bg-black ring-1 ring-emerald-400/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-emerald-400/30"></div>
                        <div className="w-2 h-2 rounded-full bg-black ring-1 ring-emerald-400/30"></div>
                    </div>

                    {/* Phone screen with rounded corners */}
                    <div className="relative w-full h-[640px] overflow-hidden rounded-[32px] z-10">
                        {/* Green gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                            {/* Subtle background texture */}
                            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                            }}></div>
                            <FloatingElements />

                            {/* Subtle glowing orbs */}
                            <motion.div
                                className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-30 blur-[80px]"
                                style={{
                                    background: 'radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(16,185,129,0) 70%)',
                                }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.4, 0.3],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />

                            <motion.div
                                className="absolute bottom-10 -left-20 w-[250px] h-[250px] rounded-full opacity-30 blur-[70px]"
                                style={{
                                    background: 'radial-gradient(circle, rgba(5,150,105,0.8) 0%, rgba(5,150,105,0) 70%)',
                                }}
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 10,
                                    delay: 1,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />
                        </div>

                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-0 w-full h-10 z-30 flex justify-center">
                            <motion.div
                                className="relative mx-auto mt-2 w-[120px] h-[32px] bg-black rounded-full flex items-center justify-center overflow-hidden"
                                animate={{ width: [120, 140, 120] }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", repeatDelay: 5 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-800 mr-1.5"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                                <motion.div
                                    className="absolute right-3 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                                />
                            </motion.div>
                        </div>

                        {/* Status bar */}
                        <div className="relative pt-12 px-6 flex justify-between items-center text-white z-20">
                            <div className="text-sm font-semibold">9:41</div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" />
                                    </svg>
                                </div>
                                <div className="text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 18h8" />
                                        <path d="M15 18h3" />
                                        <rect x="2" y="6" width="20" height="12" rx="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* App Header with green theme */}
                        <div className="px-6 pt-4 flex justify-between items-center">
                            <motion.div
                                className="text-xl font-bold"
                                animate={{
                                    background: ['linear-gradient(to right, #fff, #f5f5f5)', 'linear-gradient(to right, #f5f5f5, #fff)'],
                                }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                style={{
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                Nature<span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Match</span>
                            </motion.div>
                            <div className="flex gap-3">
                                <motion.button
                                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Settings size={18} className="text-white" />
                                </motion.button>
                                <motion.button
                                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Bell size={18} className="text-white" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Profile Card - Improved content visibility */}
                        <div className="px-4 py-4">
                            <motion.div
                                className="relative overflow-hidden shadow-xl rounded-3xl"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Card background */}
                                <div className="relative rounded-3xl overflow-hidden">
                                    {/* Profile Image - Clearly visible */}
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={profile.image}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Subtle image overlays that don't obscure the image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                        {/* Top info bar */}
                                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                                            {/* Verified badge */}
                                            {profile.verified && (
                                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                    <span className="text-xs font-medium text-white">Verified</span>
                                                </div>
                                            )}

                                            {/* Compatibility badge - green theme */}
                                            <motion.div
                                                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                                                animate={{
                                                    boxShadow: [
                                                        '0 0 0 0 rgba(16,185,129,0.4)',
                                                        '0 0 0 10px rgba(16,185,129,0)',
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatDelay: 1
                                                }}
                                            >
                                                <Sparkles size={14} className="text-emerald-200" />
                                                <span>{profile.compatibility}% Match</span>
                                            </motion.div>
                                        </div>

                                        {/* Bottom name overlay - clearly visible */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                                                        {profile.name}
                                                        <span className="text-xl font-medium text-white/90">{profile.age}</span>
                                                    </h3>
                                                    <p className="text-sm text-white/90 flex items-center gap-1.5 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                        {profile.distance}
                                                    </p>
                                                </div>

                                                {/* Active status */}
                                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full">
                                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                    <span className="text-xs font-medium text-white">{profile.activeStatus}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation dots */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                                            {[0, 1, 2, 3].map((dot, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Profile Info - Clean, readable text */}
                                    <div className="p-5 bg-white">
                                        <p className="text-gray-700 text-sm">
                                            {profile.bio}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {profile.tags.map((tag, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100"
                                                    whileHover={{
                                                        backgroundColor: 'rgba(16,185,129,0.2)',
                                                        scale: 1.05
                                                    }}
                                                >
                                                    {tag}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Action Buttons - green theme */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 px-6 z-20">
                            <motion.button
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg"
                                whileHover={{
                                    scale: 1.15,
                                    boxShadow: '0 0 15px 0 rgba(239, 68, 68, 0.5)',
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={26} className="text-red-400" />
                            </motion.button>

                            <motion.button
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg border border-emerald-400/30"
                                whileHover={{
                                    scale: 1.15,
                                    boxShadow: '0 0 20px 0 rgba(16,185,129,0.5)',
                                }}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    boxShadow: [
                                        '0 0 0 0 rgba(16,185,129,0.7)',
                                        '0 0 0 10px rgba(16,185,129,0)',
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                            >
                                <Heart size={30} className="text-white" />
                            </motion.button>

                            <motion.button
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg"
                                whileHover={{
                                    scale: 1.15,
                                    boxShadow: '0 0 15px 0 rgba(59, 130, 246, 0.5)',
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Star size={26} className="text-blue-400" />
                            </motion.button>
                        </div>

                        {/* App Menu */}
                        <AppMenu />

                        {/* Dynamic Notification */}
                        <motion.div
                            className="absolute -top-1 right-5 z-30"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-white/20">
                                <Bell size={16} className="text-emerald-200" />
                                <span className="text-sm font-medium">New Match!</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Screen subtle reflection effect */}
                    <Reflection />
                </div>

                {/* Enhanced reflections and shadows */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-72 h-16 bg-black/30 rounded-[50%] blur-xl -z-10 scale-x-[0.85]"></div>

                {/* Light reflections */}
                <motion.div
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-radial from-emerald-500/20 via-green-500/10 to-transparent blur-2xl -z-20"
                    animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                ></motion.div>
            </motion.div>
        </div>
    );
};

export default PhoneApp;