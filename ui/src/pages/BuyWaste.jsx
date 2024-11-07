import React, { useState } from "react";
import { toast } from "react-toastify";

const BuyWaste = () => {
  const [wasteId, setWasteId] = useState("");
  const [owner, setOwner] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/buyWaste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wasteId, owner }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Waste ID ${wasteId} bought successfully`);
        setWasteId(""); // Clear the input after successful purchase
        setOwner("");
      } else {
        toast.error(result.message || `Waste ID ${wasteId} does not exist`);
      }
    } catch (error) {
      toast.error("An error occurred while buying the waste");
    }
  };

  const resetForm = () => {
    setWasteId(""); // Clear the input field
    setOwner("");
  };

  return (
    <div className="bg-gradient-to-b from-green-200 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Buy Waste
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

          <div className="mb-6">
            <label
              htmlFor="owner"
              className="block text-gray-700 font-semibold mb-2"
            >
              Owner
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              className="w-full px-4 py-2 bg-transparent text-green-800 placeholder-green-500 border-2 border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g., Manufacturer-01"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Buy
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

        {/* Confirmation Box */}
        {wasteId && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Waste ID: {wasteId}
            </h3>
            <p className="text-gray-700">
              Are you sure you want to proceed with buying this waste data?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyWaste;
