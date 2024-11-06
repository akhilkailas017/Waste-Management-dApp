import React from "react";
import { useNavigate } from "react-router-dom";

const GovernmentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-green-300 to-blue-100 min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-3xl bg-transparent">
        <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
          Government Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/createVoucher")}
            className="bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-center py-8 cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105 rounded-xl"
          >
            Issue Voucher
          </div>

          <div
            onClick={() => navigate("/useVoucher")}
            className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold text-center py-8 cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105 rounded-xl"
          >
            Use Voucher
          </div>

          <div
            onClick={() => navigate("/viewWasteDetails")}
            className="bg-teal-200 hover:bg-teal-300 text-teal-900 font-semibold text-center py-8 cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105 rounded-xl"
          >
            View Waste Details
          </div>

          <div
            onClick={() => navigate("/readVoucher")}
            className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold text-center py-8 cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-105 rounded-xl"
          >
            Read Voucher
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
