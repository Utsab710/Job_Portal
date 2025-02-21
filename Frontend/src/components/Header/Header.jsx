import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Notification from "../Seeker/Notification"; // Import Notification

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetchUserDetails(token);
      }
    };

    checkAuth();
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/api/user-details/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();
      console.log("Fetched user data:", userData);
      setLoggedInUser(userData);
      setUserType(userData.role === "job_employer" ? "employer" : "seeker");
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("access_token");
      setLoggedInUser(null);
      setUserType(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setLoggedInUser(null);
    setUserType(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <span className="text-red-500 font-bold text-2xl mr-2">JP</span>
              <span className="font-semibold text-xl">JobPortal</span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Navigation links */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full lg:block lg:w-auto lg:order-1`}
          >
            {loggedInUser && (
              <ul className="flex flex-col lg:flex-row font-medium lg:space-x-8 mt-4 lg:mt-0">
                {/* Common links */}
                <li className="mb-2 lg:mb-0">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } hover:text-orange-700 lg:p-0`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                {/* Employer-specific links */}
                {userType === "employer" && (
                  <>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/eprofile"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/manage-jobs"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Manage Jobs
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/postjob"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Post Jobs
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/erecommend"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Recommended
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/viewcandidate"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        ViewCandidate
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Seeker-specific links */}
                {userType === "seeker" && (
                  <>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/applied-jobs"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Applied Jobs
                      </NavLink>
                    </li>
                    <li className="mb-2 lg:mb-0">
                      <NavLink
                        to="/recommended"
                        className={({ isActive }) =>
                          `block py-2 pr-4 pl-3 ${
                            isActive ? "text-orange-700" : "text-gray-700"
                          } hover:text-orange-700 lg:p-0`
                        }
                      >
                        Recommended
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>

          {/* Login/Logout section */}
          <div className="flex items-center lg:order-2 space-x-4">
            {userType === "seeker" && <Notification />}
            {loggedInUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-800">
                  {loggedInUser.username} ({userType})
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Login
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
