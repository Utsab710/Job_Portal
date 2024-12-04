import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const EProfile = () => {
  const [activeSection, setActiveSection] = useState("company");
  const [employerData, setEmployerData] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // Get employer data from localStorage
    const currentEmployer = JSON.parse(localStorage.getItem("currentEmployer"));
    setEmployerData(currentEmployer);

    // Calculate profile completion
    if (currentEmployer) {
      let completed = 0;
      const totalFields = 8; // Total number of main fields we're checking

      if (currentEmployer.username) completed++;
      if (currentEmployer.email) completed++;
      if (currentEmployer.companyName) completed++;

      setCompletionPercentage(Math.round((completed / totalFields) * 100));
    }
  }, []);

  const renderCompanyDetails = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Company Details</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <p className="mt-1 text-gray-900">
              {employerData?.companyName ||
                employerData?.username ||
                "Not Available"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Email
            </label>
            <p className="mt-1 text-gray-900">
              {employerData?.email || "Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "company":
        return renderCompanyDetails();
      case "profile":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  About Company
                </label>
                <p className="mt-1 text-gray-900">
                  {employerData?.companyDescription || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        );
      case "jobPostings":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Job Postings</h2>
            <p className="text-gray-600">
              Your job postings will appear here...
            </p>
          </div>
        );
      default:
        return renderCompanyDetails();
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
                  onClick={() => setActiveSection("company")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "company"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Company Details
                </button>
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "profile"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Company Profile
                </button>
                <button
                  onClick={() => setActiveSection("jobPostings")}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "jobPostings"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Job Postings
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
                  {!employerData?.companyName && <li>• Company Name</li>}
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
};

export default EProfile;
