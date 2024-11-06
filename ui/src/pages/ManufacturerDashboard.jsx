import React from "react";
import { useNavigate } from "react-router-dom";

const ManufacturerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-green-200 to-green-50 min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-3xl bg-transparent">
        <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
          Manufacturer Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/buyWaste")}
            className="bg-teal-200 hover:bg-teal-300 text-teal-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
          >
            Buy Waste
          </div>

          <div
            onClick={() => navigate("/createProduct")}
            className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
          >
            Create Product
          </div>

          <div
            onClick={() => navigate("/readProduct")}
            className="bg-green-300 hover:bg-green-400 text-green-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
          >
            Read Product
          </div>

          <div
            onClick={() => navigate("/deleteProduct")}
            className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
          >
            Delete Product
          </div>

          <div
            onClick={() => navigate("/queryProduct")}
            className="bg-brown-300 hover:bg-brown-400 text-brown-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105 rounded-lg"
          >
            View All Products
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
