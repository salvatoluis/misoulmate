import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Coffee, Zap, PenTool, Heart } from 'lucide-react';

const AIAssistantModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState<string | null>(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setActiveFeature(null);
        }
    };

    const features = [
        {
            id: 'conversation',
            icon: <MessageSquare size={20} />,
            title: 'Conversation Starters',
            description: 'Get personalized ice breakers and conversation starters based on your match\'s profile'
        },
        {
            id: 'dates',
            icon: <Coffee size={20} />,
            title: 'Date Ideas',
            description: 'Discover creative date ideas tailored to both your interests and preferences'
        },
        {
            id: 'profile',
            icon: <PenTool size={20} />,
            title: 'Profile Enhancement',
            description: 'Get AI feedback on how to improve your profile to attract more compatible matches'
        },
        {
            id: 'compatibility',
            icon: <Heart size={20} />,
            title: 'Compatibility Insights',
            description: 'Learn about your compatibility with matches and discover shared interests'
        }
    ];

    const renderFeatureContent = (featureId: any) => {
        switch (featureId) {
            case 'conversation':
                return (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3">Suggested Ice Breakers</h3>
                        <div className="space-y-3">
                            <div className="bg-green-50 p-3 rounded-lg">
                                "I noticed you're into hiking - what's the most breathtaking view you've ever hiked to?"
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                "Your taste in music is fantastic! If you could see any artist live, who would it be?"
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                "That photo of you at the cooking class looks fun! What's your signature dish?"
                            </div>
                        </div>
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-medium w-full transition-colors duration-200">
                            Generate More Ice Breakers
                        </button>
                    </div>
                );
            case 'dates':
                return (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3">Perfect Date Ideas</h3>
                        <div className="space-y-3">
                            <div className="bg-green-50 p-3 rounded-lg flex items-start">
                                <img
                                    src="https://images.unsplash.com/photo-1517638851339-a711cfcf3279?w=100&h=100&fit=crop"
                                    alt="Cooking class"
                                    className="w-12 h-12 rounded object-cover mr-3"
                                />
                                <div>
                                    <h4 className="font-semibold">Cooking Class Adventure</h4>
                                    <p className="text-sm text-slate-600">Learn to make pasta together at Maria's Cooking Studio</p>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg flex items-start">
                                <img
                                    src="https://images.unsplash.com/photo-1508485861230-7d8fca3bab22?w=100&h=100&fit=crop"
                                    alt="Botanical garden"
                                    className="w-12 h-12 rounded object-cover mr-3"
                                />
                                <div>
                                    <h4 className="font-semibold">Botanical Garden Stroll</h4>
                                    <p className="text-sm text-slate-600">Explore exotic flowers and have tea at the garden café</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-medium w-full transition-colors duration-200">
                            Find More Date Ideas
                        </button>
                    </div>
                );
            case 'profile':
                return (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3">Profile Feedback</h3>
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <h4 className="font-semibold text-green-600">What's Working Well</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Your authentic smile in photo #2 creates trust</li>
                                <li>• Mentioning your passion for cooking shows depth</li>
                                <li>• Your travel stories demonstrate adventurousness</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-green-600">Suggestions</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Add a photo showing one of your hobbies in action</li>
                                <li>• Include a conversation starter question in your bio</li>
                                <li>• Share a specific goal or dream to create connection</li>
                            </ul>
                        </div>
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-medium w-full transition-colors duration-200">
                            Get Complete Profile Analysis
                        </button>
                    </div>
                );
            case 'compatibility':
                return (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3">Compatibility with Alex</h3>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop"
                                    alt="Your profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="w-24 h-2 bg-green-200 mx-2">
                                    <div className="w-20 h-2 bg-green-500"></div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=100&h=100&fit=crop"
                                    alt="Alex"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-green-600">86%</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <h4 className="font-semibold">Shared Interests</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Hiking', 'Photography', 'Asian Cuisine', 'Jazz'].map(interest => (
                                    <span key={interest} className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold">Conversation Topics</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Both traveled to Japan - share experiences</li>
                                <li>• Similar taste in indie music - discuss favorites</li>
                                <li>• Both enjoy cooking - exchange recipes</li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={toggleModal}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-green-600 to-green-500 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow duration-300"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Sparkles size={20} className="mr-2" />
                                <h2 className="font-bold text-lg">AI Dating Assistant</h2>
                            </div>
                            <button onClick={toggleModal} className="text-white opacity-80 hover:opacity-100">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-green-100 mt-1">
                            AI-powered help to enhance your dating experience
                        </p>
                    </div>

                    {/* Content */}
                    {activeFeature ? (
                        <div>
                            <div className="p-3 bg-slate-50 border-b flex items-center">
                                <button
                                    onClick={() => setActiveFeature(null)}
                                    className="text-slate-500 mr-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6"></path>
                                    </svg>
                                </button>
                                <span className="font-medium">
                                    {features.find(f => f.id === activeFeature)?.title}
                                </span>
                            </div>
                            {renderFeatureContent(activeFeature)}
                        </div>
                    ) : (
                        <div className="divide-y max-h-96 overflow-y-auto">
                            {features.map(feature => (
                                <button
                                    key={feature.id}
                                    className="w-full p-4 text-left flex items-start hover:bg-green-50 transition-colors"
                                    onClick={() => setActiveFeature(feature.id)}
                                >
                                    <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{feature.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-slate-400">
                                        <path d="M9 18l6-6-6-6"></path>
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-3 bg-slate-50 border-t text-center text-xs text-slate-500">
                        <div className="flex items-center justify-center">
                            <Zap size={12} className="text-green-500 mr-1" />
                            <span>Powered by AI - Personalized for your dating journey</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistantModal;