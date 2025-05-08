// src/components/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { buttonHover } from '../utils/animations';

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background gradient with image */}
            <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-r from-[#FF6B81]/30 to-[#A8E0D7]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    backgroundImage: `url('/images/couple-hero.jpg')`, // This would be your real image in production
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#000]/40 to-transparent"></div>
            </motion.div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                <div className="max-w-xl md:max-w-2xl">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Find Your Perfect Match
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-white/90 mb-8 max-w-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Join thousands of singles who have found meaningful connections.
                        Our intelligent matching system helps you find the one.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            className="bg-[#FF6B81] hover:bg-[#D86D72] text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                            variants={buttonHover}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Get Started <ArrowRight size={18} />
                        </motion.button>

                        <motion.button
                            className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
                            variants={buttonHover}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            Learn More
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    y: [0, 10, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                }}
            >
                <ChevronDown size={30} />
            </motion.div>
        </section>
    );
};

export default Hero;