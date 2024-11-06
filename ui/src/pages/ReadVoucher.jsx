import React, { useState } from "react";
import { toast } from "react-toastify";

const ReadVoucher = () => {
  const [voucherId, setVoucherId] = useState("");
  const [voucherData, setVoucherData] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const readDetails = { voucherId };

    try {
      const res = await fetch("/api/readvoucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readDetails),
      });

      const result = await res.json();
      if (result.success) {
        setVoucherData(result.data);
        toast.success("Voucher data retrieved successfully");
      } else {
        toast.error(`Voucher ID ${voucherId} does not exist`);
      }
    } catch (error) {
      toast.error("An error occurred while fetching the voucher data");
    }
  };

  const resetForm = () => {
    setVoucherId("");
    setVoucherData(null);
  };

  return (
    <div className="bg-gradient-to-b from-green-300 to-green-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-transparent p-8 rounded-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Read Voucher
        </h2>
        <form onSubmit={submitForm}>
          <div className="mb-6">
            <label
              htmlFor="voucherId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Voucher ID
            </label>
            <input
              type="text"
              id="voucherId"
              name="voucherId"
              className="w-full px-4 py-2 bg-transparent text-green-800 placeholder-green-500 border-2 border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              value={voucherId}
              onChange={(e) => setVoucherId(e.target.value)}
              placeholder="e.g., Voucher-01"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Read
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

        {/* Conditionally render voucher data */}
        {voucherData && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Voucher Details
            </h3>
            <ul className="text-gray-700">
              {Object.entries(voucherData).map(([key, value]) => (
                <li key={key} className="mb-2">
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadVoucher;
