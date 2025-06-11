import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, MessageSquare } from 'lucide-react';

const Testimonials: React.FC = () => {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            id: 1,
            names: 'Sarah & Michael',
            image: '/images/couple-1.jpg',
            quote: 'We matched on miSoulMate in June and were engaged by December. The compatibility algorithm really works! We had so much in common from day one.',
            rating: 5,
            location: 'San Francisco, CA',
            date: 'June 2024',
            fullStory: 'We both swiped right and immediately hit it off. Our first date lasted 6 hours - we just couldn\'t stop talking! Within weeks, we knew this was something special. miSoulMate\'s personality questions really helped match us on values that matter. Four months later, Michael proposed during a weekend trip to Napa. We\'re planning our wedding for next summer!',
            additionalPhotos: ['/images/couple-1b.jpg', '/images/couple-1c.jpg'],
            matchRate: 98
        },
        {
            id: 2,
            names: 'David & James',
            image: '/images/couple-2.jpg',
            quote: 'After trying several dating apps, miSoulMate was the one that finally worked for us. The verified profiles meant we could trust who we were talking to.',
            rating: 5,
            location: 'Chicago, IL',
            date: 'April 2024',
            fullStory: 'We were both tired of dating apps with fake profiles and people not looking for real connections. miSoulMate\'s verification system gave us confidence that we were talking to genuine people. When we matched, the conversation flowed naturally. We met for coffee, which turned into dinner, which turned into the best relationship either of us has ever had. Thank you miSoulMate!',
            additionalPhotos: ['/images/couple-2b.jpg'],
            matchRate: 95
        },
        {
            id: 3,
            names: 'Priya & Raj',
            image: '/images/couple-3.jpg',
            quote: 'miSoulMate understood our cultural background and values. We connected on a level that other apps never provided. Our families couldn\'t be happier!',
            rating: 5,
            location: 'Seattle, WA',
            date: 'March 2024',
            fullStory: 'As two professionals with traditional families but modern lives, finding the right match was challenging. miSoulMate\'s detailed preferences allowed us to be specific about what mattered to us. When we matched, it felt different from other connections we\'d made online. After three months of dating, we introduced each other to our families, who were thrilled. We\'re now planning our future together.',
            matchRate: 96
        }
    ];

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const handlePrevious = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const BlurElements = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(79,70,229,0) 70%)' }}
                />

                <div
                    className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(20,184,166,0) 70%)' }}
                />
            </div>
        );
    };

    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden" ref={sectionRef}>
            {/* Background effects */}
            <BlurElements />

            <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] bg-repeat opacity-5"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    {/* Decorative element */}
                    <div className="w-16 h-16 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-teal-500/30 rounded-full blur-md"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Heart size={24} className="text-green-600" fill="rgb(79, 70, 229)" />
                        </div>
                    </div>

                    {/* Section title with gradient underline */}
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-4 text-slate-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Success Stories
                    </h2>

                    <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-500 rounded-full mx-auto mb-6" />

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Hear from couples who found each other through miSoulMate.
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-6xl mx-auto relative">
                    {/* Large quote mark */}
                    <div className="absolute -top-10 -left-4 md:-left-10 text-[80px] md:text-[120px] text-green-600/10 z-0 pointer-events-none">
                        <Quote size="100%" />
                    </div>

                    {/* Navigation buttons */}
                    <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 z-20">
                        <button
                            className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-all duration-300"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>
                    </div>

                    <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 z-20">
                        <button
                            className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:bg-white transition-all duration-300"
                            onClick={handleNext}
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>
                    </div>

                    <div className="relative h-[600px] sm:h-[500px] mb-8 overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <div
                                key={activeIndex}
                                className="absolute inset-0 md:px-10"
                            >
                                <div className="h-full grid md:grid-cols-5 gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/80">
                                    <div className="md:col-span-2 flex flex-col">
                                        <div className="relative rounded-2xl overflow-hidden h-48 md:h-full mb-4 md:mb-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#00000080] to-transparent z-10"></div>
                                            <img
                                                src={testimonials[activeIndex].image}
                                                alt={testimonials[activeIndex].names}
                                                className="w-full h-full object-cover"
                                            />

                                            {testimonials[activeIndex].matchRate && (
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-20">
                                                    <Heart size={14} className="mr-1" fill="white" />
                                                    {testimonials[activeIndex].matchRate}% Match
                                                </div>
                                            )}

                                            {/* Names overlay */}
                                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                                <h3 className="font-bold text-xl text-white drop-shadow-md">
                                                    {testimonials[activeIndex].names}
                                                </h3>
                                                <div className="flex items-center text-white/90 text-sm">
                                                    <span>{testimonials[activeIndex].location}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{testimonials[activeIndex].date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional photos on mobile only */}
                                        {testimonials[activeIndex].additionalPhotos && (
                                            <div className="flex gap-2 mt-4 md:hidden">
                                                {testimonials[activeIndex].additionalPhotos.map((photo, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-20 h-20 rounded-lg overflow-hidden"
                                                    >
                                                        <img src={photo} alt="" className="w-full h-full object-cover" />
                                                    </div>
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
                                                    <div key={i}>
                                                        <Star size={18} fill="#F59E0B" className="text-amber-500 mr-1" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Quote */}
                                            <div className="relative">
                                                <p className="text-xl italic text-slate-700 leading-relaxed mb-6">
                                                    "{testimonials[activeIndex].quote}"
                                                </p>

                                                {/* Full story */}
                                                <p className="text-slate-600 mb-6">
                                                    {testimonials[activeIndex].fullStory}
                                                </p>
                                            </div>

                                            {/* Additional photos on desktop */}
                                            {testimonials[activeIndex].additionalPhotos && (
                                                <div className="hidden md:flex gap-3 mt-4">
                                                    {testimonials[activeIndex].additionalPhotos.map((photo, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-24 h-24 rounded-lg overflow-hidden shadow-md"
                                                        >
                                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Message button */}
                                        <div className="mt-6">
                                            <button className="flex items-center text-green-600 font-medium hover:underline">
                                                <MessageSquare size={16} className="mr-2" />
                                                Share your success story
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === activeIndex
                                    ? 'bg-gradient-to-r from-green-600 to-green-500 w-8'
                                    : 'bg-slate-300'
                                    } transition-all duration-300`}
                                onClick={() => {
                                    setDirection(index > activeIndex ? 1 : -1);
                                    setActiveIndex(index);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;