import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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

    english_name: "ggg",
    title: "softward",
    phone: "0585907923",
    email: "miryamgur@gmail.com",
    linkedin_url: "",
    facebook_url: "",
    about: "jjfwf jfwej kjjkjef kkjkf",
    skills: ["Writing", "Design", "Marketing"],
    participantValues: [
      { id_community_value: "", description: "" },
    ],
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
      // בקשה רגילה עם fetch
      fetch(`http://localhost:5000/member/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched profile data:", data);
          const formattedSkills = formatSkillsToString(data.skills);
            setFormData({
            ...data,
            skills: formattedSkills
          });
          setOriginalData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
          alert("Error loading profile");
        },
      });
    } else {
      const emptyData = {
        english_name: "ggg",
        title: "softward",
        phone: "0585907923",
        email: "miryamgur@gmail.com",
        linkedin_url: "",
        facebook_url: "",
        about: "jjfwf jfwej kjjkjef kkjkf",
        skills: ["Writing", "Design", "Marketing"],
        participantValues: [{ id_community_value: "", description: "" }],
        jobs: [], // שים לב
      };
      setFormData(emptyData);
      setOriginalData(emptyData);
    }
  }, [id]); // הוספתי את id כתלות

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

  const getInitials = (fullName) =>
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleUpdateClick = () => {
    setIsFinalStep(true);
  };

  // --- Contribution handlers ---

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
      <div className="container mt-5 text-center">
        <h4>Thank you! Your profile has been submitted.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center w-100">
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
            style={{ width: 60, height: 60, fontSize: 24 }}
          >
            {getInitials(formData.english_name)}
          </div>
          <div className="flex-grow-1">
            <input
              type="text"
              name="english_name"
              className="form-control mb-1"
              placeholder="Full Name"
              value={formData.english_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Title (e.g. Developer, Designer)"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>

        {!isFinalStep && (
          <button className="btn btn-success ms-3" onClick={handleUpdateClick}>
            Update
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {!isFinalStep ? (
          <>
            <ul className="nav nav-pills nav-justified mb-3">
              {["contact", "about", "experience", "skills"].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content">
              {activeTab === "contact" && (
                <div className="tab-pane active">
                  <div className="mb-3">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      className="form-control"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Facebook</label>
                    <input
                      type="url"
                      name="facebook_url"
                      className="form-control"
                      value={formData.facebook_url}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div className="tab-pane active">
                  <div className="mb-3">
                    <label>About</label>
                    <textarea
                      name="about"
                      rows="4"
                      className="form-control"
                      value={formData.about}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div className="tab-pane active">
                  {formData.jobs.map((job, index) => (
                    <div key={index} className="border rounded p-3 mb-3">
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="form-control mb-2"
                        value={job.company_name}
                        onChange={(e) =>
                          handleJobChange(index, "company_name", e.target.value)
                        }
                      />

                      <div className="row mb-2">
                        <div className="col">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={job.start_date}
                            onChange={(e) =>
                              handleJobChange(index, "start_date", e.target.value)
                            }
                          />
                        </div>
                        <div className="col">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={job.end_date}
                            onChange={(e) =>
                              handleJobChange(index, "end_date", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <textarea
                        placeholder="Description"
                        className="form-control mb-2"
                        rows="2"
                        value={job.description}
                        onChange={(e) =>
                          handleJobChange(index, "description", e.target.value)
                        }
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={addJob}
                  >
                    Add Job
                  </button>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="tab-pane active">
                  <label className="form-label">Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div className="input-group mb-2" key={index}>
                      <input
                        type="text"
                        className="form-control"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Skill"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeSkill(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={addSkill}
                  >
                    + Add Skill
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Contribution select + description */}
            <div className="mb-3">
              <label>
                <strong>Community Contribution (Required)</strong>
              </label>

              {(formData.participantValues || []).map((contribution, index) => (
                <div key={index} className="border rounded p-3 mb-2">
                  <div className="row mb-2">
                    <div className="col">
                      <select
                        className="form-select"
                        value={contribution.id_community_value || ""}
                        required
                        onChange={(e) =>
                          handleContributionChange(index, "id_community_value", parseInt(e.target.value))
                        }
                      >
                        <option value="">Select contribution type</option>
                        {contributionOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={contribution.description || ""}
                        onChange={(e) =>
                          handleContributionChange(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {formData.participantValues.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeContribution(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addContribution}
              >
                Add Contribution
              </button>
            </div>

            {(formData.participantValues && formData.participantValues.length > 0 && formData.participantValues.some(cv => cv.id_community_value)) && (
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
