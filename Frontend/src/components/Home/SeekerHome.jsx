import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const SeekerHome = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return; // Ensure no further code executes
    }

    // If role is not 'job_seeker', redirect to employer home
    if (userRole !== "job_seeker") {
      navigate("/employerhome");
      return; // Ensure no further code executes
    }

    // If everything is fine, set username
    setUsername(storedUsername || "");
  }, [navigate]); // Dependency array ensures this only runs on mount

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, <span className="text-red-600">{username}</span>!
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to your job seeker dashboard. Here you can search for jobs,
            manage your applications, and update your profile.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeekerHome;
