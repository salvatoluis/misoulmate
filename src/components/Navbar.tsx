import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
            padding: '1rem 0',
        },
        scrolled: {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '0.5rem 0',
        }
    };

    const linkVariants = {
        initial: { y: -20, opacity: 0 },
        animate: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: 'easeOut'
            }
        })
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            x: '100%',
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut'
            }
        }
    };

    return (
        <motion.nav
            className="fixed w-full z-50"
            variants={navVariants}
            initial="top"
            animate={controls}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <motion.div
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[#FF6B81]">Heart</span>
                    <span className="text-[#D86D72]">Match</span>
                </motion.div>

                <div className="hidden md:flex space-x-8 items-center">
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.id}
                            href={link.href}
                            className="hover:text-[#FF6B81] transition-colors duration-200"
                            variants={linkVariants}
                            custom={index}
                            initial="initial"
                            animate="animate"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {link.label}
                        </motion.a>
                    ))}
                    <motion.button
                        className="bg-[#FF6B81] hover:bg-[#D86D72] text-white px-6 py-2 rounded-full transition-colors duration-200"
                        variants={linkVariants}
                        custom={navLinks.length}
                        initial="initial"
                        animate="animate"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up Free
                    </motion.button>
                </div>

                <motion.button
                    className="md:hidden text-[#2B2B2A]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 bg-white z-40 pt-20"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="container mx-auto px-4 flex flex-col space-y-6 py-8">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.id}
                                    href={link.href}
                                    className="text-xl hover:text-[#FF6B81] transition-colors duration-200"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: { delay: 0.1 + index * 0.1 }
                                    }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onClick={toggleMobileMenu}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.button
                                className="bg-[#FF6B81] hover:bg-[#D86D72] text-white px-6 py-3 rounded-full transition-colors duration-200 w-full mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: 0.4 }
                                }}
                                exit={{ opacity: 0, y: 20 }}
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