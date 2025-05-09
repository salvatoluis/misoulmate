import React, { useState } from 'react';
import { ChevronRight, Search, HelpCircle, MessageCircle, Plus, Minus, Shield, Heart, User, Bell, Lock } from 'lucide-react';

interface FAQCategory {
    id: string;
    title: string;
    icon: React.ReactNode;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    categoryId: string;
}

const FAQHelp: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);

    // FAQ Categories
    const categories: FAQCategory[] = [
        {
            id: 'account',
            title: 'Account & Profile',
            icon: <User size={20} className="text-[#FF6B81]" />
        },
        {
            id: 'matches',
            title: 'Matches & Messaging',
            icon: <Heart size={20} className="text-[#FF6B81]" />
        },
        {
            id: 'privacy',
            title: 'Privacy & Safety',
            icon: <Shield size={20} className="text-[#FF6B81]" />
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: <Bell size={20} className="text-[#FF6B81]" />
        },
        {
            id: 'subscription',
            title: 'Subscription & Billing',
            icon: <Lock size={20} className="text-[#FF6B81]" />
        }
    ];

    // FAQ Items
    const faqItems: FAQItem[] = [
        {
            id: '1',
            question: 'How do I edit my profile?',
            answer: 'To edit your profile, go to the Profile tab and tap the Edit button. From there you can update your photos, personal information, interests, and preferences. Remember to tap Save once you\'re done to apply your changes.',
            categoryId: 'account'
        },
        {
            id: '2',
            question: 'How do I change my password?',
            answer: 'To change your password, go to Settings > Account > Password. You\'ll need to enter your current password and then your new password twice to confirm the change.',
            categoryId: 'account'
        },
        {
            id: '3',
            question: 'Can I hide my profile temporarily?',
            answer: 'Yes, you can hide your profile by going to Settings > Privacy > Profile Visibility and selecting "Hidden". This will make your profile invisible to other users until you change it back.',
            categoryId: 'privacy'
        },
        {
            id: '4',
            question: 'How do matches work?',
            answer: 'Matches are created when two users mutually like each other. When you like someone and they like you back, a match is formed, and you\'ll be able to message each other. You can view all your matches in the Matches tab.',
            categoryId: 'matches'
        },
        {
            id: '5',
            question: 'How do I unmatch someone?',
            answer: 'To unmatch someone, go to your conversation with them, tap the three dots in the top right corner, and select "Unmatch". This will remove the match and delete the conversation permanently.',
            categoryId: 'matches'
        },
        {
            id: '6',
            question: 'How do I report inappropriate behavior?',
            answer: 'You can report inappropriate behavior by going to the user\'s profile, tapping the three dots in the top right corner, and selecting "Report". Choose the reason for your report and provide any additional details if needed.',
            categoryId: 'privacy'
        },
        {
            id: '7',
            question: 'How do I turn off notifications?',
            answer: 'To manage your notifications, go to Settings > Notifications. You can toggle individual notification types on or off, or use the "Pause All Notifications" option to temporarily disable all notifications.',
            categoryId: 'notifications'
        },
        {
            id: '8',
            question: 'How do I cancel my subscription?',
            answer: 'To cancel your subscription, go to Settings > Subscription > Manage Subscription. Follow the prompts to cancel. Note that you\'ll still have access to premium features until the end of your current billing period.',
            categoryId: 'subscription'
        },
        {
            id: '9',
            question: 'What\'s included in the premium subscription?',
            answer: 'Premium subscription includes unlimited likes, see who liked you, advanced filters, message priority, profile boosts, and ad-free experience. You can view all features by going to the Subscription page.',
            categoryId: 'subscription'
        }
    ];

    // Toggle FAQ expansion
    const toggleFAQ = (faqId: string) => {
        setExpandedFAQs(prev =>
            prev.includes(faqId)
                ? prev.filter(id => id !== faqId)
                : [...prev, faqId]
        );
    };

    // Filter FAQs based on search and active category
    const filteredFAQs = faqItems.filter(faq => {
        const matchesSearch = searchTerm.trim() === '' ||
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = activeCategory === null || faq.categoryId === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                                onClick={() => window.history.back()}
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">Help Center</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="p-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for help topics"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    {!searchTerm && (
                        <div className="mb-6 overflow-x-auto">
                            <div className="flex space-x-3 min-w-max">
                                <button
                                    className={`px-4 py-2 rounded-full text-sm ${activeCategory === null
                                            ? 'bg-[#FF6B81] text-white'
                                            : 'bg-white text-gray-700 border border-gray-200'
                                        }`}
                                    onClick={() => setActiveCategory(null)}
                                >
                                    All Topics
                                </button>

                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`px-4 py-2 rounded-full text-sm flex items-center ${activeCategory === category.id
                                                ? 'bg-[#FF6B81]/10 text-[#FF6B81] border border-[#FF6B81]'
                                                : 'bg-white text-gray-700 border border-gray-200'
                                            }`}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <span className="mr-1.5">{category.icon}</span>
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQ Section */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <HelpCircle size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Frequently Asked Questions</h2>
                                <p className="text-sm text-gray-600">
                                    {activeCategory
                                        ? `About ${categories.find(c => c.id === activeCategory)?.title}`
                                        : 'Find answers to common questions'}
                                </p>
                            </div>
                        </div>

                        {filteredFAQs.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredFAQs.map(faq => (
                                    <div key={faq.id} className="p-4">
                                        <button
                                            className="w-full flex items-center justify-between text-left"
                                            onClick={() => toggleFAQ(faq.id)}
                                        >
                                            <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                                            {expandedFAQs.includes(faq.id) ? (
                                                <Minus size={18} className="text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <Plus size={18} className="text-gray-500 flex-shrink-0" />
                                            )}
                                        </button>

                                        {expandedFAQs.includes(faq.id) && (
                                            <div className="mt-3 text-gray-600 text-sm">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-4 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-gray-700 font-medium mb-1">No results found</h3>
                                <p className="text-gray-500 text-sm">
                                    Try different keywords or browse by category instead
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Contact Support */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <MessageCircle size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Contact Support</h2>
                                <p className="text-sm text-gray-600">We're here to help</p>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-600 text-sm mb-4">
                                Couldn't find what you're looking for? Our support team is ready to assist you.
                            </p>

                            <button className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                                <MessageCircle size={18} className="mr-2" />
                                Contact Support
                            </button>

                            <div className="mt-4 text-center text-gray-500 text-sm">
                                Typical response time: within 24 hours
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQHelp;