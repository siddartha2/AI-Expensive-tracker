import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditBudgetModal from "../components/EditBudgetModal";
import API from "../services/api";
import { motion } from "framer-motion";

function Budgets() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const [budgetRes, expensesRes] = await Promise.all([
        API.get("/budget", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/expenses", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setBudget(budgetRes.data.monthlyBudget || 0);
      setExpenses(expensesRes.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (newBudget) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/budget",
        { monthlyBudget: newBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(newBudget);
      setShowBudgetModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate current month's expenses
  const spentThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(expense => {
      const d = new Date(expense.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return currentMonthExpenses.reduce((acc, item) => acc + Number(item.amount), 0);
  }, [expenses]);

  const percentage = budget > 0 ? Math.min((spentThisMonth / budget) * 100, 100) : 0;
  const remaining = budget > 0 ? budget - spentThisMonth : 0;

  // Determine state
  let statusColor = "bg-emerald-500";
  let statusText = "Healthy";
  let statusMessage = "You are spending well within your limits.";
  let statusTextColor = "text-emerald-400";

  if (percentage >= 90) {
    statusColor = "bg-red-500";
    statusText = "Near budget limit";
    statusMessage = "Warning! You have almost exhausted your monthly budget.";
    statusTextColor = "text-red-400";
  } else if (percentage >= 70) {
    statusColor = "bg-orange-500";
    statusText = "Approaching limit";
    statusMessage = "Monitor your spending carefully.";
    statusTextColor = "text-orange-400";
  }

  return (
    <div className="flex bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <div className="p-8 max-w-5xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-white text-4xl font-bold mb-2">Budgets</h1>
            <p className="text-gray-400">Manage your monthly spending limits.</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                  <h2 className="text-white text-2xl font-bold">Monthly Budget Overview</h2>
                  <p className={`mt-2 font-medium ${statusTextColor}`}>{statusText} — {statusMessage}</p>
                </div>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  {budget > 0 ? "Update Budget" : "Set Budget"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#1E293B] border border-white/5 p-6 rounded-2xl">
                  <p className="text-gray-400 mb-1">Monthly Limit</p>
                  <p className="text-3xl text-white font-bold">₹{budget}</p>
                </div>
                <div className="bg-[#1E293B] border border-white/5 p-6 rounded-2xl">
                  <p className="text-gray-400 mb-1">Spent This Month</p>
                  <p className="text-3xl text-white font-bold">₹{spentThisMonth}</p>
                </div>
                <div className="bg-[#1E293B] border border-white/5 p-6 rounded-2xl">
                  <p className="text-gray-400 mb-1">Remaining</p>
                  <p className={`text-3xl font-bold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    ₹{remaining}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span className="text-white">Usage</span>
                  <span className="text-white">{percentage.toFixed(1)}%</span>
                </div>
                
                {/* Animated Progress Bar */}
                <div className="w-full h-6 bg-[#1E293B] rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${statusColor} relative`}
                  >
                    <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {showBudgetModal && (
            <EditBudgetModal
              currentBudget={budget}
              onClose={() => setShowBudgetModal(false)}
              onSave={handleSaveBudget}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Budgets;