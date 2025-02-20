import React from "react";
import { FormFieldProps } from "./types";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  registerOptions,
  validation,
  error,
}) => {
  // Combine registerOptions and validation
  const finalRegisterOptions = {
    ...registerOptions,
    ...validation,
  };

  // Special validation for phone number if it's a phone field
  if (name === "phone_no") {
    finalRegisterOptions.pattern = {
      value: /^(97|98)\d{8}$/,
      message: "Phone number must start with 97 or 98 and be exactly 10 digits",
    };
  }

  // Special validation for password if it's a password field
  if (name === "password") {
    finalRegisterOptions.minLength = {
      value: 5,
      message: "Password must be at least 5 characters",
    };
  }

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, finalRegisterOptions)}
        className={`mt-[1rem] block w-full px-[0.75rem] py-[0.5rem] border ${
          error ? "border-red-500" : "border-gray-[300]"
        } rounded-md shadow-sm focus:outline-none focus:ring-red-[500] focus:border-red-[500]`}
      />
      {error && (
        <span className="text-red-[500] text-xs mt-[0.25rem]">
          {error.message}
        </span>
      )}
    </>
  );
};

export default FormField;
