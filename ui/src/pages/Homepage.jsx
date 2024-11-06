import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-green-700 text-white py-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-lg font-semibold">Waste Management System</h1>
          <div className="space-x-4">
            <a href="#about" className="hover:text-green-200 transition duration-200">About Us</a>
            <a href="#contact" className="hover:text-green-200 transition duration-200">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
        <div className="container max-w-3xl bg-transparent">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-8">
            Waste Management System
          </h2>
          <p className="text-center text-gray-600 mb-6">Choose your role to access the system:</p>

          {/* Button Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => navigate("/CollectionDashboard")}
              className="bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Waste Collection Company
            </div>

            <div
              onClick={() => navigate("/recyclingCenterDashboard")}
              className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Recycling Center
            </div>

            <div
              onClick={() => navigate("/manufacturerDashboard")}
              className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Manufacturer
            </div>

            <div
              onClick={() => navigate("/governmentDashboard")}
              className="bg-red-200 hover:bg-red-300 text-red-900 font-semibold text-center py-8 cursor-pointer shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Government
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Homepage;
