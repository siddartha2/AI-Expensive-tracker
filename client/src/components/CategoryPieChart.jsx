import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function CategoryPieChart({ expenses }) {
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
        "#06B6D4",
        "#8B5CF6",
        "#EC4899",
        "#10B981",
        "#F59E0B",
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

                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategoryPieChart;