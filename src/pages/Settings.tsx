import React, { useState } from 'react';
import { ChevronRight, Bell, Shield, User, LogOut, Moon, Lock, MessageSquare, Eye } from 'lucide-react';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

interface PrivacySetting {
    id: string;
    title: string;
    description: string;
    value: string;
    options: string[];
}

const Settings: React.FC = () => {
    // User settings state
    const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account');
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
        {
            id: 'new_matches',
            title: 'New Matches',
            description: 'Get notified when you match with someone new',
            enabled: true
        },
        {
            id: 'new_messages',
            title: 'New Messages',
            description: 'Get notified when you receive new messages',
            enabled: true
        },
        {
            id: 'match_activity',
            title: 'Match Activity',
            description: 'Get notified when your matches update their profile',
            enabled: false
        },
        {
            id: 'app_updates',
            title: 'App Updates',
            description: 'Get notified about new features and updates',
            enabled: true
        }
    ]);

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
        {
            id: 'profile_visibility',
            title: 'Profile Visibility',
            description: 'Who can see your profile',
            value: 'Everyone',
            options: ['Everyone', 'Only matches', 'Hidden']
        },
        {
            id: 'location_sharing',
            title: 'Location Sharing',
            description: 'How your location is shared',
            value: 'City only',
            options: ['Exact location', 'City only', 'Hidden']
        },
        {
            id: 'read_receipts',
            title: 'Read Receipts',
            description: 'Let matches know when you\'ve read their messages',
      value: 'On',
            options: ['On', 'Off']
        },
        {
            id: 'activity_status',
            title: 'Activity Status',
            description: 'Show when you\'re active on HeartMatch',
      value: 'On',
            options: ['On', 'Off']
        }
    ]);

    // User data
    const [userData, setUserData] = useState({
        email: 'user@example.com',
        phoneNumber: '+1 (555) 123-4567',
        password: '••••••••'
    });

    // Toggle notification setting
    const toggleNotification = (id: string) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, enabled: !setting.enabled }
                    : setting
            )
        );
    };

    // Change privacy setting
    const changePrivacySetting = (id: string, value: string) => {
        setPrivacySettings(prev =>
            prev.map(setting =>
                setting.id === id
                    ? { ...setting, value: value }
                    : setting
            )
        );
    };

    return (
        <div className="bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
                        <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => window.history.back()}
                        >
                            <ChevronRight size={24} className="transform rotate-180" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-4">
                        <button
                            className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'account'
                                    ? 'border-[#FF6B81] text-[#FF6B81]'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('account')}
                        >
                            Account
                        </button>
                        <button
                            className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'notifications'
                                    ? 'border-[#FF6B81] text-[#FF6B81]'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            Notifications
                        </button>
                        <button
                            className={`py-4 px-1 font-medium border-b-2 transition-colors ${activeTab === 'privacy'
                                    ? 'border-[#FF6B81] text-[#FF6B81]'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            Privacy
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-lg mx-auto">

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <h2 className="text-lg font-medium p-4 border-b border-gray-100">
                                    Account Information
                                </h2>
                                <div className="divide-y divide-gray-100">
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email</p>
                                            <p className="text-sm text-gray-600">{userData.email}</p>
                                        </div>
                                        <button className="text-[#FF6B81] text-sm font-medium">
                                            Edit
                                        </button>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Phone Number</p>
                                            <p className="text-sm text-gray-600">{userData.phoneNumber}</p>
                                        </div>
                                        <button className="text-[#FF6B81] text-sm font-medium">
                                            Edit
                                        </button>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Password</p>
                                            <p className="text-sm text-gray-600">{userData.password}</p>
                                        </div>
                                        <button className="text-[#FF6B81] text-sm font-medium">
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <h2 className="text-lg font-medium p-4 border-b border-gray-100">
                                    Preferences
                                </h2>
                                <div className="divide-y divide-gray-100">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                <Moon size={18} className="text-gray-600" />
                                            </div>
                                            <span className="text-gray-700">Dark Mode</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={darkMode}
                                                onChange={() => setDarkMode(!darkMode)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#FF6B81] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                <MessageSquare size={18} className="text-gray-600" />
                                            </div>
                                            <span className="text-gray-700">Language</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-gray-600 mr-2">English</span>
                                            <ChevronRight size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 flex justify-between items-center text-red-500">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                                            <LogOut size={18} className="text-red-500" />
                                        </div>
                                        <span>Log Out</span>
                                    </div>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                        <Bell size={20} className="text-[#FF6B81]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800">Notification Preferences</h2>
                                        <p className="text-sm text-gray-600">Manage how you receive notifications</p>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {notificationSettings.map(setting => (
                                        <div key={setting.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-700">{setting.title}</p>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={setting.enabled}
                                                    onChange={() => toggleNotification(setting.id)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#FF6B81] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <button className="w-full text-[#FF6B81] font-medium p-2 rounded-lg hover:bg-[#FF6B81]/5 transition-colors">
                                    Pause All Notifications
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center mr-3">
                                        <Shield size={20} className="text-[#FF6B81]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800">Privacy Settings</h2>
                                        <p className="text-sm text-gray-600">Control your privacy and data</p>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {privacySettings.map(setting => (
                                        <div key={setting.id} className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-700">{setting.title}</p>
                                                    <p className="text-sm text-gray-600">{setting.description}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-3">
                                                {setting.options.map(option => (
                                                    <button
                                                        key={option}
                                                        className={`py-2 px-3 rounded-lg text-sm border ${setting.value === option
                                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                            } transition-colors`}
                                                        onClick={() => changePrivacySetting(setting.id, option)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <h2 className="text-lg font-medium p-4 border-b border-gray-100">
                                    Data & Permissions
                                </h2>
                                <div className="divide-y divide-gray-100">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                <Eye size={18} className="text-gray-600" />
                                            </div>
                                            <span className="text-gray-700">View My Data</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                <Lock size={18} className="text-gray-600" />
                                            </div>
                                            <span className="text-gray-700">Download My Data</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                    <div className="p-4 flex justify-between items-center text-red-500">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                                                <User size={18} className="text-red-500" />
                                            </div>
                                            <span>Delete Account</span>
                                        </div>
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;