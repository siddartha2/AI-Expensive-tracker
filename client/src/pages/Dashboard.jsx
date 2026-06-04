import ExpenseChart from "../components/ExpenseChart";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import API from "../services/api";
import AnalyticsCard from "../components/AnalyticsCard";
import MonthlyTrendChart from "../components/MonthlyTrendChart";


function Dashboard() {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
  });

  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchSummary();
    fetchExpenses();
  }, []);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/expenses/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      (expense.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
  
      (expense.category || "")
        .toLowerCase()
        .includes(search.toLowerCase());
  
    const matchesFilter =
      filter === "All" ||
      expense.category === filter;
  
    return matchesSearch && matchesFilter;
  });

  const totalAmount = expenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );
  
  const averageExpense =
    expenses.length > 0
      ? Math.round(totalAmount / expenses.length)
      : 0;
  
  const categoryTotals = {};
  
  expenses.forEach((expense) => {
    const category = expense.category || "Other";
  
    if (categoryTotals[category]) {
      categoryTotals[category] += Number(expense.amount);
    } else {
      categoryTotals[category] = Number(expense.amount);
    }
  });
  
  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b]
            ? a
            : b
        )
      : "None";

  return (
    
    <div className="flex bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full"></div>

      <Sidebar />

      <div className="flex-1 relative z-10">
        <Navbar />

        <div className="p-8">
          <h1 className="text-white text-5xl font-bold mb-3">
            Financial Overview
          </h1>

          <p className="text-gray-400 mb-10 text-lg">
            AI-powered expense insights dashboard
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard
              title="Total Expenses"
              value={`₹${summary.totalExpenses}`}
              color="text-white"
              gradient="bg-gradient-to-br from-cyan-500 to-blue-700"
            />

            <SummaryCard
              title="Transactions"
              value={summary.totalTransactions}
              color="text-white"
              gradient="bg-gradient-to-br from-purple-500 to-indigo-700"
            />
          </div>


          {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            <AnalyticsCard
              title="Average Expense"
              value={`₹${averageExpense}`}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
            />

            <AnalyticsCard
              title="Top Spending Category"
              value={topCategory}
              gradient="bg-gradient-to-br from-pink-500 to-rose-700"
            />

            </div>

          {/* AI Insight */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">
            <h2 className="text-3xl text-white font-bold mb-6">
              AI Insight
            </h2>

            <p className="text-gray-300 text-lg leading-8">
              Your spending habits are improving steadily 🚀
              <br />
              Food expenses decreased by 12% this week.
              <br />
              AI predicts you can save ₹3,500 this month.
            </p>
          </div>



          {/* Expense Form */}
          <ExpenseForm fetchExpenses={fetchExpenses} />


          {/* Search Bar */}
          <div className="mt-10 bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none placeholder:text-gray-500"
            />

            {/* FILTER */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-1/3 bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
            >
              <option value="All">All Categories</option>

              <option value="Food">Food</option>

              <option value="Travel">Travel</option>

              <option value="Shopping">Shopping</option>

              <option value="Bills">Bills</option>
            </select>
          </div>

          {/* Expense List */}
          <ExpenseList
            expenses={filteredExpenses}
            fetchExpenses={fetchExpenses}
          />

          <ExpenseChart expenses={expenses} />
          <MonthlyTrendChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;