import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const QueryAllWaste = () => {
  const [wasteData, setWasteData] = useState(null);

  // UseEffect to trigger the data fetch on page load
  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const res = await fetch("/api/queryallwaste", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (result.success) {
          setWasteData(result.data);
          toast.success("Waste data retrieved successfully");
        } else {
          toast.error("No waste data found");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the waste data");
      }
    };

    fetchWasteData();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          All Waste
        </h2>

        {/* Conditionally render waste data */}
        {wasteData && wasteData.length > 0 && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              All Waste Data
            </h3>
            <ul className="text-gray-700">
              {wasteData.map((waste, index) => (
                <li key={index} className="mb-2">
                  <strong>Waste ID:</strong> {waste.wasteId} <br />
                  <strong>Asset Type:</strong> {waste.assetType} <br />
                  {/* Add any other waste details as needed */}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* If no data found */}
        {wasteData && wasteData.length === 0 && (
          <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              No Waste Data Found
            </h3>
            <p className="text-gray-700">There is no waste data available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryAllWaste;
