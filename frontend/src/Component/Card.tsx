import { useEffect, useState } from "react";
import { FaWater } from "react-icons/fa";
import { MoistureLevel } from "../logic/Moisture";
import { Hydrate } from "../endpoints/api";

const Card = () => {
  // States to manage moisture, hydration status, and environment data
  const [moisture, setMoisture] = useState<string>("");
  const [lastWaterTime, setLastWaterTime] = useState<string>("Not yet watered");
  const [isHydrating, setIsHydrating] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    // WebSocket connection to get real-time data
    const ws = new WebSocket(
      "wss://plant-health-iot-1.onrender.com:443/ws/sensors/"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    // Handling incoming data
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data && data[0]) {
          const sensorData = data[0];
          setTemperature(sensorData.temperature);
          setHumidity(sensorData.humidity);
          setSoilMoisture(sensorData.soilmoisture);
          setTimestamp(sensorData.timestamp);

          // Update the moisture level using the soilmoisture value
          setMoisture(MoistureLevel(sensorData.soilmoisture));
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array means this runs once when the component mounts

  const handle_hydrate = async () => {
    try {
      const result = await Hydrate(); // Call hydrate API to turn on motor
      if (result.status === "success") {
        console.log("Hydration started");
        setLastWaterTime(new Date().toLocaleTimeString()); // Update the last water time
        setIsHydrating(true); // Start the hydration process

        // After 20 seconds, set hydration state back to false
        setTimeout(() => {
          setIsHydrating(false);
        }, 20000); // 20 seconds delay
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
        value={soilMoisture ?? 0}
        max={100}
      ></progress>
      <p className="text-gray-600 mb-1">Soil moisture</p>
      <p className="text-sm text-green-600 font-semibold">{moisture}</p>

      {/* Display environment data */}
      <div className="mt-4 text-gray-600">
        <p>
          Temperature:{" "}
          <span className="text-blue-500">{temperature ?? "Loading..."}</span>{" "}
          °C
        </p>
        <p>
          Humidity:{" "}
          <span className="text-blue-500">{humidity ?? "Loading..."}</span> %
        </p>
        <p>
          Last Water Time:{" "}
          <span className="text-blue-500">{lastWaterTime}</span>
        </p>
        <p>
          Timestamp:{" "}
          <span className="text-blue-500">{timestamp ?? "Loading..."}</span>
        </p>
      </div>

      <button
        onClick={handle_hydrate}
        className={`mt-6 px-4 py-2 ${
          isHydrating ? "bg-gray-500" : "bg-blue-500"
        } text-white rounded-md hover:bg-blue-600 flex items-center`}
        disabled={isHydrating} // Disable the button while hydrating
      >
        <FaWater className="mr-2" />
        {isHydrating ? "Hydrating..." : "Hydrate"}
      </button>
    </div>
  );
};

export default Card;
