import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useDataApi from "./UseDataApi";

const contributionOptions = [
  { id: 1, label: "Webinar" },
  { id: 2, label: "Mokef" },
  { id: 3, label: "Mentoring" },
  { id: 4, label: "Other" },
];

export default function EditableUserProfile() {
  const [activeTab, setActiveTab] = useState("contact");
  const { id } = useParams();

  const [formData, setFormData] = useState({
    english_name: "",
    title: "",
    phone: "",
    email: "",
    linkedin_url: "",
    facebook_url: "",
    about: "",
    skills: [],
    participantValues: [],
    jobs: [], 
  });

  const [originalData, setOriginalData] = useState({});
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitState, setSubmitRequest] = useDataApi(null, null);
  const { isLoading, isError } = submitState;

  const [fetchState, setFetchRequest] = useDataApi(null, null);

  const formatSkillsToString = (skillsArray) => {
    if (!Array.isArray(skillsArray)) return '';
    return skillsArray.map((skill) => skill.description).join(', ');
  };

  useEffect(() => {
    if (id) {
      setFetchRequest({
        url: `/member/${id}`,
        method: "GET",
        onSuccess: (data) => {
          console.log("Fetched profile data:", data);
          setFormData({
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
          });
          setOriginalData(data);
        },
        onFailure: (error) => {
          console.error("Failed to fetch profile:", error);
          alert("Error loading profile");
        },
      });
    } else {
      const emptyData = {
        english_name: "",
        title: "",
        phone: "",
        email: "@gmail.com",
        linkedin_url: "",
        facebook_url: "",
        about: "",
        skills: [],
        participantValues: [],
        jobs: [],
      };
      setFormData(emptyData);
      setOriginalData(emptyData);
    }
  }, [id, setFetchRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobChange = (index, field, value) => {
    const updated = [...formData.jobs];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, jobs: updated }));
  };

  const addJob = () => {
    setFormData((prev) => ({
      ...prev,
      jobs: [
        ...prev.jobs,
        {
          company_name: "",
          start_date: "",
          end_date: "",
          description: "",
        },
      ],
    }));
  };

  const removeJob = (index) => {
    const updated = formData.jobs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, jobs: updated }));
  };

  const getInitials = (fullName) =>
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleUpdateClick = () => {
    setIsFinalStep(true);
  };

  const handleContributionChange = (index, field, value) => {
    const updated = [...formData.participantValues];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, participantValues: updated }));
  };

  const addContribution = () => {
    setFormData((prev) => ({
      ...prev,
      participantValues: [...prev.participantValues, { id_community_value: "", description: "" }],
    }));
  };

  const removeContribution = (index) => {
    const updated = formData.participantValues.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, participantValues: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.participantValues ||
      formData.participantValues.length === 0 ||
      !formData.participantValues.some(cv => cv.id_community_value)
    ) {
      alert("Please provide at least one community contribution");
      return;
    }

    const filteredJobs = formData.jobs.filter((job) =>
      Object.values(job).some((val) => val?.toString().trim() !== "")
    );

    const cleanedFormData = {
      ...formData,
      jobs: filteredJobs,
    };

    setSubmitRequest({
      url: id ? `/member/${id}` : "/member",
      method: "PUT",
      body: cleanedFormData,
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onFailure: () => {
        alert("Error submitting profile");
      },
    });
  };

  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Updated!</h2>
          <p className="text-gray-600">Your profile has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-grow">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {getInitials(formData.english_name) || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-grow space-y-2">
                <input
                  type="text"
                  name="english_name"
                  className="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg px-3 py-1 transition-colors"
                  placeholder="Your Full Name"
                  value={formData.english_name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="title"
                  className="w-full text-gray-600 bg-transparent border-none outline-none focus:bg-gray-50 rounded-lg px-3 py-1 transition-colors"
                  placeholder="Your Title (e.g. Senior Developer)"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>
            {!isFinalStep && (
              <button 
                onClick={handleUpdateClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Update Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!isFinalStep ? (
            <>
              {/* Content Area */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Tab */}
                  {activeTab === "contact" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile</label>
                          <input
                            type="url"
                            name="linkedin_url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Profile</label>
                          <input
                            type="url"
                            name="facebook_url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="https://facebook.com/yourprofile"
                            value={formData.facebook_url}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
                      <textarea
                        name="about"
                        rows="8"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about yourself, your background, interests, and what you're passionate about..."
                        value={formData.about}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* Experience Tab */}
                  {activeTab === "experience" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                        <button
                          type="button"
                          onClick={addJob}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          + Add Experience
                        </button>
                      </div>
                      
                      {formData.jobs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0a2 2 0 012 2v6.294a2 2 0 01-.76 1.569l-3.5 2.8a2 2 0 01-2.48 0l-3.5-2.8A2 2 0 018 14.294V8a2 2 0 012-2" />
                          </svg>
                          <p>No work experience added yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formData.jobs.map((job, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Experience #{index + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeJob(index)}
                                  className="text-red-500 hover:text-red-700 font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                              
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  placeholder="Company Name"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  value={job.company_name}
                                  onChange={(e) => handleJobChange(index, "company_name", e.target.value)}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                      type="date"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                      value={job.start_date}
                                      onChange={(e) => handleJobChange(index, "start_date", e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                      type="date"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                      value={job.end_date}
                                      onChange={(e) => handleJobChange(index, "end_date", e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <textarea
                                  placeholder="Job description, responsibilities, and achievements..."
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                  rows="3"
                                  value={job.description}
                                  onChange={(e) => handleJobChange(index, "description", e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Skills & Expertise</h3>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          + Add Skill
                        </button>
                      </div>
                      
                      {formData.skills.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <p>No skills added yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                placeholder="Enter a skill"
                              />
                              <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* Tab Navigation */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm">
                  {[
                    { key: "contact", label: "Contact", icon: "📞" },
                    { key: "about", label: "About", icon: "👤" },
                    { key: "experience", label: "Experience", icon: "💼" },
                    { key: "skills", label: "Skills", icon: "🎯" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Final Step - Contribution Selection
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Contribution</h2>
                <p className="text-gray-600">Please select how you'd like to contribute to our community</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {(formData.participantValues || []).map((contribution, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Contribution #{index + 1}</h4>
                      {formData.participantValues.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContribution(index)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type</label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={contribution.id_community_value || ""}
                          required
                          onChange={(e) => handleContributionChange(index, "id_community_value", parseInt(e.target.value))}
                        >
                          <option value="">Select contribution type</option>
                          {contributionOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Describe your contribution"
                          value={contribution.description || ""}
                          onChange={(e) => handleContributionChange(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addContribution}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Add Another Contribution
                  </button>
                </div>

                {formData.participantValues && formData.participantValues.length > 0 && formData.participantValues.some(cv => cv.id_community_value) && (
                  <div className="text-center pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? "Submitting..." : "Submit Profile"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}