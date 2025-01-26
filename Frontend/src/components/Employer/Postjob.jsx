import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const Postjob = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    jobTitle: "",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: "",
    salaryMax: "",
    jobDescription: "",
    requirements: "",
    benefits: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.companyName ||
      !formData.jobTitle ||
      !formData.jobDescription
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const jobData = {
      company_name: formData.companyName,
      company_address: formData.companyAddress,
      job_title: formData.jobTitle,
      job_type: "full_time", // Corrected to match Django model
      experience_level: 1, // Corrected to match Django model (1 for Entry Level)
      job_description: formData.jobDescription,
      requirements: formData.requirements,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobposting/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        setError(errorData.detail || "Failed to post job. Please try again.");
      } else {
        const data = await response.json();
        console.log("Job posted successfully:", data);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Header />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Post a New Job
        </h1>

        {isSubmitted && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
            Job posted successfully! Redirecting to home page...
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Company Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Address
                </label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  name="job_type"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                </select>

                <select
                  name="experience_level"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                >
                  <option value={1}>Entry Level</option>
                  <option value={2}>Mid Level</option>
                  <option value={3}>Senior Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description*
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                placeholder="List key requirements and qualifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                placeholder="List benefits and perks..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  companyName: "",
                  companyAddress: "",
                  jobTitle: "",
                  jobType: "full-time",
                  experienceLevel: "entry",
                  salaryMin: "",
                  salaryMax: "",
                  jobDescription: "",
                  requirements: "",
                  benefits: "",
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Postjob;
