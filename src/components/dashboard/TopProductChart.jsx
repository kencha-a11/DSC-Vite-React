import React, { useRef, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopProductsChart({ topProducts = { labels: [], data: [] } }) {
  const chartRef = useRef(null);

  // Clean up old chart instance
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    labels: topProducts.labels,
    datasets: [
      {
        label: "Sold",
        data: topProducts.data,
        backgroundColor: "#a78bfa",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } },
  };

  return <Bar ref={chartRef} data={data} options={options} />;
}
