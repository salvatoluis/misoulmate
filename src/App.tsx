import React from 'react';
// import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import AppPreview from './components/AppPreview';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Matches from './pages/Matches';
import MatchProfile from './pages/MatchProfile';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import Conversation from './pages/Conversation';
import Onboarding from './pages/Onboading';
import Subscription from './pages/Subscription';

const App: React.FC = () => {
  return (
    <div className="bg-[#FFF9F0] text-[#2B2B2A] min-h-screen font-sans">
      {/* <Navbar /> */}
      <Subscription />
      <Onboarding />
      <Conversation />
      <Messages />
      <UserProfile />
      <MatchProfile />
      <Matches />
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

export default App;