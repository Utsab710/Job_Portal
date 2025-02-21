import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const JobDetails = () => {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/recommended-jobs/?toggle=false`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch job details");
        }

        const data = await response.json();
        const jobs = data.jobs; // Access the jobs array from RecommendedJobsView response
        const jobData = jobs.find((j) => j.id === parseInt(id));
        if (!jobData) {
          throw new Error("Job not found");
        }
        setJob(jobData);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApplyClick = () => {
    navigate(`/apply/${job.id}`, { state: { job } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4 text-center">
          <p className="text-gray-600">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Job Details</h2>
        {job && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">{job.job_title}</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium">Company:</span> {job.company_name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Location:</span>{" "}
                {job.company_address || "Not specified"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Job Type:</span> {job.job_type}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Experience Level:</span>{" "}
                {job.experience_level}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Description:</span>{" "}
                {job.job_description || "No description provided"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Requirements:</span>{" "}
                {job.requirements || "No specific requirements"}
              </p>
              {(job.min_salary || job.max_salary) && (
                <p className="text-gray-700">
                  <span className="font-medium">Salary Range:</span>{" "}
                  {job.min_salary ? `${job.min_salary}` : "N/A"} -{" "}
                  {job.max_salary ? `${job.max_salary}` : "N/A"}
                </p>
              )}
              <p className="text-gray-700">
                <span className="font-medium">Distance:</span>{" "}
                {job.distance >= 999999
                  ? "N/A"
                  : `${job.distance.toFixed(2)} km`}
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              {localStorage.getItem("role") === "job_seeker" && (
                <button
                  onClick={handleApplyClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
