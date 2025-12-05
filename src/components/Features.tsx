import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, Scale, Lock } from 'lucide-react';

const Features = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    const features = [
        {
            id: 1,
            title: 'Verified Profiles',
            description: 'Every profile undergoes verification to ensure you\'re meeting genuine individuals.',
            icon: < ShieldCheck size={28} />,
            iconBgColor: 'from-primary to-primary',
            iconColor: 'text-white',
            detailedPoints: [
                'Multi-factor authentication',
                'Secure ID verification'
            ]
        },
        {
            id: 2,
            title: 'Smart Matching',
            description: 'Our algorithm matches you based on core values and personality traits.',
            icon: <Scale size={28} />,
            iconBgColor: 'from-teal-600 to-teal-500',
            iconColor: 'text-white',
            detailedPoints: [
                'Personality assessment',
                'Values alignment'
            ]
        },
        {
            id: 3,
            title: 'Safe Communication',
            description: 'Connect through our encrypted platform with messaging and video calls.',
            icon: <Lock size={28} />,
            iconBgColor: 'from-amber-500 to-amber-400',
            iconColor: 'text-white',
            detailedPoints: [
                'End-to-end encryption',
                'Safety features'
            ]
        },
        {
            id: 4,
            title: 'Community Events',
            description: 'Join events designed to help you connect in natural environments.',
            icon: <Users size={28} />,
            iconBgColor: 'from-primary to-primary',
            iconColor: 'text-white',
            detailedPoints: [
                'Social gatherings',
                'Interest-based activities'
            ]
        }
    ];

    const headingWords = "Why Choose Soulmatify".split(' ');

    type Feature = {
        id: number;
        title: string;
        description: string;
        icon: React.ReactNode;
        iconBgColor: string;
        iconColor: string;
        detailedPoints: string[];
    };

    interface FeatureCardProps {
        feature: Feature;
        index: number;
    }

    const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
        const cardRef = useRef<HTMLDivElement>(null);

        // For 3D tilt effect
        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const handleMouseMove = (e: any) => {
            const card = cardRef.current;
            if (card) {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate distance from center (normalized to -100 to 100)
                const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 100;
                const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 100;

                x.set(moveX);
                y.set(moveY);
            }
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        const backgroundImage = useMotionTemplate`
      radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.3) 25%,
        rgba(255, 255, 255, 0) 50%
      )
    `;

        return (
            <div
                ref={cardRef}
                className="relative group rounded-3xl overflow-hidden h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md rounded-3xl border border-white shadow-lg z-0"></div>

                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
                    style={{ backgroundImage }}
                ></motion.div>

                <div
                    className="relative p-8 z-10 h-full flex flex-col"
                >
                    <div
                        className={`bg-gradient-to-br ${feature.iconBgColor} p-5 rounded-2xl inline-flex mb-6 shadow-md`}
                    >
                        <div className={feature.iconColor}>{feature.icon}</div>
                    </div>

                    <div style={{ transform: 'translateZ(10px)' }} className="text-left flex-grow">
                        <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                        <p className="text-slate-600 mb-6">
                            {feature.description}
                        </p>

                        <ul className="space-y-2 mt-auto">
                            {feature.detailedPoints.map((point, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="mt-1 mr-2 bg-slate-100 rounded-full p-0.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-primary' :
                                            index === 1 ? 'bg-teal-500' :
                                                index === 2 ? 'bg-amber-500' : 'bg-primary'
                                            }`}></div>
                                    </div>
                                    <span className="text-sm text-slate-700">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section id="features" className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-slate-50" ref={sectionRef}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(79,70,229,0) 70%)' }}
                />

                <div
                    className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, rgba(20,184,166,0) 70%)' }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div
                    ref={headingRef}
                    className="text-center mb-20"
                >
                    <div
                        className="overflow-hidden mb-2 inline-flex flex-wrap justify-center gap-2"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
                            {headingWords.map((word, i) => (
                                <span
                                    key={i}
                                    className="inline-block mr-2"
                                >
                                    {word}
                                </span>
                            ))}
                        </h2>
                    </div>

                    {/* Underline accent */}
                    <div
                        className="h-1 w-24 bg-gradient-to-r from-primary to-teal-500 rounded-full mx-auto mb-8"
                    />

                    <div
                        className="flex items-center justify-center mb-6"
                    >
                        <Sparkles size={20} className="text-amber-500 mr-2" />
                        <span className="text-slate-600 font-medium">A Comprehensive Matchmaking Experience</span>
                    </div>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Connect with individuals who share your values, goals, and vision for a meaningful life together.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;