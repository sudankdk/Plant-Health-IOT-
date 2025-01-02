import React, { useEffect, useState } from "react";
import { IoIosBatteryCharging } from "react-icons/io";
import { Chart } from "../Component/Chart";
import { Environment, weatherData } from "../Type/Environmental";
import Card from "../Component/Card";
import { Weather } from "../endpoints/api";
import { willItRain } from "../logic/Rain";
import plantHydraLogo from "../assets/Plant Hydra.png";

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState<weatherData | null>(
    null
  );
  const [rain, setRain] = useState<string>("");

  const weatherapi = async () => {
    try {
      const data = await Weather();
      setCurrentWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-[#16423C] text-white p-4 shadow-md mb-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src={plantHydraLogo}
            alt="Plant Hydra Logo"
            className="p-2 rounded-full h-20 w-20 shadow-lg border-2 border-white"
          />
          <h2 className="text-2xl font-bold ml-4">Plant Hydration</h2>
        </div>

        {/* Info Section */}
        <div className="text-right">
          <p className="text-lg flex items-center justify-end gap-2">
            <IoIosBatteryCharging />
            <span className="font-semibold">85%</span>
          </p>
          <p className="text-lg">
            {currentWeather ? (
              <>
                {currentWeather.current.temp_c}°C (
                {currentWeather.current.temp_f}
                °F)
              </>
            ) : (
              <span className="animate-pulse">Loading...</span>
            )}
          </p>
          {rain && <p className="text-lg font-semibold">{rain}</p>}
        </div>
      </header>

      {/* Card Section */}
      <section className="mb-6">
        <Card />
      </section>

      {/* Chart Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Environmental Data
        </h2>
        <Chart data={dummyData} />
      </section>
    </div>
  );
};

export default Home;
