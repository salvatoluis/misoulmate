// src/components/Testimonials.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const testimonials: Testimonial[] = [
        {
            id: 1,
            names: 'Sarah & Michael',
            image: '/images/couple-1.jpg',
            quote: 'We matched on HeartMatch in June and were engaged by December. The compatibility algorithm really works! We had so much in common from day one.',
            rating: 5
        },
        {
            id: 2,
            names: 'David & James',
            image: '/images/couple-2.jpg',
            quote: 'After trying several dating apps, HeartMatch was the one that finally worked for us. The verified profiles meant we could trust who we were talking to.',
            rating: 5
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

    const starVariants = {
        initial: { scale: 0 },
        animate: (i: number) => ({
            scale: 1,
            transition: {
                delay: 0.3 + (i * 0.1),
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        })
    };

    const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
        return (
            <motion.div
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
            >
                <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                        <motion.img
                            src={testimonial.image}
                            alt={testimonial.names}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{testimonial.names}</h3>
                        <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <motion.div key={i} custom={i} variants={starVariants} initial="initial" animate="animate">
                                    <Star size={16} fill="#FFE066" className="text-[#FFE066]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-gray-600 italic">
                    "{testimonial.quote}"
                </p>
            </motion.div>
        );
    };

    return (
        <section id="testimonials" className="py-20 bg-[#FFF9F0]" ref={sectionRef}>
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
                        Success Stories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Hear from couples who found each other through HeartMatch.
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;