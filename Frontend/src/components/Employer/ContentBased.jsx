// src/components/Employer/ContentBased.jsx
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
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [message, setMessage] = useState("");

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
        console.log("Fetched applicants:", data); // Log the response to verify id
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

  const handleContactClick = (applicant) => {
    setSelectedApplicant(applicant);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    if (!selectedApplicant || !selectedApplicant.id) {
      alert("Invalid applicant selection. Please try again.");
      return;
    }

    const payload = {
      recipient: selectedApplicant.user,
      job_application: selectedApplicant.id,
      content: message,
    };
    console.log("Sending payload:", payload);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      alert("Message sent successfully!");
      const updatedApplicants = applicants.map((applicant) =>
        applicant.id === selectedApplicant.id
          ? { ...applicant, status: "contacted" }
          : applicant
      );
      setApplicants(updatedApplicants);
      setSelectedApplicant(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.message);
    }
  };

  // Rest of the JSX remains unchanged...
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
            {applicants.map((applicant) => (
              <div
                key={applicant.id}
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    {applicant.status || "Applied"}
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
                  <button
                    onClick={() => handleContactClick(applicant)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Contact Applicant
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedApplicant && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Contact {selectedApplicant.first_name}{" "}
                {selectedApplicant.last_name}
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                className="w-full p-2 border rounded-md mb-4 resize-none"
                rows={4}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Send
                </button>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ContentBased;
