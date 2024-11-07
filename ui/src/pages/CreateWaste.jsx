import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateWaste = () => {
  const [wasteId, setWasteId] = useState('');
  const [collectionCompany, setCollectionCompany] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [owner, setOwner] = useState('');

  const submitForm = (e) => {
    e.preventDefault();

    const newWaste = {
      wasteId,
      collectionCompany,
      totalWeight,
      owner,
    };

    addWaste(newWaste);
  };

  const addWaste = async (newWaste) => {
    try {
      console.log(newWaste)
      const res = await fetch('/api/createWaste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWaste),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`${result.message}`);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error: Unable to create waste entry.");
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-green-200 to-green-100 min-h-screen flex items-center justify-center py-10 px-4">
        <div className="bg-transparent max-w-lg w-full p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-green-800">
            Create Waste
          </h2>
          <form onSubmit={submitForm} className="space-y-4">
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
                Collection Company
              </label>
              <input
                type="text"
                id="collectionCompany"
                name="collectionCompany"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., WasteCollectionCo-01"
                required
                value={collectionCompany}
                onChange={(e) => setCollectionCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Total Weight (kg)
              </label>
              <input
                type="text"
                id="totalWeight"
                name="totalWeight"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., 500"
                required
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Owner
              </label>
              <input
                type="text"
                id="owner"
                name="owner"
                className="w-full border-none bg-green-50 rounded-lg py-2 px-4 focus:outline-none focus:bg-green-100 transition"
                placeholder="e.g., RecyclingCenter-01"
                required
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full hover:bg-green-700 transition focus:outline-none"
            >
              Create Waste
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateWaste;
