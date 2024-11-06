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
      const res = await fetch('/api/createwaste', {
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
      <section className="bg-white mb-20 flex">
        <div className="container m-auto max-w-xl py-2">
          <div className="bg-green-100 px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <form onSubmit={submitForm}>
              <h2 className="text-3xl text-green-800 text-center font-semibold mb-6">
                Create Waste
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Waste ID
                </label>
                <input
                  type="text"
                  id="wasteId"
                  name="wasteId"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. Waste-01"
                  required
                  value={wasteId}
                  onChange={(e) => setWasteId(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Collection Company
                </label>
                <input
                  type="text"
                  id="collectionCompany"
                  name="collectionCompany"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. WasteCollectionCo-01"
                  required
                  value={collectionCompany}
                  onChange={(e) => setCollectionCompany(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Total Weight (kg)
                </label>
                <input
                  type="text"
                  id="totalWeight"
                  name="totalWeight"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. 500"
                  required
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Owner
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="eg. RecyclingCenter-01"
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>

              <div>
                <button
                  className="bg-green-500 hover:bg-green-600 my-10 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Create Waste
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateWaste;
