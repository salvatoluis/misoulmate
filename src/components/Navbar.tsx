import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, User, MessageSquare, Search, Info, Crown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface NavLink {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    isNew?: boolean;
}

const publicNavLinks: NavLink[] = [
    { id: 'about', label: 'About', href: '/about' },
    { id: 'referrals', label: 'Referrals', href: '/referrals' },
    { id: 'pricing', label: 'Pricing', href: '/subscription' },
    { id: 'support', label: 'Support', href: '/help' },
];

const authenticatedNavLinks: NavLink[] = [
    { id: 'discover', label: 'Discover', href: '/discover', icon: <Search size={18} /> },
    { id: 'matches', label: 'Matches', href: '/matches', icon: <Heart size={18} /> },
    { id: 'messages', label: 'Messages', href: '/messages', icon: <MessageSquare size={18} /> },
    { id: 'profile', label: 'Profile', href: '/profile', icon: <User size={18} /> },
    { id: 'premium', label: 'Premium', href: '/subscription', icon: <Crown size={18} />, isNew: true },
    { id: 'help', label: 'Help', href: '/help', icon: <Info size={18} /> },
];

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const toggleAuth = () => {
        setIsAuthenticated(!isAuthenticated);
    };

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        }

        if (mobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const activeLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-400 ${scrolled
                ? 'bg-white/70 backdrop-blur-lg shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="text-2xl font-bold">
                        {scrolled ? (
                            <img
                                src='/images/logo_2.png'
                                alt="Logo"
                                className="h-8 w-auto"
                                style={{
                                    animation: 'fadeIn 0.3s ease forwards',
                                }}
                            />
                        ) : (
                            <img
                                src='/images/logo.png'
                                alt="Logo"
                                className="h-8 w-auto"
                                style={{
                                    animation: 'fadeInDown 0.5s ease forwards',
                                    opacity: 0,
                                    animationDelay: '0.2s'
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {activeLinks.map((link, index) => (
                        <Link
                            key={link.id}
                            to={link.href}
                            className={`text-sm font-medium hover:text-emerald-500 transition-colors duration-200 relative group ${scrolled ? 'text-[#2B2B2A]' : 'text-white'
                                }`}
                            style={{
                                animation: `fadeInDown 0.5s ease forwards`,
                                animationDelay: `${index * 0.08}s`,
                                opacity: 0
                            }}
                        >
                            <div className="flex items-center">
                                {link.icon && <span className="mr-1.5">{link.icon}</span>}
                                {link.label}
                                {link.isNew && (
                                    <span className="ml-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        New
                                    </span>
                                )}
                            </div>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <button
                            className="bg-gradient-to-r from-emerald-600 to-primary text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{ animation: 'fadeInUp 0.6s ease forwards' }}
                            onClick={toggleAuth}
                        >
                            Log Out
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <button
                                className={`font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${scrolled
                                    ? 'text-[#2B2B2A] hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                                style={{ animation: 'fadeInUp 0.5s ease forwards' }}
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </button>
                            <button
                                className="bg-gradient-to-r from-emerald-600 to-primary text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{ animation: 'fadeInUp 0.6s ease forwards' }}
                                onClick={() => navigate('/register')}
                            >
                                Sign Up Free
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden bg-white/10 backdrop-blur-md p-2 rounded-full shadow-sm border border-gray-100/20"
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? (
                        <X size={24} className="text-emerald-500" />
                    ) : (
                        <Menu size={24} className={scrolled ? "text-[#2B2B2A]" : " text-white"} />
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden fixed inset-x-0 top-20 m-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg border border-white/40 z-40 overflow-hidden transition-all duration-300"
                    style={{ animation: 'slideDown 0.3s ease-out forwards' }}
                >
                    <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                        {activeLinks.map((link, index) => (
                            <Link
                                key={link.id}
                                to={link.href}
                                className="text-lg font-medium text-[#2B2B2A] hover:text-emerald-500 transition-colors duration-200 flex items-center p-2 rounded-lg hover:bg-gray-100/50"
                                style={{
                                    animation: 'slideInLeft 0.3s ease forwards',
                                    animationDelay: `${0.05 * index}s`,
                                    opacity: 0
                                }}
                                onClick={toggleMobileMenu}
                            >
                                <span className="inline-block mr-3 w-8">
                                    {link.icon || <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                </span>
                                <span>{link.label}</span>
                                {link.isNew && (
                                    <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        New
                                    </span>
                                )}
                            </Link>
                        ))}

                        <div className="border-t border-gray-200 my-2 pt-4">
                            {isAuthenticated ? (
                                <button
                                    className="bg-gradient-to-r from-emerald-600 to-primary text-white px-6 py-3.5 rounded-xl font-medium w-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102 active:scale-98"
                                    style={{
                                        animation: 'slideInBottom 0.3s ease forwards',
                                        animationDelay: '0.3s',
                                        opacity: 0
                                    }}
                                    onClick={() => {
                                        toggleAuth();
                                        toggleMobileMenu();
                                    }}
                                >
                                    Log Out
                                </button>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <button
                                        className="bg-gradient-to-r from-emerald-600 to-primary text-white px-6 py-3.5 rounded-xl font-medium w-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102 active:scale-98"
                                        style={{
                                            animation: 'slideInBottom 0.3s ease forwards',
                                            animationDelay: '0.3s',
                                            opacity: 0
                                        }}
                                        onClick={() => {
                                            navigate('/register');
                                            toggleMobileMenu();
                                        }}
                                    >
                                        Sign Up Free
                                    </button>
                                    <button
                                        className="px-6 py-3.5 rounded-xl font-medium w-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                        style={{
                                            animation: 'slideInBottom 0.3s ease forwards',
                                            animationDelay: '0.4s',
                                            opacity: 0
                                        }}
                                        onClick={() => {
                                            navigate('/login');
                                            toggleMobileMenu();
                                        }}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInBottom {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }

                .active\\:scale-98:active {
                    transform: scale(0.98);
                }
            `}</style>
        </nav>
    );
};

export default Navbar;