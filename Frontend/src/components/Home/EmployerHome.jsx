import React, { useEffect, useState } from "react";
import Header from "../Header/Header";

function EmployerHome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve the logged-in employer from localStorage
    const loggedInEmployer = JSON.parse(
      localStorage.getItem("currentEmployer")
    );

    if (loggedInEmployer && loggedInEmployer.username) {
      setUserName(loggedInEmployer.username); // Use username instead of email
    }
  }, []);

  return (
    <>
      <Header />
      <div className="homepage">
        <h1>Home Page</h1>
        {userName ? (
          <p>Welcome, {userName}!</p> // Show personalized welcome message with username
        ) : (
          <p>Welcome to the platform!</p> // Default message for non-logged-in users
        )}
      </div>
    </>
  );
}

export default EmployerHome;
