import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "../Type/Options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const BarChart = () => {
  // Chart Data
  const data = {
    labels: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"], // Time labels
    datasets: [
      {
        label: "Temperature (°C)",
        data: [22, 24, 26, 23, 25], // Temperature values
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Semi-transparent red
        borderColor: "rgba(255, 99, 132, 1)", // Red border
        borderWidth: 1,
      },
      {
        label: "Humidity (%)",
        data: [55, 60, 58, 62, 59], // Humidity values
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Semi-transparent blue
        borderColor: "rgba(54, 162, 235, 1)", // Blue border
        borderWidth: 1,
      },
    ],
  };
  // Chart Options
  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Temperature and Humidity Comparison",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Weather Data</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
