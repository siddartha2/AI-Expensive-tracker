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
import BudgetGoalCard from "../components/BudgetGoalCard";
import EditBudgetModal from "../components/EditBudgetModal";
import BudgetAlert from "../components/BudgetAlert";
import CategoryPieChart from "../components/CategoryPieChart";
import RecentTransactions from "../components/RecentTransactions";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import ExportButton from "../components/ExportButton";
import AIChatbot from "../components/AIChatbot";
import SavingsGoalPlanner from "../components/SavingsGoalPlanner";
import { motion } from "framer-motion";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
  });

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budget, setBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses/summary", {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data.monthlyBudget || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchSummary(), fetchExpenses(), fetchBudget()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      (expense.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (expense.category || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || expense.category === filter;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());

  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const currentWeekExpenses = expenses.filter(
    (expense) => new Date(expense.createdAt) >= startOfWeek
  );
  const lastWeekExpenses = expenses.filter((expense) => {
    const date = new Date(expense.createdAt);
    return date >= lastWeekStart && date < startOfWeek;
  });

  const currentWeekTotal = currentWeekExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const lastWeekTotal = lastWeekExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const averageExpense = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;

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
      ? Object.keys(categoryTotals).reduce((a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b))
      : "None";

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((prev, current) => (Number(prev.amount) > Number(current.amount) ? prev : current))
      : null;

  return (
    <div className="flex bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Futuristic Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/15 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/15 blur-[150px] rounded-full pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8"
          >
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                Neural Dashboard
              </h1>
              <p className="text-cyan-200/70 text-lg">AI-powered financial analytics and insights</p>
            </div>
            <ExportButton expenses={expenses} />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-8"
            >
              {/* Top Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                  title="Total Processed"
                  value={`₹${summary.totalExpenses}`}
                  color="text-white"
                  gradient="bg-gradient-to-br from-cyan-600 to-blue-800 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/20"
                />
                <SummaryCard
                  title="Transactions Logged"
                  value={summary.totalTransactions}
                  color="text-white"
                  gradient="bg-gradient-to-br from-purple-600 to-indigo-800 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-400/20"
                />
                <SummaryCard
                  title="Average Vector"
                  value={`₹${averageExpense}`}
                  color="text-white"
                  gradient="bg-gradient-to-br from-emerald-600 to-teal-800 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20"
                />
                <SummaryCard
                  title="Peak Expenditure"
                  value={highestExpense ? `₹${highestExpense.amount}` : "₹0"}
                  color="text-white"
                  gradient="bg-gradient-to-br from-rose-600 to-red-800 shadow-[0_0_15px_rgba(225,29,72,0.3)] border border-rose-400/20"
                />
              </div>

              {/* Main 3-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left/Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Futuristic AI Insight Card */}
                  <div className="bg-[#1E293B]/40 border border-cyan-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                      <svg className="w-16 h-16 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-bold mb-4 flex items-center gap-3">
                      Core System Analysis
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed z-10 relative">
                      {totalAmount >= budget * 0.9 ? (
                        <>⚠️ CRITICAL: Budget threshold breached. Limit reached.<br/>Primary drain node: <strong className="text-rose-400">{topCategory}</strong></>
                      ) : totalAmount >= budget * 0.7 ? (
                        <>📊 WARNING: System operating at <strong className="text-orange-400">{Math.round((totalAmount / budget) * 100)}%</strong> capacity. Monitor reserves.</>
                      ) : (
                        <>✅ OPTIMAL: Parameters nominal.<br/>Available reserves: <strong className="text-emerald-400">₹{budget - totalAmount}</strong> for cycle.</>
                      )}
                    </p>
                  </div>

                  <ExpenseForm fetchExpenses={fetchExpenses} />
                  
                  {/* Search and Filters */}
                  <div className="bg-[#1E293B]/40 border border-white/10 backdrop-blur-xl rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <input
                      type="text"
                      placeholder="Query database..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full sm:w-2/3 bg-[#0F172A] border border-cyan-500/20 text-white p-4 rounded-2xl outline-none placeholder:text-gray-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                    />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full sm:w-1/3 bg-[#0F172A] border border-cyan-500/20 text-white p-4 rounded-2xl outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-pointer"
                    >
                      <option value="All">All Sectors</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                    </select>
                  </div>

                  <ExpenseList expenses={filteredExpenses} fetchExpenses={fetchExpenses} />
                </div>

                {/* Right Sidebar Column (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                  <BudgetGoalCard budget={budget} spent={totalAmount} onEdit={() => setShowBudgetModal(true)} />
                  {totalAmount >= budget * 0.7 && <BudgetAlert budget={budget} spent={totalAmount} />}
                  
                  <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-cyan-500/30 transition-colors">
                    <h3 className="text-white text-xl font-bold mb-4">Sector Breakdown</h3>
                    <CategoryPieChart expenses={expenses} />
                  </div>

                  <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/30 transition-colors">
                    <h3 className="text-white text-xl font-bold mb-4">Temporal Trend</h3>
                    <WeeklyTrendChart expenses={expenses} />
                  </div>
                </div>
              </div>

              {/* Full Width Charts */}
              <div className="grid grid-cols-1 gap-8 pt-4">
                <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-blue-500/30 transition-colors">
                  <h3 className="text-white text-xl font-bold mb-4">Macro Timeline</h3>
                  <MonthlyTrendChart expenses={expenses} />
                </div>
              </div>

              {/* AI Savings Goal Planner */}
              <div className="pt-4">
                <SavingsGoalPlanner expenses={expenses} />
              </div>
            </motion.div>
          )}

          {showBudgetModal && (
            <EditBudgetModal
              currentBudget={budget}
              onClose={() => setShowBudgetModal(false)}
              onSave={async (newBudget) => {
                try {
                  const token = localStorage.getItem("token");
                  await API.post("/budget", { monthlyBudget: newBudget }, { headers: { Authorization: `Bearer ${token}` } });
                  setBudget(newBudget);
                  setShowBudgetModal(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          )}

          {/* AI Chatbot Floating Widget */}
          {!isLoading && <AIChatbot expenses={expenses} budget={budget} />}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;