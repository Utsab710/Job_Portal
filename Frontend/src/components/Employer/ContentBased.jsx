import React, { useState, useEffect } from "react";
import { AlertCircle, Download, DollarSign, Target } from "lucide-react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useParams } from "react-router-dom";

function ContentBased() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/applicant/${jobId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }

        const data = await response.json();
        setApplicants(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Failed to load applicants");
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading applicants...</p>
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
          Job Applicants
        </h1>

        {applicants.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>No applicants yet for this position.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((applicant, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {applicant.first_name} {applicant.last_name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {(applicant.score * 100).toFixed(1)}% Match
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Applicant ID:</span>{" "}
                    {applicant.user}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {applicant.phone_no}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Expected Salary:</span>$
                    {applicant.expected_salary.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Job ID:</span>{" "}
                    {applicant.job_id}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <a
                    href={`http://127.0.0.1:8000${applicant.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Contact Applicant
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

export default ContentBased;
