import { useEffect, useState } from "react";
import { FaWater } from "react-icons/fa";
import { MoistureLevel } from "../logic/Moisture";
import { Hydrate } from "../endpoints/api";

const Card = () => {
  const [moisture, setMoisture] = useState<string>("");
  const [lastWaterTime, setLastWaterTime] = useState<string>("Not yet watered");
  const moistureValue: number = 20; // Replace with real-time value if available

  useEffect(() => {
    setMoisture(MoistureLevel(moistureValue));
  }, [moistureValue]);

  const handle_hydrate = async () => {
    try {
      const result = await Hydrate();
      if (result.status === "success") {
        console.log("success hydrate");
        setLastWaterTime(new Date().toLocaleTimeString()); // Update the last water time
      } else {
        console.error("Hydration failed:", result.message);
      }
    } catch (error) {
      console.error("Error in hydration request:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        Vegetable Garden
        <FaWater className="ml-2 text-blue-500" />
      </h2>
      <progress
        className="w-full mb-2"
        value={moistureValue}
        max={100}
      ></progress>
      <p className="text-gray-600 mb-1">Soil moisture</p>
      <p className="text-sm text-green-600 font-semibold">{moisture}</p>
      <p className="text-gray-600 mt-4">
        Last Water Time:{" "}
        <span className="text-blue-500 font-medium">{lastWaterTime}</span>
      </p>
      <button
        onClick={handle_hydrate}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
      >
        <FaWater className="mr-2" /> Hydrate
      </button>
    </div>
  );
};

export default Card;
