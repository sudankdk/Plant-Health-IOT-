import { useEffect, useState } from "react";
import { IoIosBatteryCharging } from "react-icons/io";
import {  weatherData } from "../Type/Environmental";
import Card from "../Component/Card";
import { Weather } from "../endpoints/api";
import { willItRain } from "../logic/Rain";
import plantHydraLogo from "../assets/Plant Hydra.png";
import EnvironmentChart from "../Component/EnvironmentChart";

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
        <h2 className="text-xl  font-bold mb-4 text-center">
          Environmental Data
        </h2>
        {/* <Chart data={dummyData} /> */}
        <EnvironmentChart />
      </section>
    </div>
  );
};

export default Home;
