import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";
  
  import { Pie } from "react-chartjs-2";
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  function ExpenseChart({ expenses }) {
    const categoryMap = {};
  
    expenses.forEach((expense) => {
      const category = expense.category || "Other";
  
      const amount = Number(expense.amount);
  
      if (categoryMap[category]) {
        categoryMap[category] += amount;
      } else {
        categoryMap[category] = amount;
      }
    });
  
    const data = {
      labels: Object.keys(categoryMap),
  
      datasets: [
        {
          label: "Expenses",
  
          data: Object.values(categoryMap),
  
          backgroundColor: [
            "#06B6D4",
            "#8B5CF6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
          ],
  
          borderWidth: 2,
        },
      ],
    };
  
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-10 backdrop-blur-lg shadow-2xl">
        <h2 className="text-white text-3xl font-bold mb-8">
          Expense Analytics
        </h2>
  
        <div className="w-full max-w-md mx-auto">
          <Pie data={data} />
        </div>
      </div>
    );
  }
  
  export default ExpenseChart;