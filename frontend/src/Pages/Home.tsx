import React, { useEffect, useState } from "react";
import { IoIosBatteryCharging } from "react-icons/io";
import { Chart } from "../Component/Chart";
import { Environment, weatherData } from "../Type/Environmental";
import Card from "../Component/Card";
import { Weather } from "../endpoints/api";
import { willItRain } from "../logic/Rain";

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState<weatherData | null>(
    null
  );
  const [rain, setRain] = useState<string>("");

  const weatherapi = async () => {
    const data = await Weather();
    setCurrentWeather(data);
  };

  useEffect(() => {
    weatherapi();
  }, []);

  useEffect(() => {
    if (currentWeather) {
      const rainPrediction = willItRain(
        currentWeather.current.humidity,
        currentWeather.current.temp_f,
        currentWeather.current.condition.text
      );
      setRain(rainPrediction);
    }
  }, [currentWeather]);

  const dummyData: Environment[] = [
    {
      temperature: 22.5,
      humidity: 60,
      timestamp: new Date(Date.now() - 1000000),
    },
    {
      temperature: 23.1,
      humidity: 58,
      timestamp: new Date(Date.now() - 800000),
    },
    {
      temperature: 24.0,
      humidity: 57,
      timestamp: new Date(Date.now() - 600000),
    },
    {
      temperature: 25.3,
      humidity: 56,
      timestamp: new Date(Date.now() - 400000),
    },
    {
      temperature: 26.1,
      humidity: 55,
      timestamp: new Date(Date.now() - 200000),
    },
    { temperature: 27.0, humidity: 54, timestamp: new Date(Date.now()) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header Section */}
      <div className="bg-[#16423C] text-white p-3  shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2 flex justify-center font-sans">
          Plant Hydration
        </h2>
        <p className="text-lg flex flex-row-reverse items-center gap-4">
          <IoIosBatteryCharging />
          <span className="font-semibold">85%</span>
        </p>

        {currentWeather ? (
          <>
            <p className="text-lg flex flex-row-reverse">
              {currentWeather.current.temp_c}°C ({currentWeather.current.temp_f}
              °F)
            </p>
            <p className="text-lg">
              Condition: {currentWeather.current.condition.text}
            </p>
          </>
        ) : (
          <p className="text-lg">Loading...</p>
        )}
        <p className="text-lg">
          Rain Probability: <span className="font-semibold">{rain}</span>
        </p>
      </div>

      {/* Card Section */}
      <div className="mb-6">
        <Card />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Environmental Data
        </h2>
        <Chart data={dummyData} />
      </div>
    </div>
  );
};

export default Home;
