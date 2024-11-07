import React, { useState } from "react";
import { toast } from "react-toastify";

const ReadWaste = () => {
  const [wasteId, setWasteId] = useState("");
  const [wasteData, setWasteData] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const readDetails = { wasteId };

    try {
      const res = await fetch("/api/readWaste", {
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

  const renderWasteDetails = () => {
    if (!wasteData) return null;

    return (
      <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Waste Details</h3>
        <ul className="text-gray-700 space-y-2">
          {Object.entries(wasteData).map(([key, value]) => (
            <li key={key} className="flex items-start space-x-2">
              <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span>
                {typeof value === "object" && value !== null ? (
                  <ul className="pl-4">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <li key={subKey} className="flex items-start space-x-2">
                        <span className="font-semibold capitalize">{subKey.replace(/([A-Z])/g, ' $1')}:</span>
                        <span>{subValue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  value
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Read Waste
        </h2>
        <form onSubmit={submitForm}>
          <div className="mb-6">
            <label
              htmlFor="wasteId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Waste ID
            </label>
            <input
              type="text"
              id="wasteId"
              name="wasteId"
              className="w-full px-4 py-2 bg-transparent text-green-800 placeholder-green-500 border-2 border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              value={wasteId}
              onChange={(e) => setWasteId(e.target.value)}
              placeholder="e.g., Waste-01"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Read
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Reset
            </button>
          </div>
        </form>

        {renderWasteDetails()}
      </div>
    </div>
  );
};

export default ReadWaste;
