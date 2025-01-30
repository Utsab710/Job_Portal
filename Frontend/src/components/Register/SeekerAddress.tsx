import React, { useState } from "react";
import LocationSearch from "./LocationSearch";

const SeekerAddress = ({ register, setValue, error }) => {
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState("");

  const handleLocationSelect = (location) => {
    setValue("address", location.address, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setCoordinates(location.coordinates);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          Address*
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            {...register("address", { required: "Address is required" })}
            className={`flex-1 p-2 border rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Search or enter your address"
          />
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🗺️ Search
          </button>
        </div>
        {coordinates && (
          <p className="text-sm text-gray-600 mt-1">{coordinates}</p>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>

      {showMap && (
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default SeekerAddress;
