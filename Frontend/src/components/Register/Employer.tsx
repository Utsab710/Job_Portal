import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useForm } from "react-hook-form";
import { FormData } from "../../../types";
import FormField from "./FormField";

function Employer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    getValues,
  } = useForm<FormData>();

  // Submit handler
  const onSubmit = async (data: FormData) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

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
        reset(); // Reset form fields
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
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Employer Registration
            </h2>
            <p className="text-xl text-gray-600">
              Join us to find great talent!
            </p>
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
                  placeholder="eg. employer123"
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
                  placeholder="eg. employer@xyz.com"
                  name="email"
                  register={register}
                  error={errors.email}
                />
              </div>

              {/* Password Field */}
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <FormField
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  register={register}
                  registerOptions={{
                    validate: {
                      matchesPreviousPassword: (value) => {
                        const { password } = getValues();
                        return value === password || "Passwords must match!";
                      },
                    },
                  }}
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

            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{" "}
              <a
                href="/employerlogin"
                className="text-red-500 hover:text-red-600"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Employer;
