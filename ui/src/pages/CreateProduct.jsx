import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const [productId, setProductId] = useState("");
  const [wasteId, setWasteId] = useState("");
  const [name, setName] = useState("");

  const submitForm = (e) => {
    e.preventDefault();

    const newProduct = {
      productId,
      wasteId,
      name,
    };

    addProduct(newProduct);
  };

  const addProduct = async (newProduct) => {
    try {
      const res = await fetch("/api/createProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`${result.message}`);
        setProductId("");
        setWasteId("");
        setName("");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error: Unable to create product entry.");
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-green-200 to-green-100 min-h-screen flex items-center justify-center py-10 px-4">
        <div className="bg-transparent max-w-lg w-full p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-green-800">
            Create Product
          </h2>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Product ID
              </label>
              <input
                type="text"
                id="productId"
                name="productId"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., Product-01"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Waste ID
              </label>
              <input
                type="text"
                id="wasteId"
                name="wasteId"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., Waste-01"
                required
                value={wasteId}
                onChange={(e) => setWasteId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., Recycled Plastic"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full hover:bg-green-700 transition focus:outline-none"
            >
              Create Product
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateProduct;
