import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'seeker' or 'employer'
  const navigate = useNavigate();

  useEffect(() => {
    const seeker = JSON.parse(localStorage.getItem("currentSeeker"));
    const employer = JSON.parse(localStorage.getItem("currentEmployer"));

    if (seeker) {
      setLoggedInUser(seeker);
      setUserType("seeker");
    } else if (employer) {
      setLoggedInUser(employer);
      setUserType("employer");
    }
  }, []);

  const handleLogout = () => {
    if (userType === "seeker") {
      localStorage.removeItem("currentSeeker");
    } else {
      localStorage.removeItem("currentEmployer");
    }
    setLoggedInUser(null);
    setUserType(null);
    navigate("/");
  };

  const renderProfileMenu = () => (
    <div className="flex items-center space-x-4">
      <Link
        to="/profile"
        className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
      >
        {loggedInUser.username}
      </Link>
      <button
        onClick={handleLogout}
        className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
      >
        Logout
      </button>
    </div>
  );

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <span className="text-red-500 font-bold text-2xl mr-2">JP</span>
              <span className="font-semibold text-xl">JobPortal</span>
            </div>
          </Link>

          <div className="flex items-center order-2">
            {loggedInUser ? (
              renderProfileMenu()
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
