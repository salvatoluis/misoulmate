import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Download, Heart, Bell, Check, Mail } from 'lucide-react';

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
                <div
                    className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,129,0.4) 0%, rgba(255,107,129,0) 70%)' }}
                />

                <div
                    className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(168,224,215,0.4) 0%, rgba(168,224,215,0) 70%)' }}
                />

                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div
                        className="order-2 md:order-1"
                    >
                        <div
                            className="inline-flex items-center bg-gradient-to-r from-[#FF6B81]/10 to-[#A8E0D7]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FF6B81]/20 mb-6"
                        >
                            <Bell size={16} className="text-[#FF6B81] mr-2" />
                            <span className="text-sm font-medium text-[#2B2B2A]">Coming Soon</span>
                        </div>

                        <h2
                            className="text-4xl md:text-5xl font-bold mb-6 text-[#2B2B2A]"
                        >
                            Take HeartMatch Everywhere
                        </h2>

                        <p
                            className="text-lg text-gray-600 mb-8"
                        >
                            Our mobile app is almost ready! Get notifications, send messages, and never miss an opportunity to connect with your matches wherever you go.
                        </p>

                        {/* Feature list */}
                        <div
                            className="space-y-4 mb-8"
                        >
                            {appScreens.map((screen, index) => (
                                <div
                                    key={screen.id}
                                    className={`flex items-start p-3 rounded-xl transition-colors duration-300 ${activeScreen === index ? 'bg-gradient-to-r from-[#FF6B81]/5 to-transparent' : 'hover:bg-gray-50'}`}
                                    onMouseEnter={() => setActiveScreen(index)}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index === 0 ? 'from-[#FF6B81] to-[#FF8A9A]' : index === 1 ? 'from-[#A8E0D7] to-[#7DCCBF]' : 'from-[#FFE066] to-[#FFCB45]'} flex items-center justify-center shrink-0 mr-4`}>
                                        <span className="text-white font-medium">{screen.id}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#2B2B2A]">{screen.title}</h3>
                                        <p className="text-gray-600 text-sm">{screen.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Join Waitlist */}
                        <div
                            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/80 shadow-lg mb-8"
                        >
                            <h3 className="text-lg font-bold mb-3 text-[#2B2B2A]">Join the Waitlist</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Be the first to know when the app launches and get priority access plus exclusive perks.
                            </p>

                            <AnimatePresence mode="wait">
                                {isSubscribed ? (
                                    <div
                                        className="flex items-center text-[#A8E0D7] font-medium"
                                    >
                                        <Check size={20} className="mr-2" />
                                        <span>Thanks! You're on the waitlist!</span>
                                    </div>
                                ) : (
                                    <form
                                        className="flex gap-2"
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
                                        <button
                                            type="submit"
                                            className={`bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-6 py-3 rounded-xl font-medium shadow-md whitespace-nowrap ${isSubmitting ? 'opacity-70' : ''}`}
                                        >
                                            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* App store badges - disabled but visually present */}
                        <div
                            className="flex flex-col sm:flex-row gap-4 opacity-50"
                        >
                            <div className="group relative">
                                <button
                                    className="bg-[#2B2B2A] text-white/80 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <Download size={20} />
                                    <span>App Store</span>
                                </button>
                                <div className="absolute -top-10 left-0 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Coming soon
                                </div>
                            </div>

                            <div className="group relative">
                                <button
                                    className="bg-[#2B2B2A] text-white/80 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <Download size={20} />
                                    <span>Google Play</span>
                                </button>
                                <div className="absolute -top-10 left-0 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Coming soon
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column: Phone mockup */}
                    <div
                        className="flex justify-center md:order-2 order-1"
                    >
                        <div className="relative">
                            {/* 3D Phone container */}
                            <div
                                className="relative z-10"
                                style={{
                                    perspective: '1000px',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Coming Soon Tag */}
                                <div
                                    className="absolute -top-6 -right-6 z-30 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-1 whitespace-nowrap border-2 border-white"

                                >
                                    <Bell size={14} className="animate-pulse" />
                                    Coming Soon
                                </div>

                                <div
                                    className="relative z-20 w-72 ios-mockup"
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
                                                    <div
                                                        key={activeScreen}
                                                        className="absolute inset-0"
                                                    >
                                                        <img
                                                            src={appScreens[activeScreen].image || `/images/app-screen-${activeScreen + 1}.jpg`}
                                                            alt={appScreens[activeScreen].title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
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
                                                            <div
                                                                key={index}
                                                                className={`h-1.5 rounded-full ${index === activeScreen ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}

                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification bubbles around the phone */}
                                    <div
                                        className="absolute -top-4 -right-3 z-40 bg-white rounded-full p-2 shadow-lg border border-gray-200"
                                    >
                                        <Heart size={16} className="text-[#FF6B81]" fill="#FF6B81" />
                                    </div>

                                    <div
                                        className="absolute top-1/4 -left-6 z-40 bg-gradient-to-r from-[#A8E0D7] to-[#7DCCBF] rounded-lg px-3 py-1.5 shadow-lg text-white text-sm"
                                    >
                                        98% Match!
                                    </div>

                                    <div
                                        className="absolute bottom-1/4 -right-6 z-40 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-100 flex items-center"

                                    >
                                        <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                                        <div className="text-xs">
                                            <div className="font-bold">New Message</div>
                                            <div className="text-gray-500">Hey! How are...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-[#FF6B81]/20 to-[#A8E0D7]/20 blur-3xl -z-10 opacity-70"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative ellipse */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F0F4FF] to-transparent -z-10"></div>
        </section>
    );
};

export default AppPreview;