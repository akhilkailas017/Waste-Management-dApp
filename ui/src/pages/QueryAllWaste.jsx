import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const QueryAllWaste = () => {
  const [wasteData, setWasteData] = useState(null);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const res = await fetch("/api/queryAllWaste", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (result.success) {
          setWasteData(result.data.value); // Access the "value" array directly
          toast.success("Waste data retrieved successfully");
        } else {
          toast.error("No waste data found");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the waste data");
      }
    };

    fetchWasteData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          All Waste
        </h2>

        {/* Display waste data in a table format if data is available */}
        {wasteData && wasteData.length > 0 ? (
          <div className="overflow-x-auto bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Waste Data
            </h3>
            <table className="min-w-full border border-green-300">
              <thead>
                <tr className="bg-green-200">
                  <th className="px-4 py-2 border-b border-green-300">Waste ID</th>
                  <th className="px-4 py-2 border-b border-green-300">Total weight</th>
                  <th className="px-4 py-2 border-b border-green-300">collection Company</th>
                  <th className="px-4 py-2 border-b border-green-300">Owner</th>
                  <th className="px-4 py-2 border-b border-green-300">Status</th>
                  <th className="px-4 py-2 border-b border-green-300">Usable Percentage</th>
                </tr>
              </thead>
              <tbody>
                {wasteData.map((waste, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border-b border-green-300">{waste.Key}</td>
                    <td className="px-4 py-2 border-b border-green-300">{waste.Record.totalWeight}</td>
                    <td className="px-4 py-2 border-b border-green-300">{waste.Record.collectionCompany}</td>
                    <td className="px-4 py-2 border-b border-green-300">{waste.Record.owner}</td>
                    <td className="px-4 py-2 border-b border-green-300">{waste.Record.status}</td>
                    <td className="px-4 py-2 border-b border-green-300">{waste.Record.usablePercentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              No Waste Data Found
            </h3>
            <p className="text-gray-700">
              There is no waste data available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryAllWaste;
