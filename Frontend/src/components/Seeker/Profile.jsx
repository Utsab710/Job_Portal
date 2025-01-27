import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Profile() {
  const [activeSection, setActiveSection] = useState("personal");
  const [seekerData, setSeekerData] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    qualification: "",
    username: "",
    email: "",
    address: "",
    skills: "",
  });

  useEffect(() => {
    const fetchSeekerProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch profile data: ${errorText}`);
        }

        const data = await response.json();
        setSeekerData(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          qualification: data.qualification || "",
          username: data.username || "",
          email: data.email || "",
          address: data.address || "",
          skills: data.skills || "",
        });

        const filledFields = Object.values(data).filter(
          (value) => value !== null && value !== ""
        ).length;
        const totalFields = Object.keys(data).length;
        const percentage = (filledFields / totalFields) * 100;
        setCompletionPercentage(percentage.toFixed(2));
      } catch (err) {
        console.error("Detailed error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchSeekerProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      const updatedData = await response.json();
      setSeekerData(updatedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const renderPersonalDetails = () => {
    if (error) {
      return (
        <div className="bg-white p-6 rounded-lg shadow text-red-500">
          Error: {error}
        </div>
      );
    }

    if (!seekerData) {
      return (
        <div className="bg-white p-6 rounded-lg shadow">
          Loading profile data...
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {isEditing ? "Cancel" : "Update Profile"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firstname
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lastname
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firstname
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.first_name || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lastname
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.last_name || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qualification
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.qualification || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.username || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.email || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.address || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <p className="mt-1 text-gray-900">
                    {seekerData.skills || "Not Available"}
                  </p>
                </div>
              </>
            )}
          </div>

          {isEditing && (
            <div className="mt-4">
              <button
                onClick={handleUpdateProfile}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResumeSection = () => {
    return <ResumeSection />;
  };

  const renderJobPreferenceSection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Job Preference</h2>
        <p>Job preference section content goes here.</p>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalDetails();
      case "resume":
        return renderResumeSection();
      case "jobPreference":
        return renderJobPreferenceSection();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("personal")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "personal"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveSection("resume")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "resume"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Resume
                </button>
                <button
                  onClick={() => setActiveSection("jobPreference")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "jobPreference"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Job Preference
                </button>
              </nav>
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Profile Completeness</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {completionPercentage}% Complete
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">
                  What's left to complete?
                </h4>
                <ul className="text-sm text-red-500">
                  {!seekerData?.address && <li>• Address</li>}
                  {!seekerData?.yearsOfExperience && <li>• Experience</li>}
                  <li>• Resume Upload</li>
                  <li>• Job Preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-9">{renderSection()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ResumeSection() {
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/upload-resume/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload resume: ${errorText}`);
      }

      const data = await response.json();
      setResume(data.resume);
      setError(null);
      alert("Resume uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      setError(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Resume</h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {error && <div className="text-red-500">{error}</div>}
      {resume && (
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View Uploaded Resume
        </a>
      )}
    </div>
  );
}

export default Profile;
