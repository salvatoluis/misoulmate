// src/pages/SafetyCenter.tsx
import React, { useState } from 'react';
import { ChevronRight, Shield, AlertCircle, Check, Info, Phone, Flag, ChevronDown, ChevronUp, Lock, User, MessageSquare, Video, MapPin, Bell, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SafetyTopic {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    isExpanded?: boolean;
}

interface EmergencyResource {
    id: string;
    name: string;
    description: string;
    phone?: string;
    link?: string;
}

const SafetyCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tips' | 'report' | 'resources'>('tips');
    const [reportType, setReportType] = useState<string>('');
    const [reportDescription, setReportDescription] = useState<string>('');
    const [reportSuccess, setReportSuccess] = useState<boolean>(false);
    const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

    // Toggle topic expansion
    const toggleTopic = (topicId: string) => {
        setExpandedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    // Handle report submission
    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would make an API call
        setTimeout(() => {
            setReportSuccess(true);
            // Reset form after a delay
            setTimeout(() => {
                setReportType('');
                setReportDescription('');
                setReportSuccess(false);
            }, 5000);
        }, 1000);
    };

    // Safety tips topics
    const safetyTopics: SafetyTopic[] = [
        {
            id: 'meeting',
            title: 'Meeting in Person',
            icon: <User className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Always meet in public places for your first few dates. Here are some guidelines:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Choose busy, well-lit public locations like coffee shops or restaurants</li>
                        <li>Tell a friend or family member about your plans, including where you're going and who you're meeting</li>
                        <li>Arrange your own transportation to and from the meeting place</li>
                        <li>Keep your phone charged and with you at all times</li>
                        <li>Stay sober and alert during your first meeting</li>
                        <li>Trust your instincts – if something feels off, leave the situation</li>
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
                        <Info size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-700 text-sm">miSoulMate offers a "Share My Date" feature that lets you share your location and date details with trusted contacts.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'communication',
            title: 'Safe Communication',
            icon: <MessageSquare className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Keep your conversations on the platform until you're comfortable moving to another means of communication:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Use the app's messaging system until you build trust with your match</li>
                        <li>Be wary of users who immediately want to move the conversation to email, text, or other platforms</li>
                        <li>Don't share personal contact information (phone number, email, social media) too quickly</li>
                        <li>Be cautious of users who ask a lot of personal questions early in your conversations</li>
                        <li>Never share financial information or send money to someone you've met online</li>
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
                        <Lock size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-700 text-sm">miSoulMate messages are encrypted and our systems scan for suspicious behavior patterns.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'profile',
            title: 'Profile Safety',
            icon: <Shield className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Create a profile that represents you without revealing too much personal information:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Use recent photos that show your face clearly, but don't include photos with identifiable locations (like your home or workplace)</li>
                        <li>Avoid sharing your full name, address, workplace, or specific details about where you live</li>
                        <li>Consider what information in your bio could be used to find you on other platforms</li>
                        <li>Don't link social media accounts that contain personal information you wouldn't want potential matches to see</li>
                    </ul>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex">
                        <AlertCircle size={18} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-700 text-sm">Remember: Information on your profile can be screenshot and saved by others, even if you later delete your profile.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'video',
            title: 'Video Chat Safety',
            icon: <Video className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Video chatting before meeting in person can be a good way to verify someone's identity:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Use the app's built-in video chat feature rather than sharing third-party accounts</li>
                        <li>Be aware of your surroundings – don't show identifiable details of your home</li>
                        <li>Dress appropriately as you would for a public video call</li>
                        <li>Remember that video calls can be recorded, so never share sensitive information or engage in behavior you wouldn't want recorded</li>
                    </ul>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex">
                        <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 text-sm">miSoulMate's video chat feature is designed with privacy in mind and doesn't allow recording within the app.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'location',
            title: 'Location Privacy',
            icon: <MapPin className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Protect your physical location when using dating apps:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Review the app's location settings and understand what location information is visible to others</li>
                        <li>Consider using the city-only location option rather than precise location</li>
                        <li>Be cautious about sharing specific locations you frequent (gym, coffee shop, workplace)</li>
                        <li>Don't share your home address until you have established significant trust</li>
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
                        <Info size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-700 text-sm">miSoulMate allows you to hide your distance or set a custom location for privacy.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'scams',
            title: 'Recognizing Scams',
            icon: <AlertCircle className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>Be alert for these common dating app scams:</p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Profiles that seem too perfect or have model-like photos with minimal personal details</li>
                        <li>People who quickly profess strong feelings without meeting you</li>
                        <li>Anyone who asks for money, cryptocurrency, gift cards, or financial assistance</li>
                        <li>Stories about emergencies, medical issues, or being stranded in a foreign country</li>
                        <li>Requests to invest in cryptocurrency, forex trading, or other investment schemes</li>
                        <li>Links to external websites, particularly those asking for personal or financial information</li>
                    </ul>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex">
                        <AlertCircle size={18} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">If you suspect a scam, report the profile immediately and never send money or share financial information with matches.</p>
                    </div>
                </div>
            )
        }
    ];

    // Emergency resources
    const emergencyResources: EmergencyResource[] = [
        {
            id: '1',
            name: 'Emergency Services',
            description: 'For immediate danger or emergencies',
            phone: '911'
        },
        {
            id: '2',
            name: 'National Domestic Violence Hotline',
            description: '24/7 support for domestic violence situations',
            phone: '1-800-799-7233',
            link: 'https://www.thehotline.org'
        },
        {
            id: '3',
            name: 'RAINN (Rape, Abuse & Incest National Network)',
            description: 'Sexual assault support and resources',
            phone: '1-800-656-4673',
            link: 'https://www.rainn.org'
        },
        {
            id: '4',
            name: 'Crisis Text Line',
            description: 'Text-based mental health support',
            phone: 'Text HOME to 741741',
            link: 'https://www.crisistextline.org'
        },
        {
            id: '5',
            name: 'Internet Crime Complaint Center (IC3)',
            description: 'For reporting internet-related crimes, including scams',
            link: 'https://www.ic3.gov'
        },
        {
            id: '6',
            name: 'Federal Trade Commission',
            description: 'Report scams and fraudulent activity',
            link: 'https://reportfraud.ftc.gov'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/profile"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Safety Center</h1>
                        </div>
                        <Link
                            to="/help"
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <HelpCircle size={20} className="text-gray-600" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Safety Banner */}
            <div className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Your Safety Matters</h2>
                        <p className="text-white/90">
                            We're committed to creating a safe dating environment. Review our safety tips,
                            report concerns, and access resources to help you date with confidence.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex max-w-lg mx-auto">
                        <button
                            className={`flex-1 py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'tips'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('tips')}
                        >
                            Safety Tips
                        </button>
                        <button
                            className={`flex-1 py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'report'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('report')}
                        >
                            Report a Concern
                        </button>
                        <button
                            className={`flex-1 py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'resources'
                                ? 'border-[#FF6B81] text-[#FF6B81]'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('resources')}
                        >
                            Resources
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">

                    {/* Safety Tips Tab */}
                    {activeTab === 'tips' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                        <Info size={20} className="text-[#FF6B81]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800">Dating Safety Guidelines</h2>
                                        <p className="text-sm text-gray-600">
                                            Essential tips to help you stay safe while dating
                                        </p>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {safetyTopics.map(topic => (
                                        <div key={topic.id} className="p-4">
                                            <button
                                                className="w-full flex items-center justify-between"
                                                onClick={() => toggleTopic(topic.id)}
                                                aria-expanded={expandedTopics.includes(topic.id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        {topic.icon}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{topic.title}</span>
                                                </div>
                                                {expandedTopics.includes(topic.id) ? (
                                                    <ChevronUp size={20} className="text-gray-500" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-500" />
                                                )}
                                            </button>

                                            {expandedTopics.includes(topic.id) && (
                                                <div className="mt-4 pl-11">
                                                    {topic.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-medium text-gray-800">Safety Features</h2>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                            <Bell size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Emergency Contact</h3>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Add trusted contacts who can be alerted with your location in case of emergency.
                                            </p>
                                            <Link to="/settings" className="text-[#FF6B81] text-sm hover:underline">
                                                Set up emergency contacts
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                            <Check size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Photo Verification</h3>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Verify your profile to show others you're really you and find other verified members.
                                            </p>
                                            <Link to="/verification" className="text-[#FF6B81] text-sm hover:underline">
                                                Get verified
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                                            <Lock size={16} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Block & Report</h3>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Easily block users and report inappropriate behavior to our safety team.
                                            </p>
                                            <Link to="/blocked-users" className="text-[#FF6B81] text-sm hover:underline">
                                                Manage blocked users
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Report a Concern Tab */}
                    {activeTab === 'report' && (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                    <Flag size={20} className="text-[#FF6B81]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800">Report a Concern</h2>
                                    <p className="text-sm text-gray-600">
                                        We take all reports seriously and review them promptly
                                    </p>
                                </div>
                            </div>

                            <div className="p-4">
                                {reportSuccess ? (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Check size={24} className="text-green-600" />
                                        </div>
                                        <h3 className="text-green-800 font-medium mb-1">Report Submitted</h3>
                                        <p className="text-green-700 text-sm mb-3">
                                            Thank you for your report. Our safety team will review it shortly.
                                        </p>
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                                            onClick={() => setReportSuccess(false)}
                                        >
                                            Submit Another Report
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReportSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                What would you like to report?*
                                            </label>
                                            <select
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                                value={reportType}
                                                onChange={(e) => setReportType(e.target.value)}
                                                required
                                            >
                                                <option value="">Select a reason</option>
                                                <option value="fake_profile">Fake profile or scammer</option>
                                                <option value="inappropriate">Inappropriate content or behavior</option>
                                                <option value="harassment">Harassment or bullying</option>
                                                <option value="underAge">User appears to be underage</option>
                                                <option value="offline">Concerning offline behavior</option>
                                                <option value="other">Other concern</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                User's name or ID (if applicable)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Example: username or match ID"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                You can find this on their profile or in your conversation
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Please describe what happened*
                                            </label>
                                            <textarea
                                                placeholder="Please provide as much detail as possible..."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-32"
                                                value={reportDescription}
                                                onChange={(e) => setReportDescription(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-start">
                                                <Info size={18} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                                <p className="text-sm text-blue-700">
                                                    Your report is confidential and will be reviewed by our safety team.
                                                    We may reach out for additional information if needed.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                disabled={!reportType || !reportDescription}
                                            >
                                                Submit Report
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                        <Phone size={20} className="text-[#FF6B81]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800">Emergency Resources</h2>
                                        <p className="text-sm text-gray-600">
                                            Support services and helplines
                                        </p>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {emergencyResources.map(resource => (
                                        <div key={resource.id} className="p-4">
                                            <h3 className="font-medium text-gray-800 mb-1">{resource.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {resource.phone && (
                                                    <a
                                                        href={`tel:${resource.phone.replace(/\D/g, '')}`}
                                                        className="inline-flex items-center px-3 py-1.5 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/20 transition-colors"
                                                    >
                                                        <Phone size={14} className="mr-1.5" />
                                                        {resource.phone}
                                                    </a>
                                                )}
                                                {resource.link && (
                                                    <a
                                                        href={resource.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                                    >
                                                        Website
                                                        <ChevronRight size={14} className="ml-1" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-medium text-gray-800">Legal & Privacy</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <Link to="/terms" className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-800">Terms of Service</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </Link>
                                    <Link to="/privacy" className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-800">Privacy Policy</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </Link>
                                    <Link to="/community" className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-800">Community Guidelines</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500 mb-3">Need immediate help from our team?</p>
                                <Link
                                    to="/help"
                                    className="inline-flex items-center px-4 py-2 border border-[#FF6B81] text-[#FF6B81] rounded-lg hover:bg-[#FF6B81]/5 transition-colors"
                                >
                                    <HelpCircle size={18} className="mr-2" />
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SafetyCenter;