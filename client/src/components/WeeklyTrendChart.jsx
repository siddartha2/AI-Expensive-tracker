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

function WeeklyTrendChart({ expenses }) {
    const { theme } = useContext(ThemeContext);
    const chartTextColor = theme === "dark" ? "#d8e7d8" : "#52645a";
    const chartAccent = theme === "dark" ? "#b9df87" : "#1a5f49";
    const weekDays = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
    };

    expenses.forEach((expense) => {
        const day = new Date(
            expense.createdAt
        ).toLocaleDateString("en-US", {
            weekday: "short",
        });

        if (weekDays[day] !== undefined) {
            weekDays[day] += Number(expense.amount);
        }
    });

    const data = {
        labels: Object.keys(weekDays),

        datasets: [
            {
                label: "Weekly Spending",
                data: Object.values(weekDays),
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
                Weekly Spending Trend
            </h2>

            <Line
                data={data}
                options={options}
            />
        </div>
    );
}

export default WeeklyTrendChart;