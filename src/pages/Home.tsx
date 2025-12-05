import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AIAssistantModal from '@/elements/AIAssistantModal';

const HomePage: React.FC = () => {
    return (
        <div className="bg-[#FFF9F0] min-h-screen">
            <Navbar />
            <Hero />
            <Footer />
            <AIAssistantModal />
        </div>
    );
};

export default HomePage;