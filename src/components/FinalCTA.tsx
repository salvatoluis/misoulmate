// src/components/FinalCTA.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Send, ArrowRight, Check, Mail, UserPlus, X } from 'lucide-react';

const FinalCTA: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    // For parallax effect on hover
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const backgroundX = useTransform(x, [-200, 200], [10, -10]);
    const backgroundY = useTransform(y, [-200, 200], [10, -10]);

    // Handle mouse movement for parallax effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = sectionRef.current ? (sectionRef.current as HTMLElement).getBoundingClientRect() : null;
        if (rect) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center
            const moveX = (e.clientX - centerX) / 25;
            const moveY = (e.clientY - centerY) / 25;

            x.set(moveX);
            y.set(moveY);

            // Update mouse position for gradient spotlight effect
            setMousePosition({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height
            });
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset email after longer delay (success message stays visible)
            setTimeout(() => {
                setEmail('');
            }, 5000);
        }, 1500);
    };

    // Reset success state if user changes email after success
    useEffect(() => {
        if (isSuccess && email.length > 0) {
            setIsSuccess(false);
        }
    }, [email, isSuccess]);

    // Animated floating hearts generator
    const FloatingHearts = () => {
        return (
            <>
                {[...Array(12)].map((_, i) => {
                    const size = Math.random() * 25 + 10;
                    const duration = Math.random() * 15 + 10;
                    const initialX = Math.random() * 100;
                    const initialScale = Math.random() * 0.8 + 0.2;
                    const initialRotate = Math.random() * 180 - 90;
                    const opacity = Math.random() * 0.5 + 0.1;

                    return (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${initialX}%`,
                                bottom: "-10%",
                                opacity
                            }}
                            initial={{ y: 0, scale: initialScale, rotate: initialRotate }}
                            animate={{
                                y: "-110vh",
                                rotate: [initialRotate, initialRotate + 20, initialRotate - 20, initialRotate],
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.5
                            }}
                        >
                            <Heart size={size} fill="white" className="text-white" />
                        </motion.div>
                    );
                })}
            </>
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <motion.section
            ref={sectionRef}
            className="py-24 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Dynamic gradient background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#FF6B81] via-[#D86D72] to-[#A8E0D7] z-0"
                style={{
                    backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                    x: backgroundX,
                    y: backgroundY,
                }}
            >
                {/* Animated overlay pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] bg-repeat opacity-10"></div>

                {/* Radial spotlight effect that follows mouse */}
                <div
                    className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)`,
                    }}
                ></div>

                {/* Floating animated hearts */}
                <div className="absolute inset-0 overflow-hidden">
                    <FloatingHearts />
                </div>
            </motion.div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    className="max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Content card with glass effect */}
                    <motion.div
                        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden"
                        variants={itemVariants}
                    >
                        {/* Decorative elements */}
                        <motion.div
                            className="absolute top-6 right-6 text-white/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Heart size={60} />
                        </motion.div>

                        <motion.div
                            className="absolute bottom-6 left-6 text-white/20"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        >
                            <Heart size={80} />
                        </motion.div>

                        {/* Icon with animation */}
                        <motion.div
                            className="w-20 h-20 mx-auto mb-6 relative"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="absolute inset-0 bg-white/20 rounded-full blur-md"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            ></motion.div>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <UserPlus size={32} className="text-white" />
                            </motion.div>
                        </motion.div>

                        {/* Heading with gradient text */}
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            variants={itemVariants}
                        >
                            Ready to Find Your Match?
                        </motion.h2>

                        {/* Underline accent */}
                        <motion.div
                            className="h-1 w-24 bg-white/30 rounded-full mx-auto mb-6"
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 96 } : { width: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        />

                        <motion.p
                            className="text-xl mb-10 max-w-2xl mx-auto text-white/90"
                            variants={itemVariants}
                        >
                            Join thousands of singles already on HeartMatch. Your perfect match could be just a click away.
                        </motion.p>

                        {/* Form with animated states */}
                        <motion.div
                            className="max-w-xl mx-auto"
                            variants={itemVariants}
                        >
                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-white flex items-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="bg-green-500 rounded-full p-2 mr-4">
                                            <Check size={24} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg">Thank you for joining!</h3>
                                            <p className="text-white/80">Check your email for next steps and exclusive offers.</p>
                                        </div>
                                        <motion.button
                                            className="ml-auto bg-white/20 rounded-full p-2"
                                            onClick={() => setIsSuccess(false)}
                                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X size={18} className="text-white" />
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        className="flex flex-col sm:flex-row gap-3"
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative flex-grow">
                                            <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                                            <motion.input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60"
                                                required
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                        <motion.button
                                            type="submit"
                                            className={`px-8 py-4 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
                                            style={{
                                                background: 'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.2))'
                                            }}
                                            whileHover={{
                                                scale: 1.03,
                                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                                            }}
                                            whileTap={{ scale: 0.97 }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <motion.div
                                                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                            ) : (
                                                <>
                                                    <span className="text-white">Join Free</span>
                                                    <ArrowRight size={16} className="text-white" />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {/* Feature badges */}
                            <motion.div
                                className="flex flex-wrap justify-center gap-2 mt-8"
                                variants={itemVariants}
                            >
                                {['Instant Access', 'Free to Join', 'Cancel Anytime'].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80 border border-white/10 flex items-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={isInView ? {
                                            opacity: 1,
                                            y: 0,
                                            transition: { delay: 0.8 + (i * 0.1) }
                                        } : {}}
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                                    >
                                        <Check size={12} className="mr-1 text-white" />
                                        {feature}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Trust signals */}
                    <motion.div
                        className="mt-8 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-white/70 text-sm">
                            Trusted by over 1M+ users worldwide • SSL Secured • Privacy Protected
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default FinalCTA;