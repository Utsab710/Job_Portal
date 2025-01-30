import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationSearch = ({ onLocationSelect, onClose }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("map").setView([27.7172, 85.324], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const getLatLng = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lon);

        const latLng = {
          latitude: parsedLat,
          longitude: parsedLng,
          address: display_name,
          displayCoordinates: `Latitude: ${parsedLat.toFixed(
            6
          )}, Longitude: ${parsedLng.toFixed(6)}`,
        };
        setSelectedLocation(latLng);
        showLocationOnMap(latLng);
        return latLng;
      } else {
        alert("Location not found.");
        return null;
      }
    } catch (error) {
      alert("Error fetching location.");
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const showLocationOnMap = (latLng) => {
    if (map && latLng) {
      map.setView([latLng.latitude, latLng.longitude], 15);

      if (marker) {
        map.removeLayer(marker);
      }

      const newMarker = L.marker([latLng.latitude, latLng.longitude])
        .addTo(map)
        .bindPopup(
          `<div>
            <p class="mb-2">${latLng.address}</p>
            <p class="text-sm">${latLng.displayCoordinates}</p>
          </div>`
        )
        .openPopup();

      setMarker(newMarker);
    }
  };

  const handleSearch = async () => {
    if (searchInput.trim()) {
      await getLatLng(searchInput);
    } else {
      alert("Please enter a location.");
    }
  };

  const handleUseLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter a location (e.g., Balaju, Kathmandu)"
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Search
          </button>
        </div>

        <div id="map" className="w-full h-96 rounded border mb-4"></div>

        {selectedLocation && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Selected location:</p>
            <p className="text-gray-800">{selectedLocation.address}</p>
            <p className="text-gray-800 text-sm">
              {selectedLocation.displayCoordinates}
            </p>
            <button
              onClick={handleUseLocation}
              className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Use this location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;
