// src/components/HowItWorks.tsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Edit3, Search, MessageCircle, ArrowRight, Heart, Check, UserPlus } from 'lucide-react';
import { ProcessStep } from '../types';

const HowItWorks: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [hoverStep, setHoverStep] = useState<number | null>(null);

    // Expanded details for each step
    const stepDetails = [
        {
            id: 1,
            title: 'Create Profile',
            description: 'Set up your profile with photos and details about yourself and what you\'re looking for.',
            icon: <Edit3 size={28} />,
            color: 'from-[#FF6B81] to-[#FF8A9A]',
            detailedDescription: 'Upload your best photos, answer personality questions, and share your interests. Our AI helps optimize your profile for better matches.',
            iconBg: 'bg-gradient-to-br from-[#FF6B81] to-[#FF8A9A]'
        },
        {
            id: 2,
            title: 'Find Matches',
            description: 'Browse potential matches or let our algorithm suggest people based on compatibility.',
            icon: <Search size={28} />,
            color: 'from-[#A8E0D7] to-[#7DCCBF]',
            detailedDescription: 'Our smart algorithm learns your preferences as you browse. Filter by interests, distance, and more to find your perfect match.',
            iconBg: 'bg-gradient-to-br from-[#A8E0D7] to-[#7DCCBF]'
        },
        {
            id: 3,
            title: 'Connect & Chat',
            description: 'Start conversations with your matches and begin your journey together.',
            icon: <MessageCircle size={28} />,
            color: 'from-[#FFE066] to-[#FFCB45]',
            detailedDescription: 'Send messages, photos, voice notes, or start a video call. Our conversation starters help break the ice with new matches.',
            iconBg: 'bg-gradient-to-br from-[#FFE066] to-[#FFCB45]'
        }
    ];

    const headingWords = "How HeartMatch Works".split(' ');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            }
        }
    };

    const wordVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.33, 1, 0.68, 1],
            }
        })
    };

    const lineVariants = {
        hidden: { width: '0%' },
        visible: {
            width: '100%',
            transition: {
                duration: 1.2,
                ease: [0.33, 1, 0.68, 1],
                delay: 0.8
            }
        }
    };

    const StepCard: React.FC<{ step: typeof stepDetails[0]; index: number }> = ({ step, index }) => {
        const cardRef = useRef(null);
        const cardInView = useInView(cardRef, { once: true, amount: 0.5 });
        const isHovered = hoverStep === step.id;
        const isActive = activeStep === step.id;

        // For 3D tilt effect
        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const rotateX = useTransform(y, [-100, 100], [5, -5]);
        const rotateY = useTransform(x, [-100, 100], [-5, 5]);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const card = cardRef.current as HTMLElement | null;
            if (card) {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate distance from center (normalized to -100 to 100)
                const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 100;
                const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 100;

                x.set(moveX);
                y.set(moveY);
            }
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        return (
            <motion.div
                ref={cardRef}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={cardInView ? {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.7,
                        delay: 0.3 + (index * 0.2),
                        ease: [0.25, 0.1, 0.25, 1]
                    }
                } : {}}
                onMouseEnter={() => setHoverStep(step.id)}
                onMouseLeave={() => setHoverStep(null)}
                onClick={() => setActiveStep(isActive ? null : step.id)}
            >
                {/* Main step card */}
                <motion.div
                    className={`relative rounded-3xl p-6 overflow-hidden cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: 'preserve-3d',
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    {/* Card background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border border-white/80 shadow-lg rounded-3xl overflow-hidden"
                        initial={{ borderRadius: 24 }}
                        animate={{
                            borderRadius: 24,
                            boxShadow: isHovered || isActive
                                ? '0 20px 30px rgba(0, 0, 0, 0.1)'
                                : '0 10px 20px rgba(0, 0, 0, 0.05)'
                        }}
                    />

                    {/* Card content */}
                    <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
                        {/* Step number with icon */}
                        <div className="flex flex-col sm:flex-row items-center mb-4 relative">
                            <motion.div
                                className={`${step.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative mb-4 sm:mb-0 sm:mr-4`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    transition: { delay: 0.5 + (index * 0.2), duration: 0.5 }
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                            >
                                <motion.div className="text-white">
                                    {step.icon}
                                </motion.div>

                                {/* Small decorative circles */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-70"
                                        style={{
                                            top: `${25 + (i * 25)}%`,
                                            left: `${85 - (i * 5)}%`,
                                        }}
                                        animate={isHovered || isActive ? {
                                            opacity: [0.4, 0.8, 0.4],
                                            scale: [1, 1.3, 1],
                                            transition: {
                                                duration: 1.5,
                                                delay: i * 0.2,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }
                                        } : {}}
                                    />
                                ))}
                            </motion.div>

                            <div className="text-center sm:text-left">
                                <motion.div
                                    className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.6 + (index * 0.2) } }}
                                >
                                    Step {step.id}
                                </motion.div>
                                <motion.h3
                                    className="text-xl font-bold mb-1 text-gray-800"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.7 + (index * 0.2), duration: 0.4 }
                                    }}
                                >
                                    {step.title}
                                </motion.h3>
                            </div>
                        </div>

                        {/* Description */}
                        <motion.p
                            className="text-gray-600 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { delay: 0.8 + (index * 0.2), duration: 0.5 }
                            }}
                        >
                            {step.description}
                        </motion.p>

                        {/* Expandable content */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                        transition: {
                                            height: { duration: 0.4 },
                                            opacity: { duration: 0.6, delay: 0.2 }
                                        }
                                    }}
                                    exit={{
                                        height: 0,
                                        opacity: 0,
                                        transition: {
                                            height: { duration: 0.3 },
                                            opacity: { duration: 0.2 }
                                        }
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-gray-600 mb-4">{step.detailedDescription}</p>

                                        {/* Feature bullets */}
                                        <ul className="space-y-2">
                                            {[
                                                "Personalized recommendations",
                                                "Smart filtering options",
                                                "Privacy controls"
                                            ].map((feature, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="flex items-center text-gray-600"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                        transition: { delay: 0.3 + (i * 0.1) }
                                                    }}
                                                >
                                                    <Check size={16} className={`mr-2 ${i === 0 ? 'text-[#FF6B81]' : i === 1 ? 'text-[#A8E0D7]' : 'text-[#FFE066]'}`} />
                                                    {feature}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* Learn more link */}
                                        <motion.div
                                            className="mt-4 inline-flex items-center text-[#FF6B81] font-medium cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            Learn more <ArrowRight size={16} className="ml-1" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Show more/less button */}
                        <motion.button
                            className={`mt-3 text-sm font-medium flex items-center ${isActive ? 'text-gray-500' : 'text-[#FF6B81]'}`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { delay: 1 + (index * 0.2) }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isActive ? 'Show less' : 'Show more'}
                            <motion.div
                                animate={{ rotate: isActive ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-1"
                            >
                                <ArrowRight size={14} className={isActive ? "rotate-90" : ""} />
                            </motion.div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Step counter badge */}
                <motion.div
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-20 border-2 border-white"
                    style={{ background: `linear-gradient(to bottom right, ${step.color.split(' ')[1]}, ${step.color.split(' ')[3]})` }}
                    initial={{ scale: 0 }}
                    animate={{
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            delay: 0.9 + (index * 0.2)
                        }
                    }}
                >
                    <span className="text-white font-bold text-sm">{step.id}</span>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <section
            id="how-it-works"
            className="py-24 bg-gradient-to-b from-white to-[#FFF9F0] relative overflow-hidden"
            ref={sectionRef}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Subtle gradient background accents */}
                <motion.div
                    className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[80px]"
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
                    className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[80px]"
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

                {/* Floating hearts */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            top: `${10 + (i * 20)}%`,
                            left: `${5 + (i * 20)}%`,
                            opacity: 0.07,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                            transition: {
                                duration: 5 + i,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.5
                            }
                        }}
                    >
                        <Heart size={20 + (i * 5)} />
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                >
                    {/* Animated heading */}
                    <div className="inline-flex flex-wrap justify-center gap-2 mb-2">
                        {headingWords.map((word, i) => (
                            <motion.span
                                key={i}
                                className="inline-block"
                                custom={i}
                                variants={wordVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                            >
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2B2B2A] to-[#555]">
                                    {word}
                                </span>
                            </motion.span>
                        ))}
                    </div>

                    {/* Underline accent */}
                    <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-[#FF6B81] to-[#A8E0D7] rounded-full mx-auto mb-8"
                        initial={{ width: 0, opacity: 0 }}
                        animate={isInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    />

                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        Finding your perfect match is easy with our simple three-step process.
                    </motion.p>
                </motion.div>

                {/* Process steps with glowing connection line */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Animated connection line */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden md:flex items-center justify-between px-24 z-0">
                        <motion.div
                            className="h-1 w-full bg-gradient-to-r from-[#FF6B81] via-[#A8E0D7] to-[#FFE066] rounded-full"
                            variants={lineVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            {/* Animated glow effect */}
                            <motion.div
                                className="absolute top-0 left-0 h-full w-20 bg-white opacity-50 blur-sm"
                                animate={{
                                    x: ["0%", "100%"],
                                    opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {stepDetails.map((step, index) => (
                            <StepCard key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </div>

                {/* Call to action */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                >
                    <motion.button
                        className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-8 py-3.5 rounded-full font-medium shadow-md inline-flex items-center group"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 15px 30px rgba(255, 107, 129, 0.2)',
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserPlus size={18} className="mr-2" />
                        <span>Create Your Profile</span>
                        <motion.div
                            className="ml-2"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowRight size={18} />
                        </motion.div>
                    </motion.button>

                    <motion.p
                        className="text-gray-500 mt-4"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        Join thousands of singles finding love today
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;