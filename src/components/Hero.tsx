import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Bookmark, BellRing } from 'lucide-react';

const Hero = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const floatingX = useTransform(x, [-100, 100], [-15, 15]);
    const floatingY = useTransform(y, [-100, 100], [-15, 15]);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const springX = useSpring(floatingX, { mass: 0.3, stiffness: 70, damping: 20 });
    const springY = useSpring(floatingY, { mass: 0.3, stiffness: 70, damping: 20 });

    const controls = useAnimation();
    const wordControls = useAnimation();

    useEffect(() => {
        controls.start((i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + (i * 0.1),
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
            },
        }));

        wordControls.start({
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.5,
            },
        });

        return () => {
            controls.stop();
            wordControls.stop();
        };
    }, [controls, wordControls]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 100;
                const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 100;

                x.set(moveX);
                y.set(moveY);

                setMousePosition({
                    x: moveX / 30,
                    y: moveY / 30
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [x, y]);

    const headingText = "Find Your Lifelong Partner";
    const headingWords = headingText.split(' ');

    // Subtle floating elements
    const FloatingElements = () => {
        const elements = Array.from({ length: 10 }, (_, i) => {
            const size = Math.random() * 15 + 8;
            const duration = Math.random() * 12 + 18;
            const delay = Math.random() * 5;
            const left = Math.random() * 100;
            const opacity = Math.random() * 0.3 + 0.1;

            return (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${left}%`,
                        opacity: opacity,
                    }}
                    initial={{ y: '100vh', scale: 0 }}
                    animate={{
                        y: '-100vh',
                        scale: [0, 1, 0.8, 1, 0],
                        rotate: [0, 5, -5, 8, -8, 0],
                    }}
                    transition={{
                        duration: duration,
                        delay: delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {i % 3 === 0 ? (
                        <BellRing size={size} className="text-green-600/60" />
                    ) : i % 3 === 1 ? (
                        <Bookmark size={size} className="text-teal-600/60" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-amber-200/40"></div>
                    )}
                </motion.div>
            );
        });

        return <>{elements}</>;
    };

    return (
        <section
            ref={heroRef}
            className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center overflow-hidden py-20"
            style={{ perspective: '1000px' }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-0" />

                <motion.div
                    className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-30 blur-[80px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(79,70,229,0) 70%)',
                        x: springX,
                        y: springY
                    }}
                />

                <motion.div
                    className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-30 blur-[80px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, rgba(20,184,166,0) 70%)',
                        x: springX,
                        y: springY,
                        scale: 1.2
                    }}
                    animate={{
                        scale: [1.2, 1.3, 1.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />

                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5 z-1"></div>

                <div className="absolute inset-0 overflow-hidden z-1">
                    <FloatingElements />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 flex flex-col items-start">
                    <motion.div
                        className="overflow-hidden mb-4"
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1 },
                        }}
                        initial="hidden"
                        animate={wordControls}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-50 to-white">
                            {headingWords.map((word, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block mr-2 mb-2"
                                    variants={{
                                        hidden: { y: 100, opacity: 0 },
                                        show: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: 0.6,
                                                ease: [0.33, 1, 0.68, 1],
                                            }
                                        },
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <Sparkles size={28} className="text-amber-400" />
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-white/80 mb-10 max-w-lg backdrop-blur-sm bg-slate-900/30 p-4 rounded-xl border border-white/10"
                        custom={1}
                        initial={{ opacity: 0, y: 30 }}
                        animate={controls}
                    >
                        Begin your journey to a meaningful marriage with our thoughtful matchmaking service.
                        We connect compatible individuals seeking lifelong commitment based on shared values,
                        interests, and life goals.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <motion.button
                            className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3.5 rounded-full font-medium shadow-lg group"
                            custom={2}
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: '0 10px 25px -5px rgba(79,70,229,0.4)'
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Get Started <ArrowRight size={18} />
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.button>

                        <motion.button
                            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-full font-medium transition-all duration-300"
                            custom={3}
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            whileHover={{
                                borderColor: 'rgba(255, 255, 255, 0.4)',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Our Approach
                        </motion.button>
                    </div>

                    <motion.div
                        className="flex gap-8 mt-12"
                        custom={4}
                        initial={{ opacity: 0, y: 30 }}
                        animate={controls}
                    >
                        <div className="text-center">
                            <motion.span
                                className="block text-3xl font-bold text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.6, duration: 0.5 }}
                            >
                                500K+
                            </motion.span>
                            <span className="text-white/60 text-sm">Committed Members</span>
                        </div>

                        <div className="text-center">
                            <motion.span
                                className="block text-3xl font-bold text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.7, duration: 0.5 }}
                            >
                                92%
                            </motion.span>
                            <span className="text-white/60 text-sm">Compatibility Rate</span>
                        </div>

                        <div className="text-center">
                            <motion.span
                                className="block text-3xl font-bold text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8, duration: 0.5 }}
                            >
                                5K+
                            </motion.span>
                            <span className="text-white/60 text-sm">Marriages</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="w-full md:w-1/2 flex justify-center items-center pt-10 md:pt-0"
                    style={{
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformStyle: 'preserve-3d',
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                        <motion.div
                            className="relative z-20"
                            style={{
                                transform: 'translateZ(40px)',
                            }}
                        >
                            <div className="w-72 h-auto relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-teal-500/20 rounded-[40px] backdrop-blur-sm p-3 -m-3 z-0 opacity-70"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1526553743273-a3b6defd6281?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                                    alt="miSoulMate App"
                                    className="w-full h-auto rounded-[32px] border-[8px] border-slate-800 shadow-2xl relative z-10"
                                />

                                <motion.div
                                    className="absolute -top-6 -right-4 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/30"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    style={{ transform: 'translateZ(60px)' }}
                                >
                                    <BellRing size={24} className="text-amber-400" />
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-8 -left-6 z-20 bg-white/10 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white/30"
                                    animate={{
                                        y: [0, 10, 0],
                                        rotate: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: 1
                                    }}
                                    style={{ transform: 'translateZ(50px)' }}
                                >
                                    <span className="text-white text-sm">97% Compatible</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        <div
                            className="absolute inset-0 bg-gradient-to-r from-green-600/40 to-teal-500/40 rounded-full blur-[80px] -z-10 scale-75"
                            style={{ transform: 'translateZ(-20px)' }}
                        ></div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    y: [0, 8, 0]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "loop"
                }}
            >
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-lg">
                    <ChevronDown size={24} className="text-white" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;