import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function ApplyingJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  const [formData, setFormData] = useState({
    location: "",
    phone_no: "",
    expected_salary: "",
    resume: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Debug log
      console.log("Submitting job application with data:", {
        job: job?.id,
        location: formData.location,
        phone_no: formData.phone_no,
        expected_salary: formData.expected_salary,
        resume: formData.resume,
      });

      const submitData = new FormData();
      submitData.append("job", job.id);
      submitData.append("location", formData.location);
      submitData.append("phone_no", formData.phone_no);
      submitData.append("expected_salary", formData.expected_salary);
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }

      // Debug log
      console.log("FormData contents:");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/apply-job/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: submitData,
      });

      // Debug log
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Failed to submit application"
        );
      }

      setSuccess("Application submitted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Application error:", error);
      setError(error.message || "Failed to submit application");
    }
  };

  if (!job) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-red-500">
              No job information found. Please select a job first.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Apply for {job.job_title}</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="number"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Expected Salary</label>
              <input
                type="number"
                name="expected_salary"
                value={formData.expected_salary}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Resume</label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept=".pdf,.doc,.docx"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ApplyingJobs;
