// src/components/Testimonials.tsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, MessageSquare } from 'lucide-react';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Expanded testimonials with more details
    const testimonials: (Testimonial & {
        location: string;
        date: string;
        fullStory: string;
        additionalPhotos?: string[];
        matchRate?: number;
    })[] = [
            {
                id: 1,
                names: 'Sarah & Michael',
                image: '/images/couple-1.jpg',
                quote: 'We matched on HeartMatch in June and were engaged by December. The compatibility algorithm really works! We had so much in common from day one.',
                rating: 5,
                location: 'San Francisco, CA',
                date: 'June 2024',
                fullStory: 'We both swiped right and immediately hit it off. Our first date lasted 6 hours - we just couldn\'t stop talking! Within weeks, we knew this was something special.HeartMatch\'s personality questions really helped match us on values that matter. Four months later, Michael proposed during a weekend trip to Napa. We\'re planning our wedding for next summer!',
                additionalPhotos: ['/images/couple-1b.jpg', '/images/couple-1c.jpg'],
                matchRate: 98
            },
            {
                id: 2,
                names: 'David & James',
                image: '/images/couple-2.jpg',
                quote: 'After trying several dating apps, HeartMatch was the one that finally worked for us. The verified profiles meant we could trust who we were talking to.',
                rating: 5,
                location: 'Chicago, IL',
                date: 'April 2024',
                fullStory: 'We were both tired of dating apps with fake profiles and people not looking for real connections. HeartMatch\'s verification system gave us confidence that we were talking to genuine people.When we matched, the conversation flowed naturally.We met for coffee, which turned into dinner, which turned into the best relationship either of us has ever had.Thank you HeartMatch!',
                additionalPhotos: ['/images/couple-2b.jpg'],
                matchRate: 95
            },
            {
                id: 3,
                names: 'Priya & Raj',
                image: '/images/couple-3.jpg',
                quote: 'HeartMatch understood our cultural background and values. We connected on a level that other apps never provided. Our families couldn\'t be happier!',
                rating: 5,
                location: 'Seattle, WA',
                date: 'March 2024',
                fullStory: 'As two professionals with traditional families but modern lives, finding the right match was challenging. HeartMatch\'s detailed preferences allowed us to be specific about what mattered to us.When we matched, it felt different from other connections we\'d made online. After three months of dating, we introduced each other to our families, who were thrilled. We\'re now planning our future together.',
                matchRate: 96
            }
        ];

    const cardVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.19, 1, 0.22, 1]
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.5,
                ease: [0.19, 1, 0.22, 1]
            }
        })
    };

    const starVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.3 + (i * 0.1),
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        })
    };

    // Next/Previous handlers
    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const handlePrevious = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    // For mobile swipe
    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipe = Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 800;
        if (swipe) {
            if (offset.x > 0) {
                handlePrevious();
            } else {
                handleNext();
            }
        }
    };

    // Background blur elements generator
    const BlurElements = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,129,0.5) 0%, rgba(255,107,129,0) 70%)' }}
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
                    className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(168,224,215,0.5) 0%, rgba(168,224,215,0) 70%)' }}
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
        )
    };

    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-[#FFF9F0] to-[#FFF5E6] relative overflow-hidden" ref={sectionRef}>
            {/* Background effects */}
            <BlurElements />

            <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] bg-repeat opacity-5"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Decorative element */}
                    <motion.div
                        className="w-16 h-16 mx-auto mb-6 relative"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B81]/30 to-[#A8E0D7]/30 rounded-full blur-md"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Heart size={24} className="text-[#FF6B81]" fill="#FF6B81" />
                        </div>
                    </motion.div>

                    {/* Section title with gradient underline */}
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2B2A]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Success Stories
                    </motion.h2>

                    <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-[#FF6B81] to-[#A8E0D7] rounded-full mx-auto mb-6"
                        initial={{ width: 0, opacity: 0 }}
                        animate={isInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    />

                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Hear from couples who found each other through HeartMatch.
                    </motion.p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="max-w-6xl mx-auto relative">
                    {/* Large quote mark */}
                    <motion.div
                        className="absolute -top-10 -left-4 md:-left-10 text-[80px] md:text-[120px] text-[#FF6B81]/10 z-0 pointer-events-none"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <Quote size="100%" />
                    </motion.div>

                    {/* Navigation buttons */}
                    <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 z-20">
                        <motion.button
                            className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-all duration-300"
                            onClick={handlePrevious}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={24} className="text-gray-700" />
                        </motion.button>
                    </div>

                    <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 z-20">
                        <motion.button
                            className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-all duration-300"
                            onClick={handleNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={24} className="text-gray-700" />
                        </motion.button>
                    </div>

                    {/* Testimonial cards */}
                    <div className="relative h-[600px] sm:h-[500px] mb-8 overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                                className="absolute inset-0 md:px-10"
                            >
                                <div className="h-full grid md:grid-cols-5 gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/80">
                                    {/* Image column */}
                                    <div className="md:col-span-2 flex flex-col">
                                        <div className="relative rounded-2xl overflow-hidden h-48 md:h-full mb-4 md:mb-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#00000080] to-transparent z-10"></div>
                                            <img
                                                src={testimonials[activeIndex].image}
                                                alt={testimonials[activeIndex].names}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Match rate badge */}
                                            {testimonials[activeIndex].matchRate && (
                                                <motion.div
                                                    className="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-20"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5, duration: 0.3 }}
                                                >
                                                    <Heart size={14} className="mr-1" fill="white" />
                                                    {testimonials[activeIndex].matchRate}% Match
                                                </motion.div>
                                            )}

                                            {/* Names overlay */}
                                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                                <motion.h3
                                                    className="font-bold text-xl text-white drop-shadow-md"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.4 }}
                                                >
                                                    {testimonials[activeIndex].names}
                                                </motion.h3>
                                                <motion.div
                                                    className="flex items-center text-white/90 text-sm"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4, duration: 0.4 }}
                                                >
                                                    <span>{testimonials[activeIndex].location}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{testimonials[activeIndex].date}</span>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Additional photos on mobile only */}
                                        {testimonials[activeIndex].additionalPhotos && (
                                            <div className="flex gap-2 mt-4 md:hidden">
                                                {testimonials[activeIndex].additionalPhotos.map((photo, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-20 h-20 rounded-lg overflow-hidden"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                                                    >
                                                        <img src={photo} alt="" className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content column */}
                                    <div className="md:col-span-3 flex flex-col justify-between">
                                        <div>
                                            {/* Rating stars */}
                                            <div className="flex mb-3">
                                                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        custom={i}
                                                        variants={starVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                    >
                                                        <Star size={18} fill="#FFE066" className="text-[#FFE066] mr-1" />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <motion.div
                                                className="relative"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                            >
                                                <p className="text-xl italic text-gray-700 leading-relaxed mb-6">
                                                    "{testimonials[activeIndex].quote}"
                                                </p>

                                                {/* Full story */}
                                                <p className="text-gray-600 mb-6">
                                                    {testimonials[activeIndex].fullStory}
                                                </p>
                                            </motion.div>

                                            {/* Additional photos on desktop */}
                                            {testimonials[activeIndex].additionalPhotos && (
                                                <div className="hidden md:flex gap-3 mt-4">
                                                    {testimonials[activeIndex].additionalPhotos.map((photo, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-24 h-24 rounded-lg overflow-hidden shadow-md"
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Message button */}
                                        <motion.div
                                            className="mt-6"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7, duration: 0.4 }}
                                        >
                                            <button className="flex items-center text-[#FF6B81] font-medium hover:underline">
                                                <MessageSquare size={16} className="mr-2" />
                                                Share your success story
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination dots */}
                    <motion.div
                        className="flex justify-center gap-2 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        {testimonials.map((_, index) => (
                            <motion.button
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === activeIndex
                                    ? 'bg-gradient-to-r from-[#FF6B81] to-[#D86D72] w-8'
                                    : 'bg-gray-300'
                                    } transition-all duration-300`}
                                onClick={() => {
                                    setDirection(index > activeIndex ? 1 : -1);
                                    setActiveIndex(index);
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;