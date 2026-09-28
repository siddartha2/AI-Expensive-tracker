import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import ThemeContext from "../context/ThemeStore";

function CategoryPieChart({ expenses }) {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const categoryTotals = {};

    expenses.forEach((expense) => {
        const category =
            expense.category || "Other";

        categoryTotals[category] =
            (categoryTotals[category] || 0) +
            Number(expense.amount);
    });

    const data = Object.keys(categoryTotals).map(
        (category) => ({
            name: category,
            value: categoryTotals[category],
        })
    );

    const COLORS = [
        "#1A5F49",
        "#4D8A62",
        "#83A956",
        "#2D8878",
        "#B5A84E",
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-10">
            <h2 className="text-white text-2xl font-bold mb-6">
                Category Breakdown
            </h2>

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                    index % COLORS.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            borderColor: isDark ? "#2b493b" : "#dce5df",
                            borderRadius: 8,
                            backgroundColor: isDark ? "#17362b" : "#ffffff",
                            color: isDark ? "#eff6ed" : "#1d2b23",
                        }}
                        itemStyle={{ color: isDark ? "#eff6ed" : "#1d2b23" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategoryPieChart;