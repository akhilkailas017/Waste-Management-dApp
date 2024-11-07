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
      <div className="mt-6 w-full bg-green-50 rounded-lg shadow-md p-4 sm:p-6 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
          Waste Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {Object.entries(wasteData).map(([key, value]) => (
                <tr key={key} className="border-b border-green-100">
                  <td className="px-4 py-2 font-semibold text-gray-700 capitalize bg-green-100">
                    {key.replace(/([A-Z])/g, " $1")}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {typeof value === "object" && value !== null ? (
                      <table className="w-full border-collapse mt-2">
                        <tbody>
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <tr key={subKey}>
                              <td className="px-4 py-1 font-medium text-gray-600 capitalize bg-green-50">
                                {subKey.replace(/([A-Z])/g, " $1")}
                              </td>
                              <td className="px-4 py-1 text-gray-600">
                                {subValue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-transparent p-6 rounded-lg w-full max-w-lg mx-auto">
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
              className="w-full px-4 py-2 bg-transparent text-green-800 placeholder-green-500 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
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
