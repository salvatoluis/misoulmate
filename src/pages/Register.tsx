import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, Mail, Lock, ArrowRight, Calendar, AlertCircle,
    MapPin, Check, ChevronLeft, ChevronRight, Upload, X,
    Globe, BookOpen, Camera, Music, Coffee, Film,
    Plus
} from 'lucide-react';
import authService from '@/services/auth.service';

// Define interest options with icons
const interestOptions = [
    { value: 'Photography', icon: <Camera size={16} /> },
    { value: 'Reading', icon: <BookOpen size={16} /> },
    { value: 'Coffee', icon: <Coffee size={16} /> },
    { value: 'Hiking', icon: <MapPin size={16} /> },
    { value: 'Music', icon: <Music size={16} /> },
    { value: 'Travel', icon: <Globe size={16} /> },
    { value: 'Movies', icon: <Film size={16} /> },
    { value: 'Art', icon: <Camera size={16} /> },
    { value: 'Cooking', icon: <Coffee size={16} /> },
    { value: 'Fitness', icon: <User size={16} /> },
    { value: 'Fashion', icon: <User size={16} /> },
    { value: 'Technology', icon: <Lock size={16} /> },
    { value: 'Dancing', icon: <User size={16} /> },
    { value: 'Writing', icon: <BookOpen size={16} /> },
    { value: 'Gaming', icon: <Film size={16} /> },
    { value: 'Yoga', icon: <User size={16} /> }
];

