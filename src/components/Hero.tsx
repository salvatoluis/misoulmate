import { useState, useEffect } from 'react';
import { ChevronRight, Heart, Check, Shield, Sparkles, Briefcase } from 'lucide-react';

export default function Hero() {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    type FloatingElement = {
        id: number;
        size: number;
        left: number;
        top: number;
        duration: number;
        delay: number;
    };
    const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        // Create floating elements
        const elements = Array(12).fill(0).map((_, i) => ({
            id: i,
            size: Math.random() * 30 + 10,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: Math.random() * 30 + 20,
            delay: Math.random() * 10,
        }));

        setFloatingElements(elements);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="relative h-auto w-full overflow-hidden bg-black">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-[150vh] w-[150vw] -translate-x-1/4 -translate-y-1/4 opacity-30"
                    style={{
                        background: 'radial-gradient(circle at 30% 40%, rgba(var(--color-primary-500), 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(var(--color-primary-400), 0.2) 0%, transparent 30%), radial-gradient(circle at 20% 80%, rgba(var(--color-primary-600), 0.15) 0%, transparent 70%)',
                        transform: `translate(${-scrollY * 0.02}px, ${-scrollY * 0.03}px)`,
                    }}
                ></div>

                {floatingElements.map((el) => (
                    <div
                        key={el.id}
                        className="absolute rounded-full bg-primary-300/10"
                        style={{
                            width: `${el.size}px`,
                            height: `${el.size}px`,
                            left: `${el.left}%`,
                            top: `${el.top}%`,
                            animation: `float ${el.duration}s ease-in-out ${el.delay}s infinite alternate`,
                            filter: 'blur(8px)',
                        }}
                    ></div>
                ))}

                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"
                    style={{ opacity: 0.3 - scrollY * 0.0005 }}
                ></div>
            </div>

            <div
                className={`relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 transition-all duration-1000 ease-out sm:px-8 lg:px-12 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
            >
                <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative max-w-2xl space-y-10">

                        <div
                            className="relative space-y-6"
                            style={{ transform: `translateY(${-scrollY * 0.04}px)` }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center rounded-full bg-white/[0.03] px-5 py-2 backdrop-blur-2xl">
                                <div className="mr-2 h-2 w-2 rounded-full bg-primary-400"></div>
                                <p className="text-xs font-medium text-white/90">
                                    <span className="text-primary-300">12,000+</span> successful matches in the professional world
                                </p>
                            </div>

                            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
                                <span
                                    className="relative inline-block"
                                    style={{
                                        textShadow: '0 0 80px rgba(var(--color-primary-500), 0.2)'
                                    }}
                                >
                                    Elevate
                                    <div className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"></div>
                                </span>
                                <br />
                                Your Love Life
                            </h1>

                            <p className="text-xl leading-relaxed text-white/70">
                                Where accomplished professionals find meaningful connections leading to marriage. Our AI-driven matches bring together like-minded individuals with shared values and ambitions.
                            </p>
                        </div>

                        {/* CTA section */}
                        <div className="flex flex-col space-y-5 sm:flex-row sm:space-x-6 sm:space-y-0">
                            <button className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 p-px text-lg font-semibold text-white">
                                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 transition-all duration-300 ease-out group-hover:opacity-0"></span>
                                <span className="absolute inset-0 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mouse-x,_0)_var(--mouse-y,_0),_rgba(var(--color-primary-400),_0.6),_transparent_40%)]"></span>
                                <span className="relative z-10 flex w-full items-center justify-center gap-2 rounded-[0.7rem] bg-black px-8 py-4 transition-all duration-300 ease-out group-hover:gap-4">
                                    Start Your Journey
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>

                            <button className="group flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/[0.05]">
                                How It Works
                            </button>
                        </div>
                    </div>

                    {/* Right side - 3D card interface */}
                    <div
                        className="relative mt-20 flex w-full max-w-xl origin-top lg:mt-0"
                        style={{
                            transform: `perspective(1000px) rotateX(${scrollY * 0.01}deg) rotateY(${scrollY * 0.01}deg)`,
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Main profile card */}
                        <div className="relative flex h-full w-full translate-z-0 flex-col overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-[1px] shadow-2xl backdrop-blur-xl transition-all duration-300">
                            <div className="relative h-full w-full rounded-[calc(1.5rem-1px)] bg-black/30 p-8">
                                {/* Highlight accent */}
                                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl"></div>
                                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-600/10 blur-3xl"></div>

                                {/* Profile header */}
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl p-[2px]" style={{ background: `linear-gradient(45deg, rgb(var(--color-primary-500)), rgb(var(--color-primary-400)))` }}>
                                            <div className="h-full w-full rounded-[calc(1rem-1px)] bg-black/30"></div>
                                            <Sparkles className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Elite Matching</h3>
                                            <p className="text-white/60">Personalized for you</p>
                                        </div>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 backdrop-blur-sm">
                                        <Check className="h-5 w-5 text-primary-400" />
                                    </div>
                                </div>

                                {/* Compatibility stats */}
                                <div className="mb-10 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-white/80">Compatibility Score</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary-400"></div>
                                                <p className="text-sm font-bold text-white">97%</p>
                                            </div>
                                        </div>
                                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                                            <div className="absolute inset-0 h-full w-[97%] rounded-full bg-gradient-to-r from-primary-600 to-primary-400">
                                                <div className="absolute inset-0 opacity-30 bg-primary animate-shimmer"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="rounded-2xl bg-white/[0.03] p-4 backdrop-blur-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                                                <Shield className="h-5 w-5 text-primary-400" />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-white">Elite Verification</p>
                                            <p className="mt-1 text-xs text-white/60">Verified professionals</p>
                                        </div>

                                        <div className="rounded-2xl bg-white/[0.03] p-4 backdrop-blur-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                                                <Briefcase className="h-5 w-5 text-primary-400" />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-white">Career Match</p>
                                            <p className="mt-1 text-xs text-white/60">93% alignment</p>
                                        </div>

                                        <div className="rounded-2xl bg-white/[0.03] p-4 backdrop-blur-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                                                <Heart className="h-5 w-5 text-primary-400" />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-white">Values</p>
                                            <p className="mt-1 text-xs text-white/60">95% compatibility</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Match preview */}
                                <div className="relative rounded-2xl bg-white/[0.02] p-5 backdrop-blur-md">
                                    <div className="mb-4 flex justify-between">
                                        <p className="text-sm font-medium text-white">Your Top Matches</p>
                                        <p className="text-xs text-primary-400">View all</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 p-[2px]">
                                            <div className="h-full w-full rounded-lg bg-black/30"></div>
                                            <p className="absolute text-xs font-bold text-white">+5</p>
                                        </div>

                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-10 w-10 rounded-xl bg-white/5"></div>
                                        ))}

                                        <div className="ml-auto rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white">
                                            <span className="text-primary-400">24</span> new today
                                        </div>
                                    </div>
                                </div>

                                {/* CTA button */}
                                <button className="mt-7 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-4 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30">
                                    Find Your Perfect Match
                                </button>
                            </div>
                        </div>

                        {/* Floating notification */}
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 p-0.5 shadow-lg shadow-primary-500/20">
                                    <div className="h-full w-full rounded-[calc(0.75rem-1px)] bg-black/20 backdrop-blur-sm"></div>
                                    <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">2,384 Online Now</p>
                                    <p className="text-xs text-white/60">In your professional network</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating achievement */}
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
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-400"></div>
                                <p className="text-xs font-medium text-white">745+ successful marriages</p>
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
      `}</style>
        </div>
    );
}