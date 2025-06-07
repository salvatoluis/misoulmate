import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
    Camera, Edit, ChevronRight, LogOut, Bell, Shield,
    CreditCard, Heart, User, Lock, Settings, HelpCircle,
    ChevronDown, Plus, ArrowLeft, Instagram,
    Music, AlertTriangle
} from 'lucide-react';
import { ExtendedProfile, ProfileFormData, ProfileQuestion } from '@/types/profile.type';
import useProfileApi from '@/hooks/useProfileAPI';
import profileService from '@/services/profile.service';

// Default user data for new profiles
const defaultUserData: ExtendedProfile = {
    name: "",
    photos: [],
    bio: "",
    interests: [],
    languages: [],
    notifications: true,
    subscription: "Free"
};

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<ExtendedProfile>(defaultUserData);
    const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
    const [editing, setEditing] = useState<boolean>(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isNewProfile, setIsNewProfile] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);


    const {
        loading,
        error,
        validationErrors,
        updateProfile,
        uploadPhoto,
        deletePhoto,
        createProfile
    } = useProfileApi();

    const [formData, setFormData] = useState<ProfileFormData>({
        bio: '',
        occupation: '',
        education: '',
        interests: [],
        languages: [],
        height: '',
        drinking: '',
        smoking: '',
        zodiac: '',
        questions: []
    });

    useEffect(() => {
        const getProfile = async () => {
            try {
                const profile = await profileService.getProfile();
                if (profile) {
                    setUserData({ ...profile, notifications: true, subscription: profile.subscription || "Free" });
                    setFormData({
                        name: profile.name || '',
                        bio: profile.bio || '',
                        occupation: profile.occupation || '',
                        education: profile.education || '',
                        interests: [...(profile.interests || [])],
                        languages: [...(profile.languages || [])],
                        height: profile.height || '',
                        drinking: profile.drinking || '',
                        smoking: profile.smoking || '',
                        zodiac: profile.zodiac || '',
                        questions: profile.questions ? [...profile.questions] : []
                    });
                    setIsNewProfile(false);
                } else {
                    setIsNewProfile(true);
                    setEditing(true);
                }

                setIsLoaded(true);
            } catch (err) {
                console.error("Failed to fetch profile", err);

                setIsLoaded(true);
            }
        };

        getProfile();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const photoUrl = await uploadPhoto(file);

        if (photoUrl) {
            // Update user data with new photo
            const updatedPhotos = [...(userData.photos || []), photoUrl];
            setUserData({
                ...userData,
                photos: updatedPhotos
            });
        }
    };

    const handleRemovePhoto = async (index: number) => {
        if (!userData.photos || userData.photos.length === 0) return;

        const photoUrl = userData.photos[index];
        const success = await deletePhoto(photoUrl);

        if (success) {
            // Update user data by removing the photo
            const updatedPhotos = userData.photos.filter((_, i) => i !== index);
            setUserData({
                ...userData,
                photos: updatedPhotos
            });
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleAddInterest = () => {
        // Simple implementation - in a real app, you'd show a modal or input field
        const newInterest = prompt("Add a new interest:");
        if (newInterest && newInterest.trim()) {
            setFormData({
                ...formData,
                interests: [...(formData.interests || []), newInterest.trim()]
            });
        }
    };

    const handleRemoveInterest = (index: number) => {
        const updatedInterests = [...(formData.interests || [])];
        updatedInterests.splice(index, 1);
        setFormData({
            ...formData,
            interests: updatedInterests
        });
    };

    const handleUpdateQuestion = (index: number, answer: string) => {
        if (!formData.questions) return;

        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            answer
        };

        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const handleAddQuestion = () => {
        // Simple implementation - in a real app, you'd show a modal with input fields
        const question = prompt("Enter a new question:");
        const answer = prompt("Enter your answer:");

        if (question && question.trim() && answer && answer.trim()) {
            const newQuestion: ProfileQuestion = {
                question: question.trim(),
                answer: answer.trim()
            };

            setFormData({
                ...formData,
                questions: [...(formData.questions || []), newQuestion]
            });
        }
    };

    const toggleEdit = () => {
        if (editing) {
            // Save changes
            saveChanges();
        } else {
            // Enter edit mode
            setEditing(true);
        }
    };

    const saveChanges = async () => {
        // Prepare data for API
        const updatedProfile = {
            ...userData,
            ...formData
        };

        // If it's a new profile, create it, otherwise update it
        let profile;
        if (isNewProfile) {
            profile = await createProfile(updatedProfile);
            if (profile) {
                setIsNewProfile(false);
            }
        } else {
            profile = await updateProfile(updatedProfile);
        }

        if (profile) {
            // Update local state with response data
            setUserData({
                ...profile,
                notifications: userData.notifications,
                subscription: userData.subscription
            });

            setEditing(false);
        }
    };

    const handleSignOut = () => {
        // Handle sign out logic
        localStorage.removeItem('authToken');
        alert("User signed out");
        // Redirect to login page
    };

    const handleToggleNotifications = async () => {
        try {
            // This would typically use the updateSettings method from the hook
            // For now, just update the local state
            setUserData({
                ...userData,
                notifications: !userData.notifications
            });
        } catch (err) {
            console.error("Failed to update notifications", err);
        }
    };

    // If profile is still loading, show loading spinner
    if (!isLoaded && !loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-[#FF6B81] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Loading indicator */}
            {loading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="animate-spin h-8 w-8 border-4 border-[#FF6B81] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-700">Loading...</p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
                    <AlertTriangle size={18} className="mr-2" />
                    <span>{error}</span>
                    <button
                        className="ml-4 text-red-700"
                    // onClick={() => setError(null)}
                    >
                        &times;
                    </button>
                </div>
            )}

            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="mr-2 md:hidden">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">
                            {isNewProfile ? 'Create Profile' : 'Profile & Settings'}
                        </h1>
                    </div>
                    {activeTab === 'profile' && (
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium ${editing
                                ? 'bg-[#FF6B81] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors`}
                            onClick={toggleEdit}
                            disabled={loading}
                        >
                            {editing ? (isNewProfile ? 'Create' : 'Save') : 'Edit'}
                        </button>
                    )}
                </div>

                {!isNewProfile && (
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
                )}
            </header>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
                <div className="container mx-auto px-4 mt-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Please fix the following errors:</p>
                        <ul className="list-disc ml-5 mt-2">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* New Profile Creation Message */}
            {isNewProfile && (
                <div className="container mx-auto px-4 mt-4">
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                        <p className="font-bold">Welcome! Let's set up your profile.</p>
                        <p>Please fill in the required information to get started.</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 pt-6 pb-20">
                {(activeTab === 'profile' || isNewProfile) ? (
                    <div className="space-y-6">
                        {/* Basic Information (Required for new profiles) */}
                        {isNewProfile && (
                            <section className="bg-white rounded-xl shadow-sm">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Your age"
                                            min="18"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Photos</h2>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {userData.photos && userData.photos.map((photo, index) => (
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
                                                    <button
                                                        className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white"
                                                        onClick={() => handleRemovePhoto(index)}
                                                    >
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
                                    {editing && (
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

                                {isNewProfile && !userData.photos?.length && (
                                    <div className="mt-4 text-sm text-gray-500">
                                        Adding at least one photo is highly recommended.
                                    </div>
                                )}
                            </div>
                        </section>

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
                                        placeholder="Tell others about yourself..."
                                    />
                                ) : (
                                    <div className="text-gray-700 space-y-3">
                                        {userData.bio ? userData.bio.split('\n\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        )) : (
                                            <p className="text-gray-400 italic">No bio added yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

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
                                                placeholder="What do you do?"
                                            />
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.occupation || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
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
                                                placeholder="Your education background"
                                            />
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.education || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection('basic')}
                            >
                                <h2 className="text-lg font-bold text-gray-800">Basic Info</h2>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-400 transition-transform ${expandedSection === 'basic' ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {expandedSection === 'basic' && (
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Height</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                                placeholder="Your height (e.g. 5'10)"
                                            />
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.height || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Drinking</label>
                                        {editing ? (
                                            <select
                                                name="drinking"
                                                value={formData.drinking || ''}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            >
                                                <option value="">Prefer not to say</option>
                                                <option value="Non-drinker">Non-drinker</option>
                                                <option value="Social drinker">Social drinker</option>
                                                <option value="Regular drinker">Regular drinker</option>
                                            </select>
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.drinking || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Smoking</label>
                                        {editing ? (
                                            <select
                                                name="smoking"
                                                value={formData.smoking || ''}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            >
                                                <option value="">Prefer not to say</option>
                                                <option value="Non-smoker">Non-smoker</option>
                                                <option value="Social smoker">Social smoker</option>
                                                <option value="Regular smoker">Regular smoker</option>
                                            </select>
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.smoking || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Zodiac</label>
                                        {editing ? (
                                            <select
                                                name="zodiac"
                                                value={formData.zodiac || ''}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            >
                                                <option value="">Select zodiac sign</option>
                                                <option value="Aries">Aries</option>
                                                <option value="Taurus">Taurus</option>
                                                <option value="Gemini">Gemini</option>
                                                <option value="Cancer">Cancer</option>
                                                <option value="Leo">Leo</option>
                                                <option value="Virgo">Virgo</option>
                                                <option value="Libra">Libra</option>
                                                <option value="Scorpio">Scorpio</option>
                                                <option value="Sagittarius">Sagittarius</option>
                                                <option value="Capricorn">Capricorn</option>
                                                <option value="Aquarius">Aquarius</option>
                                                <option value="Pisces">Pisces</option>
                                            </select>
                                        ) : (
                                            <div className="text-gray-700">
                                                {userData.zodiac || <span className="text-gray-400 italic">Not specified</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

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
                                        {formData.interests && formData.interests.length > 0 ? (
                                            formData.interests.map((interest, index) => (
                                                <div
                                                    key={index}
                                                    className={`px-3 py-1.5 rounded-full text-sm ${editing
                                                        ? 'bg-gray-100 text-gray-700 pr-1.5 group'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {interest}
                                                    {editing && (
                                                        <button
                                                            className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => handleRemoveInterest(index)}
                                                        >
                                                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            !editing && <div className="text-gray-400 italic">No interests added yet.</div>
                                        )}

                                        {editing && (
                                            <button
                                                className="px-2 py-1.5 rounded-full text-sm bg-[#FF6B81]/10 text-[#FF6B81] flex items-center hover:bg-[#FF6B81]/20 transition-colors"
                                                onClick={handleAddInterest}
                                            >
                                                <Plus size={16} className="mr-1" />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

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
                                    {formData.questions && formData.questions.length > 0 ? (
                                        formData.questions.map((item, idx) => (
                                            <div key={idx} className="border-l-2 border-[#FF6B81] pl-4 py-1">
                                                <div className="text-gray-500 mb-1">{item.question}</div>
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        value={item.answer}
                                                        onChange={(e) => handleUpdateQuestion(idx, e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                                    />
                                                ) : (
                                                    <div className="text-gray-700">{item.answer}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        !editing && <div className="text-gray-400 italic">No questions answered yet.</div>
                                    )}

                                    {editing && (
                                        <button
                                            className="w-full mt-3 py-2 flex items-center justify-center text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                                            onClick={handleAddQuestion}
                                        >
                                            <Plus size={16} className="mr-1.5" />
                                            Add Another Question
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>

                        {!isNewProfile && (
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
                                                    <div className="text-gray-500 text-sm">
                                                        {userData.instagram || 'Not connected'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="text-[#FF6B81] text-sm font-medium">
                                                {userData.instagram ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>

                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Music className="text-green-500 mr-3" size={20} />
                                                <div>
                                                    <div className="font-medium">Spotify</div>
                                                    <div className="text-gray-500 text-sm">
                                                        {userData.spotifyArtists && userData.spotifyArtists.length > 0
                                                            ? `${userData.spotifyArtists.length} artists connected`
                                                            : 'Not connected'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                                                {userData.spotifyArtists && userData.spotifyArtists.length > 0 ? 'Manage' : 'Connect'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {isNewProfile && (
                            <div className="mt-6">
                                <button
                                    className="w-full py-3 bg-[#FF6B81] text-white rounded-xl font-medium hover:bg-[#FF5A70] transition-colors"
                                    onClick={saveChanges}
                                    disabled={loading}
                                >
                                    Create Profile
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
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
                                    <div className="relative inline-block w-10 h-6 transition-colors duration-200 ease-in-out rounded-full bg-gray-200">
                                        <label
                                            htmlFor="toggle"
                                            className={`absolute left-0 w-6 h-6 transition-transform duration-200 ease-in-out transform ${userData.notifications ? 'translate-x-4 bg-[#FF6B81]' : 'translate-x-0 bg-white'
                                                } border rounded-full cursor-pointer top-0 border-gray-200 shadow-sm`}
                                        ></label>
                                        <input
                                            type="checkbox"
                                            id="toggle"
                                            name="toggle"
                                            className="w-full h-full appearance-none focus:outline-none"
                                            checked={userData.notifications}
                                            onChange={handleToggleNotifications}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

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