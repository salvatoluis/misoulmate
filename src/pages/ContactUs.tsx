// src/pages/ContactUs.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MessageSquare, Phone, HelpCircle, Send, Check, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface ContactTopic {
    id: string;
    label: string;
}

interface FAQ {
    id: string;
    question: string;
    answer: React.ReactNode;
}

const ContactUs: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    // Contact Topics
    const contactTopics: ContactTopic[] = [
        { id: 'account', label: 'Account & Login Issues' },
        { id: 'billing', label: 'Billing & Subscription' },
        { id: 'technical', label: 'Technical Problems' },
        { id: 'safety', label: 'Safety Concerns' },
        { id: 'feedback', label: 'Feedback & Suggestions' },
        { id: 'other', label: 'Other' }
    ];

    // FAQ Items
    const faqs: FAQ[] = [
        {
            id: 'login',
            question: 'I can\'t login to my account',
            answer: (
                <div className="space-y-2">
                    <p>If you're having trouble accessing your account, try these steps:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Verify your email address and password are correct</li>
                        <li>Reset your password through the "Forgot Password" link</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Try accessing from a different device or browser</li>
                        <li>Make sure your app is updated to the latest version</li>
                    </ol>
                    <p>If you still can't access your account, please contact us using the form below.</p>
                </div>
            )
        },
        {
            id: 'subscription',
            question: 'How do I cancel my subscription?',
            answer: (
                <div className="space-y-2">
                    <p>To cancel your miSoulMate subscription:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to Settings {'>'} Subscription</li>
                        <li>Tap on "Manage Subscription"</li>
                        <li>Select "Cancel Subscription"</li>
                        <li>Follow the prompts to confirm cancellation</li>
                    </ol>
                    <p>Please note: If you subscribed through the App Store or Google Play, you'll need to cancel through their respective platforms.</p>
                    <p>Your premium features will remain active until the end of your current billing period.</p>
                </div>
            )
        },
        {
            id: 'photos',
            question: 'Why was my photo rejected?',
            answer: (
                <div className="space-y-2">
                    <p>Photos may be rejected for the following reasons:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>The photo doesn't clearly show your face</li>
                        <li>The photo contains inappropriate content</li>
                        <li>There are other people in the photo</li>
                        <li>The photo contains contact information or social media handles</li>
                        <li>The photo is a screenshot or has text overlays</li>
                        <li>The photo is not yours or is copyrighted material</li>
                    </ul>
                    <p>Please review our <Link to="/community" className="text-[#FF6B81] hover:underline">Community Guidelines</Link> for more information on acceptable photos.</p>
                </div>
            )
        },
        {
            id: 'response',
            question: 'How quickly will I get a response?',
            answer: (
                <div className="space-y-2">
                    <p>Our typical response times:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><span className="font-medium">General inquiries:</span> 1-2 business days</li>
                        <li><span className="font-medium">Account issues:</span> 12-24 hours</li>
                        <li><span className="font-medium">Billing questions:</span> 24-48 hours</li>
                        <li><span className="font-medium">Safety concerns:</span> High priority, usually within 24 hours</li>
                    </ul>
                    <p>We strive to respond to all inquiries as quickly as possible. Response times may be longer during weekends and holidays.</p>
                </div>
            )
        },
        {
            id: 'delete',
            question: 'How do I delete my account?',
            answer: (
                <div className="space-y-2">
                    <p>To delete your miSoulMate account:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to Settings {'>'} Account</li>
                        <li>Scroll to the bottom and tap "Delete Account"</li>
                        <li>Follow the prompts to confirm deletion</li>
                    </ol>
                    <p className="text-red-600">Please note: Account deletion is permanent and cannot be undone. Your profile, matches, messages, and other data will be permanently removed.</p>
                    <p>If you're having issues with the app, consider <Link to="/help" className="text-[#FF6B81] hover:underline">contacting support</Link> before deleting your account.</p>
                </div>
            )
        }
    ];

    // Toggle FAQ expansion
    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to an API
        setTimeout(() => {
            setSubmitted(true);
            // Reset form after successful submission
            setTimeout(() => {
                setEmail('');
                setName('');
                setTopic('');
                setMessage('');
                setSubmitted(false);
            }, 5000);
        }, 1000);
    };

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
                            <h1 className="text-xl font-bold text-gray-800">Contact Us</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-xl mx-auto">

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                            <div className="w-12 h-12 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare size={24} className="text-[#FF6B81]" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">Live Chat</h3>
                            <p className="text-sm text-gray-600 mb-3">Available 9am-8pm EST</p>
                            <button className="w-full py-2 text-sm text-[#FF6B81] border border-[#FF6B81] rounded-lg hover:bg-[#FF6B81]/5 transition-colors">
                                Start Chat
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                            <div className="w-12 h-12 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Mail size={24} className="text-[#FF6B81]" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">Email Support</h3>
                            <p className="text-sm text-gray-600 mb-3">24/7 support via email</p>
                            <a
                                href="mailto:support@miSoulMate.com"
                                className="block w-full py-2 text-sm text-[#FF6B81] border border-[#FF6B81] rounded-lg hover:bg-[#FF6B81]/5 transition-colors"
                            >
                                Email Us
                            </a>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                            <div className="w-12 h-12 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Phone size={24} className="text-[#FF6B81]" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">Phone Support</h3>
                            <p className="text-sm text-gray-600 mb-3">Mon-Fri, 10am-6pm EST</p>
                            <a
                                href="tel:+18005551234"
                                className="block w-full py-2 text-sm text-[#FF6B81] border border-[#FF6B81] rounded-lg hover:bg-[#FF6B81]/5 transition-colors"
                            >
                                Call Us
                            </a>
                        </div>
                    </div>

                    {/* Support Hours */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <Clock size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Support Hours</h2>
                                <p className="text-sm text-gray-600">
                                    When our team is available to help
                                </p>
                            </div>
                        </div>

                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="font-medium text-gray-800 mb-2">Live Chat & Phone Support</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="text-gray-800">9am - 8pm EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="text-gray-800">10am - 6pm EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="text-gray-800">Closed</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Holidays</span>
                                    <span className="text-gray-800">Limited Hours</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-2">Email Support</h3>
                            <p className="text-sm text-gray-600">
                                Our email support team is available 24/7, and we typically respond within 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Common Questions */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <HelpCircle size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Common Questions</h2>
                                <p className="text-sm text-gray-600">
                                    Quick answers to frequently asked questions
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {faqs.map(faq => (
                                <div key={faq.id} className="p-4">
                                    <button
                                        className="w-full flex items-center justify-between text-left"
                                        onClick={() => toggleFAQ(faq.id)}
                                        aria-expanded={expandedFAQ === faq.id}
                                    >
                                        <span className="font-medium text-gray-800">{faq.question}</span>
                                        {expandedFAQ === faq.id ? (
                                            <ChevronUp size={18} className="text-gray-500 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />
                                        )}
                                    </button>

                                    {expandedFAQ === faq.id && (
                                        <div className="mt-3 text-gray-600 text-sm">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-50 text-center">
                            <Link
                                to="/help"
                                className="text-[#FF6B81] hover:underline text-sm inline-flex items-center"
                            >
                                View all FAQs
                                <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                <Send size={20} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Send Us a Message</h2>
                                <p className="text-sm text-gray-600">
                                    We'll get back to you as soon as possible
                                </p>
                            </div>
                        </div>

                        <div className="p-4">
                            {submitted ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-primary" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 mb-6">
                                        Thank you for contacting us. We'll respond to your message as soon as possible.
                                    </p>
                                    <button
                                        className="px-6 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg transition-colors"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                            Your Name*
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Your email address"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="topic">
                                            Topic*
                                        </label>
                                        <select
                                            id="topic"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            required
                                        >
                                            <option value="">Select a topic</option>
                                            {contactTopics.map(option => (
                                                <option key={option.id} value={option.id}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                                            Message*
                                        </label>
                                        <textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-32"
                                            placeholder="Please describe how we can help you..."
                                            required
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full py-3 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;