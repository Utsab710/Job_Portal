// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/jobposting/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          throw new Error(errorData.detail || "Failed to fetch job postings");
        }

        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message);
      }
    };

    const checkUserRole = () => {
      const role = localStorage.getItem("role");
      if (role) {
        setUserRole(role);
      }
    };

    fetchJobs();
    checkUserRole();
  }, []);

  const handleSearch = () => {
    setIsSearched(true);
    const lowerSearchTitle = searchTitle.toLowerCase().trim();
    const lowerSearchLocation = searchLocation.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      const titleMatch =
        (job.job_title &&
          job.job_title.toLowerCase().includes(lowerSearchTitle)) ||
        (job.job_description &&
          job.job_description.toLowerCase().includes(lowerSearchTitle)) ||
        (job.requirements &&
          job.requirements.toLowerCase().includes(lowerSearchTitle));
      const locationMatch =
        !lowerSearchLocation ||
        (job.company_address &&
          job.company_address.toLowerCase().includes(lowerSearchLocation));

      if (lowerSearchTitle && lowerSearchLocation) {
        return titleMatch && locationMatch;
      } else if (lowerSearchTitle) {
        return titleMatch;
      } else if (lowerSearchLocation) {
        return locationMatch;
      }
      return true;
    });

    setFilteredJobs(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleApplyClick = (job) => {
    navigate(`/apply/${job.id}`, { state: { job } });
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-4">
              Join the Job Provider Companies
            </h1>
            <p className="text-xl mb-8">We've helped provide you jobs</p>

            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Job title, keywords, or phrase"
                  className="flex-grow p-3 rounded-lg text-gray-900"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-grow p-3 rounded-lg text-gray-900"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {isSearched ? "Search Results" : "Featured Jobs"}
          </h2>

          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">
                    {job.job_title}
                  </h3>
                  <p className="text-gray-600 mb-2">{job.company_name}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {job.company_address}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {job.job_type} • {job.experience_level}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {job.job_description}
                  </p>

                  <div className="flex gap-4 items-center">
                    <Link
                      to={`/jobdetails/${job.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Full Details
                    </Link>

                    {userRole === "job_seeker" && (
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center">
                <p className="text-gray-500">
                  {isSearched
                    ? "No jobs found matching your search criteria."
                    : "No job listings available."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
