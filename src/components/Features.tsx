// src/components/Features.tsx
import React, { useRef } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { ShieldCheck, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { Feature } from '../types';

const Features: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const headingRef = useRef(null);
    const headingInView = useInView(headingRef, { once: true, amount: 0.6 });

    const features: Feature[] = [
        {
            id: 1,
            title: 'Verified Profiles',
            description: 'Every profile is verified to ensure you\'re meeting real, authentic people who are looking for genuine connections.',
      icon: < ShieldCheck size = { 32} />,
        iconBgColor: 'from-[#FF6B81] to-[#FF8A9A]',
        iconColor: 'text-white'
    },
    {
        id: 2,
        title: 'Smart Matching',
        description: 'Our algorithm learns your preferences over time to suggest matches that are more likely to result in meaningful relationships.',
        icon: <Heart size={32} />,
            iconBgColor: 'from-[#A8E0D7] to-[#7DCCBF]',
                iconColor: 'text-white'
    },
{
    id: 3,
        title: 'Instant Messaging',
            description: 'Connect instantly with your matches through our secure, feature-rich messaging platform with photo sharing and video calls.',
                icon: <MessageSquare size={32} />,
                    iconBgColor: 'from-[#FFE066] to-[#FFCB45]',
                        iconColor: 'text-white'
}
  ];

const headingWords = "Why Choose HeartMatch".split(' ');

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
    hidden: { y: 100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1],
        }
    }
};

// Card component with 3D hover effect
const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
    const cardRef = useRef(null);
    const cardInView = useInView(cardRef, { once: true, amount: 0.2 });

    // For 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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

    // Generating subtle shine effect for each card
    const backgroundImage = useMotionTemplate`
      radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.3) 25%,
        rgba(255, 255, 255, 0) 50%
      )
    `;

    return (
        <motion.div
            ref={cardRef}
            className="relative group rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={cardInView ? { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 * index } } : {}}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md rounded-3xl border border-white shadow-lg z-0"></div>

            {/* Highlight effect */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
                style={{ backgroundImage }}
            ></motion.div>

            {/* Card content */}
            <motion.div
                className="relative p-8 z-10"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 30px rgba(0, 0, 0, 0.05)' }}
            >
                {/* Icon with 3D transform */}
                <motion.div
                    className={`bg-gradient-to-br ${feature.iconBgColor} p-5 rounded-2xl inline-flex mb-6 shadow-md`}
                    style={{ transform: 'translateZ(20px)' }}
                    initial={{ scale: 0 }}
                    animate={cardInView ? {
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                            delay: 0.3 + 0.1 * index
                        }
                    } : {}}
                    whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.5 }
                    }}
                >
                    <div className={feature.iconColor}>{feature.icon}</div>
                </motion.div>

                {/* Content with 3D transform */}
                <motion.div style={{ transform: 'translateZ(10px)' }} className="text-left">
                    <h3 className="text-xl font-bold mb-3 text-[#2B2B2A]">{feature.title}</h3>
                    <p className="text-gray-600">
                        {feature.description}
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

return (
    <section id="features" className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50" ref={sectionRef}>
        {/* Subtle background accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Gradient orb top-right */}
            <motion.div
                className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(255,107,129,0.4) 0%, rgba(255,107,129,0) 70%)' }}
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -10, 0],
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Gradient orb bottom-left */}
            <motion.div
                className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(168,224,215,0.4) 0%, rgba(168,224,215,0) 70%)' }}
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                ref={headingRef}
                className="text-center mb-20"
                initial={{ opacity: 0 }}
                animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
            >
                {/* Animated heading with word-by-word reveal */}
                <motion.div
                    className="overflow-hidden mb-2 inline-flex flex-wrap justify-center gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate={headingInView ? "show" : "hidden"}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#2B2B2A] to-[#555]">
                        {headingWords.map((word, i) => (
                            <motion.span
                                key={i}
                                className="inline-block mr-2"
                                variants={wordVariants}
                                initial="hidden"
                                animate={headingInView ? "visible" : "hidden"}
                                custom={i}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h2>
                </motion.div>

                {/* Underline accent */}
                <motion.div
                    className="h-1 w-24 bg-gradient-to-r from-[#FF6B81] to-[#A8E0D7] rounded-full mx-auto mb-8"
                    initial={{ width: 0, opacity: 0 }}
                    animate={headingInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex items-center justify-center mb-6"
                >
                    <Sparkles size={20} className="text-[#FFE066] mr-2" />
                    <span className="text-gray-600 font-medium">Discover Our Premium Features</span>
                </motion.div>

                <motion.p
                    className="text-lg text-gray-600 max-w-2xl mx-auto bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/80 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    Our unique approach to dating helps you find meaningful connections with people who share your interests and values.
                </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} index={index} />
                ))}
            </div>
        </div>
    </section>
);
};

export default Features;