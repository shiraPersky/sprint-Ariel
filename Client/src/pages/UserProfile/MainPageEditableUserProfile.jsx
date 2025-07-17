import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useDataApi from "../UseDataApi";

// Import components
import ProfileHeader from './ProfileHeader';
import ContactTab from './ContactTab';
import AboutTab from './AboutTab';
import ExperienceTab from './ExperienceTab';
import SkillsTab from './SkillsTab';
import TabNavigation from './TabNavigation';
import ContributionStep from './ContributionStep';
import SuccessScreen from './SuccessScreen';

/**
 * EditableUserProfile Component
 * Main component for editing user profiles with tabs and contribution step
 */
export default function EditableUserProfile() {
  const [activeTab, setActiveTab] = useState("contact");
  const { id } = useParams();

  // Form state
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
  const [isContributionStep, setIsContributionStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // API hooks
  const [submitState, setSubmitRequest] = useDataApi(null, null);
  const { isLoading, isError } = submitState;
  const [fetchState, setFetchRequest] = useDataApi(null, null);

  /**
   * Initialize form data on component mount or when ID changes
   */
  useEffect(() => {
    if (id) {
      // Fetch existing profile data
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
      // Initialize empty form for new profile
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

  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle job field changes
   * @param {number} index - Job index in array
   * @param {string} field - Field name to update
   * @param {string} value - New value
   */
  const handleJobChange = (index, field, value) => {
    const updated = [...formData.jobs];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, jobs: updated }));
  };

  /**
   * Add new job entry
   */
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

  /**
   * Remove job entry
   * @param {number} index - Job index to remove
   */
  const removeJob = (index) => {
    const updated = formData.jobs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, jobs: updated }));
  };

  /**
   * Handle skill field changes
   * @param {number} index - Skill index in array
   * @param {string} value - New skill value
   */
  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  /**
   * Add new skill entry
   */
  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  /**
   * Remove skill entry
   * @param {number} index - Skill index to remove
   */
  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  /**
   * Handle contribution field changes
   * @param {number} index - Contribution index in array
   * @param {string} field - Field name to update
   * @param {any} value - New value
   */
  const handleContributionChange = (index, field, value) => {
    const updated = [...formData.participantValues];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, participantValues: updated }));
  };

  /**
   * Add new contribution entry
   */
  const addContribution = () => {
    setFormData((prev) => ({
      ...prev,
      participantValues: [...prev.participantValues, { id_community_value: "", description: "" }],
    }));
  };

  /**
   * Remove contribution entry
   * @param {number} index - Contribution index to remove
   */
  const removeContribution = (index) => {
    const updated = formData.participantValues.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, participantValues: updated }));
  };

  /**
   * Navigate to contribution step
   */
  const handleUpdateClick = () => {
    setIsContributionStep(true);
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate contributions
    if (
      !formData.participantValues ||
      formData.participantValues.length === 0 ||
      !formData.participantValues.some(cv => cv.id_community_value)
    ) {
      alert("Please provide at least one community contribution");
      return;
    }

    // Filter out empty jobs
    const filteredJobs = formData.jobs.filter((job) =>
      Object.values(job).some((val) => val?.toString().trim() !== "")
    );

    const cleanedFormData = {
      ...formData,
      jobs: filteredJobs,
    };

    // Submit profile data
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

  // Render success screen if submitted
  if (isSubmitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader
          formData={formData}
          handleChange={handleChange}
          showUpdateButton={!isContributionStep}
          onUpdateClick={handleUpdateClick}
        />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!isContributionStep ? (
            <>
              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-6">
                  {/* Render active tab content */}
                  {activeTab === "contact" && (
                    <ContactTab 
                      formData={formData} 
                      handleChange={handleChange} 
                    />
                  )}

                  {activeTab === "about" && (
                    <AboutTab 
                      formData={formData} 
                      handleChange={handleChange} 
                    />
                  )}

                  {activeTab === "experience" && (
                    <ExperienceTab
                      formData={formData}
                      handleJobChange={handleJobChange}
                      addJob={addJob}
                      removeJob={removeJob}
                    />
                  )}

                  {activeTab === "skills" && (
                    <SkillsTab
                      formData={formData}
                      handleSkillChange={handleSkillChange}
                      addSkill={addSkill}
                      removeSkill={removeSkill}
                    />
                  )}
                </form>
              </div>

              {/* Tab Navigation */}
              <TabNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </>
          ) : (
            // Contribution Step
            <ContributionStep
              formData={formData}
              handleContributionChange={handleContributionChange}
              addContribution={addContribution}
              removeContribution={removeContribution}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}