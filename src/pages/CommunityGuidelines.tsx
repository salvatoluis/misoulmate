// src/pages/CommunityGuidelines.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, AlertTriangle, Check, X, ChevronDown, ChevronUp, Camera, MessageSquare, Users, Flag, Info, ThumbsUp, UserX } from 'lucide-react';

interface Guideline {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    isExpanded?: boolean;
}

const CommunityGuidelines: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['respect']);

    // Toggle section expansion
    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Guidelines data
    const guidelines: Guideline[] = [
        {
            id: 'respect',
            title: 'Respect & Inclusivity',
            icon: <Users className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>At Soulmatify, we're committed to creating a respectful and inclusive environment where everyone feels welcome. Our community is diverse, and we celebrate people of all backgrounds, identities, and orientations.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Do:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Treat everyone with respect and kindness</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Be open-minded and considerate of different perspectives</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Report any behavior that makes you feel uncomfortable</span>
                        </li>
                    </ul>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Don't:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Use hate speech, slurs, or discriminatory language</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Harass, bully, or intimidate other users</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Make jokes or comments that target someone's identity, appearance, or background</span>
                        </li>
                    </ul>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mt-4">
                        <p className="text-yellow-800 text-sm">
                            <AlertTriangle size={16} className="inline mr-1" />
                            Violations of these guidelines may result in account warnings or suspension.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'authenticity',
            title: 'Authenticity & Honesty',
            icon: <Check className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>Building genuine connections starts with being your authentic self. Honesty is fundamental to creating a trustworthy environment for everyone on Soulmatify.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Do:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Use recent photos that clearly show your face</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Provide accurate information about yourself (age, location, etc.)</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Consider getting your profile verified</span>
                        </li>
                    </ul>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Don't:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Use heavily filtered, altered, or outdated photos</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Create fake or misleading profiles</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Pretend to be someone else or misrepresent your identity</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Create multiple accounts to circumvent bans or restrictions</span>
                        </li>
                    </ul>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-4">
                        <p className="text-primary text-sm">
                            <Info size={16} className="inline mr-1" />
                            Verified profiles receive a badge and are prioritized in search results.
                            <Link to="/verification" className="text-[#FF6B81] ml-1 hover:underline">Get verified</Link>
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'safety',
            title: 'Safety & Privacy',
            icon: <Shield className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>Your safety and privacy are top priorities at Soulmatify. We've implemented features to help keep you safe, but it's important to also take personal precautions.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Do:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Take time to get to know someone before sharing personal details</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Meet in public places for your first few dates</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Tell a friend or family member about your date plans</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Use the app's built-in messaging system until you build trust</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Report suspicious behavior immediately</span>
                        </li>
                    </ul>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Don't:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Share your home address, financial information, or other sensitive details</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Send money to someone you've met on the app</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Share intimate photos or videos with matches</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Continue engaging with someone who makes you uncomfortable</span>
                        </li>
                    </ul>

                    <div className="mt-4">
                        <Link to="/safety" className="text-[#FF6B81] hover:underline inline-flex items-center">
                            Visit our Safety Center for more tips
                            <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>
            )
        },
        {
            id: 'communication',
            title: 'Respectful Communication',
            icon: <MessageSquare className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>How you communicate with others sets the tone for your interactions. Respectful communication helps create meaningful connections and positive experiences.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Do:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Start conversations with thoughtful messages related to the person's profile</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Be respectful of boundaries and take "no" for an answer</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Engage in genuine conversations that build connection</span>
                        </li>
                    </ul>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Don't:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Send inappropriate, offensive, or explicit messages or images</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Make unwelcome sexual advances or harass others</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Continue messaging someone who has expressed disinterest</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Send spam messages or use the app primarily for promotion</span>
                        </li>
                    </ul>

                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-4">
                        <p className="text-red-800 text-sm">
                            <AlertTriangle size={16} className="inline mr-1" />
                            Inappropriate messages can result in immediate account suspension.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'photos',
            title: 'Photo Guidelines',
            icon: <Camera className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>Your photos are an important part of your profile. They help others get to know you and determine if there might be a connection.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Acceptable photos:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Clear, recent photos of yourself</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Photos that show your face clearly (at least in your main photo)</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Photos that showcase your interests and personality</span>
                        </li>
                        <li className="flex items-start">
                            <Check size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Appropriate, fully-clothed photos</span>
                        </li>
                    </ul>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">Prohibited photos:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Explicit or sexually suggestive content</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Photos of children, even if they're your own</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Photos of other people without their permission</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Violent, graphic, or offensive imagery</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Photos with contact information or social media handles</span>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Photos that aren't yours or violate someone else's copyright</span>
                        </li>
                    </ul>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-4">
                        <p className="text-primary text-sm">
                            <ThumbsUp size={16} className="inline mr-1" />
                            Tip: Upload 4-6 varied photos to give others a better sense of who you are.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'reporting',
            title: 'Reporting & Moderation',
            icon: <Flag className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>We rely on our community to help maintain a safe and positive environment. If you encounter behavior that violates our guidelines, please report it.</p>

                    <h4 className="font-medium text-gray-800 mt-4 mb-2">How to report:</h4>
                    <ol className="space-y-2 list-decimal pl-5">
                        <li>Go to the user's profile or the specific message</li>
                        <li>Tap the three dots (•••) or flag icon</li>
                        <li>Select "Report"</li>
                        <li>Choose the reason for reporting</li>
                        <li>Add any additional details if prompted</li>
                        <li>Submit your report</li>
                    </ol>

                    <p className="mt-4">Our moderation team reviews all reports and takes appropriate action based on our guidelines. Actions may include:</p>

                    <ul className="space-y-2 mt-2">
                        <li className="flex items-start">
                            <Info size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Issuing warnings to users</span>
                        </li>
                        <li className="flex items-start">
                            <Info size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Removing inappropriate content</span>
                        </li>
                        <li className="flex items-start">
                            <Info size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Temporarily suspending accounts</span>
                        </li>
                        <li className="flex items-start">
                            <Info size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                            <span>Permanently banning serious or repeat offenders</span>
                        </li>
                    </ul>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-4">
                        <p className="text-primary text-sm">
                            <Shield size={16} className="inline mr-1" />
                            All reports are confidential. The reported user will not know who reported them.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'prohibited',
            title: 'Prohibited Activities',
            icon: <UserX className="text-[#FF6B81]" size={20} />,
            content: (
                <div className="space-y-3">
                    <p>The following activities are strictly prohibited on Soulmatify and may result in immediate account suspension or permanent ban:</p>

                    <ul className="space-y-3 mt-4">
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Harassment & Abuse:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Bullying, stalking, threats, hate speech, or any form of abusive behavior</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Scams & Fraud:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Catfishing, financial scams, phishing, or any deceptive practices</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Solicitation:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Promoting products/services, seeking financial assistance, or soliciting for other purposes</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Inappropriate Content:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Explicit sexual content, nudity, violence, illegal activities, or other offensive material</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Underage Users:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Soulmatify is for adults 18+ only. Misrepresenting your age or attempting to interact with minors is prohibited</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Data Mining & Automation:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Using bots, scrapers, or automated systems to collect user data or interact with the platform</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <X size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                                <span className="font-medium text-gray-800">Legal Violations:</span>
                                <p className="text-gray-600 text-sm mt-0.5">Any activity that violates local, state, or federal laws</p>
                            </div>
                        </li>
                    </ul>

                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-4">
                        <p className="text-red-800 text-sm">
                            <AlertTriangle size={16} className="inline mr-1" />
                            We cooperate with law enforcement when required for serious violations.
                        </p>
                    </div>
                </div>
            )
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
                                to="/help"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Community Guidelines</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Community Promise Banner */}
            <div className="bg-gradient-to-r from-[#FF6B81] to-[#D86D72] text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Our Community Promise</h2>
                        <p className="text-white/90 mb-4">
                            We're committed to fostering a safe, respectful, and inclusive community where everyone can
                            connect authentically. These guidelines help ensure a positive experience for all members.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                <span className="font-medium">Respect</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                <span className="font-medium">Safety</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                <span className="font-medium">Authenticity</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                <span className="font-medium">Inclusivity</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">About Our Guidelines</h2>

                    <p className="text-gray-700 mb-4">
                        Soulmatify is a place to connect, build relationships, and discover meaningful connections.
                        These guidelines help ensure that everyone has a positive and safe experience.
                    </p>

                    <p className="text-gray-700 mb-4">
                        By using Soulmatify, you agree to follow these guidelines and our
                        <Link to="/terms" className="text-[#FF6B81] mx-1 hover:underline">Terms of Service</Link>
                        and
                        <Link to="/privacy" className="text-[#FF6B81] mx-1 hover:underline">Privacy Policy</Link>.
                        Violating these guidelines may result in content removal, account suspension, or permanent banning.
                    </p>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex">
                            <Info size={20} className="text-primary mr-3 flex-shrink-0" />
                            <p className="text-primary text-sm">
                                These guidelines apply to all interactions on Soulmatify, including profiles, messages, and any other content shared on the platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guidelines Sections */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {guidelines.map(guideline => (
                        <div key={guideline.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <button
                                className="w-full p-4 flex items-center justify-between"
                                onClick={() => toggleSection(guideline.id)}
                                aria-expanded={expandedSections.includes(guideline.id)}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                        {guideline.icon}
                                    </div>
                                    <h2 className="text-lg font-medium text-gray-800">{guideline.title}</h2>
                                </div>
                                {expandedSections.includes(guideline.id) ? (
                                    <ChevronUp size={20} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-500" />
                                )}
                            </button>

                            {expandedSections.includes(guideline.id) && (
                                <div className="px-4 pb-4 pt-2">
                                    {guideline.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Conclusion Card */}
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Keeping Our Community Safe Together</h2>

                    <p className="text-gray-700 mb-4">
                        These guidelines are meant to foster a community where everyone feels welcome, safe, and respected.
                        We're constantly reviewing and improving our policies to better serve our community.
                    </p>

                    <p className="text-gray-700 mb-4">
                        If you have questions about our guidelines or want to report a violation,
                        please <Link to="/contact" className="text-[#FF6B81] hover:underline">contact our support team</Link>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                        <Link
                            to="/safety"
                            className="w-full sm:w-auto px-6 py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg font-medium transition-colors text-center"
                        >
                            Visit Safety Center
                        </Link>
                        <Link
                            to="/help"
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                        >
                            Get Help
                        </Link>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="max-w-3xl mx-auto mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Last updated: May 1, 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommunityGuidelines;