import React, { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldError } from "react-hook-form";
import { FormData } from "../../../types";

interface SeekerAddressProps {
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  error?: FieldError;
}

function SeekerAddress({ register, setValue, error }: SeekerAddressProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (input: string) => {
    if (!input) return;

    setIsLoading(true);
    try {
      const API_KEY = "AlzaSyYpFC3JnmdgpiSx1gSgNclAodMlhlb-aVu";
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setValue("address", value, { shouldValidate: true });

    if (value.length >= 3) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const address = suggestion.description;
    setInputValue(address);
    setSuggestions([]);
  };

  // Sync inputValue with form state
  useEffect(() => {
    setValue("address", inputValue, { shouldValidate: true });
  }, [inputValue, setValue]);

  const { ref, ...rest } = register("address", {
    required: "Address is required",
  });

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Address*
      </label>
      <input
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter your address"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-[38px]">
          <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default SeekerAddress;
