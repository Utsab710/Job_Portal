import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/jobs/");
        if (response.ok) {
          const jobData = await response.json();
          setData(jobData);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };
    fetchJobs();
  }, []);

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

        <h2 className="text-3xl font-bold mb-8 text-center">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-4">
          {data.map((job, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-4">{job.company}</p>
              <p className="text-sm text-gray-500 mb-4">{job.location}</p>
              <button className="text-red-600 hover:underline">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
