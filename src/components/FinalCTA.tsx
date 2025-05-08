// src/components/FinalCTA.tsx
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { buttonHover } from '../utils/animations';

const FinalCTA: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setEmail('');

            // Reset success state after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        }, 1000);
    };

    const gradientVariants = {
        initial: {
            backgroundPosition: '0% 50%',
        },
        animate: {
            backgroundPosition: '100% 50%',
            transition: {
                repeat: Infinity,
                repeatType: "reverse" as const,
                duration: 10,
                ease: "linear"
            }
        }
    };

    return (
        <motion.section
            className="py-20 text-white overflow-hidden"
            style={{
                background: 'linear-gradient(-45deg, #FF6B81, #D86D72, #A8E0D7, #FF6B81)',
                backgroundSize: '400% 400%',
            }}
            variants={gradientVariants}
            initial="initial"
            animate="animate"
            ref={sectionRef}
        >
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Ready to Find Your Match?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of singles already on HeartMatch. Your perfect match could be just a click away.
                    </p>
                </motion.div>

                <motion.form
                    className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 flex-grow"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.button
                        type="submit"
                        className={`bg-white text-[#FF6B81] px-8 py-3 rounded-full font-medium flex-shrink-0 ${isSubmitting ? 'opacity-70' : ''} ${isSuccess ? 'bg-green-400 text-white' : ''}`}
                        variants={buttonHover}
                        initial="initial"
                        whileHover={!isSubmitting && !isSuccess ? "hover" : "initial"}
                        whileTap={!isSubmitting && !isSuccess ? "tap" : "initial"}
                        disabled={isSubmitting || isSuccess}
                    >
                        {isSubmitting ? 'Joining...' : isSuccess ? 'Success!' : 'Join Free'}
                    </motion.button>
                </motion.form>

                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 text-white"
                    >
                        Thanks for joining! Check your email for next steps.
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

export default FinalCTA;