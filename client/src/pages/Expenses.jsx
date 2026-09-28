import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryCard from "../components/SummaryCard";
import ExportButton from "../components/ExportButton";
import API from "../services/api";
import PastMonthsHistory from "../components/PastMonthsHistory";
import { motion } from "framer-motion";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredAndSortedExpenses = useMemo(() => {
    let result = expenses.filter((expense) => {
      const matchesSearch =
        (expense.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (expense.category || "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || expense.category === filter;
      return matchesSearch && matchesFilter;
    });

    switch (sort) {
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        result.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      case "lowest":
        result.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return result;
  }, [expenses, search, filter, sort]);

  // Derived values for summary cards
  const totalExpenses = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  
  const now = new Date();
  const currentMonthExpenses = expenses.filter(expense => {
    const d = new Date(expense.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = currentMonthExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

  const averageExpense = expenses.length > 0 ? Math.round(totalExpenses / expenses.length) : 0;
  
  const highestExpense = expenses.length > 0 
    ? expenses.reduce((prev, current) => Number(prev.amount) > Number(current.amount) ? prev : current).amount
    : 0;

  return (
    <div className="flex bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <div className="p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4"
          >
            <div>
              <h1 className="text-white text-4xl font-bold mb-2">Expenses</h1>
              <p className="text-gray-400">Track and manage your spending.</p>
            </div>
            <ExportButton expenses={filteredAndSortedExpenses} />
          </motion.div>

          {/* Summary Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <SummaryCard
              title="Total Expenses"
              value={`₹${totalExpenses}`}
              color="text-white"
              gradient="bg-gradient-to-br from-cyan-500 to-blue-700"
            />
            <SummaryCard
              title="This Month"
              value={`₹${thisMonthTotal}`}
              color="text-white"
              gradient="bg-gradient-to-br from-purple-500 to-indigo-700"
            />
            <SummaryCard
              title="Average Expense"
              value={`₹${averageExpense}`}
              color="text-white"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
            />
            <SummaryCard
              title="Highest Expense"
              value={`₹${highestExpense}`}
              color="text-white"
              gradient="bg-gradient-to-br from-pink-500 to-rose-700"
            />
          </motion.div>

          <ExpenseForm fetchExpenses={fetchExpenses} />

          {/* Filters & Sorting */}
          <div className="mt-10 bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:flex-1 bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none placeholder:text-gray-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-48 bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          {/* Loading / Error States */}
          {isLoading ? (
            <div className="mt-10 flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="mt-10 bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
              {error}
            </div>
          ) : (
            <>
              <ExpenseList
                expenses={filteredAndSortedExpenses}
                fetchExpenses={fetchExpenses}
              />

              {/* Past Months History */}
              <PastMonthsHistory expenses={expenses} />
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Expenses;