import { useEffect, useState } from "react";
import { Data } from "../endpoints/api"; // Your Data API endpoint
import { Chart } from "./Chart"; // Import the Chart component
import { Environment } from "../Type/Environmental"; // Assuming you have an Environment type

const EnvironmentChart = () => {
  const [environmentData, setEnvironmentData] = useState<Environment[]>([]);

  useEffect(() => {
    // Function to fetch data from the Data API
    const fetchData = async () => {
      try {
        const result = await Data(); // Assuming Data() returns the environmental data
        setEnvironmentData(result); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching environment data:", error);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array to only run on mount

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
      {environmentData.length > 0 ? (
        <Chart data={environmentData} />
      ) : (
        <p>Loading data...</p> // Show a loading message while data is being fetched
      )}
    </div>
  );
};

export default EnvironmentChart;
