import { FieldError, UseFormRegister, RegisterOptions } from "react-hook-form";

// Define the structure for form data
export type FormData = {
  username: string;
  email: string;
  address: string;
  yearsOfExperience: number;
  password: string;
  confirmPassword: string;
};

// Define the props for FormField component
export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  registerOptions?: RegisterOptions; // Optional: rules for validation
  error: FieldError | undefined; // Handles error for each field
  valueAsNumber?: boolean; // Optional: when dealing with number inputs
};

// List of valid field names for form fields
export type ValidFieldNames =
  | "username"
  | "email"
  | "yearsOfExperience"
  | "address"
  | "password"
  | "confirmPassword";
