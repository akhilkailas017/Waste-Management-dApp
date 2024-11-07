import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const QueryAllProduct = () => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch("/api/queryAllProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (result.success) {
          setProductData(result.data.value); // Access "value" array directly
          toast.success("Product data retrieved successfully");
        } else {
          toast.error("No product data found");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the product data");
      }
    };

    fetchProductData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          All Products
        </h2>

        {/* Display products in a table format if data is available */}
        {productData && productData.length > 0 ? (
          <div className="overflow-x-auto bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Product Data
            </h3>
            <table className="min-w-full border border-blue-300">
              <thead>
                <tr className="bg-blue-200">
                  <th className="px-4 py-2 border-b border-blue-300">Product ID</th>
                  <th className="px-4 py-2 border-b border-blue-300">Asset Type</th>
                  <th className="px-4 py-2 border-b border-blue-300">Name</th>
                  <th className="px-4 py-2 border-b border-blue-300">Owner</th>
                  <th className="px-4 py-2 border-b border-blue-300">Status</th>
                  <th className="px-4 py-2 border-b border-blue-300">Waste ID</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((product, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border-b border-blue-300">{product.Key}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{product.Record.assetType}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{product.Record.name}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{product.Record.owner}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{product.Record.status}</td>
                    <td className="px-4 py-2 border-b border-blue-300">{product.Record.wasteId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              No Product Data Found
            </h3>
            <p className="text-gray-700">
              There is no product data available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryAllProduct;
