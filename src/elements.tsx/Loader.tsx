import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface LoaderProps {
    onFinished: () => void;
    duration?: number;
}

const Loader: React.FC<LoaderProps> = ({ onFinished, duration = 3000 }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, duration - 500);

        const durationTimer = setTimeout(() => {
            onFinished();
        }, duration);

        const interval = 400;
        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (interval / duration) * 100;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, interval);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(durationTimer);
            clearInterval(progressTimer);
        };
    }, [duration, onFinished]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B81] via-[#E75A70] to-[#D86D72] overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJnIiB3aWR0aD0iNDAwJSIgaGVpZ2h0PSI0MDAlIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIj48L3JlY3Q+PHBhdGggZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA3KSIgZD0iTTAgMGg0MHY0MEgweiI+PC9wYXRoPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] animate-glow-slow"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Pulsing circle backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-white/5 backdrop-blur-sm rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white/5 backdrop-blur-sm rounded-full animate-pulse-slower"></div>

                <div className="relative">
                    <div className="animate-heartbeat-modern flex items-center justify-center">
                        <Heart
                            size={90}
                            className="text-white filter drop-shadow-xl"
                            fill="white"
                            strokeWidth={1}
                        />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(6)].map((_, i) => {
                            const size = 10 + Math.random() * 14;
                            const delay = Math.random() * 2;
                            const duration = 5 + Math.random() * 3;

                            return (
                                <div
                                    key={i}
                                    className="absolute animate-float"
                                    style={{
                                        animationDelay: `${delay}s`,
                                        animationDuration: `${duration}s`,
                                        left: `${50 + (Math.random() * 60 - 30)}%`,
                                        top: `${50 + (Math.random() * 60 - 30)}%`,
                                    }}
                                >
                                    <Heart
                                        size={size}
                                        className="text-white"
                                        fill="white"
                                        strokeWidth={1}
                                        style={{ opacity: 0.5 + Math.random() * 0.5 }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 text-center animate-fade-in-up">
                    <h1 className="text-3xl font-bold tracking-wide text-white">
                        <span className="relative inline-block">
                            Mi<span className="text-white/90">Soul</span>Mate
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white/30 rounded-full transform scale-x-0 animate-line-reveal"></span>
                        </span>
                    </h1>
                    <p className="text-white/70 text-sm font-light tracking-widest mt-3 uppercase">Find your perfect match</p>
                </div>

                <div className="mt-12 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <style>
                {`
                @keyframes heartbeat-modern {
                0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7)); }
                25% { transform: scale(1.08); filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)); }
                40% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7)); }
                60% { transform: scale(1.08); filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)); }
                100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7)); }
                }
                
                @keyframes pulse-slow {
                0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.15; }
                100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.3; }
                }
                
                @keyframes pulse-slower {
                0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.15; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.07; }
                100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.15; }
                }
                
                @keyframes glow-slow {
                0% { opacity: 0.2; }
                50% { opacity: 0.4; }
                100% { opacity: 0.2; }
                }
                
                @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                20% { opacity: 0.8; }
                100% { transform: translate(calc(var(--direction, 1) * 30px), -50px) rotate(calc(var(--rotation, 20) * 1deg)); opacity: 0; }
                }
                
                @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(15px); }
                100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes line-reveal {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
                }
                
                .animate-heartbeat-modern {
                animation: heartbeat-modern 1.5s ease infinite;
                }
                
                .animate-pulse-slow {
                animation: pulse-slow 3s ease-in-out infinite;
                }
                
                .animate-pulse-slower {
                animation: pulse-slower 4s ease-in-out infinite;
                }
                
                .animate-glow-slow {
                animation: glow-slow 4s ease-in-out infinite;
                }
                
                .animate-float {
                --direction: ${Math.random() > 0.5 ? 1 : -1};
                --rotation: ${Math.random() * 40 - 20};
                animation: float var(--duration, 6s) ease-out forwards;
                }
                
                .animate-fade-in-up {
                animation: fade-in-up 1s ease-out forwards 0.3s;
                opacity: 0;
                }
                
                .animate-line-reveal {
                animation: line-reveal 1.2s ease-out forwards 1s;
                transform-origin: center;
                }
            `}
            </style>
        </div>
    );
};

export default Loader;