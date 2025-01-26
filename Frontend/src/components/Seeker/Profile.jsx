import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Profile() {
  const [activeSection, setActiveSection] = useState("personal");
  const [seekerData, setSeekerData] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeekerProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        console.log("Access Token:", accessToken); // Log the token

        if (!accessToken) {
          // Redirect to login if no token is found
          window.location.href = "/login"; // Update this to your login route
          return;
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
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch profile data: ${errorText}`);
        }

        const data = await response.json();
        console.log("Profile data:", data);
        setSeekerData(data);
      } catch (err) {
        console.error("Detailed error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchSeekerProfile();
  }, []);

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
      <>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Details</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
        <div>
          <button>Update Profile</button>
        </div>
      </>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalDetails();
      case "resume":
        return <ResumeSection />; // Use the ResumeSection component here
      case "jobPreference":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
            <p className="text-gray-600">
              Job preferences section coming soon...
            </p>
          </div>
        );
      default:
        return renderPersonalDetails();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
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

            {/* Profile Completion Card */}
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

          {/* Main Content */}
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
