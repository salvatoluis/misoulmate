// src/components/AppPreview.tsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Download, Heart, Bell, ArrowRight, Check, ChevronRight, Mail } from 'lucide-react';

const AppPreview: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [activeScreen, setActiveScreen] = useState(0);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // App screens content
    const appScreens = [
        {
            id: 1,
            title: 'Discover',
            image: '/images/app-screen-1.jpg',
            description: 'Browse profiles that match your preferences and find your perfect match.'
        },
        {
            id: 2,
            title: 'Connect',
            image: '/images/app-screen-2.jpg',
            description: 'Start meaningful conversations with our intelligent conversation starters.'
        },
        {
            id: 3,
            title: 'Meet',
            image: '/images/app-screen-3.jpg',
            description: 'Plan and schedule your dates with our integrated calendar and suggestions.'
        }
    ];

    // For 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-300, 300], [10, -10]);
    const rotateY = useTransform(x, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = sectionRef.current ? (sectionRef.current as HTMLElement).getBoundingClientRect() : null;
        if (rect) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center
            const moveX = (e.clientX - centerX) / 5;
            const moveY = (e.clientY - centerY) / 5;

            x.set(moveX);
            y.set(moveY);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Handle email submission for waitlist
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubscribed(true);

            // Reset subscription state after a while
            setTimeout(() => {
                setEmail('');
            }, 3000);
        }, 1500);
    };

    // Switch to the next screen every 3 seconds
    React.useEffect(() => {
        if (!isInView) return;

        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % appScreens.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isInView, appScreens.length]);

    return (
        <section
            id="app-preview"
            className="py-24 bg-gradient-to-b from-white to-[#F5F7FF] relative overflow-hidden"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gradient orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,129,0.4) 0%, rgba(255,107,129,0) 70%)' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -20, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                <motion.div
                    className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(168,224,215,0.4) 0%, rgba(168,224,215,0) 70%)' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left column: App info and waitlist */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="order-2 md:order-1"
                    >
                        {/* Coming Soon Tag */}
                        <motion.div
                            className="inline-flex items-center bg-gradient-to-r from-[#FF6B81]/10 to-[#A8E0D7]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FF6B81]/20 mb-6"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Bell size={16} className="text-[#FF6B81] mr-2" />
                            <span className="text-sm font-medium text-[#2B2B2A]">Coming Soon</span>
                        </motion.div>

                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-6 text-[#2B2B2A]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            Take HeartMatch Everywhere
                        </motion.h2>

                        <motion.p
                            className="text-lg text-gray-600 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            Our mobile app is almost ready! Get notifications, send messages, and never miss an opportunity to connect with your matches wherever you go.
                        </motion.p>

                        {/* Feature list */}
                        <motion.div
                            className="space-y-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            {appScreens.map((screen, index) => (
                                <motion.div
                                    key={screen.id}
                                    className={`flex items-start p-3 rounded-xl transition-colors duration-300 ${activeScreen === index ? 'bg-gradient-to-r from-[#FF6B81]/5 to-transparent' : 'hover:bg-gray-50'}`}
                                    whileHover={{ x: 5 }}
                                    onMouseEnter={() => setActiveScreen(index)}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index === 0 ? 'from-[#FF6B81] to-[#FF8A9A]' : index === 1 ? 'from-[#A8E0D7] to-[#7DCCBF]' : 'from-[#FFE066] to-[#FFCB45]'} flex items-center justify-center shrink-0 mr-4`}>
                                        <span className="text-white font-medium">{screen.id}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#2B2B2A]">{screen.title}</h3>
                                        <p className="text-gray-600 text-sm">{screen.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Join Waitlist */}
                        <motion.div
                            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/80 shadow-lg mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            <h3 className="text-lg font-bold mb-3 text-[#2B2B2A]">Join the Waitlist</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Be the first to know when the app launches and get priority access plus exclusive perks.
                            </p>

                            <AnimatePresence mode="wait">
                                {isSubscribed ? (
                                    <motion.div
                                        className="flex items-center text-[#A8E0D7] font-medium"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <Check size={20} className="mr-2" />
                                        <span>Thanks! You're on the waitlist!</span>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        className="flex gap-2"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="relative flex-grow">
                                            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="Your email address"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#FF6B81] focus:ring-2 focus:ring-[#FF6B81]/20 transition-all duration-300 outline-none"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <motion.button
                                            type="submit"
                                            className={`bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-6 py-3 rounded-xl font-medium shadow-md whitespace-nowrap ${isSubmitting ? 'opacity-70' : ''}`}
                                            whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(255, 107, 129, 0.4)' }}
                                            whileTap={{ scale: 0.97 }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* App store badges - disabled but visually present */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 opacity-50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                        >
                            <div className="group relative">
                                <motion.button
                                    className="bg-[#2B2B2A] text-white/80 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                    whileHover={{ scale: 1 }}
                                >
                                    <Download size={20} />
                                    <span>App Store</span>
                                </motion.button>
                                <div className="absolute -top-10 left-0 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Coming soon
                                </div>
                            </div>

                            <div className="group relative">
                                <motion.button
                                    className="bg-[#2B2B2A] text-white/80 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                    whileHover={{ scale: 1 }}
                                >
                                    <Download size={20} />
                                    <span>Google Play</span>
                                </motion.button>
                                <div className="absolute -top-10 left-0 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Coming soon
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right column: Phone mockup */}
                    <motion.div
                        className="flex justify-center md:order-2 order-1"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <div className="relative">
                            {/* 3D Phone container */}
                            <motion.div
                                className="relative z-10"
                                style={{
                                    perspective: '1000px',
                                    transformStyle: 'preserve-3d',
                                    rotateX,
                                    rotateY
                                }}
                            >
                                {/* Coming Soon Tag */}
                                <motion.div
                                    className="absolute -top-6 -right-6 z-30 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-1 whitespace-nowrap border-2 border-white"
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={isInView ? {
                                        scale: 1,
                                        rotate: 0
                                    } : { scale: 0, rotate: -10 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                        delay: 0.8
                                    }}
                                >
                                    <Bell size={14} className="animate-pulse" />
                                    Coming Soon
                                </motion.div>

                                {/* Phone mockup */}
                                <motion.div
                                    className="relative z-20 w-72 ios-mockup"
                                    initial={{ y: 50 }}
                                    animate={isInView ? {
                                        y: [0, -15, 0],
                                        transition: {
                                            y: {
                                                duration: 4,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                ease: "easeInOut"
                                            }
                                        }
                                    } : { y: 50 }}
                                >
                                    {/* Phone frame */}
                                    <div className="relative">
                                        {/* Phone hardware frame */}
                                        <div className="w-full h-full absolute top-0 left-0 z-30 pointer-events-none">
                                            <img
                                                src="/images/phone-frame.png"
                                                alt="Phone frame"
                                                className="w-full h-auto"
                                            />
                                        </div>

                                        {/* Screen container */}
                                        <div className="rounded-[38px] overflow-hidden bg-black border-8 border-[#2B2B2A] relative aspect-[9/19] shadow-2xl">
                                            {/* App screens carousel */}
                                            <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1c1c1e] to-[#2c1e26]">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={activeScreen}
                                                        className="absolute inset-0"
                                                        initial={{ opacity: 0, scale: 1.1 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <img
                                                            src={appScreens[activeScreen].image || `/images/app-screen-${activeScreen + 1}.jpg`}
                                                            alt={appScreens[activeScreen].title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                </AnimatePresence>

                                                {/* App UI overlay elements */}
                                                <div className="absolute inset-0 pointer-events-none">
                                                    {/* Status bar */}
                                                    <div className="h-10 w-full px-5 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent">
                                                        <div className="text-white text-xs">9:41 AM</div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-4 h-4 rounded-full bg-white/90"></div>
                                                            <div className="w-4 h-4 rounded-full bg-white/90"></div>
                                                        </div>
                                                    </div>

                                                    {/* App screen indicator dots */}
                                                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1">
                                                        {appScreens.map((_, index) => (
                                                            <motion.div
                                                                key={index}
                                                                className={`h-1.5 rounded-full ${index === activeScreen ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                                                                animate={{
                                                                    width: index === activeScreen ? 24 : 6,
                                                                    opacity: index === activeScreen ? 1 : 0.4
                                                                }}
                                                                transition={{ duration: 0.3 }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification bubbles around the phone */}
                                    <motion.div
                                        className="absolute -top-4 -right-3 z-40 bg-white rounded-full p-2 shadow-lg border border-gray-200"
                                        initial={{ scale: 0 }}
                                        animate={isInView ? {
                                            scale: [0, 1.1, 1],
                                            transition: {
                                                delay: 1,
                                                duration: 0.5,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }
                                        } : { scale: 0 }}
                                    >
                                        <Heart size={16} className="text-[#FF6B81]" fill="#FF6B81" />
                                    </motion.div>

                                    <motion.div
                                        className="absolute top-1/4 -left-6 z-40 bg-gradient-to-r from-[#A8E0D7] to-[#7DCCBF] rounded-lg px-3 py-1.5 shadow-lg text-white text-sm"
                                        initial={{ scale: 0, x: 20 }}
                                        animate={isInView ? {
                                            scale: [0, 1.1, 1],
                                            x: 0,
                                            transition: {
                                                delay: 1.2,
                                                duration: 0.5,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }
                                        } : { scale: 0, x: 20 }}
                                    >
                                        98% Match!
                                    </motion.div>

                                    <motion.div
                                        className="absolute bottom-1/4 -right-6 z-40 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-100 flex items-center"
                                        initial={{ scale: 0, x: -20 }}
                                        animate={isInView ? {
                                            scale: [0, 1.1, 1],
                                            x: 0,
                                            transition: {
                                                delay: 1.4,
                                                duration: 0.5,
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15
                                            }
                                        } : { scale: 0, x: -20 }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                                        <div className="text-xs">
                                            <div className="font-bold">New Message</div>
                                            <div className="text-gray-500">Hey! How are...</div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Glow effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-[#FF6B81]/20 to-[#A8E0D7]/20 blur-3xl -z-10 opacity-70"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom decorative ellipse */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F0F4FF] to-transparent -z-10"></div>
        </section>
    );
};

export default AppPreview;