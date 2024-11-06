import React from "react";
import { useNavigate } from "react-router-dom";

const RecyclingCenterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-3xl bg-transparent">
        <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
          Recycling Center Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/updateWaste")}
            className="bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Update Waste
          </div>

          <div
            onClick={() => navigate("/queryWaste")}
            className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
          >
            View Waste Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclingCenterDashboard;
