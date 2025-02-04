import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import SeekerAddress from "./SeekerAddress";
import { FormData } from "../../../types";

function Seeker() {
  const [isEmployer, setIsEmployer] = useState(false); // Toggle between Seeker and Employer

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    getValues,
    setValue,
  } = useForm<FormData>();

  const handleAddressChange = (value) => {
    setValue("address", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    if (isEmployer) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Employer registered successfully: " + result.message);
          reset();
        } else {
          const errorData = await response.json();
          if (errorData.username) {
            setError("username", {
              type: "manual",
              message: errorData.username[0],
            });
          }
          if (errorData.email) {
            setError("email", { type: "manual", message: errorData.email[0] });
          }
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again.");
      }
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const usernameExists = existingUsers.some(
        (user) => user.username === data.username
      );

      if (usernameExists) {
        setError("username", {
          type: "manual",
          message: "Username already exists",
        });
        return;
      }

      const userExists = existingUsers.some(
        (user) => user.email === data.email
      );

      if (userExists) {
        setError("email", { type: "manual", message: "Email already exists" });
        return;
      }

      existingUsers.push(data);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      alert("Seeker registered successfully");
      reset();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Register as a{" "}
              <span className="text-red-500">
                {isEmployer ? "Employer" : "Seeker"}
              </span>
            </h2>
            <div className="flex items-center justify-center mt-4">
              <label className="mr-2">Are you an Employer?</label>
              <input
                type="checkbox"
                checked={isEmployer}
                onChange={(e) => setIsEmployer(e.target.checked)}
                className="h-4 w-4 text-red-500 focus:ring-red-400 border-gray-300 rounded"
              />
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username*
                </label>
                <FormField
                  type="text"
                  placeholder="eg. username123"
                  name="username"
                  register={register}
                  error={errors.username}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <FormField
                  type="email"
                  placeholder="eg. user@xyz.com"
                  name="email"
                  register={register}
                  error={errors.email}
                />
              </div>

              {!isEmployer && (
                <>
                  {/* Address Field */}
                  <SeekerAddress
                    register={register}
                    setValue={setValue}
                    error={errors.address}
                  />

                  {/* Years of Experience Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience*
                    </label>
                    <FormField
                      type="number"
                      placeholder="Years of Experience (0 - 10)"
                      name="yearsOfExperience"
                      register={register}
                      error={errors.yearsOfExperience}
                    />
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <FormField
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  register={register}
                  error={errors.password}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <FormField
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Seeker;
