import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useContext } from "react";
import ThemeContext from "../context/ThemeStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MonthlyTrendChart({ expenses }) {
  const { theme } = useContext(ThemeContext);
  const chartTextColor = theme === "dark" ? "#d8e7d8" : "#52645a";
  const chartAccent = theme === "dark" ? "#b9df87" : "#1a5f49";
  const monthlyTotals = {};

  expenses.forEach((expense) => {
    const month = new Date(
      expense.createdAt
    ).toLocaleDateString("en-IN", {
      month: "short",
    });

    monthlyTotals[month] =
      (monthlyTotals[month] || 0) +
      Number(expense.amount);
  });

  const labels = Object.keys(monthlyTotals);

  const amounts = Object.values(monthlyTotals);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: amounts,
        borderColor: chartAccent,
        backgroundColor: chartAccent,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: chartTextColor,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: chartTextColor,
        },
      },

      y: {
        ticks: {
          color: chartTextColor,
        },
      },
    },
  };



  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-10 backdrop-blur-lg shadow-2xl">
      <h2 className="text-white text-3xl font-bold mb-6">
        Monthly Trend
      </h2>

      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default MonthlyTrendChart;