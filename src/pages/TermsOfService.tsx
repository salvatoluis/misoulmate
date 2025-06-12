import React, { useState } from 'react';
import { ChevronRight, FileText, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsSection {
    id: string;
    title: string;
    content: React.ReactNode;
}

const TermsOfService: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['introduction']);

    // Toggle section expansion
    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const lastUpdated = 'June 1, 2025';

    const termsSections: TermsSection[] = [
        {
            id: 'introduction',
            title: 'Introduction',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        Welcome to miSoulMate. These Terms of Service ("Terms") govern your access to and use of the miSoulMate application, website, and services (collectively, the "Service"). Please read these Terms carefully before accessing or using our Service.
                    </p>
                    <p>
                        By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access or use any services.
                    </p>
                </div>
            )
        },
        {
            id: 'eligibility',
            title: 'Eligibility',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        You must be at least 18 years old to create an account on miSoulMate and use the Service. By creating an account and using the Service, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You are at least 18 years old.</li>
                        <li>You can form a binding contract with miSoulMate.</li>
                        <li>You are not a person who is barred from using the Service under the laws of the United States or any other applicable jurisdiction.</li>
                        <li>You will comply with these Terms and all applicable local, state, national, and international laws, rules, and regulations.</li>
                        <li>You have never been convicted of or pled no contest to a felony, a sex crime, or any crime involving violence or a threat of violence, and that you are not required to register as a sex offender with any state, federal, or local sex offender registry.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'account',
            title: 'Your Account',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        You are responsible for maintaining the confidentiality of your login credentials and are fully responsible for all activities that occur under your account. You agree to immediately notify miSoulMate of any unauthorized use of your account or any other breach of security.
                    </p>
                    <p>
                        Your account is personal to you and you agree not to provide any other person with access to this Service using your username, password, or other security information.
                    </p>
                    <p>
                        You agree that all information you provide to register with this Service or otherwise is governed by our Privacy Policy, and you consent to all actions we take with respect to your information consistent with our Privacy Policy.
                    </p>
                </div>
            )
        },
        {
            id: 'content',
            title: 'User Content',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        You are solely responsible for the content and information that you post, upload, publish, link to, transmit, record, display or otherwise make available (collectively, "post") on the Service, including messages, photos, videos, profile text, and any other content ("User Content").
                    </p>
                    <p>
                        You agree that you will not post User Content that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Is fraudulent, false, misleading, or deceptive</li>
                        <li>Infringes on the rights of any third party, including copyright, trademark, privacy, or publicity rights</li>
                        <li>Contains nudity, sexually explicit content, or is pornographic</li>
                        <li>Is defamatory, abusive, harassing, threatening, or violent</li>
                        <li>Promotes racism, bigotry, hatred, or physical harm against any group or individual</li>
                        <li>Is illegal or promotes illegal activities</li>
                        <li>Impersonates any person or entity</li>
                        <li>Contains unsolicited promotions, political campaigning, advertising, or solicitations</li>
                        <li>Contains private or personally identifiable information belonging to others without their consent</li>
                        <li>Contains viruses, corrupted data, or other harmful files</li>
                    </ul>
                    <p>
                        miSoulMate reserves the right, but is not obligated, to monitor and/or review all User Content, and to remove any User Content that violates these Terms or that otherwise violates our Community Guidelines.
                    </p>
                </div>
            )
        },
        {
            id: 'license',
            title: 'License Grant',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        By posting User Content on the Service, you grant to miSoulMate a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to host, use, distribute, modify, run, copy, publicly display, translate, and create derivative works of your User Content in connection with the operation and provision of the Service.
                    </p>
                    <p>
                        This license terminates when you delete your User Content or your account, except:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Where your User Content has been shared with others and they have not deleted it</li>
                        <li>Where miSoulMate has used your User Content in promotional materials or for legal purposes</li>
                        <li>Where reasonably necessary for technical backup and storage purposes</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'subscriptions',
            title: 'Subscriptions and Payments',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        miSoulMate offers paid subscription services ("Premium Services") that provide enhanced features beyond the basic free service. By purchasing Premium Services, you agree to the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You authorize miSoulMate to charge your chosen payment method for the subscription fees.</li>
                        <li>Subscriptions automatically renew until you cancel. You can cancel at any time through your account settings.</li>
                        <li>Cancellation will stop automatic renewal, but you will not receive a refund for the current billing period.</li>
                        <li>We may change subscription fees by giving you notice before the change takes effect.</li>
                        <li>All purchases are final and non-refundable, except where required by law.</li>
                        <li>Some subscription features may vary by device, platform, or region.</li>
                    </ul>
                    <p>
                        For detailed information about our subscription plans, billing practices, and cancellation policies, please visit our Subscription Information page.
                    </p>
                </div>
            )
        },
        {
            id: 'safety',
            title: 'Safety and Interactions',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        While miSoulMate strives to encourage a respectful user experience, we are not responsible for the conduct of any user on or off the Service. You agree to use caution in all interactions with other users, particularly if you decide to communicate off the platform or meet in person.
                    </p>
                    <p>
                        You understand that miSoulMate does not conduct criminal background checks on its users or otherwise inquire into the background of its users. miSoulMate makes no representations or warranties as to the conduct or compatibility of users.
                    </p>
                    <p>
                        miSoulMate reserves the right to conduct any criminal background check or other screenings at any time, and to use available public records for any purpose related to the operation of the Service.
                    </p>
                    <p>
                        Please refer to our <Link to="/safety" className="text-[#FF6B81] hover:underline">Safety Center</Link> for tips on safe dating practices.
                    </p>
                </div>
            )
        },
        {
            id: 'termination',
            title: 'Termination',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
                    </p>
                    <p>
                        If you wish to terminate your account, you may simply discontinue using the Service, or delete your account through the account settings.
                    </p>
                    <p>
                        All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                </div>
            )
        },
        {
            id: 'disclaimers',
            title: 'Disclaimers',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. MISOULMATE EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>
                        MISOULMATE MAKES NO WARRANTY THAT:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>THE SERVICE WILL MEET YOUR REQUIREMENTS</li>
                        <li>THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE</li>
                        <li>THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE</li>
                        <li>THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'limitation',
            title: 'Limitation of Liability',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        IN NO EVENT SHALL MISOULMATE, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT</li>
                        <li>PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICE</li>
                        <li>ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION STORED THEREIN</li>
                        <li>ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICE</li>
                        <li>ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICE BY ANY THIRD PARTY</li>
                        <li>ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICE</li>
                    </ul>
                    <p>
                        THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE JURISDICTION.
                    </p>
                </div>
            )
        },
        {
            id: 'changes',
            title: 'Changes to Terms',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p>
                        By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                    </p>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact Information',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="font-medium">
                        Email: legal@misoulmate.com<br />
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
                                to="/safety"
                                className="text-gray-600 hover:text-gray-800 transition-colors mr-3"
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </Link>
                            <h1 className="text-xl font-bold text-gray-800">Terms of Service</h1>
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
                                <FileText size={24} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Terms of Service</h2>
                                <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            Please read these Terms of Service carefully before using miSoulMate. By accessing or using our service, you agree to be bound by these terms.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="divide-y divide-gray-100">
                            {termsSections.map(section => (
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

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500">
                            By using miSoulMate, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
                        </p>
                        <div className="flex justify-center space-x-4">
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
                            <Link
                                to="/community"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Community Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;