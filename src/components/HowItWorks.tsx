// src/components/HowItWorks.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProcessStep } from '../types';

const HowItWorks: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const steps: ProcessStep[] = [
        {
            id: 1,
            title: 'Create Profile',
            description: 'Set up your profile with photos and details about yourself and what you\'re looking for.'
        },
        {
            id: 2,
            title: 'Find Matches',
            description: 'Browse potential matches or let our algorithm suggest people based on compatibility.'
        },
        {
            id: 3,
            title: 'Connect & Chat',
            description: 'Start conversations with your matches and begin your journey together.'
        }
    ];

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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section
            id="how-it-works"
            className="py-20 bg-gradient-to-b from-white to-[#FFF9F0]"
            ref={sectionRef}
        >
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        How HeartMatch Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Finding your perfect match is easy with our simple three-step process.
                    </p>
                </motion.div>

                <motion.div
                    className="relative max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                >
                    {/* Connection line */}
                    <motion.div
                        className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#D86D72]/20 -translate-y-1/2 z-0"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                        style={{ transformOrigin: 'left' }}
                    />

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="text-center"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="bg-white w-16 h-16 rounded-full shadow-md flex items-center justify-center mx-auto mb-6 border-4 border-[#FFF9F0]"
                                    whileHover={{
                                        scale: 1.1,
                                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)"
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <span className="text-xl font-bold text-[#FF6B81]">{step.id}</span>
                                </motion.div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-600">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;