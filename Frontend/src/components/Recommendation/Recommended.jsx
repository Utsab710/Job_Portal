import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

const Recommended = () => {
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);

  // Fetch jobs and user profile
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://localhost:8000/api/recommended-jobs/?toggle=${isToggleEnabled}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setJobs(data.jobs);
        setUserProfile(data.user);
        setJobTypeFilter(data.user.job_type || "");
        setExperienceLevelFilter(data.user.experience_level || "");
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isToggleEnabled]); // Added isToggleEnabled to dependency array

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Recommended Jobs</h2>

        <div className="space-y-6 mb-8">
          {/* Toggle Switch */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isToggleEnabled}
                onChange={(e) => setIsToggleEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              {isToggleEnabled ? "Enhanced Matching" : "Standard Matching"}
            </span>
          </div>

          {/* Search bar with icon */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, description, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevelFilter}
                onChange={(e) => setExperienceLevelFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-4">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
        </p>

        {/* Job Listings */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.job_title}
                      </h3>
                      <p className="text-lg text-gray-700 font-medium">
                        {job.company_name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-600">{job.company_address}</p>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                        {job.job_type}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                        {job.experience_level}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Distance: {job.distance.toFixed(2)} km
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Link
                    to={`/jobdetails/${job.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Full Details
                  </Link>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  <Link to={"/applyingjobs"}>Apply</Link>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              No matching jobs found. Try adjusting your search criteria or
              filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;
