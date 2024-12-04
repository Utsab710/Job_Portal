import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'seeker' or 'employer'
  const loginDropdownRef = useRef(null);
  const registerDropdownRef = useRef(null);
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

  const toggleLoginDropdown = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsRegisterOpen(false);
  };

  const toggleRegisterDropdown = () => {
    setIsRegisterOpen(!isRegisterOpen);
    setIsLoginOpen(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loggedInUser) {
        if (
          loginDropdownRef.current &&
          !loginDropdownRef.current.contains(event.target)
        ) {
          setIsLoginOpen(false);
        }
      } else {
        if (
          loginDropdownRef.current &&
          !loginDropdownRef.current.contains(event.target) &&
          registerDropdownRef.current &&
          !registerDropdownRef.current.contains(event.target)
        ) {
          setIsLoginOpen(false);
          setIsRegisterOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginDropdownRef, registerDropdownRef, loggedInUser]);

  const renderProfileDropdown = () => {
    if (userType === "seeker") {
      return (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/applied-jobs"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Applied Jobs
          </Link>
        </div>
      );
    } else {
      return (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/manage-jobs"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Manage Jobs
          </Link>
          <Link
            to="/applications"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            View Applications
          </Link>
        </div>
      );
    }
  };

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
              <div className="flex items-center space-x-4">
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={toggleLoginDropdown}
                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none flex items-center"
                  >
                    <span>{loggedInUser.username}</span>
                    <IoMdArrowDropdown className="w-5 h-5" />
                  </button>
                  {isLoginOpen && renderProfileDropdown()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="relative" ref={loginDropdownRef}>
                  <Link
                    to="#"
                    onClick={toggleLoginDropdown}
                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none flex items-center"
                  >
                    <span>Log in</span>
                    <IoMdArrowDropdown className="w-5 h-5" />
                  </Link>
                  {isLoginOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <Link
                        to="/seekerlogin"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Log in as Seeker
                      </Link>
                      <Link
                        to="/employerlogin"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Log in as Employer
                      </Link>
                    </div>
                  )}
                </div>

                <div
                  className="relative inline-block text-left"
                  ref={registerDropdownRef}
                >
                  <Link
                    to="#"
                    onClick={toggleRegisterDropdown}
                    className="text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none flex items-center"
                  >
                    <span>Register</span>
                    <IoMdArrowDropdown className="w-5 h-5" />
                  </Link>
                  {isRegisterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <Link
                        to="/seeker"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Register as Seeker
                      </Link>
                      <Link
                        to="/employer"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Register as Employer
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex font-medium lg:flex-row lg:space-x-8">
              {(!loggedInUser || userType === "seeker") && (
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Home
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  About
                </NavLink>
              </li>
              {!loggedInUser && (
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Contact Us
                  </NavLink>
                </li>
              )}
              {loggedInUser && userType === "seeker" && (
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              )}
              {loggedInUser && userType === "seeker" && (
                <li>
                  <NavLink
                    to="/applied-jobs"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Applied Jobs
                  </NavLink>
                </li>
              )}
              {loggedInUser && userType === "employer" && (
                <li>
                  <NavLink
                    to="/eprofile"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              )}
              {loggedInUser && userType === "employer" && (
                <>
                  <li>
                    <NavLink
                      to="/postjob"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-gray-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                      }
                    >
                      Post Jobs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/selection"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 ${
                          isActive ? "text-orange-700" : "text-gray-700"
                        } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                      }
                    >
                      Selection
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
