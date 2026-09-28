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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function WeeklyTrendChart({ expenses }) {
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
                borderColor: "#8B5CF6",
                backgroundColor: "#8B5CF6",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: "white",
                },
            },
        },

        scales: {
            x: {
                ticks: {
                    color: "white",
                },
            },

            y: {
                ticks: {
                    color: "white",
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