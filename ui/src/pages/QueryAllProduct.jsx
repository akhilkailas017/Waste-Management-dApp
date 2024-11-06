import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const QueryAllProduct = () => {
  const [productData, setProductData] = useState(null);

  // useEffect to trigger the data fetch on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch("/api/queryallproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (result.success) {
          setProductData(result.data);
          toast.success("Product data retrieved successfully");
        } else {
          toast.error("No product data found");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the product data");
      }
    };

    fetchProductData();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
           All Products
        </h2>

        {/* Conditionally render product data */}
        {productData && productData.length > 0 && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              All Product Data
            </h3>
            <ul className="text-gray-700">
              {productData.map((product, index) => (
                <li key={index} className="mb-4">
                  <strong>Product ID:</strong> {product.productId} <br />
                  <strong>Asset Type:</strong> {product.assetType} <br />
                  {/* Add any other product details as needed */}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* If no data found */}
        {productData && productData.length === 0 && (
          <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              No Product Data Found
            </h3>
            <p className="text-gray-700">There is no product data available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryAllProduct;
