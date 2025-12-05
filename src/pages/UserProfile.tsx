import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Camera,
  ChevronDown,
  Plus,
  ArrowLeft,
  AlertTriangle,
  User,
  Shield,
  Eye,
  UserX,
  X,
} from "lucide-react";
import {
  ExtendedProfile,
  ProfileQuestion,
} from "@/types/profile.type";
import useProfileApi from "@/hooks/useProfileAPI";
import profileService from "@/services/profile.service";
import PremiumUpsell from "@/elements/PremiumUpsell";

const defaultUserData: ExtendedProfile = {
  name: "",
  photos: [],
  bio: "",
  interests: [],
  languages: [],
  notifications: true,
  subscription: "Free",
};

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<ExtendedProfile>(defaultUserData);
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [editing, setEditing] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [premiumError, setPremiumError] = useState<string | null>(null);

  const [profileViews, setProfileViews] = useState<{ planInfo?: { currentPlan?: string }, views?: any[] }>({});
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [blockedUsers, setBlockedUsers] = useState<{ data?: any[], planInfo?: { featureUnlocked?: boolean, currentPlan?: string } }>({});
  const [blockModalOpen, setBlockModalOpen] = useState<boolean>(false);
  const [userToBlock, setUserToBlock] = useState<any>(null);
  const [blockType, setBlockType] = useState<"profile" | "complete">(
    "complete"
  );
  const [blockReason, setBlockReason] = useState<string>("");
  const [viewsFilter, setViewsFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  const {
    loading,
    error,
    validationErrors,
    updateProfile,
    uploadPhoto,
    deletePhoto,
  } = useProfileApi();

  const [formData, setFormData] = useState<any>({
    name: "",
    age: "",
    gender: "",
    bio: "",
    occupation: "",
    education: "",
    location: "",
    interests: [],
    languages: [],
    height: "",
    drinking: "",
    smoking: "",
    zodiac: "",
    lookingFor: "",
    showMe: "",
    ageRange: [25, 35],
    maxDistance: 25,
    questions: [],
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile) {
          setUserData({
            ...profile,
            notifications: true,
            subscription: profile.subscription || "Free",
          });
          setFormData({
            name: profile.name || "",
            age: profile.age || "",
            gender: profile.gender || "",
            bio: profile.bio || "",
            occupation: profile.occupation || "",
            education: profile.education || "",
            location: profile.location || "",
            interests: [...(profile.interests || [])],
            languages: [...(profile.languages || [])],
            height: profile.height || "",
            drinking: profile.drinking || "",
            smoking: profile.smoking || "",
            zodiac: profile.zodiac || "",
            lookingFor: profile.lookingFor || "",
            showMe: profile.showMe || "Everyone",
            ageRange: profile.ageRange || [25, 35],
            maxDistance: profile.maxDistance || 25,
            questions: profile.questions ? [...profile.questions] : [],
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

  useEffect(() => {
    const fetchProfileViews = async () => {
      try {
        const viewsData = await profileService.getProfileViews();
        setProfileViews(viewsData);
      } catch (err) {
        if (err instanceof Error) {
          setPremiumError(err.message);
        } else {
          setPremiumError("An error occurred while fetching profile views.");
        }
      }
    };

    const fetchViewsCount = async () => {
      if (userData && userData.id) {
        try {
          const count = await profileService.getProfileViewsCount(userData.id);
          setViewsCount(count);
        } catch (err) {
          console.error("Failed to fetch views count", err);
        }
      }
    };

    const fetchBlockedUsers = async () => {
      try {
        const response = await profileService.getBlockedUsers();
        setBlockedUsers(response);
      } catch (err) {
        console.error("Failed to fetch blocked users", err);
      }
    };

    if (isLoaded) {
      fetchProfileViews();
      fetchViewsCount();
      fetchBlockedUsers();
    }
  }, [isLoaded, userData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10),
    });
  };

  const handleMinAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const minAge = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      ageRange: [minAge, formData.ageRange ? formData.ageRange[1] : 35],
    });
  };

  const handleMaxAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maxAge = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      ageRange: [formData.ageRange ? formData.ageRange[0] : 25, maxAge],
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
      const updatedPhotos = [...(userData.photos || []), photoUrl];
      setUserData({
        ...userData,
        photos: updatedPhotos,
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
        photos: updatedPhotos,
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
        interests: [...(formData.interests || []), newInterest.trim()],
      });
    }
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...(formData.interests || [])];
    updatedInterests.splice(index, 1);
    setFormData({
      ...formData,
      interests: updatedInterests,
    });
  };

  const handleAddLanguage = () => {
    const newLanguage = prompt("Add a language:");
    if (newLanguage && newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), newLanguage.trim()],
      });
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = [...(formData.languages || [])];
    updatedLanguages.splice(index, 1);
    setFormData({
      ...formData,
      languages: updatedLanguages,
    });
  };

  const handleUpdateQuestion = (index: number, answer: string) => {
    if (!formData.questions) return;

    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      answer,
    };

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleAddQuestion = () => {
    const question = prompt("Enter a new question:");
    const answer = prompt("Enter your answer:");

    if (question && question.trim() && answer && answer.trim()) {
      const newQuestion: ProfileQuestion = {
        question: question.trim(),
        answer: answer.trim(),
      };

      setFormData({
        ...formData,
        questions: [...(formData.questions || []), newQuestion],
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
      ...formData,
    };

    const profile = await updateProfile(updatedProfile, userData.id || "");

    if (profile) {
      setUserData({
        ...profile,
        notifications: userData.notifications,
        subscription: userData.subscription,
      });

      setEditing(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await profileService.blockUser(userId);
      setBlockModalOpen(false);
      const blocked = await profileService.getBlockedUsers();
      setBlockedUsers(blocked);
    } catch (err) {
      console.error("Failed to block user", err);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await profileService.unblockUser(userId);
      const blocked = await profileService.getBlockedUsers();
      setBlockedUsers(blocked);
    } catch (err) {
      console.error("Failed to unblock user", err);
    }
  };

  const formatViewTime = (date: string) => {
    const viewDate = new Date(date);
    const now = new Date();

    if (viewDate.toDateString() === now.toDateString()) {
      return `Today at ${viewDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (viewDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${viewDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return (
      viewDate.toLocaleDateString() +
      " at " +
      viewDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (!isLoaded && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="animate-spin h-10 w-10 border-4 border-[#FF6B9D] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-20">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="animate-spin h-8 w-8 border-4 border-[#FF6B9D] border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-300">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg z-50 flex items-center shadow-md">
          <AlertTriangle size={18} className="mr-2" />
          <span>{error}</span>
          <button className="ml-4 text-red-300">&times;</button>
        </div>
      )}

      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-2 md:hidden">
              <ArrowLeft size={24} className="text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-white">
              Profile & Settings
            </h1>
          </div>
          {activeTab === "profile" && (
            <button
              className={`px-4 py-1.5 mr-[36px] md:mr-2 rounded-full text-sm font-medium ${
                editing
                  ? "bg-[#FF6B9D] text-white hover:bg-[#FF4D88]"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
            <p className="font-bold">Please fix the following errors:</p>
            <ul className="list-disc ml-5 mt-2">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-6 pb-20 max-w-4xl">
        {/* Profile Header Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800">
                {userData.photos && userData.photos[0] ? (
                  <img
                    src={userData.photos[0]}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <User size={48} className="text-gray-600" />
                  </div>
                )}
              </div>
              {editing && (
                <button
                  onClick={handleAddPhoto}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#FF6B9D] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Camera size={20} className="text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {userData.name || "Your Name"}
                {userData.age && <span className="text-gray-400">, {userData.age}</span>}
              </h1>
              <p className="text-gray-400 mb-4">
                {userData.location || "Add your location"}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {userData.interests && userData.interests.slice(0, 3).map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {userData.interests && userData.interests.length > 3 && (
                  <span className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full">
                    +{userData.interests.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white placeholder-gray-500"
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <div className="text-gray-300">
                    {userData.bio ? (
                      userData.bio.split("\n\n").map((paragraph, i) => <p key={i} className="mb-2">{paragraph}</p>)
                    ) : (
                      <p className="text-gray-500 italic">No bio added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Photos Grid */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Photos</h2>
                <div className="grid grid-cols-3 gap-3">
                  {userData.photos &&
                    userData.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden relative group"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {editing && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button
                              className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white"
                              onClick={() => handleRemovePhoto(index)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-[#FF6B9D] text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  {editing && (
                    <button
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:text-gray-400 hover:border-gray-600 transition-colors"
                      onClick={handleAddPhoto}
                    >
                      <Plus size={24} />
                      <span className="mt-1 text-xs">Add</span>
                    </button>
                  )}
                </div>
                {editing && (
                  <p className="text-xs text-gray-400 mt-3">First photo will be your main profile photo</p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </section>

            {/* Interests & Languages */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.interests && formData.interests.length > 0
                    ? formData.interests.map((interest: any, index: number) => (
                        <div
                          key={index}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            editing
                              ? "bg-gray-800 text-gray-300 pr-1.5 group"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {interest}
                          {editing && (
                            <button
                              className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveInterest(index)}
                            >
                              <X size={14} className="text-gray-400 inline" />
                            </button>
                          )}
                        </div>
                      ))
                    : !editing && (
                        <div className="text-gray-500 italic">
                          No interests added yet.
                        </div>
                      )}

                  {editing && (
                    <button
                      className="px-2 py-1.5 rounded-full text-sm bg-[#FF6B9D]/10 text-[#FF6B9D] flex items-center hover:bg-[#FF6B9D]/20 transition-colors"
                      onClick={handleAddInterest}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-4 mt-8">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.languages && formData.languages.length > 0
                    ? formData.languages.map((language: any, index: number) => (
                        <div
                          key={index}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            editing
                              ? "bg-gray-800 text-gray-300 pr-1.5 group"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {language}
                          {editing && (
                            <button
                              className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveLanguage(index)}
                            >
                              <X size={14} className="text-gray-400 inline" />
                            </button>
                          )}
                        </div>
                      ))
                    : !editing && (
                        <div className="text-gray-500 italic">
                          No languages added yet.
                        </div>
                      )}

                  {editing && (
                    <button
                      className="px-2 py-1.5 rounded-full text-sm bg-[#FF6B9D]/10 text-[#FF6B9D] flex items-center hover:bg-[#FF6B9D]/20 transition-colors"
                      onClick={handleAddLanguage}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Questions Section */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Questions</h2>
                <div className="space-y-4">
                  {formData.questions && formData.questions.length > 0
                    ? formData.questions.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-2 border-[#FF6B9D] pl-4 py-2"
                        >
                          <div className="text-gray-400 text-sm mb-2">
                            {item.question}
                          </div>
                          {editing ? (
                            <input
                              type="text"
                              value={item.answer}
                              onChange={(e) =>
                                handleUpdateQuestion(idx, e.target.value)
                              }
                              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white"
                            />
                          ) : (
                            <div className="text-gray-300">{item.answer}</div>
                          )}
                        </div>
                      ))
                    : !editing && (
                        <div className="text-gray-500 italic">
                          No questions answered yet.
                        </div>
                      )}

                  {editing && (
                    <button
                      className="w-full mt-3 py-2 flex items-center justify-center text-[#FF6B9D] bg-[#FF6B9D]/5 hover:bg-[#FF6B9D]/10 rounded-lg transition-colors"
                      onClick={handleAddQuestion}
                    >
                      <Plus size={16} className="mr-1.5" />
                      Add Question
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Details & Settings */}
          <div className="space-y-6">
            {/* Basic Details */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Name <span className="text-[#FF6B9D]">*</span>
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm placeholder-gray-500"
                        placeholder="Your name"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    {editing ? (
                      <input
                        type="number"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleNumberChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                        min="18"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.age || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    {editing ? (
                      <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.gender || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm placeholder-gray-500"
                        placeholder="City, State"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.location || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Height</label>
                    {editing ? (
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm placeholder-gray-500"
                        placeholder="e.g. 5'10"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.height || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Occupation</label>
                    {editing ? (
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm placeholder-gray-500"
                        placeholder="What do you do?"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.occupation || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Education</label>
                    {editing ? (
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm placeholder-gray-500"
                        placeholder="Your education"
                      />
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.education || "Not specified"}</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Dating Preferences */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Looking For</label>
                    {editing ? (
                      <select
                        name="lookingFor"
                        value={formData.lookingFor || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Relationship">Relationship</option>
                        <option value="Marriage">Marriage</option>
                        <option value="Casual">Casual</option>
                        <option value="Friendship">Friendship</option>
                      </select>
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.lookingFor || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Show Me</label>
                    {editing ? (
                      <select
                        name="showMe"
                        value={formData.showMe || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                      >
                        <option value="Everyone">Everyone</option>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Non-binary">Non-binary</option>
                      </select>
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.showMe || "Everyone"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age Range</label>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={formData.ageRange ? formData.ageRange[0] : 25}
                          onChange={handleMinAgeChange}
                          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                          min="18"
                          max="100"
                        />
                        <span className="text-gray-400 text-sm">-</span>
                        <input
                          type="number"
                          value={formData.ageRange ? formData.ageRange[1] : 35}
                          onChange={handleMaxAgeChange}
                          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                          min="18"
                          max="100"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-300 text-sm">
                        {userData.ageRange
                          ? `${userData.ageRange[0]} - ${userData.ageRange[1]}`
                          : "Not specified"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Distance</label>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="maxDistance"
                          value={formData.maxDistance || 25}
                          onChange={handleNumberChange}
                          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white text-sm"
                          min="1"
                          max="100"
                        />
                        <span className="text-gray-400 text-sm whitespace-nowrap">miles</span>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-sm">{userData.maxDistance || 25} miles</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Views */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <button
                className="w-full p-6 flex justify-between items-center"
                onClick={() => toggleSection("profileViews")}
              >
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-[#FF6B9D]" />
                  <h2 className="text-lg font-bold text-white">Profile Views</h2>
                  {viewsCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-sm text-gray-400">
                      {viewsCount}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform ${
                    expandedSection === "profileViews" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "profileViews" && (
                <div className="px-6 pb-6">
                  {premiumError ? (
                    <PremiumUpsell message="See who viewed your profile" />
                  ) : profileViews.views && profileViews.views.length > 0 ? (
                    <div className="space-y-3">
                      {profileViews.views.map((view) => (
                        <div
                          key={view.viewerId}
                          className="flex items-center justify-between p-3 border border-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{view.viewerName}</div>
                              <div className="text-xs text-gray-400">
                                {formatViewTime(view.viewedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Eye className="mx-auto mb-2 text-gray-700" size={32} />
                      <p className="text-sm">No views yet</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Blocked Users */}
            <section className="bg-gray-900 rounded-xl border border-gray-800">
              <button
                className="w-full p-6 flex justify-between items-center"
                onClick={() => toggleSection("blockedUsers")}
              >
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-[#FF6B9D]" />
                  <h2 className="text-lg font-bold text-white">Blocked Users</h2>
                  {blockedUsers?.data && blockedUsers.data.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-sm text-gray-400">
                      {blockedUsers.data.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform ${
                    expandedSection === "blockedUsers" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "blockedUsers" && (
                <div className="px-6 pb-6">
                  {!blockedUsers.planInfo?.featureUnlocked ? (
                    <PremiumUpsell message="Manage blocked users" />
                  ) : blockedUsers.data && blockedUsers.data.length > 0 ? (
                    <div className="space-y-3">
                      {blockedUsers.data.map((block) => (
                        <div
                          key={block.id}
                          className="flex items-center justify-between p-3 border border-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                              {block.blocked.profile?.photos?.[0] ? (
                                <img
                                  src={block.blocked.profile.photos[0]}
                                  alt={block.blocked.profile.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <UserX size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">
                                {block.blocked.profile?.name || "User"}
                              </div>
                              <div className="text-xs text-gray-400">{block.type}</div>
                            </div>
                          </div>
                          <button
                            className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                            onClick={() => handleUnblockUser(block.blocked.id)}
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Shield className="mx-auto mb-2 text-gray-700" size={32} />
                      <p className="text-sm">No blocked users</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Block User Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Block User</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-300 mb-4 text-sm">
                Choose how you want to block {userToBlock?.profile?.name || "this user"}:
              </p>

              <div className="space-y-3 mb-4">
                <label className="flex items-start p-3 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50">
                  <input
                    type="radio"
                    name="blockType"
                    value="profile"
                    checked={blockType === "profile"}
                    onChange={() => setBlockType("profile")}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-white text-sm">Profile Block</div>
                    <div className="text-xs text-gray-400">
                      They won't see your profile but can message if matched
                    </div>
                  </div>
                </label>

                <label className="flex items-start p-3 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50">
                  <input
                    type="radio"
                    name="blockType"
                    value="complete"
                    checked={blockType === "complete"}
                    onChange={() => setBlockType("complete")}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-white text-sm">Complete Block</div>
                    <div className="text-xs text-gray-400">
                      They won't see your profile or message you
                    </div>
                  </div>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]/30 focus:border-[#FF6B9D] text-white placeholder-gray-500 text-sm"
                  placeholder="Why are you blocking this user?"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setBlockModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  onClick={() => handleBlockUser(userToBlock.id)}
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
