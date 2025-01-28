import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

const experienceLevelMap = {
  1: "entry",
  2: "mid",
  3: "senior",
};

const Recommended = () => {
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all jobs and user profile
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://localhost:8000/api/recommended-jobs/",
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
  }, []);

  const calculateJobSimilarity = (job, userProfile) => {
    if (!userProfile) return 0;

    let score = 1;

    // Advanced skills matching with partial matches and weightage
    if (userProfile.skills) {
      const userSkills = userProfile.skills
        .toLowerCase()
        .split(",")
        .map((s) => s.trim());
      const jobDescription = job.job_description.toLowerCase();

      let skillScore = 0;
      userSkills.forEach((skill) => {
        // Full match
        if (jobDescription.includes(skill)) {
          skillScore += 5;
        }
        // Partial match (at least 4 characters)
        else if (
          skill.length >= 4 &&
          jobDescription.includes(skill.substring(0, skill.length - 1))
        ) {
          skillScore += 3;
        }
      });
      score += skillScore;
    }

    // Job type matching
    if (userProfile.job_type && job.job_type === userProfile.job_type) {
      score += 3;
    }

    // Experience level matching with proximity bonus
    if (userProfile.experience_level) {
      const levelDiff = Math.abs(
        job.experience_level - userProfile.experience_level
      );
      score += levelDiff === 0 ? 4 : levelDiff === 1 ? 2 : 0;
    }

    return score;
  };

  // Generate recommendations
  useEffect(() => {
    if (jobs.length > 0 && userProfile) {
      const scoredJobs = jobs
        .map((job) => ({
          ...job,
          similarityScore: calculateJobSimilarity(job, userProfile),
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore);

      setRecommendedJobs(scoredJobs);
    }
  }, [jobs, userProfile]);

  // Enhanced search with debouncing
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter jobs with improved search
  const filteredJobs = recommendedJobs.filter((job) => {
    const searchTerms = debouncedSearchQuery.toLowerCase().split(" ");
    const matchesSearch =
      !debouncedSearchQuery ||
      searchTerms.every(
        (term) =>
          job.job_title.toLowerCase().includes(term) ||
          job.job_description.toLowerCase().includes(term) ||
          job.company_name.toLowerCase().includes(term)
      );

    const matchesJobType = !jobTypeFilter || job.job_type === jobTypeFilter;
    const matchesExperienceLevel =
      !experienceLevelFilter ||
      experienceLevelMap[job.experience_level] === experienceLevelFilter;

    return matchesSearch && matchesJobType && matchesExperienceLevel;
  });

  const maxScore = Math.max(
    ...(filteredJobs.map((job) => job.similarityScore) || [0])
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Recommended Jobs</h2>

        <div className="space-y-6 mb-8">
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
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-4">
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
          found
        </p>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg
                  ${
                    job.similarityScore === maxScore
                      ? "border-2 border-blue-500 bg-blue-50"
                      : "border border-gray-200"
                  }`}
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
                    {job.similarityScore === maxScore && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Best Match
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-600">{job.company_address}</p>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                        {job.job_type.replace("_", " ")}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                        {experienceLevelMap[job.experience_level]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Match Score: {Math.round(job.similarityScore * 10)}%
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
