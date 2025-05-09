// src/components/FinalCTA.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Heart, ArrowRight, Check, Mail, UserPlus, X } from 'lucide-react';

const FinalCTA: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);

    const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = sectionRef.current ? sectionRef.current.getBoundingClientRect() : null;
        if (rect) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const moveX = (e.clientX - centerX) / 25;
            const moveY = (e.clientY - centerY) / 25;

            setParallaxOffset({ x: moveX, y: moveY });

            setMousePosition({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height
            });
        }
    };

    const handleMouseLeave = () => {
        setParallaxOffset({ x: 0, y: 0 });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                setEmail('');
            }, 5000);
        }, 1500);
    };

    useEffect(() => {
        if (isSuccess && email.length > 0) {
            setIsSuccess(false);
        }
    }, [email, isSuccess]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-24 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-[#FF6B81] via-[#D86D72] to-[#A8E0D7] z-0 transition-transform duration-300"
                style={{
                    backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                    transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
                }}
            >
                <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] bg-repeat opacity-10"></div>

                <div
                    className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)`,
                    }}
                ></div>

                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(12)].map((_, i) => {
                        const size = Math.random() * 25 + 10;
                        const duration = Math.random() * 15 + 10;
                        const initialX = Math.random() * 100;
                        const initialScale = Math.random() * 0.8 + 0.2;
                        const initialRotate = Math.random() * 180 - 90;
                        const opacity = Math.random() * 0.5 + 0.1;
                        const animationDelay = i * 0.5;

                        return (
                            <div
                                key={i}
                                className="absolute text-white"
                                style={{
                                    left: `${initialX}%`,
                                    bottom: "-10%",
                                    opacity,
                                    transform: `scale(${initialScale}) rotate(${initialRotate}deg)`,
                                    animation: `float ${duration}s linear ${animationDelay}s infinite`,
                                }}
                            >
                                <Heart size={size} fill="white" className="text-white" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div
                    className={`max-w-4xl mx-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden transition-transform duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-5'}`}
                    >
                        <div
                            className="absolute top-6 right-6 text-white/30"
                            style={{ animation: 'rotate-slow 20s linear infinite' }}
                        >
                            <Heart size={60} />
                        </div>

                        <div
                            className="absolute bottom-6 left-6 text-white/20"
                            style={{ animation: 'rotate-slow-reverse 25s linear infinite' }}
                        >
                            <Heart size={80} />
                        </div>

                        <div
                            className={`w-20 h-20 mx-auto mb-6 relative transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            <div
                                className="absolute inset-0 bg-white/20 rounded-full blur-md"
                                style={{ animation: 'pulse 3s ease-in-out infinite' }}
                            ></div>
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                            >
                                <UserPlus size={32} className="text-white" />
                            </div>
                        </div>

                        <h2
                            className={`text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ fontFamily: "'Playfair Display', serif", transitionDelay: '300ms' }}
                        >
                            Ready to Find Your Match?
                        </h2>

                        <div
                            className={`h-1 rounded-full mx-auto mb-6 bg-white/30 transition-all duration-600 ${isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}
                            style={{ transitionDelay: '600ms' }}
                        />

                        <p
                            className={`text-xl mb-10 max-w-2xl mx-auto text-white/90 transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: '400ms' }}
                        >
                            Join thousands of singles already on miSoulMate. Your perfect match could be just a click away.
                        </p>

                        <div
                            className={`max-w-xl mx-auto transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: '500ms' }}
                        >
                            {isSuccess ? (
                                <div
                                    className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-white flex items-center transition-all duration-300"
                                >
                                    <div className="bg-green-500 rounded-full p-2 mr-4">
                                        <Check size={24} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg">Thank you for joining!</h3>
                                        <p className="text-white/80">Check your email for next steps and exclusive offers.</p>
                                    </div>
                                    <button
                                        className="ml-auto bg-white/20 rounded-full p-2 hover:bg-white/30 hover:scale-110 active:scale-95 transition-all duration-200"
                                        onClick={() => setIsSuccess(false)}
                                    >
                                        <X size={18} className="text-white" />
                                    </button>
                                </div>
                            ) : (
                                <form
                                    className="flex flex-col sm:flex-row gap-3"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="relative flex-grow">
                                        <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:scale-[1.01] transition-transform duration-200"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`px-8 py-4 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 ${isSubmitting ? 'opacity-70' : ''}`}
                                        style={{
                                            background: 'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.2))'
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div
                                                className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-white">Join Free</span>
                                                <ArrowRight size={16} className="text-white" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Feature badges */}
                            <div
                                className={`flex flex-wrap justify-center gap-2 mt-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{ transitionDelay: '700ms' }}
                            >
                                {['Instant Access', 'Free to Join', 'Cancel Anytime'].map((feature, i) => (
                                    <div
                                        key={i}
                                        className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80 border border-white/10 flex items-center hover:scale-105 hover:bg-white/15 transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                                        style={{ transitionDelay: `${800 + (i * 100)}ms` }}
                                    >
                                        <Check size={12} className="mr-1 text-white" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust signals */}
                    <div
                        className={`mt-8 text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                        style={{ transitionDelay: '900ms' }}
                    >
                        <p className="text-white/70 text-sm">
                            Trusted by over 1M+ users worldwide • SSL Secured • Privacy Protected
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) scale(var(--scale)) rotate(var(--rotate));
                    }
                    100% {
                        transform: translateY(-110vh) scale(var(--scale)) rotate(calc(var(--rotate) + 20deg));
                    }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
                
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes rotate-slow-reverse {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
            `}</style>
        </section>
    );
};

export default FinalCTA;