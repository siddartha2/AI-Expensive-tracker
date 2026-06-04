import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  function MonthlyTrendChart({ expenses }) {
    const chartData = expenses.map((expense) => ({
      date: new Date(expense.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      ),
      amount: Number(expense.amount),
    }));
  
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-10 backdrop-blur-lg shadow-2xl">
        <h2 className="text-white text-3xl font-bold mb-8">
          Monthly Trend
        </h2>
  
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
  
              <XAxis dataKey="date" />
  
              <YAxis />
  
              <Tooltip />
  
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#06B6D4"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  
  export default MonthlyTrendChart;