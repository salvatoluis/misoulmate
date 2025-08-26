import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="bg-white min-h-screen">
            <header className="p-4 flex justify-center">
                <Link to="/" className="flex items-center">
                    <div className="w-10 h-10 bg-[#FF6B81]/10 rounded-full flex items-center justify-center">
                        <img src="/logo.jpeg" alt="soulmatify logo" className='w-8 h-8' />
                    </div>
                    <span className="text-xl font-bold text-gray-800 ml-2">soulmatify</span>
                </Link>
            </header>

            <main className="max-w-md mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="py-6 text-center text-sm text-gray-500">
                <p>© 2025 soulmatify. All rights reserved.</p>
                <div className="mt-2 space-x-4">
                    <Link to="/terms" className="text-gray-500 hover:text-gray-700">Terms</Link>
                    <Link to="/privacy" className="text-gray-500 hover:text-gray-700">Privacy</Link>
                    <Link to="/help" className="text-gray-500 hover:text-gray-700">Help</Link>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;