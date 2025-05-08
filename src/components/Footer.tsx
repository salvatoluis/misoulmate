// src/components/Footer.tsx
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, Send, ExternalLink, ChevronUp, Mail, Check, Info } from 'lucide-react';

interface FooterLink {
    id: string;
    label: string;
    href: string;
    isNew?: boolean;
}

interface FooterColumn {
    id: string;
    title: string;
    links: FooterLink[];
}

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const footerRef = useRef(null);
    const isInView = useInView(footerRef, { once: true, amount: 0.1 });

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setEmail('');

            // Reset after some time
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);
        }, 1500);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const footerColumns: FooterColumn[] = [
        {
            id: 'company',
            title: 'Company',
            links: [
                { id: 'about', label: 'About Us', href: '#' },
                { id: 'careers', label: 'Careers', href: '#', isNew: true },
                { id: 'blog', label: 'Blog', href: '#' },
                { id: 'press', label: 'Press', href: '#' },
            ]
        },
        {
            id: 'support',
            title: 'Support',
            links: [
                { id: 'help', label: 'Help Center', href: '#' },
                { id: 'safety', label: 'Safety Tips', href: '#' },
                { id: 'contact', label: 'Contact Us', href: '#' },
                { id: 'guidelines', label: 'Community Guidelines', href: '#' },
            ]
        },
        {
            id: 'legal',
            title: 'Legal',
            links: [
                { id: 'privacy', label: 'Privacy Policy', href: '#' },
                { id: 'terms', label: 'Terms of Service', href: '#' },
                { id: 'cookies', label: 'Cookie Policy', href: '#' },
                { id: 'accessibility', label: 'Accessibility', href: '#', isNew: true },
            ]
        },
    ];

    const socialLinks = [
        { id: 'facebook', icon: 'facebook', href: '#', label: 'Facebook' },
        { id: 'twitter', icon: 'twitter', href: '#', label: 'Twitter' },
        { id: 'instagram', icon: 'instagram', href: '#', label: 'Instagram' },
        { id: 'tiktok', icon: 'tiktok', href: '#', label: 'TikTok' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
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
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, x: -5 },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
            }
        },
        hover: {
            x: 5,
            transition: {
                duration: 0.2,
            }
        }
    };

    return (
        <footer className="relative overflow-hidden" ref={footerRef}>
            {/* Top curved divider */}
            <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute -top-10 left-0 w-full h-20 text-[#2B2B2A]"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        fill="currentColor"
                        opacity=".25"
                    ></path>
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        fill="currentColor"
                        opacity=".5"
                    ></path>
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        fill="currentColor"
                    ></path>
                </svg>
            </div>

            {/* Main footer content */}
            <div className="pt-16 pb-8 bg-[#2B2B2A] relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5"></div>

                    <motion.div
                        className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-5 blur-[100px]"
                        style={{ background: 'radial-gradient(circle, rgba(255,107,129,1) 0%, rgba(255,107,129,0) 70%)' }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.08, 0.05],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />

                    <motion.div
                        className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-5 blur-[100px]"
                        style={{ background: 'radial-gradient(circle, rgba(168,224,215,1) 0%, rgba(168,224,215,0) 70%)' }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.08, 0.05],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </div>

                <div className="container mx-auto px-6">
                    {/* Main footer grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-12 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "show" : "hidden"}
                    >
                        {/* Logo and newsletter column */}
                        <motion.div
                            className="md:col-span-4 lg:col-span-3"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="flex items-center mb-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] p-1.5 rounded-lg mr-2 flex items-center justify-center"
                                    whileHover={{ rotate: 10 }}
                                >
                                    <Heart size={16} className="text-white" />
                                </motion.div>
                                <span className="text-white text-2xl font-bold">
                                    Heart<span className="text-[#FF6B81]">Match</span>
                                </span>
                            </motion.div>

                            <p className="text-gray-400 mb-6">
                                Finding love in the digital age, made simple.
                            </p>

                            {/* Newsletter form */}
                            <div className="mb-8">
                                <h3 className="text-white text-md font-semibold mb-3">Get Dating Tips & Updates</h3>
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-3 flex items-center"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <Check size={16} className="text-green-400 mr-2" />
                                            <p className="text-green-100 text-sm">Thanks for subscribing!</p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            onSubmit={handleSubscribe}
                                            className="flex"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="relative flex-grow">
                                                <Mail size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Your email"
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-l-lg bg-gray-700/50 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF6B81]/50 focus:border-[#FF6B81]/50"
                                                    required
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                className="px-4 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#D86D72] rounded-r-lg text-white"
                                                whileHover={{
                                                    scale: 1.05,
                                                    transition: { duration: 0.2 }
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <motion.div
                                                        className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                ) : (
                                                    <Send size={16} />
                                                )}
                                            </motion.button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Social links */}
                            <div>
                                <h3 className="text-white text-md font-semibold mb-3">Connect With Us</h3>
                                <div className="flex space-x-3">
                                    {socialLinks.map(social => (
                                        <motion.a
                                            key={social.id}
                                            href={social.href}
                                            className="relative bg-gray-700/30 backdrop-blur-sm hover:bg-gray-700/50 p-2.5 rounded-lg text-gray-400 hover:text-white border border-gray-700/50 transition-colors duration-200 group"
                                            whileHover={{ scale: 1.1, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            onMouseEnter={() => setActiveTooltip(social.id)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                            aria-label={social.label}
                                        >
                                            {social.id === 'facebook' && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                                </svg>
                                            )}
                                            {social.id === 'twitter' && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                                </svg>
                                            )}
                                            {social.id === 'instagram' && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                                </svg>
                                            )}
                                            {social.id === 'tiktok' && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                                                </svg>
                                            )}

                                            {/* Tooltip */}
                                            <AnimatePresence>
                                                {activeTooltip === social.id && (
                                                    <motion.div
                                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {social.label}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer links columns */}
                        {footerColumns.map(column => (
                            <motion.div
                                key={column.id}
                                className="md:col-span-2 lg:col-span-3"
                                variants={itemVariants}
                            >
                                <h3 className="text-white font-bold mb-4 text-lg">{column.title}</h3>
                                <ul className="space-y-3">
                                    {column.links.map(link => (
                                        <li key={link.id}>
                                            <motion.a
                                                href={link.href}
                                                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                                                variants={linkVariants}
                                                whileHover="hover"
                                            >
                                                <motion.span className="inline-block mr-1.5 w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#FF6B81] transition-colors" />
                                                <span>{link.label}</span>
                                                {link.isNew && (
                                                    <span className="ml-2 text-xs bg-[#FF6B81]/20 text-[#FF6B81] px-1.5 py-0.5 rounded-md">
                                                        New
                                                    </span>
                                                )}
                                            </motion.a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* App download column */}
                        <motion.div
                            className="md:col-span-4 lg:col-span-3"
                            variants={itemVariants}
                        >
                            <h3 className="text-white font-bold mb-4 text-lg">Get the App</h3>
                            <p className="text-gray-400 mb-4">Our mobile app is coming soon. Join the waitlist to be the first to know when it launches!</p>

                            <div className="space-y-3">
                                <motion.div
                                    className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 cursor-not-allowed opacity-70"
                                    whileHover={{ scale: 1 }}
                                >
                                    <div className="bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.68 1.36-1.53 2.7-2.53 4.08ZM13.34 7.3c-.12-2.48 2.04-4.68 4.7-4.5.26 2.72-2.62 4.9-4.7 4.5Z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs">Coming soon on</span>
                                        <span className="text-white font-medium">App Store</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 cursor-not-allowed opacity-70"
                                    whileHover={{ scale: 1 }}
                                >
                                    <div className="bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                                            <path d="M17.94 9c-.78 2.34-3.13 5.25-3.13 5.25s-2.34-2.91-3.12-5.25c-.8-2.4.8-4.95 3.12-4.95s3.93 2.55 3.13 4.95ZM6.1 15c1.17 1.95 4.73 3 4.73 3s0-3.75-1.18-5.7c-1.18-1.95-3.5-1.8-4.43.15-.93 1.95.69 3.83.88 2.55ZM8.93 12c1.17 1.95 4.73 3 4.73 3s0-3.75-1.18-5.7c-1.18-1.95-3.5-1.8-4.43.15-.93 1.95.88 4.5.88 2.55ZM12 19.5s4.13-2.33 5.31-4.28c1.18-1.95.59-4.35-1.77-4.5-2.36-.15-3.54 8.78-3.54 8.78Z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs">Coming soon on</span>
                                        <span className="text-white font-medium">Google Play</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom bar with copyright */}
                    <motion.div
                        className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <p className="text-gray-500 text-sm mb-4 md:mb-0 flex items-center">
                            <Info size={14} className="mr-1.5" />
                            Made with love in San Francisco. © 2025 HeartMatch. All rights reserved.
                        </p>
                        <div className="flex items-center">
                            <a href="#" className="text-gray-400 hover:text-white text-sm mr-6 hover:underline">Beta Program</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm mr-6 hover:underline">Partners</a>

                            {/* Back to top button */}
                            <motion.button
                                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center"
                                onClick={scrollToTop}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Back to top"
                            >
                                <ChevronUp size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;