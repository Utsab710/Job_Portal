import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

function ApplyingJobs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    phone_no: "",
    expected_salary: "",
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (
      !formData.location ||
      !formData.phone_no ||
      !formData.expected_salary ||
      !resume
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("location", formData.location);
    submitData.append("phone_no", formData.phone_no);
    submitData.append("expected_salary", formData.expected_salary);
    submitData.append("resume", resume);

    // Debug log the form data
    console.log("=== Submission Debug ===");
    console.log("Token:", localStorage.getItem("access_token"));
    for (let pair of submitData.entries()) {
      console.log(`Field ${pair[0]}:`, pair[1]);
    }

    const token = localStorage.getItem("access_token");
    console.log("Token being sent:", token);

    try {
      if (!token) {
        throw new Error("Not authenticated. Please log in.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/apply-job/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: submitData,
        credentials: "include",
        mode: "cors",
      });

      // Log the raw response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.detail || data.error || JSON.stringify(data));
      }

      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error applying for the job:", error);
      setError(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Apply for Job</h2>

          {isSubmitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              Application submitted successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="resume" className="block text-gray-700 mb-2">
                Resume* (PDF, DOC, DOCX)
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone_no" className="block text-gray-700 mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone_no"
                name="phone_no"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone_no}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="expected_salary"
                className="block text-gray-700 mb-2"
              >
                Expected Salary*
              </label>
              <input
                type="number"
                id="expected_salary"
                name="expected_salary"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expected_salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 
                  ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ApplyingJobs;
