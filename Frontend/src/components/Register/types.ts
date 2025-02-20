import { RegisterOptions, FieldError } from "react-hook-form";

export interface FormFieldProps {
  type: string;
  placeholder?: string;
  name: string;
  register: any;
  registerOptions?: RegisterOptions;
  validation?: RegisterOptions;
  error?: FieldError;
}
