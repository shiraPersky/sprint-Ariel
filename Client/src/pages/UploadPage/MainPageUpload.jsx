import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDataApi from "../UseDataApi";

// Import components
import PageHeader from "./PageHeader";
import LinkedInSection from "./LinkedInSection";
import Divider from "./Divider";
import LoadingIndicator from "./LoadingIndicator";
import ActionButtons from "./ActionButtons";
import CvUploadBox from "./cv/components/CvUploadBox";
import CvProgressBar from "./cv/components/CvProgressBar";
import CvPreview from "./cv/components/CvPreview";
import useCvUpload from "./cv/hooks/useCvUpload";

/**
 * UploadData Component
 * Main component for profile upload with LinkedIn import or CV upload
 */
function UploadData() {
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const navigate = useNavigate();
  const [state, setRequest] = useDataApi(null);
  const { data, isLoading, isError } = state;
  const [uploadMode, setUploadMode] = useState(null); // 'linkedin' | 'cv'

  const {
    selectedFile,
    previewURL,
    uploadProgress,
    uploadSuccess,
    handleFileChange,
    handleDrop,
    handleDragOver,
    resetUpload,
  } = useCvUpload();
  


  /**
   * Handle upload/import action
   * Processes LinkedIn URL or CV file upload
   */
  const handleUpload = () => {
    if (linkedinUrl) {
      setUploadMode('linkedin');
      // Process LinkedIn import
      console.log("Submitting LinkedIn URL:", linkedinUrl);
      setRequest({
        url: "http://localhost:5000/excel/add-linkedin-member",
        method: "POST",
        body: { linkedin_url: linkedinUrl },
        onSuccess: (data) => {
          console.log("LinkedIn import successful:", data);
          console.log("Navigating to member data page...", data.member);
          // Navigate to profile page with ID if successful
          if (data && data.data.member.id_community_member) {
            navigate(`/member/${data.data.member.id_community_member}/data/`);
          }
        },
        onFailure: (error) => {
          // Navigate to manual creation page on error
          console.error("LinkedIn import failed:", error);
          navigate("/member/data");
        },
      });
    } else if (selectedFile) {
      setUploadMode('cv');
      // Process CV file upload
      console.log("Uploading CV file:", selectedFile.name);
      const formData = new FormData();
      formData.append("cv", selectedFile);

      setRequest({
        url: "http://localhost:5000/upload-cv",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onSuccess: (data) => {
          console.log("CV upload success:", data);
          navigate(`/member/${data.id_community_member}/data/`);
        },
        onFailure: (error) => {
          console.error("CV upload failed:", error);
          navigate("/member/data");
        },
      });
    } else {
      alert("Please provide either a LinkedIn URL or upload a CV file.");
    }
  };

  /**
   * Handle manual profile creation
   * Navigate directly to profile creation page
   */
  const handleManualCreate = () => {
    navigate("/member/data");
  };

  /**
   * Check if user has provided input (LinkedIn URL or CV file)
   * @returns {boolean} True if user has provided input
   */
  const hasUserInput = () => {
    return linkedinUrl.trim() !== "" || selectedFile !== null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader />

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-8">
            <LinkedInSection
              linkedinUrl={linkedinUrl}
              setLinkedinUrl={setLinkedinUrl}
              isLoading={isLoading}
            />

            <Divider />

            <>
              {!uploadSuccess && (
                <div className="border rounded-xl shadow-md p-4 bg-white mb-6">
                  <CvUploadBox
                    handleFileChange={handleFileChange}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                  />
                </div>
              )}

              {selectedFile && !uploadSuccess && uploadProgress < 100 && (
                <div className="mb-4">
                  <CvProgressBar progress={uploadProgress} />
                </div>
              )}

              {uploadSuccess && selectedFile && (
                <CvPreview
                  selectedFile={selectedFile}
                  previewURL={previewURL}
                />
              )}
            </>
              

            <LoadingIndicator isLoading={isLoading} uploadMode={uploadMode} />

            <ActionButtons
              onUpload={handleUpload}
              onManualCreate={handleManualCreate}
              isLoading={isLoading}
              hasInput={hasUserInput()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadData;
