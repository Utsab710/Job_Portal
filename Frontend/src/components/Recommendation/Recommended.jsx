import React, { useState, useEffect } from "react";
import Header from "../Header/Header";

function Recommended() {
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  // Fetch all jobs and user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all jobs
        const jobsResponse = await fetch(
          "http://localhost:8000/api/jobposting/"
        );
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);

        // Fetch user profile
        const token = localStorage.getItem("access_token");
        const userResponse = await fetch(
          "http://localhost:8000/api/user-details/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const userData = await userResponse.json();
        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Content-based recommendation algorithm
  const calculateJobSimilarity = (job, userProfile) => {
    let score = 0;

    // Skills matching
    if (userProfile.skills) {
      const userSkills = userProfile.skills.toLowerCase().split(",");
      const jobSkillsMatch = userSkills.filter((skill) =>
        job.job_description.toLowerCase().includes(skill)
      ).length;
      score += jobSkillsMatch * 2;
    }

    // Job title matching
    if (userProfile.preferred_job_title) {
      const titleSimilarity = job.job_title
        .toLowerCase()
        .includes(userProfile.preferred_job_title.toLowerCase())
        ? 3
        : 0;
      score += titleSimilarity;
    }

    // Experience level matching
    if (userProfile.experience_level) {
      const experienceLevelMatch =
        job.experience_level === userProfile.experience_level ? 2 : 0;
      score += experienceLevelMatch;
    }

    // Location preference
    if (userProfile.preferred_location) {
      const locationMatch = job.company_address
        .toLowerCase()
        .includes(userProfile.preferred_location.toLowerCase())
        ? 2
        : 0;
      score += locationMatch;
    }

    return score;
  };

  // Generate recommendations
  useEffect(() => {
    if (jobs.length > 0 && userProfile) {
      const scoredJobs = jobs.map((job) => ({
        ...job,
        similarityScore: calculateJobSimilarity(job, userProfile),
      }));

      // Sort jobs by similarity score in descending order
      const sortedRecommendations = scoredJobs
        .filter((job) => job.similarityScore > 0)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 5); // Top 5 recommendations

      setRecommendedJobs(sortedRecommendations);
    }
  }, [jobs, userProfile]);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>

        {recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{job.job_title}</h3>
                <p className="text-gray-600">{job.company_name}</p>
                <p className="text-sm text-gray-500">{job.company_address}</p>
                <p className="text-sm text-gray-500">
                  {job.job_type} • {job.experience_level}
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  Recommendation Score: {job.similarityScore}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recommendations available. Please complete your profile.</p>
        )}
      </div>
    </div>
  );
}

export default Recommended;
