import React, { useState } from "react";
import { toast } from "react-toastify";

const ReadWaste = () => {
  const [wasteId, setWasteId] = useState("");
  const [wasteData, setWasteData] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const readDetails = {
      wasteId,
    };

    try {
      const res = await fetch("/api/readwaste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readDetails),
      });

      const result = await res.json();
      if (result.success) {
        setWasteData(result.data);
        toast.success("Waste data retrieved successfully");
      } else {
        toast.error(`Waste ID ${wasteId} does not exist`);
      }
    } catch (error) {
      toast.error("An error occurred while fetching the waste data");
    }
  };

  const resetForm = () => {
    setWasteId(""); // Clear the input field
    setWasteData(null); // Clear the fetched data
  };

  return (
    <div className="bg-white flex items-center justify-center m-20">
      <div className="bg-green-100 p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
          Read Waste
        </h2>
        <form onSubmit={submitForm}>
          <div className="mb-4">
            <label
              htmlFor="wasteId"
              className="block text-gray-700 font-bold mb-2"
            >
              Waste ID
            </label>
            <input
              type="text"
              id="wasteId"
              name="wasteId"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={wasteId}
              onChange={(e) => setWasteId(e.target.value)}
              placeholder="e.g., Waste-01"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Read
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Conditionally render waste data */}
        {wasteData && (
          <div className="mt-6 bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Waste Details
            </h3>
            <ul className="text-gray-700">
              {Object.entries(wasteData).map(([key, value]) => (
                <li key={key} className="mb-1">
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadWaste;
