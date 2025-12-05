import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Heart, Shield, Briefcase, Star, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef(null);
    
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cardMousePosition, setCardMousePosition] = useState({ x: 50, y: 50 });
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            
            if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                setCardMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timer);
        };
    }, []);

    const floatingElements = Array(10).fill(0).map((_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.05 + 0.01
    }));

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#16161e] pt-20">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-[150vh] w-[150vw] -translate-x-1/4 -translate-y-1/4 opacity-40"
                    style={{
                        background: 'radial-gradient(circle at 30% 40%, rgba(255, 107, 129, 0.05) 0%, transparent 35%), radial-gradient(circle at 80% 20%, rgba(183, 91, 255, 0.04) 0%, transparent 30%), radial-gradient(circle at 20% 60%, rgba(252, 128, 178, 0.05) 0%, transparent 50%)',
                        transform: `translate(${-scrollY * 0.02}px, ${-scrollY * 0.03}px)`,
                    }}
                ></div>

                {floatingElements.map((el) => (
                    <div
                        key={el.id}
                        className="absolute rounded-full"
                        style={{
                            width: `${el.size}px`,
                            height: `${el.size}px`,
                            left: `${el.left}%`,
                            top: `${el.top}%`,
                            opacity: el.opacity,
                            background: 'linear-gradient(135deg, rgba(255, 107, 129, 0.3), rgba(183, 91, 255, 0.3))',
                            animation: `float ${el.duration}s ease-in-out ${el.delay}s infinite alternate`,
                            filter: 'blur(18px)',
                        }}
                    ></div>
                ))}

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAxNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"
                    style={{ opacity: 0.15 - scrollY * 0.0003 }}
                ></div>
            </div>

            {/* Main content */}
            <div
                className={`relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 transition-all duration-1000 ease-out sm:px-8 lg:px-12 ${
                    isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="flex w-full flex-col items-center lg:flex-row lg:items-center lg:justify-between">
                    {/* Left side content */}
                    <div className="relative max-w-2xl space-y-10 text-center lg:text-left">
                        <div
                            className="relative space-y-7"
                            style={{ transform: `translateY(${-scrollY * 0.03}px)` }}
                        >
                            <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
                                Find 
                                <span
                                    className="relative mx-3 inline-block bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] bg-clip-text text-transparent"
                                    style={{
                                        textShadow: '0 0 80px rgba(255, 107, 129, 0.2)'
                                    }}
                                >
                                    Authentic
                                </span>
                                <br className="hidden md:block" />
                                Connections
                            </h1>

                            <p className="text-xl leading-relaxed text-white/70">
                                Discover meaningful relationships with like-minded professionals who share your values and aspirations. Our intelligent matching algorithm goes beyond appearances.
                            </p>
                        </div>

                        <div
                            ref={ctaRef}
                            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                            style={{
                                '--mouse-x': `${mousePosition.x}px`,
                                '--mouse-y': `${mousePosition.y}px`
                            } as React.CSSProperties & Record<string, any>}
                        >
                            <button
                                onClick={() => navigate('/register')}
                                className="group relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#FF6B81]/20 hover:shadow-xl hover:shadow-[#FF6B81]/30 transition-all duration-300"
                            >
                                Get Started Free
                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={() => navigate('/login')}
                                className="group flex items-center justify-center rounded-full border-2 border-white/20 bg-white/[0.05] px-8 py-4 text-lg font-medium text-white backdrop-blur-md transition-all hover:bg-white/[0.10] hover:border-white/30"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>

                    <div
                        ref={cardRef}
                        className="relative mt-20 flex w-full max-w-xl origin-top perspective lg:mt-0"
                        style={{
                            '--mouse-x': `${cardMousePosition.x}%`,
                            '--mouse-y': `${cardMousePosition.y}%`
                        } as React.CSSProperties & Record<string, any>}
                    >
                        <div 
                            className="relative flex h-full mt-16 w-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-[1px] shadow-2xl backdrop-blur-xl transition-all duration-300"
                            style={{
                                transform: `perspective(1000px) rotateX(${(cardMousePosition.y - 50) * 0.04}deg) rotateY(${(cardMousePosition.x - 50) * -0.04}deg)`,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.1s ease-out'
                            }}
                        >
                            <div className="relative h-full w-full rounded-[calc(1.5rem-1px)] bg-[#0c0c14]/90 p-8">
                                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#FF6B81]/5 blur-3xl"></div>
                                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#B75BFF]/5 blur-3xl"></div>
                                
                                <div 
                                    className="absolute inset-0 opacity-10 transition-opacity duration-300 ease-out"
                                    style={{
                                        background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 107, 129, 0.4), transparent 40%)'
                                    }}
                                ></div>

                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-full p-[2px] shadow-md" 
                                            style={{ 
                                                background: `linear-gradient(45deg, #FF6B81, #B75BFF)`
                                            }}
                                        >
                                            <div className="h-full w-full rounded-full bg-black/30 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80')] bg-cover bg-center"></div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Sarah, 28</h3>
                                            <p className="text-white/60">Marketing Director</p>
                                        </div>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B81]/10 backdrop-blur-sm">
                                        <Heart className="h-5 w-5 text-[#FF6B81]" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-white/80">Match Compatibility</p>
                                            <p className="text-sm font-bold text-white">92%</p>
                                        </div>
                                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                                            <div className="absolute inset-0 h-full w-[92%] rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="rounded-xl bg-white/[0.03] p-3 backdrop-blur-sm border border-white/[0.03] text-center">
                                            <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-[#FF6B81]/10 mb-2">
                                                <Shield className="h-4 w-4 text-[#FF6B81]" />
                                            </div>
                                            <p className="text-xs font-medium text-white">Verified</p>
                                        </div>

                                        <div className="rounded-xl bg-white/[0.03] p-3 backdrop-blur-sm border border-white/[0.03] text-center">
                                            <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-[#B75BFF]/10 mb-2">
                                                <Star className="h-4 w-4 text-[#B75BFF]" />
                                            </div>
                                            <p className="text-xs font-medium text-white">Values</p>
                                        </div>

                                        <div className="rounded-xl bg-white/[0.03] p-3 backdrop-blur-sm border border-white/[0.03] text-center">
                                            <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-[#FF6B81]/10 mb-2">
                                                <Briefcase className="h-4 w-4 text-[#FF6B81]" />
                                            </div>
                                            <p className="text-xs font-medium text-white">Career</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="mb-3 text-sm font-medium text-white/80">Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Travel', 'Fitness', 'Art'].map((interest, i) => (
                                            <div
                                                key={i}
                                                className="rounded-full bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 border border-white/5"
                                            >
                                                {interest}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="mt-6 w-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF6B81]/10 transition-all hover:shadow-xl hover:shadow-[#FF6B81]/20 flex items-center justify-center gap-2 group">
                                    View Profile
                                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        <div
                            className="absolute -left-8 bottom-16 z-20 max-w-[250px] rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-xl backdrop-blur-xl"
                            style={{
                                transform: 'translateZ(30px)',
                                animationName: 'float',
                                animationDuration: '6s',
                                animationTimingFunction: 'ease-in-out',
                                animationIterationCount: 'infinite',
                                animationDirection: 'alternate',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] p-0.5 shadow-lg shadow-[#FF6B81]/20">
                                    <div className="h-full w-full rounded-full bg-black/20 backdrop-blur-sm"></div>
                                    <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">843 Online Now</p>
                                    <p className="text-xs text-white/60">5 matches nearby</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating match notification */}
                        <div
                            className="absolute -right-6 top-10 z-20 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-xl backdrop-blur-xl"
                            style={{
                                transform: 'translateZ(20px) rotate(2deg)',
                                animationName: 'float',
                                animationDuration: '7s',
                                animationTimingFunction: 'ease-in-out',
                                animationIterationCount: 'infinite',
                                animationDirection: 'alternate',
                                animationDelay: '1s'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] flex items-center justify-center">
                                    <Heart size={14} className="text-white" />
                                </div>
                                <p className="text-xs font-medium text-white">3 new matches today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0% { transform: translateZ(20px); }
                    100% { transform: translateZ(40px); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                .perspective {
                    perspective: 1000px;
                }
                
                @font-face {
                    font-family: 'Display';
                    src: local('SF Pro Display'), local('Poppins'), local('Inter'), sans-serif;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}