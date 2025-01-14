import axios from "axios";

export const Weather = async () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=ITAHARI&aqi=no`;

  try {
    const response = await axios.get(apiUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export const Hydrate = async () => {
  try {
    // Send POST request to the API
    const API_URL = "http://your-django-api-endpoint.com/api/hydrate/";
    const response = await axios.post(API_URL);

    // Return the API response data
    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error("Error in hydrate function:", error);

    // Return a fallback error message or throw it for further handling
    throw new Error("Failed to send hydration request. Please try again.");
  }
};
