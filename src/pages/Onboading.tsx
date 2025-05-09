// src/pages/Onboarding.tsx
import React, { useState, useRef } from 'react';
import { Camera, Check, ChevronRight, X, Heart, MapPin, User, BookOpen, Briefcase, GraduationCap } from 'lucide-react';

type OnboardingStep =
    | 'welcome'
    | 'photos'
    | 'basics'
    | 'bio'
    | 'interests'
    | 'questions'
    | 'preferences'
    | 'complete';

interface InterestCategory {
    name: string;
    interests: string[];
    icon: React.ReactNode;
}

const Onboarding: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');

    const [userData, setUserData] = useState({
        name: '',
        birthdate: '',
        gender: '',
        photos: [] as string[],
        occupation: '',
        company: '',
        school: '',
        height: '',
        location: '',
        bio: '',
        interests: [] as string[],
        questions: [
            { question: 'My ideal weekend includes...', answer: '' },
            { question: 'I value most in a relationship...', answer: '' },
            { question: 'A random fact about me...', answer: '' }
        ],
        preferences: {
            genderPreference: '',
            ageRange: [18, 45] as [number, number],
            distance: 30,
            relationshipType: ''
        }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalSteps = 7;
    const currentStepIndex =
        currentStep === 'welcome' ? 0 :
            currentStep === 'photos' ? 1 :
                currentStep === 'basics' ? 2 :
                    currentStep === 'bio' ? 3 :
                        currentStep === 'interests' ? 4 :
                            currentStep === 'questions' ? 5 :
                                currentStep === 'preferences' ? 6 : 7;

    const progress = Math.round((currentStepIndex / totalSteps) * 100);

    const interestCategories: InterestCategory[] = [
        {
            name: 'Sports & Fitness',
            interests: ['Running', 'Yoga', 'Gym', 'Basketball', 'Swimming', 'Hiking', 'Cycling', 'Tennis'],
            icon: <User size={20} />
        },
        {
            name: 'Creative',
            interests: ['Art', 'Photography', 'Writing', 'Music', 'Design', 'Dancing', 'DIY', 'Fashion'],
            icon: <Camera size={20} />
        },
        {
            name: 'Food & Drink',
            interests: ['Cooking', 'Coffee', 'Wine', 'Foodie', 'Baking', 'Craft Beer', 'Restaurants', 'Vegetarian'],
            icon: <BookOpen size={20} />
        },
        {
            name: 'Travel',
            interests: ['Adventure', 'Backpacking', 'Road Trips', 'Beach', 'Mountains', 'Camping', 'City Breaks', 'Culture'],
            icon: <MapPin size={20} />
        }
    ];

    // Handle photo upload
    const handleAddPhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In a real app, you would upload the file to a server
        // For now, let's use a placeholder URL
        if (e.target.files && e.target.files[0]) {
            // Simulating a new photo being added with a placeholder URL
            setUserData({
                ...userData,
                photos: [...userData.photos, '/images/placeholder-photo.jpg']
            });
        }
    };

    // Toggle selection of an interest
    const toggleInterest = (interest: string) => {
        if (userData.interests.includes(interest)) {
            setUserData({
                ...userData,
                interests: userData.interests.filter(i => i !== interest)
            });
        } else {
            setUserData({
                ...userData,
                interests: [...userData.interests, interest]
            });
        }
    };

    // Handle text input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle nested properties (for preferences)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setUserData({
                ...userData,
                [parent]: {
                    ...(userData as any)[parent],
                    [child]: value
                }
            });
        } else {
            setUserData({
                ...userData,
                [name]: value
            });
        }
    };

    // Handle question answers
    const handleQuestionChange = (index: number, answer: string) => {
        const updatedQuestions = [...userData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            answer
        };

        setUserData({
            ...userData,
            questions: updatedQuestions
        });
    };

    // Navigate to next step
    const nextStep = () => {
        switch (currentStep) {
            case 'welcome':
                setCurrentStep('photos');
                break;
            case 'photos':
                setCurrentStep('basics');
                break;
            case 'basics':
                setCurrentStep('bio');
                break;
            case 'bio':
                setCurrentStep('interests');
                break;
            case 'interests':
                setCurrentStep('questions');
                break;
            case 'questions':
                setCurrentStep('preferences');
                break;
            case 'preferences':
                setCurrentStep('complete');
                break;
            // Complete will redirect to the main app
        }
    };

    // Navigate to previous step
    const prevStep = () => {
        switch (currentStep) {
            case 'photos':
                setCurrentStep('welcome');
                break;
            case 'basics':
                setCurrentStep('photos');
                break;
            case 'bio':
                setCurrentStep('basics');
                break;
            case 'interests':
                setCurrentStep('bio');
                break;
            case 'questions':
                setCurrentStep('interests');
                break;
            case 'preferences':
                setCurrentStep('questions');
                break;
            // Can't go back from welcome or complete
        }
    };

    // Check if the current step is valid and can proceed
    const canProceed = () => {
        switch (currentStep) {
            case 'welcome':
                return true; // Always can proceed from welcome
            case 'photos':
                return userData.photos.length > 0; // At least one photo
            case 'basics':
                return userData.name && userData.birthdate && userData.gender && userData.location; // Required fields
            case 'bio':
                return userData.bio.length >= 20; // Minimum bio length
            case 'interests':
                return userData.interests.length >= 3; // At least 3 interests
            case 'questions':
                return userData.questions.every(q => q.answer.length > 0); // All questions answered
            case 'preferences':
                return userData.preferences.genderPreference && userData.preferences.relationshipType; // Required preferences
            default:
                return true;
        }
    };

    // Render the appropriate step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 'welcome':
                return (
                    <div className="text-center py-8 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={36} className="text-[#FF6B81]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-3">Welcome to miSoulMate</h1>
                        <p className="text-gray-600 mb-8">
                            Let's create your profile and find your perfect match. This will only take about 5 minutes.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-700">
                                <div className="w-8 h-8 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mr-3">
                                    <Camera size={16} className="text-[#FF6B81]" />
                                </div>
                                <span>Add your best photos</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <div className="w-8 h-8 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mr-3">
                                    <User size={16} className="text-[#FF6B81]" />
                                </div>
                                <span>Share your interests and personality</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <div className="w-8 h-8 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mr-3">
                                    <Heart size={16} className="text-[#FF6B81]" />
                                </div>
                                <span>Set your dating preferences</span>
                            </div>
                        </div>
                    </div>
                );

            case 'photos':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Add your photos</h2>
                        <p className="text-gray-600 mb-6">
                            Choose at least one photo. Your first photo will be your main profile picture.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {userData.photos.map((photo, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                                    <img
                                        src={photo}
                                        alt={`User photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                        <button
                                            className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white"
                                            onClick={() => {
                                                const updatedPhotos = [...userData.photos];
                                                updatedPhotos.splice(index, 1);
                                                setUserData({ ...userData, photos: updatedPhotos });
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                        {index !== 0 && (
                                            <button
                                                className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white"
                                                onClick={() => {
                                                    const updatedPhotos = [...userData.photos];
                                                    [updatedPhotos[0], updatedPhotos[index]] = [updatedPhotos[index], updatedPhotos[0]];
                                                    setUserData({ ...userData, photos: updatedPhotos });
                                                }}
                                            >
                                                <Star size={16} />
                                            </button>
                                        )}
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-[#FF6B81] text-white text-xs px-2 py-0.5 rounded-full">
                                            Main
                                        </div>
                                    )}
                                </div>
                            ))}

                            {userData.photos.length < 6 && (
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

                        <div className="text-sm text-gray-500 mb-4">
                            <p>Photo tips:</p>
                            <ul className="list-disc list-inside ml-2">
                                <li>Use clear, recent photos of yourself</li>
                                <li>Include at least one clear face shot</li>
                                <li>Show your interests and personality</li>
                                <li>Avoid group photos for your main picture</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'basics':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
                        <p className="text-gray-600 mb-6">
                            Let's start with the basics. This information helps us find better matches for you.
                        </p>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    required
                                />
                            </div>

                            {/* Birth Date */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={userData.birthdate}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">You must be 18 years or older to use miSoulMate</p>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={userData.gender}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="Woman">Woman</option>
                                    <option value="Man">Man</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={userData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, State"
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                        required
                                    />
                                    <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Occupation */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Occupation (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={userData.occupation}
                                        onChange={handleInputChange}
                                        placeholder="Your job title"
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    />
                                    <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Company (Optional)</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={userData.company}
                                    onChange={handleInputChange}
                                    placeholder="Where you work"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                />
                            </div>

                            {/* Education */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Education (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="school"
                                        value={userData.school}
                                        onChange={handleInputChange}
                                        placeholder="School or university"
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                    />
                                    <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Height */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Height (Optional)</label>
                                <select
                                    name="height"
                                    value={userData.height}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                >
                                    <option value="">Select height</option>
                                    <option value="4'10&quot;">4'10" (147 cm)</option>
                                    <option value="4'11&quot;">4'11" (150 cm)</option>
                                    <option value="5'0&quot;">5'0" (152 cm)</option>
                                    <option value="5'1&quot;">5'1" (155 cm)</option>
                                    <option value="5'2&quot;">5'2" (157 cm)</option>
                                    <option value="5'3&quot;">5'3" (160 cm)</option>
                                    <option value="5'4&quot;">5'4" (163 cm)</option>
                                    <option value="5'5&quot;">5'5" (165 cm)</option>
                                    <option value="5'6&quot;">5'6" (168 cm)</option>
                                    <option value="5'7&quot;">5'7" (170 cm)</option>
                                    <option value="5'8&quot;">5'8" (173 cm)</option>
                                    <option value="5'9&quot;">5'9" (175 cm)</option>
                                    <option value="5'10&quot;">5'10" (178 cm)</option>
                                    <option value="5'11&quot;">5'11" (180 cm)</option>
                                    <option value="6'0&quot;">6'0" (183 cm)</option>
                                    <option value="6'1&quot;">6'1" (185 cm)</option>
                                    <option value="6'2&quot;">6'2" (188 cm)</option>
                                    <option value="6'3&quot;">6'3" (191 cm)</option>
                                    <option value="6'4&quot;">6'4" (193 cm)</option>
                                    <option value="6'5&quot;">6'5" (196 cm)</option>
                                    <option value="6'6&quot;">6'6" (198 cm)</option>
                                    <option value="6'7&quot; or taller">6'7" or taller (201 cm+)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'bio':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Write your bio</h2>
                        <p className="text-gray-600 mb-6">
                            Tell potential matches about yourself. What makes you unique? What are you passionate about?
                        </p>

                        <div>
                            <textarea
                                name="bio"
                                value={userData.bio}
                                onChange={handleInputChange}
                                placeholder="I'm a..."
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-40"
                                maxLength={500}
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>{userData.bio.length} / 500 characters</span>
                                <span>{userData.bio.length >= 20 ? 'Looking good!' : 'Please write at least 20 characters'}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium text-gray-700 mb-2">Bio tips:</h3>
                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                <li>Be authentic and show your personality</li>
                                <li>Mention hobbies and interests</li>
                                <li>Include conversation starters</li>
                                <li>Avoid generic statements</li>
                                <li>Keep it positive and approachable</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'interests':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Add your interests</h2>
                        <p className="text-gray-600 mb-6">
                            Select at least 3 interests to help us find people with similar passions.
                        </p>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {userData.interests.map(interest => (
                                    <div
                                        key={interest}
                                        className="bg-[#FF6B81]/10 text-[#FF6B81] px-3 py-1.5 rounded-full text-sm font-medium flex items-center group"
                                    >
                                        {interest}
                                        <button
                                            className="ml-1.5 text-[#FF6B81]"
                                            onClick={() => toggleInterest(interest)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-gray-500">
                                {userData.interests.length} / 3 minimum selected
                            </div>
                        </div>

                        <div className="space-y-6">
                            {interestCategories.map(category => (
                                <div key={category.name}>
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                            {category.icon}
                                        </span>
                                        {category.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {category.interests.map(interest => (
                                            <button
                                                key={interest}
                                                className={`px-3 py-1.5 rounded-full text-sm ${userData.interests.includes(interest)
                                                    ? 'bg-[#FF6B81]/10 text-[#FF6B81]'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } transition-colors`}
                                                onClick={() => toggleInterest(interest)}
                                            >
                                                {interest}
                                                {userData.interests.includes(interest) && (
                                                    <Check size={14} className="inline ml-1" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'questions':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Answer some questions</h2>
                        <p className="text-gray-600 mb-6">
                            These help people get to know you better and can be great conversation starters.
                        </p>

                        <div className="space-y-6">
                            {userData.questions.map((question, index) => (
                                <div key={index} className="border-l-2 border-[#FF6B81] pl-4 py-1">
                                    <div className="text-gray-700 font-medium mb-2">{question.question}</div>
                                    <textarea
                                        value={question.answer}
                                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                                        placeholder="Your answer..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] h-24"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'preferences':
                return (
                    <div className="py-6 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Your dating preferences</h2>
                        <p className="text-gray-600 mb-6">
                            Tell us what you're looking for so we can find your best matches.
                        </p>

                        <div className="space-y-5">
                            {/* Gender Preference */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">I'm interested in</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Women', 'Men', 'Everyone'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`py-2.5 rounded-lg border ${userData.preferences.genderPreference === option
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } transition-colors`}
                                            onClick={() => setUserData({
                                                ...userData,
                                                preferences: {
                                                    ...userData.preferences,
                                                    genderPreference: option
                                                }
                                            })}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Age Range */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Age range: {userData.preferences.ageRange[0]} - {userData.preferences.ageRange[1]}
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="range"
                                        min="18"
                                        max="70"
                                        value={userData.preferences.ageRange[0]}
                                        onChange={(e) => setUserData({
                                            ...userData,
                                            preferences: {
                                                ...userData.preferences,
                                                ageRange: [parseInt(e.target.value), userData.preferences.ageRange[1]]
                                            }
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                    />
                                    <input
                                        type="range"
                                        min="18"
                                        max="70"
                                        value={userData.preferences.ageRange[1]}
                                        onChange={(e) => setUserData({
                                            ...userData,
                                            preferences: {
                                                ...userData.preferences,
                                                ageRange: [userData.preferences.ageRange[0], parseInt(e.target.value)]
                                            }
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                    />
                                </div>
                            </div>

                            {/* Distance */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Maximum distance: {userData.preferences.distance} miles
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={userData.preferences.distance}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        preferences: {
                                            ...userData.preferences,
                                            distance: parseInt(e.target.value)
                                        }
                                    })}
                                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                />
                            </div>

                            {/* Relationship Type */}
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">I'm looking for</label>
                                <div className="space-y-2">
                                    {['Long-term relationship', 'Casual dating', 'New friends', 'Still figuring it out'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`w-full py-3 px-4 rounded-lg border ${userData.preferences.relationshipType === option
                                                ? 'border-[#FF6B81] bg-[#FF6B81]/5 text-[#FF6B81]'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                } transition-colors text-left flex justify-between items-center`}
                                            onClick={() => setUserData({
                                                ...userData,
                                                preferences: {
                                                    ...userData.preferences,
                                                    relationshipType: option
                                                }
                                            })}
                                        >
                                            <span>{option}</span>
                                            {userData.preferences.relationshipType === option && (
                                                <Check size={18} className="text-[#FF6B81]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'complete':
                return (
                    <div className="text-center py-10 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-[#FF6B81]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={36} className="text-[#FF6B81]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-3">Profile Complete!</h1>
                        <p className="text-gray-600 mb-8">
                            You're all set to start finding your perfect matches. Your profile looks great!
                        </p>
                        <button
                            className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors"
                            onClick={() => {
                                // In a real app, this would navigate to the main app
                                window.location.href = '/matches';
                            }}
                        >
                            Start Matching
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header with progress */}
            {currentStep !== 'welcome' && currentStep !== 'complete' && (
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                onClick={prevStep}
                            >
                                <ChevronRight size={24} className="transform rotate-180" />
                            </button>
                            <div className="text-center text-sm font-medium text-gray-500">
                                Step {currentStepIndex} of {totalSteps}
                            </div>
                            <div className="w-6 h-6"></div> {/* Empty space for alignment */}
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#FF6B81] transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </header>
            )}

            {/* Main content */}
            <div className="container mx-auto px-4 pt-6">
                {renderStepContent()}

                {/* Navigation buttons */}
                {currentStep !== 'complete' && (
                    <div className="mt-8 max-w-lg mx-auto">
                        {currentStep !== 'welcome' ? (
                            <div className="flex justify-between">
                                <button
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                                <button
                                    className={`px-6 py-2.5 rounded-lg text-white ${canProceed()
                                        ? 'bg-[#FF6B81] hover:bg-[#D86D72]'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        } transition-colors`}
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                >
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <button
                                className="w-full py-3.5 bg-[#FF6B81] hover:bg-[#D86D72] text-white font-medium rounded-xl transition-colors"
                                onClick={nextStep}
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Adding a Star component for main photo
const Star: React.FC<{ size: number }> = ({ size }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
};

export default Onboarding;