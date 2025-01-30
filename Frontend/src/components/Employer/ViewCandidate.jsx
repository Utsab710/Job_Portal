import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

function ViewCandidate() {
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState([]); // Changed to empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/applicant/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setCandidateData(data);
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError(err.message);
      }
    };

    fetchCandidateData();
  }, [navigate]);

  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!candidateData.length) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-center">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div>
        <Header />
        <div className="min-h-screen bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Candidate Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidateData.map((candidate, index) => (
                <div
                  key={candidate.id || index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="font-semibold">Username:</label>
                      <p className="mt-1">
                        {candidate.first_name} {candidate.last_name}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold">Location:</label>
                      <p className="mt-1">{candidate.location}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Phone Number:</label>
                      <p className="mt-1">{candidate.phone_no}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Expected Salary:</label>
                      <p className="mt-1">${candidate.expected_salary}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Resume:</label>
                      <a
                        href={`http://127.0.0.1:8000${candidate.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline block"
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ViewCandidate;
