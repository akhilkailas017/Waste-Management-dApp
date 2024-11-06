import React from 'react';

const Homepage = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Waste Management System</h1>
          <div className="space-x-4">
            <a href="#about" className="hover:text-gray-200">About Us</a>
            <a href="#contact" className="hover:text-gray-200">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Waste Management System</h2>
        <p className="text-lg text-gray-600 mb-8">Login as one of the roles below to manage waste responsibly.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg">
            Waste Collection Company
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-lg">
            Recycling Center
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg">
            Manufacturer
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg">
            Government
          </button>
        </div>
      </main>
    </>
  );
}

export default Homepage;
