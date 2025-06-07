import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';


const Login: React.FC<any> = ({ }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
                email,
                password,
            });

            const { user, profile, token } = response.data;

            localStorage.setItem('auth', JSON.stringify({ user, profile, token }));

            navigate('/matches');
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };
    

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to continue to miSoulMate</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-[#FF6B81] border-gray-300 rounded focus:ring-[#FF6B81]"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-[#FF6B81] hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                    Sign In
                    <ArrowRight size={18} className="ml-2" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#FF6B81] hover:underline font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>

            <div className="mt-8">
                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600 text-sm">Or sign in with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button className="p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
                        Google
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <img src="/images/apple-icon.svg" alt="Apple" className="h-5 w-5 mr-2" />
                        Apple
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;