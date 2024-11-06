import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateVoucher = () => {
  const [voucherId, setVoucherId] = useState('');
  const [wasteId, setWasteId] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  const submitForm = (e) => {
    e.preventDefault();

    const voucherData = {
      voucherId,
      wasteId,
      type,
      amount,
    };

    createVoucher(voucherData);
  };

  const createVoucher = async (voucherData) => {
    try {
      const res = await fetch('/api/createvoucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`${result.message}`);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error: Unable to create voucher.");
    }
  };

  return (
    <section className="bg-gradient-to-b from-green-200 to-blue-100 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="bg-transparent max-w-lg w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-800">
          Create Voucher
        </h2>
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="block text-green-900 font-semibold mb-1">
              Voucher ID
            </label>
            <input
              type="text"
              id="voucherId"
              name="voucherId"
              className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
              placeholder="e.g., Voucher-01"
              required
              value={voucherId}
              onChange={(e) => setVoucherId(e.target.value)}
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
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
              placeholder="e.g., Recycling"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-green-900 font-semibold mb-1">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
              placeholder="e.g., 100"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full hover:bg-green-700 transition focus:outline-none"
          >
            Create Voucher
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateVoucher;
