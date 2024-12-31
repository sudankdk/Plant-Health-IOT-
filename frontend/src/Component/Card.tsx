import React from "react";
import { FaWater } from "react-icons/fa"; // Importing a water icon

const Card = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        Vegetable Garden
        <FaWater className="ml-2 text-blue-500" />
      </h2>
      <p className="text-gray-600 mb-1">Soil Moisture:</p>
      <p className="text-sm text-green-600 font-semibold">Low, High,Hydrated</p>
      <p className="text-gray-600 mt-4">
        Last Water Time:{" "}
        <span className="text-blue-500 font-medium">Water time</span>
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
        <FaWater className="mr-2" /> Hydrate
      </button>
    </div>
  );
};

export default Card;
