import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function JobDetails() {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/jobposting/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>No job found</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {job.job_title}
        </h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Company Details
            </h2>
            <p className="text-gray-600">{job.company_name}</p>
            <p className="text-gray-600">{job.company_address}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Job Type</h2>
            <p className="text-gray-600">{job.job_type}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Experience Level
            </h2>
            <p className="text-gray-600">{job.experience_level}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Job Description
            </h2>
            <p className="text-gray-600">{job.job_description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Requirements
            </h2>
            <p className="text-gray-600">{job.requirements}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
            <p className="text-gray-600">{job.benefits}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Salary Range
            </h2>
            <p className="text-gray-600">
              ${job.salary_min} - ${job.salary_max}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetails;
