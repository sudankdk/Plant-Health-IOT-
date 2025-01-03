import axios from "axios";

export const Weather = async () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; //   console.log(apiKey);
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=ITAHARI&aqi=no`;

  try {
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};
