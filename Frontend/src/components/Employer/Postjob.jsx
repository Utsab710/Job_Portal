import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const Postjob = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "full-time",
    experienceLevel: "entry",
    salaryMin: "",
    salaryMax: "",
    jobDescription: "",
    requirements: "",
    benefits: "",
    companyAddress: "", // Added companyAddress field
  });

  useEffect(() => {
    // Fetch company address from backend
    const fetchUserAddress = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prevState) => ({
            ...prevState,
            companyAddress: data.address || "", // Assuming address is part of the user profile
          }));
        } else {
          setError("Failed to fetch company address.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setError("Failed to fetch company address.");
      }
    };

    fetchUserAddress();
  }, []);

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
    if (!formData.jobTitle || !formData.jobDescription) {
      setError("Please fill in all required fields");
      return;
    }

    // Salary validation
    if (formData.salaryMin && formData.salaryMax) {
      if (
        parseFloat(formData.salaryMin) < 0 ||
        parseFloat(formData.salaryMax) < 0
      ) {
        setError("Salaries cannot be negative.");
        return;
      }
      if (parseFloat(formData.salaryMax) <= parseFloat(formData.salaryMin)) {
        setError("Max salary must be greater than min salary.");
        return;
      }
    }

    // Create jobData object first
    const jobData = {
      job_title: formData.jobTitle.trim(),
      job_type: formData.jobType === "full-time" ? "full_time" : "part_time",
      experience_level:
        formData.experienceLevel === "entry"
          ? 1
          : formData.experienceLevel === "mid"
          ? 2
          : 3,
      job_description: formData.jobDescription.trim(),
      requirements: formData.requirements.trim() || null,
      min_salary: formData.salaryMin ? parseInt(formData.salaryMin) : null,
      max_salary: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      company_address: formData.companyAddress.trim() || null,
    };

    // Log the data being sent
    console.log("Submitting job data:", jobData);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobposting/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data);
        if (typeof data === "object" && data.detail) {
          setError(data.detail);
        } else if (typeof data === "object") {
          // Handle validation errors
          const errors = Object.entries(data)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join("; ");
          setError(errors);
        } else {
          setError("An unexpected error occurred");
        }
      } else {
        console.log("Job posted successfully:", data);
        setIsSubmitted(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Error details:", error);
      setError(`Failed to submit job posting: ${error.message}`);
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
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
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
                  jobTitle: "",
                  jobType: "full-time",
                  experienceLevel: "entry",
                  salaryMin: "",
                  salaryMax: "",
                  jobDescription: "",
                  requirements: "",
                  benefits: "",
                  companyAddress: "",
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