// Define language options
const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi'
];

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Initialize form data to match the Joi schema
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        profile: {
            name: '',
            birthdate: '', // We'll convert this to age when submitting
            bio: '',
            location: '',
            photos: [] as string[],
            interests: [] as string[],
            languages: [] as string[],
            lookingFor: 'Relationship', // Default value
            showMe: 'Women', // Default value
            ageRange: [25, 35] as [number, number], // Default range
            maxDistance: 25, // Default value in miles
            questions: [] as Array<{ question: string, answer: string }>
        }
    });

    // Handle input changes for top-level fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Check if the field is a profile field
        if (name.includes('.')) {
            const [parent, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...((prev as any)[parent]),
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle interest selection
    const toggleInterest = (interest: string) => {
        setFormData(prev => {
            const currentInterests = prev.profile.interests;
            const newInterests = currentInterests.includes(interest)
                ? currentInterests.filter(i => i !== interest)
                : [...currentInterests, interest];

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    interests: newInterests
                }
            };
        });
    };

    // Handle language selection
    const toggleLanguage = (language: string) => {
        setFormData(prev => {
            const currentLanguages = prev.profile.languages;
            const newLanguages = currentLanguages.includes(language)
                ? currentLanguages.filter(l => l !== language)
                : [...currentLanguages, language];

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    languages: newLanguages
                }
            };
        });
    };

    // Handle age range change
    const handleAgeRangeChange = (index: number, value: number) => {
        setFormData(prev => {
            const newRange = [...prev.profile.ageRange] as [number, number];
            newRange[index] = value;
            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    ageRange: newRange
                }
            };
        });
    };

    // Handle adding a question
    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                questions: [
                    ...prev.profile.questions,
                    { question: '', answer: '' }
                ]
            }
        }));
    };

    // Handle updating a question
    const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
        setFormData(prev => {
            const newQuestions = [...prev.profile.questions];
            newQuestions[index] = {
                ...newQuestions[index],
                [field]: value
            };

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    questions: newQuestions
                }
            };
        });
    };

    // Handle removing a question
    const removeQuestion = (index: number) => {
        setFormData(prev => {
            const newQuestions = [...prev.profile.questions];
            newQuestions.splice(index, 1);

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    questions: newQuestions
                }
            };
        });
    };

    // Handle file upload for photos
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // In a real app, you would upload to a server and get back URLs
            // For now, we'll create object URLs for preview
            const fileURL = URL.createObjectURL(e.target.files[0]);

            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    photos: [...prev.profile.photos, fileURL]
                }
            }));
        }
    };

    // Handle removing a photo
    const removePhoto = (index: number) => {
        setFormData(prev => {
            const newPhotos = [...prev.profile.photos];
            newPhotos.splice(index, 1);

            return {
                ...prev,
                profile: {
                    ...prev.profile,
                    photos: newPhotos
                }
            };
        });
    };

    const calculateAge = (birthdate: string): number => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Validate each step
    const validateStep = (): boolean => {
        const errors: Record<string, string> = {};

        switch (step) {
            case 1: // Account details
                if (!formData.email) {
                    errors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    errors.email = 'Please enter a valid email address';
                }

                if (!formData.password) {
                    errors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    errors.password = 'Password must be at least 8 characters';
                }

                if (formData.password !== formData.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }
                break;

            case 2: // Basic profile
                if (!formData.profile.name) {
                    errors.name = 'Name is required';
                }

                if (!formData.profile.birthdate) {
                    errors.birthdate = 'Birth date is required';
                } else {
                    const age = calculateAge(formData.profile.birthdate);
                    if (age < 18) {
                        errors.birthdate = 'You must be at least 18 years old to register';
                    }
                }

                if (!formData.profile.location) {
                    errors.location = 'Location is required';
                }
                break;

            case 3: // Bio and interests
                if (formData.profile.interests.length === 0) {
                    errors.interests = 'Please select at least one interest';
                }
                break;

            case 4: // Photos
                if (formData.profile.photos.length === 0) {
                    errors.photos = 'Please upload at least one photo';
                }
                break;

            default:
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Go to next step
    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    // Go to previous step
    const prevStep = () => {
        setStep(step - 1);
    };

    const convertBlobToBase64 = (blobUrl: any) => {
        return new Promise((resolve, reject) => {
            fetch(blobUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation
        if (!validateStep()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const base64Photos = await Promise.all(
                formData.profile.photos.map(photo => convertBlobToBase64(photo))
            );

            // Calculate age from birthdate
            const age = calculateAge(formData.profile.birthdate);

            const { birthdate, ...profileWithoutBirthdate } = formData.profile;
            const registerData = {
                email: formData.email,
                password: formData.password,
                profile: {
                    ...profileWithoutBirthdate,
                    photos: base64Photos, // Use base64 photos instead of blob URLs
                    age,
                    questions: formData.profile.questions.filter(
                        q => q.question.trim() !== '' && q.answer.trim() !== ''
                    )
                }
            };

            // Call register API
            await authService.register(registerData);

            navigate('/matches');
        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle API error responses
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                // Handle validation errors from API
                const apiErrors = err.response.data.errors;
                const formattedErrors: Record<string, string> = {};

                apiErrors.forEach((error: any) => {
                    const field = error.path.split('.').pop();
                    formattedErrors[field] = error.message;
                });

                setValidationErrors(formattedErrors);

                // Go to the appropriate step based on the error
                if (formattedErrors.email || formattedErrors.password) {
                    setStep(1);
                } else if (formattedErrors.name || formattedErrors.age || formattedErrors.location) {
                    setStep(2);
                } else if (formattedErrors.bio || formattedErrors.interests) {
                    setStep(3);
                } else if (formattedErrors.photos) {
                    setStep(4);
                } else {
                    setStep(5);
                }
            } else {
                setError('An error occurred during registration. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Render progress indicator
    const renderProgress = () => {
        return (
            <div className="flex justify-between items-center mb-8">
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                    <React.Fragment key={stepNumber}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNumber === step
                                ? 'bg-[#FF6B81] text-white'
                                : stepNumber < step
                                    ? 'bg-[#FF6B81]/20 text-[#FF6B81]'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {stepNumber < step ? <Check size={16} /> : stepNumber}
                        </div>
                        {stepNumber < 5 && (
                            <div
                                className={`flex-1 h-0.5 ${stepNumber < step ? 'bg-[#FF6B81]' : 'bg-gray-200'
                                    }`}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // Render step titles
    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Create Your Account";
            case 2:
                return "Basic Information";
            case 3:
                return "About You";
            case 4:
                return "Add Photos";
            case 5:
                return "Preferences";
            default:
                return "Create Your Account";
        }
    };

    // Render form based on current step
    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                                Email
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                                Password
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="confirmPassword">
                                Confirm Password
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.name">
                                Full Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="profile.name"
                                    name="profile.name"
                                    value={formData.profile.name}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                    placeholder="Your name"
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.birthdate">
                                Birth Date
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    id="profile.birthdate"
                                    name="profile.birthdate"
                                    value={formData.profile.birthdate}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.birthdate ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                />
                            </div>
                            {validationErrors.birthdate ? (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.birthdate}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">You must be 18 years or older</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.location">
                                Location
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="profile.location"
                                    name="profile.location"
                                    value={formData.profile.location}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${validationErrors.location ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]`}
                                    placeholder="City, State"
                                />
                            </div>
                            {validationErrors.location && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                            )}
                        </div>
                    </>
                );

            case 3:
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.bio">
                                Bio
                            </label>
                            <textarea
                                id="profile.bio"
                                name="profile.bio"
                                value={formData.profile.bio}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Tell others about yourself, your interests, and what you're looking for</p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Interests
                                {validationErrors.interests && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {interestOptions.map((interest) => (
                                    <button
                                        key={interest.value}
                                        type="button"
                                        onClick={() => toggleInterest(interest.value)}
                                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${formData.profile.interests.includes(interest.value)
                                            ? 'bg-[#FF6B81] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {interest.icon}
                                        {interest.value}
                                        {formData.profile.interests.includes(interest.value) && (
                                            <Check size={14} />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {validationErrors.interests && (
                                <p className="text-red-500 text-sm mt-2">{validationErrors.interests}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Languages
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {languageOptions.map((language) => (
                                    <button
                                        key={language}
                                        type="button"
                                        onClick={() => toggleLanguage(language)}
                                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${formData.profile.languages.includes(language)
                                            ? 'bg-[#FF6B81] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {language}
                                        {formData.profile.languages.includes(language) && (
                                            <Check size={14} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case 4:
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Profile Photos
                                {validationErrors.photos && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {formData.profile.photos.map((photo, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden group">
                                        <img
                                            src={photo}
                                            alt={`Profile photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-2 left-2 bg-[#FF6B81] text-white text-xs px-2 py-0.5 rounded-full">
                                                Main
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {formData.profile.photos.length < 6 && (
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF6B81]/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <Upload size={24} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Add Photo</span>
                                    </label>
                                )}
                            </div>
                            {validationErrors.photos && (
                                <p className="text-red-500 text-sm mt-2">{validationErrors.photos}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Add up to 6 photos. The first photo will be your main profile photo.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Profile Questions
                            </label>

                            {formData.profile.questions.map((question, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium text-gray-700">Question {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Enter your question..."
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            value={question.answer}
                                            onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="Your answer..."
                                        />
                                    </div>
                                </div>
                            ))}

                            {formData.profile.questions.length < 3 && (
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#FF6B81]/50 hover:text-[#FF6B81] transition-colors"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Question
                                </button>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                                Add questions and answers to showcase your personality.
                            </p>
                        </div>
                    </>
                );

            case 5:
                return (
                    <>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.lookingFor">
                                I'm Looking For
                            </label>
                            <select
                                id="profile.lookingFor"
                                name="profile.lookingFor"
                                value={formData.profile.lookingFor}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            >
                                <option value="Relationship">Relationship</option>
                                <option value="Casual">Casual Dating</option>
                                <option value="Friendship">Friendship</option>
                                <option value="Marriage">Marriage</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.showMe">
                                Show Me
                            </label>
                            <select
                                id="profile.showMe"
                                name="profile.showMe"
                                value={formData.profile.showMe}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            >
                                <option value="Women">Women</option>
                                <option value="Men">Men</option>
                                <option value="Everyone">Everyone</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Age Range: {formData.profile.ageRange[0]} - {formData.profile.ageRange[1]}
                            </label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="range"
                                    min="18"
                                    max="70"
                                    value={formData.profile.ageRange[0]}
                                    onChange={(e) => handleAgeRangeChange(0, parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                />
                                <span className="text-sm font-medium w-8 text-center">{formData.profile.ageRange[0]}</span>
                            </div>
                            <div className="flex gap-4 items-center mt-2">
                                <input
                                    type="range"
                                    min="18"
                                    max="70"
                                    value={formData.profile.ageRange[1]}
                                    onChange={(e) => handleAgeRangeChange(1, parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                />
                                <span className="text-sm font-medium w-8 text-center">{formData.profile.ageRange[1]}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1" htmlFor="profile.maxDistance">
                                Maximum Distance: {formData.profile.maxDistance} miles
                            </label>
                            <input
                                type="range"
                                id="profile.maxDistance"
                                name="profile.maxDistance"
                                min="5"
                                max="100"
                                step="5"
                                value={formData.profile.maxDistance}
                                onChange={handleChange}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                            />
                        </div>

                        <div className="flex items-start mt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 mt-1 text-[#FF6B81] border-gray-300 rounded focus:ring-[#FF6B81]"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#FF6B81] hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-[#FF6B81] hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{getStepTitle()}</h1>
                <p className="text-gray-600">Step {step} of 5</p>
            </div>

            {renderProgress()}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-start">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
                {renderForm()}

                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="ml-auto px-4 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg transition-colors flex items-center"
                        >
                            Next
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="ml-auto px-6 py-2 bg-[#FF6B81] hover:bg-[#D86D72] text-white rounded-lg transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} className="ml-1" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>

            {step === 1 && (
                <>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#FF6B81] hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-600 text-sm">Or sign up with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button
                                type="button"
                                className="p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                onClick={() => authService.oauthRegister('google', '')}
                            >
                                <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
                                Google
                            </button>
                            <button
                                type="button"
                                className="p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                onClick={() => authService.oauthRegister('apple', '')}
                            >
                                <img src="/images/apple-icon.svg" alt="Apple" className="h-5 w-5 mr-2" />
                                Apple
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Register;