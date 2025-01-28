import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null); // Add this line to define error state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/jobposting/", {
          method: "GET", // Explicitly specify GET method
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
        console.log("Fetched jobs:", data); // Debug log
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message); // Set the error message here
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

  console.log("Current User Role:", userRole);

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
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
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-grow p-3 rounded-lg text-gray-900"
                />
                <button className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Jobs</h2>

          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div> // Display error if it exists
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
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
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        <Link to={"/applyingjobs"}>Apply</Link>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                No job listings available.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
