import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
    Camera, Edit, ChevronRight,
    ChevronDown, Plus, ArrowLeft, Instagram, Music, AlertTriangle,
    Twitter,
    Video,
    Youtube
} from 'lucide-react';
import { ExtendedProfile, ProfileQuestion } from '@/types/profile.type';
import useProfileApi from '@/hooks/useProfileAPI';
import profileService from '@/services/profile.service';

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
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const {
        loading,
        error,
        validationErrors,
        updateProfile,
        uploadPhoto,
        deletePhoto
    } = useProfileApi();

    const [formData, setFormData] = useState<any>({
        name: '',
        age: '',
        gender: '',
        bio: '',
        occupation: '',
        education: '',
        location: '',
        interests: [],
        languages: [],
        height: '',
        drinking: '',
        smoking: '',
        zodiac: '',
        lookingFor: '',
        showMe: '',
        ageRange: [25, 35],
        maxDistance: 25,
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
                        age: profile.age || '',
                        gender: profile.gender || '',
                        bio: profile.bio || '',
                        occupation: profile.occupation || '',
                        education: profile.education || '',
                        location: profile.location || '',
                        interests: [...(profile.interests || [])],
                        languages: [...(profile.languages || [])],
                        height: profile.height || '',
                        drinking: profile.drinking || '',
                        smoking: profile.smoking || '',
                        zodiac: profile.zodiac || '',
                        lookingFor: profile.lookingFor || '',
                        showMe: profile.showMe || 'Everyone',
                        ageRange: profile.ageRange || [25, 35],
                        maxDistance: profile.maxDistance || 25,
                        questions: profile.questions ? [...profile.questions] : []
                    });
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

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value, 10)
        });
    };

    const handleMinAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const minAge = parseInt(e.target.value, 10);
        setFormData({
            ...formData,
            ageRange: [minAge, formData.ageRange ? formData.ageRange[1] : 35]
        });
    };

    const handleMaxAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxAge = parseInt(e.target.value, 10);
        setFormData({
            ...formData,
            ageRange: [formData.ageRange ? formData.ageRange[0] : 25, maxAge]
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

    const handleAddLanguage = () => {
        const newLanguage = prompt("Add a language:");
        if (newLanguage && newLanguage.trim()) {
            setFormData({
                ...formData,
                languages: [...(formData.languages || []), newLanguage.trim()]
            });
        }
    };

    const handleRemoveLanguage = (index: number) => {
        const updatedLanguages = [...(formData.languages || [])];
        updatedLanguages.splice(index, 1);
        setFormData({
            ...formData,
            languages: updatedLanguages
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
            saveChanges();
        } else {
            setEditing(true);
        }
    };

    const saveChanges = async () => {
        const updatedProfile = {
            ...userData,
            ...formData
        };

        const profile = await updateProfile(updatedProfile, userData.id || '');

        if (profile) {
            setUserData({
                ...profile,
                notifications: userData.notifications,
                subscription: userData.subscription
            });

            setEditing(false);
        }
    };

    if (!isLoaded && !loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-[#FF6B81] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        {loading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="animate-spin h-8 w-8 border-4 border-[#FF6B81] border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-700">Loading...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
            <AlertTriangle size={18} className="mr-2" />
            <span>{error}</span>
            <button className="ml-4 text-red-700">&times;</button>
          </div>
        )}

        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button className="mr-2 md:hidden">
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                Profile & Settings
              </h1>
            </div>
            {activeTab === "profile" && (
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  editing
                    ? "bg-[#FF6B81] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={toggleEdit}
                disabled={loading}
              >
                {editing ? "Save" : "Edit"}
              </button>
            )}
          </div>
        </header>

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

        <div className="container mx-auto px-4 pt-6 pb-20">
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Basic Information
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                      placeholder="Your name"
                      required
                    />
                  ) : (
                    <div className="text-gray-700">{userData.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Age
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ""}
                      onChange={handleNumberChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                      placeholder="Your age"
                      min="18"
                    />
                  ) : (
                    <div className="text-gray-700">
                      {userData.age || "Not specified"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Gender
                  </label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="text-gray-700">
                      {userData.gender || "Not specified"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                      placeholder="City, State"
                    />
                  ) : (
                    <div className="text-gray-700">
                      {userData.location || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Dating Preferences
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Looking For
                  </label>
                  {editing ? (
                    <select
                      name="lookingFor"
                      value={formData.lookingFor || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                    >
                      <option value="">Select what you're looking for</option>
                      <option value="Relationship">Relationship</option>
                      <option value="Marriage">Marriage</option>
                      <option value="Casual">Casual</option>
                      <option value="Friendship">Friendship</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  ) : (
                    <div className="text-gray-700">
                      {userData.lookingFor || "Not specified"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Show Me
                  </label>
                  {editing ? (
                    <select
                      name="showMe"
                      value={formData.showMe || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                      <option value="Non-binary">Non-binary</option>
                    </select>
                  ) : (
                    <div className="text-gray-700">
                      {userData.showMe || "Everyone"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Age Range
                  </label>
                  {editing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={formData.ageRange ? formData.ageRange[0] : 25}
                        onChange={handleMinAgeChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                        min="18"
                        max="100"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={formData.ageRange ? formData.ageRange[1] : 35}
                        onChange={handleMaxAgeChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                        min="18"
                        max="100"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      {userData.ageRange
                        ? `${userData.ageRange[0]} to ${userData.ageRange[1]}`
                        : "Not specified"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Maximum Distance (miles)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      name="maxDistance"
                      value={formData.maxDistance || 25}
                      onChange={handleNumberChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                      min="1"
                      max="100"
                    />
                  ) : (
                    <div className="text-gray-700">
                      {userData.maxDistance || 25} miles
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Photos</h2>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {userData.photos &&
                    userData.photos.map((photo, index) => (
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
                    Drag to reorder. First photo will be your main profile
                    photo.
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
                    {userData.bio ? (
                      userData.bio
                        .split("\n\n")
                        .map((paragraph, i) => <p key={i}>{paragraph}</p>)
                    ) : (
                      <p className="text-gray-400 italic">No bio added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("work")}
              >
                <h2 className="text-lg font-bold text-gray-800">
                  Work & Education
                </h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "work" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "work" && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Occupation
                    </label>
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
                        {userData.occupation || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Education
                    </label>
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
                        {userData.education || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("basic")}
              >
                <h2 className="text-lg font-bold text-gray-800">Basic Info</h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "basic" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "basic" && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Height
                    </label>
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
                        {userData.height || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Drinking
                    </label>
                    {editing ? (
                      <select
                        name="drinking"
                        value={formData.drinking || ""}
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
                        {userData.drinking || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Smoking
                    </label>
                    {editing ? (
                      <select
                        name="smoking"
                        value={formData.smoking || ""}
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
                        {userData.smoking || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Zodiac
                    </label>
                    {editing ? (
                      <select
                        name="zodiac"
                        value={formData.zodiac || ""}
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
                        {userData.zodiac || (
                          <span className="text-gray-400 italic">
                            Not specified
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("interests")}
              >
                <h2 className="text-lg font-bold text-gray-800">Interests</h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "interests" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "interests" && (
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.interests && formData.interests.length > 0
                      ? formData.interests.map((interest: any, index: number) => (
                          <div
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              editing
                                ? "bg-gray-100 text-gray-700 pr-1.5 group"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {interest}
                            {editing && (
                              <button
                                className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveInterest(index)}
                              >
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))
                      : !editing && (
                          <div className="text-gray-400 italic">
                            No interests added yet.
                          </div>
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
                onClick={() => toggleSection("languages")}
              >
                <h2 className="text-lg font-bold text-gray-800">Languages</h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "languages" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "languages" && (
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.languages && formData.languages.length > 0
                      ? formData.languages.map((language: any, index: number) => (
                          <div
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              editing
                                ? "bg-gray-100 text-gray-700 pr-1.5 group"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {language}
                            {editing && (
                              <button
                                className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveLanguage(index)}
                              >
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))
                      : !editing && (
                          <div className="text-gray-400 italic">
                            No languages added yet.
                          </div>
                        )}

                    {editing && (
                      <button
                        className="px-2 py-1.5 rounded-full text-sm bg-[#FF6B81]/10 text-[#FF6B81] flex items-center hover:bg-[#FF6B81]/20 transition-colors"
                        onClick={handleAddLanguage}
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
                onClick={() => toggleSection("questions")}
              >
                <h2 className="text-lg font-bold text-gray-800">Questions</h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "questions" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "questions" && (
                <div className="p-4 space-y-5">
                  {formData.questions && formData.questions.length > 0
                    ? formData.questions.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-2 border-[#FF6B81] pl-4 py-1"
                        >
                          <div className="text-gray-500 mb-1">
                            {item.question}
                          </div>
                          {editing ? (
                            <input
                              type="text"
                              value={item.answer}
                              onChange={(e) =>
                                handleUpdateQuestion(idx, e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/30 focus:border-[#FF6B81]"
                            />
                          ) : (
                            <div className="text-gray-700">{item.answer}</div>
                          )}
                        </div>
                      ))
                    : !editing && (
                        <div className="text-gray-400 italic">
                          No questions answered yet.
                        </div>
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

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("accounts")}
              >
                <h2 className="text-lg font-bold text-gray-800">
                  Connected Accounts
                </h2>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    expandedSection === "accounts" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedSection === "accounts" && (
                <div className="divide-y divide-gray-100">
                  {/* Instagram (existing) */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Instagram className="text-pink-500 mr-3" size={20} />
                      <div>
                        <div className="font-medium">Instagram</div>
                        <div className="text-gray-500 text-sm">
                          {userData.instagram || "Not connected"}
                        </div>
                      </div>
                    </div>
                    <button className="text-[#FF6B81] text-sm font-medium">
                      {userData.instagram ? "Disconnect" : "Connect"}
                    </button>
                  </div>

                  {/* Spotify (existing) */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Music className="text-primary mr-3" size={20} />
                      <div>
                        <div className="font-medium">Spotify</div>
                        <div className="text-gray-500 text-sm">
                          {userData.spotifyArtists &&
                          userData.spotifyArtists.length > 0
                            ? `${userData.spotifyArtists.length} artists connected`
                            : "Not connected"}
                        </div>
                      </div>
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                      {userData.spotifyArtists &&
                      userData.spotifyArtists.length > 0
                        ? "Manage"
                        : "Connect"}
                    </button>
                  </div>

                  {/* Twitter/X (new) */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Twitter className="text-blue-400 mr-3" size={20} />
                      <div>
                        <div className="font-medium">Twitter/X</div>
                        <div className="text-gray-500 text-sm">
                          {userData.twitter || "Not connected"}
                        </div>
                      </div>
                    </div>
                    <button className="text-[#1DA1F2] text-sm font-medium">
                      {userData.twitter ? "Disconnect" : "Connect"}
                    </button>
                  </div>

                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Video className="text-black mr-3" size={20} />
                      <div>
                        <div className="font-medium">TikTok</div>
                        <div className="text-gray-500 text-sm">
                          {userData.tiktok || "Not connected"}
                        </div>
                      </div>
                    </div>
                    <button className="text-[#000000] text-sm font-medium">
                      {userData.tiktok ? "Disconnect" : "Connect"}
                    </button>
                  </div>

                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Youtube className="text-red-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium">YouTube</div>
                        <div className="text-gray-500 text-sm">
                          {userData.youtube ? "Connected" : "Not connected"}
                        </div>
                      </div>
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                      {userData.youtube ? "Manage" : "Connect"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
};

export default UserProfile;