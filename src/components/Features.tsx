// src/components/Features.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { Feature } from '../types';
import { staggerContainer, fadeUp } from '../utils/animations';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Features: React.FC = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const features: Feature[] = [
        {
            id: 1,
            title: 'Verified Profiles',
            description: 'Every profile is verified to ensure you\'re meeting real, authentic people who are looking for genuine connections.',
      icon: < ShieldCheck size = { 32} />,
        iconBgColor: 'bg-[#FF6B81]/10',
        iconColor: 'text-[#FF6B81]'
    },
    {
        id: 2,
        title: 'Smart Matching',
        description: 'Our algorithm learns your preferences over time to suggest matches that are more likely to result in meaningful relationships.',
        icon: <Heart size={32} />,
            iconBgColor: 'bg-[#A8E0D7]/10',
                iconColor: 'text-[#A8E0D7]'
    },
{
    id: 3,
        title: 'Instant Messaging',
            description: 'Connect instantly with your matches through our secure, feature-rich messaging platform with photo sharing and video calls.',
                icon: <MessageSquare size={32} />,
                    iconBgColor: 'bg-[#FFE066]/10',
                        iconColor: 'text-[#FFE066]'
}
  ];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
    return (
        <motion.div
            className="bg-[#FFF9F0] p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
            variants={fadeUp}
            custom={index}
        >
            <div className={`${feature.iconBgColor} p-4 rounded-full inline-flex mb-6`}>
                <div className={feature.iconColor}>{feature.icon}</div>
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600">
                {feature.description}
            </p>
        </motion.div>
    );
};

return (
    <section id="features" className="py-20 bg-white" ref={sectionRef}>
        <div className="container mx-auto px-4 md:px-6">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Why Choose HeartMatch
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Our unique approach to dating helps you find meaningful connections with people who share your interests and values.
                </p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
            >
                {features.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} index={index} />
                ))}
            </motion.div>
        </div>
    </section>
);
};

export default Features;