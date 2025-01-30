import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import SeekerAddress from "./SeekerAddress";
import { FormData } from "../../../types";

function Register() {
  const [isEmployer, setIsEmployer] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
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

    // Create payload based on the user type
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
      first_name: data.firstname,
      last_name: data.lastname,
      role: isEmployer ? "job_employer" : "job_seeker",
      // Add fields based on user type
      ...(isEmployer
        ? {
            company_name: data.company_name || "",
            pan_no: data.pan_no || "",
            // Set seeker fields to null for employer
            phone_no: null,
            address: null,
            skills: null,
            qualification: null,
          }
        : {
            phone_no: data.phone_no || "",
            address: data.address || "",
            skills: data.skills || "",
            qualification: data.qualification || "",
            // Set employer fields to null for seeker
            company_name: null,
            pan_no: null,
          }),
    };
    console.log("Sending payload:", payload);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          alert(firstError[0]);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const result = JSON.parse(responseText);
      alert(
        `${isEmployer ? "Employer" : "Job Seeker"} registered successfully: ${
          result.message || "Welcome!"
        }`
      );
      reset();
    } catch (error) {
      console.error("Full error:", error);
      alert("Error during registration. Please check the console for details.");
    }
  };

  // Rest of the component remains the same...
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Register as a{" "}
              <span className="text-red-500">
                {isEmployer ? "Employer" : "Job Seeker"}
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
              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Firstname*
                </label>
                <FormField
                  type="text"
                  name="firstname"
                  register={register}
                  error={errors.firstname}
                  validation={{ required: "First name is required" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lastname*
                </label>
                <FormField
                  type="text"
                  name="lastname"
                  register={register}
                  error={errors.lastname}
                  validation={{ required: "Last name is required" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username*
                </label>
                <FormField
                  type="text"
                  name="username"
                  register={register}
                  error={errors.username}
                  validation={{ required: "Username is required" }}
                />
              </div>
              <SeekerAddress
                register={register}
                setValue={setValue}
                error={errors.address}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <FormField
                  type="email"
                  name="email"
                  register={register}
                  error={errors.email}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
              </div>

              {/* Role-specific Fields */}
              {isEmployer ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name*
                    </label>
                    <FormField
                      type="text"
                      name="company_name"
                      register={register}
                      error={errors.company_name}
                      validation={{ required: "Company name is required" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number*
                    </label>
                    <FormField
                      type="text"
                      name="pan_no"
                      register={register}
                      error={errors.pan_no}
                      validation={{ required: "PAN number is required" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <FormField
                      type="text"
                      name="phone_no"
                      register={register}
                      error={errors.phone_no}
                      validation={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Phone number must be exactly 10 digits",
                        },
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <FormField
                      type="text"
                      name="skills"
                      register={register}
                      error={errors.skills}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <select
                      {...register("qualification", {
                        required: "Qualification is required",
                      })}
                      className={`mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${
                        errors.qualification ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Qualification</option>
                      <option value="SEE">SEE</option>
                      <option value="+2">+2</option>
                      <option value="Under_graduate">Under Graduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                    {errors.qualification && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.qualification.message}
                      </p>
                    )}
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
                  name="password"
                  register={register}
                  error={errors.password}
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <FormField
                  type="password"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                  validation={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === register("password").value ||
                      "Passwords do not match",
                  }}
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

export default Register;
