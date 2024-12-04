import React from "react";
import { FormFieldProps } from "../../../types";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  registerOptions,
  error,
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, registerOptions)}
      className={`mt-[1rem] block w-full px-[0.75rem] py-[0.5rem] border border-gray-[300] rounded-md shadow-sm focus:outline-none focus:ring-red-[500] focus:border-red-[500]`}
    />
    {error && (
      <span className="text-red-[500] text-xs mt-[0.25rem]">
        {error.message}
      </span>
    )}
  </>
);

export default FormField;
