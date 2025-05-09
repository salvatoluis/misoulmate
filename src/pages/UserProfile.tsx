// src/pages/UserProfile.tsx
import React, { useState, useRef } from 'react';
import {
    Camera, Edit, ChevronRight, LogOut, Bell, Shield,
    CreditCard, Heart, User, Lock, Settings, HelpCircle,
    ChevronDown, Plus, ArrowLeft, Instagram,
    Music,
} from 'lucide-react';

// Dummy user data
const userData = {
    id: "user123",
    name: "Alex Johnson",
    age: 29,
    photos: [
        "/images/user-profile-1.jpg",
        "/images/user-profile-2.jpg",
        "/images/user-profile-3.jpg",
        "/images/user-profile-4.jpg",
    ],
    bio: "Product designer by day, amateur chef by night. Love hiking, travel photography, and finding the best coffee shops in town.\n\nLooking for someone who enjoys good conversation and new adventures.",
    occupation: "Senior Product Designer at TechCorp",
    location: "San Francisco, CA",
    education: "MFA in Design, RISD",
    height: "5'10\"",
    interests: ["Photography", "Cooking", "Hiking", "Travel", "Coffee", "Design"],
    lookingFor: "Relationship",
    showMe: "Women",
    ageRange: [25, 35],
    maxDistance: 25,
    notifications: true,
    subscription: "Premium",
    instagram: "@alex.designs",
    questions: [
        {
            question: "My ideal weekend includes...",
            answer: "A morning hike, exploring a new neighborhood, and cooking dinner with friends."
        },
        {
            question: "I value most in a relationship...",
            answer: "Trust, good communication, and making each other laugh."
        }
    ]
};

const UserProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [editing, setEditing] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state (would be more detailed in a real app)
    const [formData, setFormData] = useState({
        bio: userData.bio,
        occupation: userData.occupation,
        education: userData.education,
        interests: [...userData.interests],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In a real app, you would upload the file to a server here
        console.log("File selected:", e.target.files?.[0]);
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const toggleEdit = () => {
        if (editing) {
            // In a real app, you would save changes to the server here
            userData.bio = formData.bio;
            userData.occupation = formData.occupation;
            userData.education = formData.education;
        }
        setEditing(!editing);
    };

    const handleSignOut = () => {
        // In a real app, this would sign the user out
        alert("User signed out");
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="mr-2 md:hidden">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Profile & Settings</h1>
                    </div>
                    {activeTab === 'profile' && (
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium ${editing
                                    ? 'bg-[#FF6B81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors`}
                            onClick={toggleEdit}
                        >
                            {editing ? 'Save' : 'Edit'}
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="container mx-auto px-4 flex">
                        <button
                            className={`py-3 px-4 text-sm font-medium relative ${activeTab === 'profile'
                                    ? 'text-[#FF6B81]'
                                    : 'text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                            {activeTab === 'profile' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                            )}
                        </button>
                        <button
                            className={`py-3 px-4 text-sm font-medium relative ${activeTab === 'settings'
                                    ? 'text-[#FF6B81]'
                                    : 'text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                            {activeTab === 'settings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B81]"></div>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-6 pb-20">
                {activeTab === 'profile' ? (
                    /* Profile Tab */
                    <div className="space-y-6">
                        {/* Photos Section */}
                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Photos</h2>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {userData.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg overflow-hidden relative group"
                                        >
                                            <img
                                                src={photo}
                                                alt={`User photo ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {editing && (
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                    <button className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            {index === 0 && (
                                                <div className="absolute bottom-2 left-2 bg-[#FF6B81] text-white text-xs px-2 py-0.5 rounded-full">
                                                    Main
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {editing && userData.photos.length < 6 && (
                                        <button
                                            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors"
                                            onClick={handleAddPhoto}
                                        >
                                            <Camera size={24} />
                                            <span className="mt-1 text-xs">Add Photo</span>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </button>
                                    )}
                                </div>

                                {editing && (
                                    <div className="mt-4 text-sm text-gray-500">
                                        Drag to reorder. First photo will be your main profile photo.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* About Section */}
                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">About</h2>
                            </div>

                            <div className="p-4">
                                {editing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    />
                                ) : (
                                    <div className="text-gray-700 space-y-3">
                                        {userData.bio.split('\n\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Work & Education Section */}
                        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection('work')}
                            >
                                <h2 className="text-lg font-bold text-gray-800">Work & Education</h2>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition-transform ${expandedSection === 'work' ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {expandedSection === 'work' && (
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Occupation</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            />
                                        ) : (
                                            <div className="text-gray-700">{userData.occupation}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Education</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            />
                                        ) : (
                                            <div className="text-gray-700">{userData.education}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Interests Section */}
                        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection('interests')}
                            >
                                <h2 className="text-lg font-bold text-gray-800">Interests</h2>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition-transform ${expandedSection === 'interests' ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {expandedSection === 'interests' && (
                                <div className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {userData.interests.map((interest, index) => (
                                            <div
                                                key={index}
                                                className={`px-3 py-1.5 rounded-full text-sm ${editing
                                                        ? 'bg-gray-100 text-gray-700 pr-1.5 group'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {interest}
                                                {editing && (
                                                    <button className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {editing && (
                                            <button className="px-2 py-1.5 rounded-full text-sm bg-[#FF6B81]/10 text-[#FF6B81] flex items-center hover:bg-[#FF6B81]/20 transition-colors">
                                                <Plus size={16} className="mr-1" />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Questions Section */}
                        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection('questions')}
                            >
                                <h2 className="text-lg font-bold text-gray-800">Questions</h2>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition-transform ${expandedSection === 'questions' ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {expandedSection === 'questions' && (
                                <div className="p-4 space-y-5">
                                    {userData.questions.map((item, idx) => (
                                        <div key={idx} className="border-l-2 border-[#FF6B81] pl-4 py-1">
                                            <div className="text-gray-500 mb-1">{item.question}</div>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={item.answer}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                                />
                                            ) : (
                                                <div className="text-gray-700">{item.answer}</div>
                                            )}
                                        </div>
                                    ))}

                                    {editing && (
                                        <button className="w-full mt-3 py-2 flex items-center justify-center text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-lg transition-colors">
                                            <Plus size={16} className="mr-1.5" />
                                            Add Another Question
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Connected Accounts */}
                        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection('accounts')}
                            >
                                <h2 className="text-lg font-bold text-gray-800">Connected Accounts</h2>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition-transform ${expandedSection === 'accounts' ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {expandedSection === 'accounts' && (
                                <div className="divide-y divide-gray-100">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Instagram className="text-pink-500 mr-3" size={20} />
                                            <div>
                                                <div className="font-medium">Instagram</div>
                                                <div className="text-gray-500 text-sm">{userData.instagram}</div>
                                            </div>
                                        </div>
                                        <button className="text-[#FF6B81] text-sm font-medium">Disconnect</button>
                                    </div>

                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Music className="text-green-500 mr-3" size={20} />
                                            <div>
                                                <div className="font-medium">Spotify</div>
                                                <div className="text-gray-500 text-sm">Not connected</div>
                                            </div>
                                        </div>
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                ) : (
                    /* Settings Tab */
                    <div className="space-y-6">
                        {/* Account Settings */}
                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Account</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <User className="text-gray-400 mr-3" size={20} />
                                        <div>Personal Information</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <CreditCard className="text-gray-400 mr-3" size={20} />
                                        <div>
                                            <div>Subscription</div>
                                            <div className="text-sm text-gray-500">{userData.subscription}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Heart className="text-gray-400 mr-3" size={20} />
                                        <div>Dating Preferences</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>
                            </div>
                        </section>

                        {/* Privacy & Safety */}
                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Privacy & Safety</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Shield className="text-gray-400 mr-3" size={20} />
                                        <div>Privacy Settings</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Lock className="text-gray-400 mr-3" size={20} />
                                        <div>Blocked Users</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Bell className="text-gray-400 mr-3" size={20} />
                                        <div>
                                            <div>Notifications</div>
                                            <div className="text-sm text-gray-500">{userData.notifications ? 'Enabled' : 'Disabled'}</div>
                                        </div>
                                    </div>
                                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200">
                                        <label htmlFor="toggle" className="absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform bg-white border rounded-full cursor-pointer top-0 border-gray-200 shadow-sm"></label>
                                        <input
                                            type="checkbox"
                                            id="toggle"
                                            name="toggle"
                                            className="w-full h-full appearance-none focus:outline-none"
                                            checked={userData.notifications}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Help & Support */}
                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Help & Support</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <HelpCircle className="text-gray-400 mr-3" size={20} />
                                        <div>Help Center</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Settings className="text-gray-400 mr-3" size={20} />
                                        <div>Report a Problem</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>

                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Shield className="text-gray-400 mr-3" size={20} />
                                        <div>Community Guidelines</div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>
                            </div>
                        </section>

                        {/* Sign Out */}
                        <button
                            className="w-full py-4 text-[#FF6B81] font-medium bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                            onClick={handleSignOut}
                        >
                            <div className="flex items-center justify-center">
                                <LogOut size={18} className="mr-2" />
                                Sign Out
                            </div>
                        </button>

                        <div className="text-center text-gray-500 text-sm py-2">
                            Version 1.0.0
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;