// src/pages/HomePage.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import AppPreview from '../components/AppPreview';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
    return (
        <div className="bg-[#FFF9F0] min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <AppPreview />
            <FinalCTA />
            <Footer />
        </div>
    );
};

export default HomePage;