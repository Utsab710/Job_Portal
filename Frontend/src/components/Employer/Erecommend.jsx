import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

function Erecommend() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/jobs/posted/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        console.log(data);
        setJobs(data || []); // Assuming backend returns job_postings
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load your job postings");
        setIsLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  // Function to map experience level
  const getExperienceLevel = (level) => {
    switch (level) {
      case 1:
        return "Entry Level";
      case 2:
        return "Mid Level";
      case 3:
        return "Senior Level";
      default:
        return "Not Specified";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading your job postings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Your Job Postings
        </h1>

        {jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.job_title}
                </h2>
                <div className="text-sm text-gray-600 mb-4">
                  <p>
                    {getExperienceLevel(job.experience_level)} |{" "}
                    {job.job_type === "full_time" ? "Full Time" : "Part Time"}
                  </p>
                  {job.min_salary && job.max_salary && (
                    <p>
                      Salary: ${job.min_salary} - ${job.max_salary}
                    </p>
                  )}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {job.job_description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Posted recently</span>
                  <button className="text-red-500 hover:text-red-600 font-medium">
                    <Link to={`/contentbased/${job.id}`}>View Details</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Erecommend;
