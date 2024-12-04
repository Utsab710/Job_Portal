import React, { useEffect, useState } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Profile() {
  const [activeSection, setActiveSection] = useState("personal");
  const [seekerData, setSeekerData] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // Get seeker data from localStorage
    const currentSeeker = JSON.parse(localStorage.getItem("currentSeeker"));
    setSeekerData(currentSeeker);

    // Calculate profile completion
    if (currentSeeker) {
      let completed = 0;
      const totalFields = 6; // Total number of main fields we're checking

      if (currentSeeker.username) completed++;
      if (currentSeeker.email) completed++;
      if (currentSeeker.address) completed++;
      if (currentSeeker.yearsOfExperience) completed++;

      setCompletionPercentage(Math.round((completed / totalFields) * 100));
    }
  }, []);

  const renderPersonalDetails = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Details</h2>
        {/* <button className="text-red-500 hover:text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button> */}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="mt-1 text-gray-900">
              {seekerData?.username || "Not Available"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">
              {seekerData?.email || "Not Available"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <p className="mt-1 text-gray-900">
              {seekerData?.address || "Not Available"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <p className="mt-1 text-gray-900">
              {seekerData?.yearsOfExperience || 0} years
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalDetails();
      case "resume":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Resume</h2>
            <p className="text-gray-600">Resume section coming soon...</p>
          </div>
        );
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
export default Profile;
