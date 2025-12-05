import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, ArrowRight, Check, UserPlus, BookOpen, Coffee, Heart } from 'lucide-react';

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [hoverStep, setHoverStep] = useState<number | null>(null);

    // Expanded details for each step
    const stepDetails = [
        {
            id: 1,
            title: 'Complete Your Profile',
            description: 'Create a profile that showcases your personality and relationship goals.',
            icon: <BookOpen size={24} />,
            color: 'from-primary to-primary',
            detailedDescription: 'Our personality assessment helps us understand your core values and preferences for meaningful matches.',
            iconBg: 'bg-gradient-to-br from-primary to-primary',
            features: [
                'Personality assessment',
                'Values exploration'
            ]
        },
        {
            id: 2,
            title: 'Discover Matches',
            description: 'Our algorithm suggests compatible individuals based on your values and goals.',
            icon: <Search size={24} />,
            color: 'from-teal-600 to-teal-500',
            detailedDescription: 'Focus on quality connections with matches who share your vision for life.',
            iconBg: 'bg-gradient-to-br from-teal-600 to-teal-500',
            features: [
                'Value-based matching',
                'Compatibility assessment'
            ]
        },
        {
            id: 3,
            title: 'Connect & Chat',
            description: 'Build connections through messaging and conversation tools.',
            icon: <MessageCircle size={24} />,
            color: 'from-primary to-primary',
            detailedDescription: 'Use conversation starters and progress naturally from messaging to video calls.',
            iconBg: 'bg-gradient-to-br from-primary to-primary',
            features: [
                'Conversation starters',
                'Messaging & video calls'
            ]
        },
        {
            id: 4,
            title: 'Meet in Person',
            description: 'Plan your first date with our tools and safety guidance.',
            icon: <Coffee size={24} />,
            color: 'from-amber-500 to-amber-400',
            detailedDescription: 'Get venue suggestions and safety tips for comfortable first meetings.',
            iconBg: 'bg-gradient-to-br from-amber-500 to-amber-400',
            features: [
                'Venue suggestions',
                'Safety protocols'
            ]
        }
    ];

    const headingWords = "How Soulmatify Works".split(' ');

    const wordVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i: any) => ({
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

    type StepDetail = typeof stepDetails[number];
    interface StepCardProps {
        step: StepDetail;
        index: number;
    }
    const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
        const cardRef = useRef(null);
        const cardInView = useInView(cardRef, { once: true, amount: 0.5 });
        const isHovered = hoverStep === step.id;
        const isActive = activeStep === step.id;

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
                    <div className="relative z-10">
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
                                    className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.6 + (index * 0.2) } }}
                                >
                                    Step {step.id}
                                </motion.div>
                                <motion.h3
                                    className="text-xl font-bold mb-1 text-slate-800"
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
                            className="text-slate-600 mt-2"
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
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-slate-600 mb-4">{step.detailedDescription}</p>

                                        {/* Feature bullets */}
                                        <ul className="space-y-2">
                                            {step.features.map((feature, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="flex items-center text-slate-600"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                        transition: { delay: 0.3 + (i * 0.1) }
                                                    }}
                                                >
                                                    <Check size={16} className={`mr-2 ${index === 0 ? 'text-primary' :
                                                        index === 1 ? 'text-teal-500' :
                                                            index === 2 ? 'text-primary' :
                                                                'text-amber-500'
                                                        }`} />
                                                    {feature}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* Learn more link */}
                                        <motion.div
                                            className={`mt-4 inline-flex items-center font-medium cursor-pointer ${index === 0 ? 'text-primary' :
                                                index === 1 ? 'text-teal-600' :
                                                    index === 2 ? 'text-primary' :
                                                        'text-amber-600'
                                                }`}
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
                            className={`mt-3 text-sm font-medium flex items-center ${isActive ? 'text-slate-500' : index === 0 ? 'text-primary' :
                                index === 1 ? 'text-teal-600' :
                                    index === 2 ? 'text-primary' :
                                        'text-amber-600'}`}
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
                    style={{
                        background: `linear-gradient(to bottom right, ${index === 0 ? 'var(--tw-gradient-from-primary), var(--tw-gradient-to-primary)' :
                            index === 1 ? 'var(--tw-gradient-from-teal-600), var(--tw-gradient-to-teal-500)' :
                                index === 2 ? 'var(--tw-gradient-from-primary), var(--tw-gradient-to-primary)' :
                                    'var(--tw-gradient-from-amber-500), var(--tw-gradient-to-amber-400)'
                            })`
                    }}
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

    // Journey stages for the bottom section
    const journeyStages = [
        { name: "Profile Creation", icon: <UserPlus size={18} className="text-primary" />, time: "Day 1", color: "bg-green-100 text-primary" },
        { name: "Discover Matches", icon: <Search size={18} className="text-teal-500" />, time: "Days 2-7", color: "bg-teal-100 text-teal-600" },
        { name: "Meaningful Conversations", icon: <MessageCircle size={18} className="text-primary" />, time: "Weeks 1-3", color: "bg-green-100 text-primary" },
        { name: "First Meeting", icon: <Coffee size={18} className="text-amber-500" />, time: "Weeks 2-4", color: "bg-amber-100 text-amber-600" },
        { name: "Relationship Building", icon: <Heart size={18} className="text-emerald-500" />, time: "Ongoing", color: "bg-emerald-100 text-emerald-600" }
    ];

    return (
        <section
            id="how-it-works"
            className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
            ref={sectionRef}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Subtle gradient background accents */}
                <motion.div
                    className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[80px]"
                    style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(79,70,229,0) 70%)' }}
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
                    style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, rgba(20,184,166,0) 70%)' }}
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
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                                    {word}
                                </span>
                            </motion.span>
                        ))}
                    </div>

                    {/* Underline accent */}
                    <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-primary to-teal-500 rounded-full mx-auto mb-8"
                        initial={{ width: 0, opacity: 0 }}
                        animate={isInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    />

                    <motion.p
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        Four simple steps to finding your compatible partner.
                    </motion.p>
                </motion.div>

                {/* Process steps with glowing connection line */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Animated connection line */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden md:flex items-center justify-between px-24 z-0">
                        <motion.div
                            className="h-1 w-full bg-gradient-to-r from-primary via-teal-500 to-amber-500 rounded-full"
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {stepDetails.map((step, index) => (
                            <StepCard key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </div>

                {/* Relationship journey timeline */}
                <motion.div
                    className="mt-20 bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white shadow-lg max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                >
                    <h3 className="text-2xl font-bold mb-6 text-slate-800 text-center">Your Journey to Meaningful Connection</h3>

                    <div className="relative">
                        {/* Timeline connector */}
                        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {journeyStages.map((stage, index) => (
                                <motion.div
                                    key={index}
                                    className="relative flex flex-col items-center text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: 1.4 + (index * 0.1), duration: 0.5 }}
                                >
                                    <div className={`${stage.color} rounded-full p-3 mb-3 z-10 bg-white shadow-md`}>
                                        {stage.icon}
                                    </div>
                                    <h4 className="font-semibold text-slate-800 mb-1">{stage.name}</h4>
                                    <span className="text-xs text-slate-500">{stage.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Call to action */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                >
                    <motion.button
                        className="bg-gradient-to-r from-primary to-primary text-white px-8 py-3.5 rounded-full font-medium shadow-md inline-flex items-center group"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 15px 30px rgba(79, 70, 229, 0.2)',
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserPlus size={18} className="mr-2" />
                        <span>Begin Your Journey</span>
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
                        className="text-slate-500 mt-4"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        Join thousands who have found meaningful relationships
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;