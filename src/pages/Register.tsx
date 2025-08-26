import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    User, Mail, Lock, ArrowRight, Calendar, AlertCircle,
    MapPin, Check, ChevronLeft, ChevronRight, Upload, X,
    Globe, BookOpen, Camera, Music, Coffee, Film,
    Plus, Gift, Eye, EyeOff
} from 'lucide-react';
import authService from '@/services/auth.service';

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

const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi'
];

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    type Profile = {
        name: string;
        birthdate: string;
        bio: string;
        location: string;
        photos: string[];
        interests: string[];
        languages: string[];
        lookingFor: string;
        showMe: string;
        gender: string;
        ageRange: [number, number];
        maxDistance: number;
        questions: { question: string; answer: string }[];
    };
    
    type RegisterFormData = {
        email: string;
        password: string;
        confirmPassword: string;
        referralCode: string;
        profile: Profile;
    };
    
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        profile: {
            name: '',
            birthdate: '',
            bio: '',
            location: '',
            photos: [],
            interests: [],
            languages: [],
            lookingFor: 'Relationship',
            showMe: 'Women',
            gender: '',
            ageRange: [25, 35],
            maxDistance: 25,
            questions: []
        }
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const refCode = params.get("ref");

        if (refCode) {
            setFormData((prev) => ({
                ...prev,
                referralCode: refCode,
            }));
        }
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, field] = name.split('.');
            if (parent === "profile") {
                setFormData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        [field]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

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

    const toggleLanguage = (language) => {
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

    const handleAgeRangeChange = (index, value) => {
        setFormData(prev => {
            const newRange = [...prev.profile.ageRange];
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

    const updateQuestion = (index, field, value) => {
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

    const removeQuestion = (index) => {
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

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
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

    const removePhoto = (index) => {
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

    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateStep = () => {
        const errors = {};

        switch (step) {
            case 1:
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

            case 2: 
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

            case 3: 

                if (!formData.profile.bio) {
                    errors.bio = 'Bio is required';
                }
                if (formData.profile.interests.length === 0) {
                    errors.interests = 'Please select at least one interest';
                }
                break;

            case 4:
                if (formData.profile.photos.length === 0) {
                    errors.photos = 'Please upload at least one photo';
                }
                break;

            case 5:
                if (!agreeToTerms) {
                    errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
                }
                break;

            default:
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setIsTransitioning(true);
            setTimeout(() => {
                setStep(prevStep => prevStep + 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const prevStep = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setStep(prevStep => prevStep - 1);
            setIsTransitioning(false);
        }, 300);
    };

    const convertBlobToBase64 = (blobUrl) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!validateStep()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const base64Photos = await Promise.all(
                formData.profile.photos.map(photo => convertBlobToBase64(photo))
            );

            const age = calculateAge(formData.profile.birthdate);

            const { birthdate, ...profileWithoutBirthdate } = formData.profile;
            const registerData = {
                email: formData.email,
                password: formData.password,
                referralCode: formData.referralCode,
                profile: {
                    ...profileWithoutBirthdate,
                    photos: base64Photos,
                    age,
                    questions: formData.profile.questions.filter(
                        q => q.question.trim() !== '' && q.answer.trim() !== ''
                    )
                }
            };

            await authService.register(registerData);

            // Show success animation before redirecting
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            console.error('Registration error:', err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                const apiErrors = err.response.data.errors;
                const formattedErrors = {};

                apiErrors.forEach((error) => {
                    const field = error.path.split('.').pop();
                    formattedErrors[field] = error.message;
                });

                setValidationErrors(formattedErrors);

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
            setFormSubmitted(false);
        }
    };

    const renderProgress = () => {
        return (
            <div className="relative mb-8">
                {/* Progress bar background */}
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    {/* Progress bar indicator */}
                    <div 
                        className="h-full bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] transition-all duration-500 ease-in-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    ></div>
                </div>
                
                {/* Step indicators */}
                <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
                    {[1, 2, 3, 4, 5].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ease-in-out
                                ${stepNumber === step
                                    ? 'bg-[#FF6B81] text-white scale-110 shadow-lg shadow-[#FF6B81]/30'
                                    : stepNumber < step
                                        ? 'bg-[#FF6B81] text-white scale-100'
                                        : 'bg-white border-2 border-gray-200 text-gray-400'
                                }`}
                        >
                            {stepNumber < step ? <Check size={12} /> : stepNumber}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

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

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return "Let's set up your login credentials";
            case 2:
                return "Tell us a bit about yourself";
            case 3:
                return "Share your interests and languages";
            case 4:
                return "Upload photos to complete your profile";
            case 5:
                return "Set your dating preferences";
            default:
                return "";
        }
    };

    const renderForm = () => {
        return (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="email"
                            >
                                Email
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 border ${
                                        validationErrors.email
                                            ? "border-red-500 ring-1 ring-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="password"
                            >
                                Password
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 pr-10 border ${
                                        validationErrors.password
                                            ? "border-red-500 ring-1 ring-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {validationErrors.password ? (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.password}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                   
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full p-3 pl-10 pr-10 border ${
                                        validationErrors.confirmPassword
                                            ? "border-red-500 ring-1 ring-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="referralCode"
                            >
                                Referral Code{" "}
                                <span className="text-gray-500 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Gift
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    id="referralCode"
                                    name="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200"
                                    placeholder="Enter referral code"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                If someone referred you, enter their code here
                            </p>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.name">
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
                                    className={`w-full p-3 pl-10 border ${validationErrors.name 
                                        ? 'border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                    placeholder="Your name"
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.birthdate">
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
                                    className={`w-full p-3 pl-10 border ${validationErrors.birthdate 
                                        ? 'border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                />
                            </div>
                            {validationErrors.birthdate ? (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.birthdate}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                    You must be 18 years or older
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.location">
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
                                    className={`w-full p-3 pl-10 border ${validationErrors.location 
                                        ? 'border-red-500 ring-1 ring-red-500' 
                                        : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200`}
                                    placeholder="City, State"
                                />
                            </div>
                            {validationErrors.location && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.location}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.bio">
                                Bio
                            </label>
                            <textarea
                                id="profile.bio"
                                name="profile.bio"
                                value={formData.profile.bio}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] transition-all duration-200 resize-none"
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tell others about yourself, your interests, and what you're looking for
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all duration-200 ${
                                            formData.profile.interests.includes(interest.value)
                                                ? 'bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {interest.icon}
                                        {interest.value}
                                        {formData.profile.interests.includes(interest.value) && (
                                            <Check size={14} className="ml-1" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {validationErrors.interests && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.interests}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Languages
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {languageOptions.map((language) => (
                                    <button
                                        key={language}
                                        type="button"
                                        onClick={() => toggleLanguage(language)}
                                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all duration-200 ${
                                            formData.profile.languages.includes(language)
                                                ? 'bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {language}
                                        {formData.profile.languages.includes(language) && (
                                            <Check size={14} className="ml-1" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Photos
                                {validationErrors.photos && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {formData.profile.photos.map((photo, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden group border border-gray-200 shadow-sm">
                                        <img
                                            src={photo}
                                            alt={`Profile photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50"
                                            aria-label="Remove photo"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                                                Main
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {formData.profile.photos.length < 6 && (
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF6B81]/50 hover:bg-gray-50 transition-all duration-200">
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
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {validationErrors.photos}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Add up to 6 photos. The first photo will be your main profile photo.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Questions
                            </label>

                            {formData.profile.questions.map((question, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg mb-3 border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium text-gray-700">Question {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                            aria-label="Remove question"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Enter your question..."
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            value={question.answer}
                                            onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                                            placeholder="Your answer..."
                                        />
                                    </div>
                                </div>
                            ))}

                            {formData.profile.questions.length < 3 && (
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-[#FF6B81]/50 hover:text-[#FF6B81] hover:bg-gray-50 transition-all duration-200"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Question
                                </button>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                                Add questions and answers to showcase your personality.
                            </p>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.lookingFor">
                                I'm Looking For
                            </label>
                            <select
                                id="profile.lookingFor"
                                name="profile.lookingFor"
                                value={formData.profile.lookingFor}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] bg-white"
                            >
                                <option value="Relationship">Relationship</option>
                                <option value="Casual">Casual Dating</option>
                                <option value="Friendship">Friendship</option>
                                <option value="Marriage">Marriage</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.gender">
                                    Gender
                                </label>
                                <select
                                    id="profile.gender"
                                    name="profile.gender"
                                    value={formData.profile.gender}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] bg-white"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.showMe">
                                    Show Me
                                </label>
                                <select
                                    id="profile.showMe"
                                    name="profile.showMe"
                                    value={formData.profile.showMe}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81] bg-white"
                                >
                                    <option value="Women">Women</option>
                                    <option value="Men">Men</option>
                                    <option value="Everyone">Everyone</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age Range: {formData.profile.ageRange[0]} - {formData.profile.ageRange[1]}
                            </label>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="range"
                                        min="18"
                                        max="70"
                                        value={formData.profile.ageRange[0]}
                                        onChange={(e) => handleAgeRangeChange(0, parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                    />
                                    <span className="text-sm font-medium w-8 text-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">{formData.profile.ageRange[0]}</span>
                                </div>
                                <div className="flex gap-4 items-center mt-4">
                                    <input
                                        type="range"
                                        min="18"
                                        max="70"
                                        value={formData.profile.ageRange[1]}
                                        onChange={(e) => handleAgeRangeChange(1, parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                    />
                                    <span className="text-sm font-medium w-8 text-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">{formData.profile.ageRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile.maxDistance">
                                Maximum Distance: {formData.profile.maxDistance} miles
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    id="profile.maxDistance"
                                    name="profile.maxDistance"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={formData.profile.maxDistance}
                                    onChange={handleChange}
                                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#FF6B81]"
                                />
                                <span className="text-sm font-medium w-12 text-center bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">{formData.profile.maxDistance}</span>
                            </div>
                        </div>

                        <div className="flex items-start mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToTerms}
                                onChange={() => setAgreeToTerms(!agreeToTerms)}
                                className={`h-5 w-5 mt-0.5 rounded border-gray-300 text-[#FF6B81] focus:ring-[#FF6B81]/50 ${validationErrors.terms ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#FF6B81] hover:underline font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-[#FF6B81] hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {validationErrors.terms && (
                            <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {validationErrors.terms}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{getStepTitle()}</h1>
                <p className="text-gray-600 text-sm">{getStepDescription()}</p>
            </div>

            {renderProgress()}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-start animate-fadeIn">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()} className="space-y-4">
                {renderForm()}

                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-gray-400/30"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back
                        </button>
                    ) : (
                        <div></div> // Empty div to maintain layout with flex justify-between
                    )}

                    {step < 5 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] hover:from-[#FF5A70] hover:to-[#FF7A8A] text-white rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50"
                        >
                            Next
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] hover:from-[#FF5A70] hover:to-[#FF7A8A] text-white rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50"
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
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#FF6B81] hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            )}

            {/* Global CSS */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                /* Improve range input styling */
                input[type="range"] {
                    -webkit-appearance: none;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 5px;
                    background-image: linear-gradient(to right, #FF6B81, #FF8E9E);
                    background-repeat: no-repeat;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #FF6B81;
                    cursor: pointer;
                    box-shadow: 0 0 2px 0 rgba(0,0,0,0.25);
                }
                
                input[type="range"]::-moz-range-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #FF6B81;
                    cursor: pointer;
                    box-shadow: 0 0 2px 0 rgba(0,0,0,0.25);
                    border: none;
                }
                
                input[type="range"]:focus {
                    outline: none;
                }
                
                input[type="range"]::-webkit-slider-runnable-track {
                    -webkit-appearance: none;
                    box-shadow: none;
                    border: none;
                    background: transparent;
                }
                
                input[type="range"]::-moz-range-track {
                    box-shadow: none;
                    border: none;
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default Register;