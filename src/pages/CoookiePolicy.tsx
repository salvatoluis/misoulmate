import React, { useState } from 'react';
import { ChevronRight, Cookie, ChevronDown, ChevronUp, HelpCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookieSection {
    id: string;
    title: string;
    content: React.ReactNode;
}

const CookiePolicy: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['what']);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const lastUpdated = 'June 1, 2025';

    const cookieSections: CookieSection[] = [
        {
            id: 'what',
            title: 'What Are Cookies',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Authenticate users and remember your preferences</li>
                        <li>Deliver and measure the effectiveness of advertising campaigns</li>
                        <li>Analyze your use of our services and improve our features</li>
                        <li>Prevent fraud and enhance the security of our platform</li>
                        <li>Personalize content and provide recommendations</li>
                    </ul>
                    <p>
                        Other similar technologies are also used for these purposes, such as web beacons, pixels, mobile identifiers, and tracking URLs. All of these technologies are referred to in this Cookie Policy as "cookies."
                    </p>
                </div>
            )
        },
        {
            id: 'types',
            title: 'Types of Cookies We Use',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We use the following types of cookies on our platform:
                    </p>

                    <h3 className="font-medium text-gray-800 mt-4">Essential Cookies</h3>
                    <p>
                        These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Authentication cookies to verify your identity and maintain your logged-in status</li>
                        <li>Security cookies to prevent fraud and protect your account</li>
                        <li>Load balancing cookies to distribute traffic to different servers</li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Functional Cookies</h3>
                    <p>
                        These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Language preference cookies</li>
                        <li>Location cookies to provide location-based matches</li>
                        <li>Preference cookies to remember your settings and display options</li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Analytics Cookies</h3>
                    <p>
                        These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Google Analytics cookies to understand how you navigate through our services</li>
                        <li>Performance cookies to measure page load times</li>
                        <li>Heatmap cookies to track cursor movements and clicks</li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Advertising/Targeting Cookies</h3>
                    <p>
                        These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Retargeting cookies to show you ads based on your previous visits to our site</li>
                        <li>Social media cookies to enable social sharing and engagement features</li>
                        <li>Marketing cookies to deliver ads relevant to your interests</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'third-party',
            title: 'Third-Party Cookies',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        Some cookies are placed by third parties on our behalf. These third parties may include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Analytics providers</span> (such as Google Analytics) to help us understand how users interact with our services
                        </li>
                        <li>
                            <span className="font-medium">Advertising networks</span> (such as Facebook and Google) to help deliver ads that are relevant to your interests
                        </li>
                        <li>
                            <span className="font-medium">Social media platforms</span> to enable you to share content from our site and to provide login functionality through their platforms
                        </li>
                        <li>
                            <span className="font-medium">Security and fraud prevention services</span> to monitor and prevent fraudulent activities and security breaches
                        </li>
                    </ul>
                    <p>
                        These third parties may use cookies, web beacons, and similar technologies to collect or receive information from our website and elsewhere on the internet and use that information to provide measurement services and target ads.
                    </p>
                    <p>
                        The way these third parties collect and use your information is governed by their privacy policies. We encourage you to review the privacy policies of these third-party service providers.
                    </p>
                </div>
            )
        },
        {
            id: 'manage',
            title: 'Managing Your Cookie Preferences',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        You have several options to manage your cookie preferences:
                    </p>

                    <h3 className="font-medium text-gray-800 mt-4">Through our Cookie Consent Tool</h3>
                    <p>
                        When you first visit our site, you will be presented with a cookie banner that allows you to accept or decline different categories of cookies. You can change your preferences at any time by clicking on the "Cookie Preferences" link in the footer of our website.
                    </p>

                    <h3 className="font-medium text-gray-800 mt-4">Browser Settings</h3>
                    <p>
                        Most web browsers allow you to control cookies through their settings preferences. Here's how to manage cookies in popular browsers:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><span className="font-medium">Google Chrome:</span> Settings → Privacy and Security → Cookies and other site data</li>
                        <li><span className="font-medium">Mozilla Firefox:</span> Options → Privacy & Security → Cookies and Site Data</li>
                        <li><span className="font-medium">Apple Safari:</span> Preferences → Privacy → Cookies and website data</li>
                        <li><span className="font-medium">Microsoft Edge:</span> Settings → Cookies and site permissions → Cookies</li>
                    </ul>
                    <p>
                        Please note that blocking all cookies will negatively impact the usability of many websites, including ours. Some features of the site may not work if you have disabled cookies.
                    </p>

                    <h3 className="font-medium text-gray-800 mt-4">Mobile Settings</h3>
                    <p>
                        On your mobile device, you can adjust your privacy and advertising settings to limit tracking. For example:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><span className="font-medium">iOS devices:</span> Settings → Privacy → Tracking → Limit Ad Tracking</li>
                        <li><span className="font-medium">Android devices:</span> Settings → Google → Ads → Opt out of Ads Personalization</li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Opt-Out Tools</h3>
                    <p>
                        You can opt out of certain third-party targeting and advertising cookies by using the opt-out tools provided by various industry groups:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B81] hover:underline">Digital Advertising Alliance (DAA)</a></li>
                        <li><a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B81] hover:underline">Network Advertising Initiative (NAI)</a></li>
                        <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF6B81] hover:underline">European Interactive Digital Advertising Alliance (EDAA)</a></li>
                    </ul>

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex mt-4">
                        <AlertCircle size={18} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-700 text-sm">
                            Please note that even if you opt out of certain cookies, you may still see advertisements, but they will not be tailored to your interests.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'expiration',
            title: 'Cookie Lifespans',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        Cookies can remain on your device for different periods of time depending on their type:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Session Cookies:</span> These are temporary cookies that exist only during your browser session. They are deleted from your device when you close your browser.
                        </li>
                        <li>
                            <span className="font-medium">Persistent Cookies:</span> These remain on your device after you close your browser and may be used by your browser on subsequent visits to our site. They remain on your device until they expire or are deleted.
                        </li>
                    </ul>
                    <p>
                        The expiration date of a cookie depends on its purpose. For example:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Authentication cookies typically expire when you log out or after a certain period of inactivity</li>
                        <li>Preference cookies may last for several months to remember your settings</li>
                        <li>Advertising cookies often expire after 30-90 days</li>
                        <li>Analytics cookies may be retained for up to two years to track user behavior over time</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'changes',
            title: 'Changes to This Cookie Policy',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised Cookie Policy on our website. If we make material changes to this policy, we will notify you by email or by means of a notice on our website prior to the changes becoming effective.
                    </p>
                    <p>
                        We encourage you to periodically review this page for the latest information on our cookie practices.
                    </p>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact Us',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        If you have any questions or concerns about our use of cookies or this Cookie Policy, please contact us at:
                    </p>
                    <p className="font-medium">
                        Email: privacy@misoulmate.com<br />
                        Address: 123 Dating Avenue, Suite 500, San Francisco, CA 94103, USA
                    </p>
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
                                to="/privacy"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Cookie Policy</h1>
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

            {/* Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-4">
                                <Cookie size={24} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Cookie Policy</h2>
                                <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            This Cookie Policy explains how miSoulMate uses cookies and similar technologies to recognize and remember you when you visit our website and apps, and how you can control them.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="divide-y divide-gray-100">
                            {cookieSections.map(section => (
                                <div key={section.id} className="p-5">
                                    <button
                                        className="w-full flex items-center justify-between"
                                        onClick={() => toggleSection(section.id)}
                                        aria-expanded={expandedSections.includes(section.id)}
                                    >
                                        <span className="font-semibold text-lg text-gray-800">{section.title}</span>
                                        {expandedSections.includes(section.id) ? (
                                            <ChevronUp size={20} className="text-gray-500" />
                                        ) : (
                                            <ChevronDown size={20} className="text-gray-500" />
                                        )}
                                    </button>

                                    {expandedSections.includes(section.id) && (
                                        <div className="mt-4">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-5 mb-6">
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">Cookie Preferences</h3>
                        <p className="text-gray-700 mb-4">
                            You can customize which cookies you allow on miSoulMate. Please note that blocking some types of cookies may impact your experience on our site.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">Essential Cookies</p>
                                    <p className="text-sm text-gray-500">Required for basic site functionality</p>
                                </div>
                                <div className="w-12 h-6 bg-primary rounded-full relative cursor-not-allowed opacity-75">
                                    <div className="absolute right-0.5 top-0.5 bg-white w-5 h-5 rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">Functional Cookies</p>
                                    <p className="text-sm text-gray-500">Enhance site functionality and personalization</p>
                                </div>
                                <label className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                    <input type="checkbox" className="sr-only" defaultChecked />
                                    <div className="absolute right-0.5 top-0.5 bg-white w-5 h-5 rounded-full"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">Analytics Cookies</p>
                                    <p className="text-sm text-gray-500">Help us improve our services</p>
                                </div>
                                <label className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                    <input type="checkbox" className="sr-only" defaultChecked />
                                    <div className="absolute right-0.5 top-0.5 bg-white w-5 h-5 rounded-full"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-800">Advertising Cookies</p>
                                    <p className="text-sm text-gray-500">Used to show you relevant ads</p>
                                </div>
                                <label className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                    <input type="checkbox" className="sr-only" defaultChecked />
                                    <div className="absolute right-0.5 top-0.5 bg-white w-5 h-5 rounded-full"></div>
                                </label>
                            </div>
                        </div>

                        <button className="mt-5 w-full py-2.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-lg transition-colors">
                            Save Preferences
                        </button>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500">
                            By using miSoulMate, you consent to our use of cookies in accordance with this Cookie Policy and our Privacy Policy.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/terms"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/privacy"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/safety"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Safety Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;