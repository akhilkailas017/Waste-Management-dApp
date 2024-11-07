import React, { useState } from "react";
import { toast } from "react-toastify";

const DeleteProduct = () => {
  const [productId, setProductId] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/deleteProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Product ID ${productId} deleted successfully`);
        setProductId(""); // Clear the input after successful deletion
      } else {
        toast.error(result.message || `Product ID ${productId} does not exist`);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product data");
    }
  };

  const resetForm = () => {
    setProductId(""); // Clear the input field
  };

  return (
    <div className="bg-gradient-to-b from-red-300 to-red-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-red-800 mb-6 text-center">
          Delete Product
        </h2>
        <form onSubmit={submitForm}>
          <div className="mb-6">
            <label
              htmlFor="productId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              className="w-full px-4 py-2 bg-transparent text-red-800 placeholder-red-500 border-2 border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="e.g., Product-01"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Delete
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
        {productId && (
          <div className="mt-6 p-6 bg-red-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              Product ID: {productId}
            </h3>
            <p className="text-gray-700">Are you sure you want to delete this product data?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteProduct;
