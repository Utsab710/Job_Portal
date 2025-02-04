import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const EmployerHome = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "job_employer") {
      navigate("/seekerhome");
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername); // Set the username retrieved from localStorage
    } else {
      console.log("No username found in localStorage");
      setUsername("Guest");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, <span className="text-red-600">{username}</span>!
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to your employer dashboard. Here you can post new jobs,
            manage applications, and view candidate profiles.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerHome;
