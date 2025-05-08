// src/components/AppPreview.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, Heart } from 'lucide-react';
import { buttonHover } from '../utils/animations';

const AppPreview: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    return (
        <section id="app-preview" className="py-20 bg-white" ref={sectionRef}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Take HeartMatch Everywhere
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Our mobile app keeps you connected to your matches wherever you go.
                            Get notifications, send messages, and never miss an opportunity to connect.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                className="bg-[#2B2B2A] hover:bg-[#2B2B2A]/80 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                                variants={buttonHover}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Download size={20} />
                                App Store
                            </motion.button>
                            <motion.button
                                className="bg-[#2B2B2A] hover:bg-[#2B2B2A]/80 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                                variants={buttonHover}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Download size={20} />
                                Google Play
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center md:justify-end"
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative">
                            <motion.div
                                className="phone-mockup"
                                initial={{ y: 20 }}
                                animate={isInView ? {
                                    y: [0, -10, 0],
                                    transition: {
                                        duration: 4,
                                        times: [0, 0.5, 1],
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }
                                } : { y: 20 }}
                            >
                                <img
                                    src="/images/app-mockup.jpg"
                                    alt="HeartMatch App"
                                    className="w-72 rounded-3xl shadow-xl border-8 border-[#2B2B2A] object-cover"
                                />
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-4 -left-4 bg-[#FF6B81] p-3 rounded-full shadow-lg"
                                initial={{ scale: 0 }}
                                animate={isInView ? {
                                    scale: [0.8, 1.2, 0.8],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }
                                } : { scale: 0 }}
                            >
                                <Heart size={24} className="text-white" fill="white" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AppPreview;