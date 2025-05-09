import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Calendar } from 'lucide-react';

const Register: React.FC<any> = ({}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.birthdate || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const birthDate = new Date(formData.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError('You must be at least 18 years old to register');
            return;
        }

        navigate('/onboarding');
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h1>
                <p className="text-gray-600">Join HeartMatch and find your perfect match</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="Your name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Birth Date</label>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">You must be 18 years or older to use HeartMatch</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 mt-1 text-[#FF6B81] border-gray-300 rounded focus:ring-[#FF6B81]"
                        required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-[#FF6B81] hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-[#FF6B81] hover:underline">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                    Sign Up
                    <ArrowRight size={18} className="ml-2" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#FF6B81] hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>

            <div className="mt-8">
                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600 text-sm">Or sign up with</span>
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

export default Register;