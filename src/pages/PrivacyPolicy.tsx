import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp, HelpCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PrivacySection {
    id: string;
    title: string;
    content: React.ReactNode;
}

const PrivacyPolicy: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['information']);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const lastUpdated = 'June 1, 2025';

    const privacySections: PrivacySection[] = [
        {
            id: 'information',
            title: 'Information We Collect',
            content: (
                <div className="space-y-3 text-gray-700">
                    <h3 className="font-medium text-gray-800">Information you provide to us:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Account Information:</span> When you create an account, you provide us with at least your login credentials, as well as some basic details necessary for the service to work, such as your gender, date of birth, and sexual orientation.
                        </li>
                        <li>
                            <span className="font-medium">Profile Information:</span> To help you connect with others on miSoulMate, we may ask you to upload additional information to your profile, such as details about yourself, your lifestyle, interests, preferences, and photos.
                        </li>
                        <li>
                            <span className="font-medium">Content:</span> When you engage with our community, we collect the content you contribute, as well as information about when and how you created it. This includes your messages to other users, photos you upload, and information about your interactions with other users.
                        </li>
                        <li>
                            <span className="font-medium">Purchase Information:</span> If you purchase our premium services, we collect payment and billing data, including your name, address, and financial information, depending on the payment method you choose.
                        </li>
                        <li>
                            <span className="font-medium">Surveys and Marketing:</span> From time to time, we may invite you to participate in surveys or offer marketing opportunities. If you choose to engage with these, we collect the information you provide.
                        </li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Information we collect automatically:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Usage Information:</span> We collect information about your activity on our services, such as how you use them (e.g., date and time you logged in, features you've used, searches, clicks and pages viewed, how you navigate between pages) and how you interact with other users (e.g., users you connect and interact with, time and date of your exchanges, number of messages you send and receive).
                        </li>
                        <li>
                            <span className="font-medium">Device Information:</span> We collect information from and about the device(s) you use to access our services, including hardware and software information such as IP address, device ID and type, app and device settings and characteristics, app crashes, advertising IDs, browser type, version and language, operating system, and time zones.
                        </li>
                        <li>
                            <span className="font-medium">Location Data:</span> When you use our service, we collect location data to help you match with other users, either through GPS, Bluetooth, or WiFi connections. If you decline permission for us to collect your geolocation, we will not collect it, but this may affect some functionality of the service.
                        </li>
                        <li>
                            <span className="font-medium">Cookies and Similar Technologies:</span> We use cookies and similar technologies to recognize you, remember your preferences, and track your use of our app. You can control cookies through your browser settings and other tools.
                        </li>
                    </ul>

                    <h3 className="font-medium text-gray-800 mt-4">Information from third parties:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Social Media:</span> If you choose to log in to our services using a social media account, we will receive social media data such as your name and email address to authenticate you.
                        </li>
                        <li>
                            <span className="font-medium">Other Partners:</span> We may receive information about you from our partners, for instance when miSoulMate accounts can be created through a partner's website (such as a social network).
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'use',
            title: 'How We Use Your Information',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        The main reason we use your information is to deliver and improve our services. Additionally, we use your information to help keep you safe and to provide you with advertising that may be of interest to you. Here's how:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">To operate our services:</span> We use your information to deliver our services, process transactions, manage your account, communicate with you, and connect you with other users. We also use your information to respond to your comments and questions.
                        </li>
                        <li>
                            <span className="font-medium">To improve our services:</span> We use your information to improve our services and develop new products, features, and services. This includes analyzing how users interact with our app to enhance user experience.
                        </li>
                        <li>
                            <span className="font-medium">To personalize your experience:</span> We use your information to personalize the service, providing content and features that match your profile, activities, and interests. We also use it to ensure that you see relevant advertisements.
                        </li>
                        <li>
                            <span className="font-medium">To maintain a safe environment:</span> We use information to detect and prevent fraud and other harmful activity, to resolve disputes, and to enforce our terms.
                        </li>
                        <li>
                            <span className="font-medium">For research and development:</span> We may use your information for research and analytical purposes to improve user safety and security, enhance our services, develop new features, and conduct audits and troubleshooting activities.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'sharing',
            title: 'How We Share Your Information',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We share your information with:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Other users:</span> When you create a profile, other users will be able to see information you have shared with us, such as your photos, basic information, interests, and preferences. When you chat with other users, you're sharing content with them.
                        </li>
                        <li>
                            <span className="font-medium">Service providers:</span> We engage service providers to perform functions and provide services to us, such as hosting, content moderation, analytics, customer service, marketing, advertising, payment processing, and security.
                        </li>
                        <li>
                            <span className="font-medium">Partners:</span> We may share information with business partners for marketing or promotional purposes, or to operate co-branded services, with your consent where required.
                        </li>
                        <li>
                            <span className="font-medium">Legal requirements:</span> We may disclose your information if reasonably necessary to: (i) comply with a legal process, such as a court order, subpoena, or search warrant; (ii) protect our rights, privacy, safety or property, or that of you or others; or (iii) enforce our terms of service.
                        </li>
                        <li>
                            <span className="font-medium">Business transfers:</span> We may share your information if miSoulMate is involved in a merger, acquisition, reorganization, sale of some or all of its assets, bankruptcy, or similar transaction.
                        </li>
                    </ul>
                    <p>
                        We do not sell your personal information to third parties.
                    </p>
                </div>
            )
        },
        {
            id: 'choices',
            title: 'Your Rights and Choices',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We want you to be in control of your information, so we provide you with the following tools:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Access/Update tools in the service:</span> Tools and account settings that help you to access, rectify, or delete information that you provided to us and that's associated with your account. These tools are accessible in the settings section of your profile.
                        </li>
                        <li>
                            <span className="font-medium">Device permissions:</span> Mobile platforms have permission systems for specific types of device data and notifications, such as phone contacts, pictures, location services, and push notifications. You can change your settings on your device to either consent or oppose the collection of the corresponding information or the display of the corresponding notifications.
                        </li>
                        <li>
                            <span className="font-medium">Deletion:</span> You can delete your account by using the corresponding functionality directly on the service. We retain certain information as required by law or for legitimate business purposes.
                        </li>
                    </ul>
                    <p className="mt-4">
                        <span className="font-medium">Rights you may have under applicable laws:</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Right to Access:</span> You can request a copy of your personal data.
                        </li>
                        <li>
                            <span className="font-medium">Right to Rectification:</span> You can request that we correct inaccurate or incomplete information.
                        </li>
                        <li>
                            <span className="font-medium">Right to Erasure:</span> You can request that we delete your personal data.
                        </li>
                        <li>
                            <span className="font-medium">Right to Restriction of Processing:</span> You can ask us to restrict the processing of your personal data.
                        </li>
                        <li>
                            <span className="font-medium">Right to Data Portability:</span> You can request a copy of your data in a structured, commonly used, and machine-readable format.
                        </li>
                        <li>
                            <span className="font-medium">Right to Object:</span> You can object to our processing of your personal data.
                        </li>
                    </ul>
                    <p>
                        To exercise these rights, you can contact us at privacy@misoulmate.com. Note that these rights may be limited in some circumstances by local law requirements.
                    </p>
                </div>
            )
        },
        {
            id: 'california',
            title: 'California Privacy Rights',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). These include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <span className="font-medium">Right to Know:</span> You can request information about the personal information we've collected about you, including the categories of personal information, the sources from which we collected it, the purpose for collecting it, and with whom we shared it.
                        </li>
                        <li>
                            <span className="font-medium">Right to Delete:</span> You can request that we delete the personal information we have collected from you, subject to certain exceptions.
                        </li>
                        <li>
                            <span className="font-medium">Right to Opt-Out of Sales and Sharing:</span> You have the right to opt-out of the sale of your personal information or sharing for cross-context behavioral advertising.
                        </li>
                        <li>
                            <span className="font-medium">Right to Correct:</span> You can request that we correct inaccurate personal information maintained about you.
                        </li>
                        <li>
                            <span className="font-medium">Right to Limit Use of Sensitive Personal Information:</span> You can request to limit the use of your sensitive personal information.
                        </li>
                    </ul>
                    <p>
                        To exercise these rights, you can contact us at privacy@misoulmate.com or use the "Do Not Sell or Share My Personal Information" link on our website. We will not discriminate against you for exercising your rights under the CCPA/CPRA.
                    </p>
                </div>
            )
        },
        {
            id: 'security',
            title: 'How We Protect Your Information',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We work hard to protect you from unauthorized access, alteration, disclosure, or destruction of your personal information. As with all technology companies, although we take steps to secure your information, we do not promise, and you should not expect, that your personal information will always remain secure.
                    </p>
                    <p>
                        We regularly monitor our systems for possible vulnerabilities and attacks and regularly review our information collection, storage, and processing practices to update our physical, technical, and organizational security measures.
                    </p>
                    <p>
                        We may suspend your use of all or part of the services without notice if we suspect or detect any breach of security. If you believe that your account or information is no longer secure, please notify us immediately at security@misoulmate.com.
                    </p>
                </div>
            )
        },
        {
            id: 'children',
            title: 'Children\'s Privacy',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        Our services are restricted to individuals who are 18 years of age or older. We do not knowingly collect, maintain, or use personal information from children under 18 years of age. If we learn that we have collected personal information of a child under 18, we will take steps to delete such information from our files as soon as possible.
                    </p>
                    <p>
                        If you believe that we might have any information from or about a child under 18, please contact us at privacy@misoulmate.com.
                    </p>
                </div>
            )
        },
        {
            id: 'international',
            title: 'International Data Transfers',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        miSoulMate operates globally and may transfer your data to third parties in locations around the world for the purposes described in this privacy policy. Wherever your personal information is transferred, stored, or processed by us, we will take reasonable steps to safeguard the privacy of your personal information.
                    </p>
                    <p>
                        When we transfer personal data outside of the EEA, UK, or Switzerland, we ensure an adequate level of protection for the rights of data subjects based on the adequacy of the receiving country's data protection laws, contractual obligations placed on the recipient of the data, or EU-US and Swiss-US Privacy Shield principles.
                    </p>
                </div>
            )
        },
        {
            id: 'retention',
            title: 'Data Retention',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We keep your personal information only as long as we need it for legitimate business purposes and as permitted by applicable law. If you decide to stop using our services, you can close your account and your profile will no longer be visible to other users. Note that we will keep some of your information after you close your account:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            We retain your personal information after you have closed your account to comply with legal obligations, resolve disputes, prevent fraud and abuse, enforce our terms, or take other actions permitted by law.
                        </li>
                        <li>
                            Information you have shared with others (e.g., through messages) will remain visible after you close your account, although your name and profile picture will no longer be visible.
                        </li>
                        <li>
                            We retain de-personalized information after your account has been closed.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'cookies',
            title: 'Cookies and Similar Technologies',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        When you visit or interact with our services, we or our authorized service providers may use cookies, web beacons, and other similar technologies for storing information to help provide you with a better, faster, and safer experience, and for advertising purposes.
                    </p>
                    <p>
                        We use these technologies to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Authenticate users and provide personalized content</li>
                        <li>Remember user preferences and settings</li>
                        <li>Determine the popularity of content</li>
                        <li>Deliver and measure the effectiveness of advertising campaigns</li>
                        <li>Analyze site traffic and trends, and generally understand the online behaviors and interests of people who interact with our services</li>
                    </ul>
                    <p>
                        You can control cookies through your browser settings and other tools. However, if you block certain cookies, you may not be able to register, login, or access certain parts or make full use of the services.
                    </p>
                </div>
            )
        },
        {
            id: 'changes',
            title: 'Changes to This Policy',
            content: (
                <div className="space-y-3 text-gray-700">
                    <p>
                        We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this Privacy Policy. If we make material changes to this Privacy Policy, we will notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.
                    </p>
                    <p>
                        Your continued use of our services after the effective date of any update to the Privacy Policy will mean that you accept the updated Privacy Policy.
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
                        If you have questions about this Privacy Policy, please contact us at:
                    </p>
                    <p className="font-medium">
                        Email: privacy@misoulmate.com<br />
                        Address: 123 Dating Avenue, Suite 500, San Francisco, CA 94103, USA<br />
                        Data Protection Officer: dpo@misoulmate.com
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
                            <h1 className="text-xl font-bold text-gray-800">Privacy Policy</h1>
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
                                <Lock size={24} className="text-[#FF6B81]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
                                <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            This Privacy Policy describes how miSoulMate collects, uses, and discloses your information and how you can control your privacy settings when using our services.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="divide-y divide-gray-100">
                            {privacySections.map(section => (
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
                            By using miSoulMate, you acknowledge that you have read and understood this Privacy Policy and our handling of your personal information.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/terms"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/safety"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Safety Center
                            </Link>
                            <Link
                                to="/cookies"
                                className="text-[#FF6B81] hover:underline text-sm font-medium"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;