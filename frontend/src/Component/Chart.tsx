import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Environment } from "../Type/Environmental";

interface ChartEnvironment {
  data: Environment[];
}

export function Chart({ data }: ChartEnvironment) {
  const chartData = {
    //HEre by labels i mean the variable shown in x axis
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature), //ya temeprature values aauxa
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Semi-transparent red
        borderColor: "rgba(255, 99, 132, 1)", // Red border
        borderWidth: 1,
      },
      {
        label: "Humidity (%)",
        data: data.map((d) => d.humidity), // Humidity values
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Semi-transparent blue
        borderColor: "rgba(54, 162, 235, 1)", // Blue border
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "24-Hour Environmental Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Weather Data</h2>
      <Line options={options} data={chartData} />
    </div>
  );
}
