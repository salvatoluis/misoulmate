import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavLink {
    id: string;
    label: string;
    href: string;
}

const navLinks: NavLink[] = [
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'testimonials', label: 'Success Stories', href: '#testimonials' },
];

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const controls = useAnimation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
                controls.start(isScrolled ? 'scrolled' : 'top');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled, controls]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navVariants = {
        top: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            backdropFilter: 'blur(0px)',
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
            padding: '1.25rem 0',
        },
        scrolled: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
            padding: '0.75rem 0',
        }
    };

    const linkVariants = {
        initial: { y: -20, opacity: 0 },
        animate: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.08,
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    const buttonVariants = {
        initial: {
            opacity: 0,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.3,
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        hover: {
            scale: 1.03,
            boxShadow: '0 4px 20px rgba(255, 107, 129, 0.4)',
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.97,
            boxShadow: '0 2px 10px rgba(255, 107, 129, 0.3)',
            transition: {
                duration: 0.1,
                ease: "easeIn"
            }
        }
    };

    const logoVariants = {
        initial: { opacity: 0, x: -20 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            scale: 0.98,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const menuIconVariants = {
        closed: { rotate: 0 },
        open: { rotate: 90 }
    };

    return (
        <motion.nav
            className="fixed w-full z-50"
            variants={navVariants}
            initial="top"
            animate={controls}
            transition={{ duration: 0.4 }}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <motion.div
                    className="flex items-center gap-2"
                    variants={logoVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                >
                    <div className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] p-1.5 rounded-full">
                        <Heart size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold">
                        <span className={scrolled ? "text-[#FF6B81]" : "text-white"}>MiSoul</span>
                        <span className={scrolled ? "text-[#D86D72]" : "text-white"}>Mate</span>
                    </div>
                </motion.div>

                <div className="hidden md:flex space-x-10 items-center">
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.id}
                            href={link.href}
                            className={`text-sm font-medium hover:text-[#FF6B81] transition-colors duration-200 relative group ${scrolled ? 'text-[#2B2B2A]' : 'text-white'}`}
                            variants={linkVariants}
                            custom={index}
                            initial="initial"
                            animate="animate"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {link.label}
                            <motion.span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B81] group-hover:w-full transition-all duration-300"
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                            />
                        </motion.a>
                    ))}
                    <motion.button
                        className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-7 py-2.5 rounded-full font-medium shadow-md"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up Free
                    </motion.button>
                </div>

                <motion.button
                    className="md:hidden bg-white/10 backdrop-blur-md p-2 rounded-full shadow-sm border border-gray-100/20"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    variants={menuIconVariants}
                    animate={mobileMenuOpen ? "open" : "closed"}
                >
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={24} className="text-[#FF6B81]" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={24} className={scrolled ? "text-[#2B2B2A]" : "text-white"} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-x-0 top-20 m-4 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/40 z-40 overflow-hidden"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.id}
                                    href={link.href}
                                    className="text-lg font-medium text-[#2B2B2A] hover:text-[#FF6B81] transition-colors duration-200 flex items-center"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: { delay: 0.1 + index * 0.08 }
                                    }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={toggleMobileMenu}
                                >
                                    <motion.span className="inline-block mr-2 w-1.5 h-1.5 rounded-full bg-[#FF6B81]" />
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.button
                                className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 w-full mt-4 shadow-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: 0.35 }
                                }}
                                exit={{ opacity: 0, y: 20 }}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(255, 107, 129, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/register')}
                            >
                                Sign Up Free
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;