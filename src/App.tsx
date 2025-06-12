import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Matches from './pages/Matches';
import MatchProfile from './pages/MatchProfile';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import Conversation from './pages/Conversation';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import BlockedUsers from './pages/BlockedUsers';
import FAQHelp from './pages/FAQHelp';
import DatePlanner from './pages/DatePlanner';
import Icebreakers from './pages/Icebreakers';
import HomePage from './pages/Home';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboading';
import MainLayout from './layouts/MainLayout';
import PageNotFound from './pages/PageNotFound';
import NotificationPage from './pages/Notifications';
import Discover from './pages/Discover';
import SafetyCenter from './pages/SafetyCenter';
import ContactUs from './pages/ContactUs';
import CommunityGuidelines from './pages/CommunityGuidelines';
import ForYou from './pages/ForYou';
import ConversationPage from './pages/ConversationPage';
import socketService from './services/socket.service';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize socket if user is authenticated
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.token && parsedAuth.user?.id) {
          socketService.initialize(parsedAuth.token, parsedAuth.user.id);
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    }

    const reloadListener = () => {
      setLoading(true);
    };

    window.addEventListener('beforeunload', reloadListener);

    return () => {
      window.removeEventListener('beforeunload', reloadListener);
      // Disconnect socket when component unmounts
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    const reloadListener = () => {
      setLoading(true);
    };

    window.addEventListener('beforeunload', reloadListener);

    return () => {
      window.removeEventListener('beforeunload', reloadListener);
    };
  }, []);

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <>{children}</>;
  };

  const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
  };

  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          } />
          <Route path="/safety" element={
            <PublicRoute>
              <SafetyCenter />
            </PublicRoute>
          } />
          <Route path="/contact" element={
            <PublicRoute>
              <ContactUs />
            </PublicRoute>
          } />
          <Route path="/community" element={
            <PublicRoute>
              <CommunityGuidelines />
            </PublicRoute>
          } />

          <Route path="/login" element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          } />

          <Route path="/onboarding" element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          } />

          <Route path="/matches" element={
            <ProtectedRoute>
              <MainLayout>
                <Matches />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/for-you" element={
            <ProtectedRoute>
              <MainLayout>
                <ForYou />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/match/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <MatchProfile />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute>
              <MainLayout>
                <Messages />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/conversation/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <Conversation />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/messages/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ConversationPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/subscription" element={
            <ProtectedRoute>
              <MainLayout>
                <Subscription />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/blocked-users" element={
            <ProtectedRoute>
              <MainLayout>
                <BlockedUsers />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/help" element={
            <ProtectedRoute>
              <MainLayout>
                <FAQHelp />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/terms-of-service" element={
            <ProtectedRoute>
              <MainLayout>
                <TermsOfService />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/privacy-policy" element={
            <ProtectedRoute>
              <MainLayout>
                <PrivacyPolicy />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/date-planner" element={
            <ProtectedRoute>
              <MainLayout>
                <DatePlanner />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/icebreakers" element={
            <ProtectedRoute>
              <MainLayout>
                <Icebreakers />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/discover" element={
            <ProtectedRoute>
              <MainLayout>
                <Discover />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;