import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";

function PastMonthsHistory({ expenses }) {
  // Group expenses by "YYYY-MM" key
  const monthlyData = useMemo(() => {
    const grouped = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = { expenses: [], total: 0, count: 0 };
      }
      grouped[key].expenses.push(expense);
      grouped[key].total += Number(expense.amount);
      grouped[key].count += 1;
    });

    // Sort keys descending (newest first)
    const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      const label = format(new Date(Number(year), Number(month) - 1, 1), "MMMM yyyy");
      const categories = {};
      grouped[key].expenses.forEach((e) => {
        categories[e.category] = (categories[e.category] || 0) + Number(e.amount);
      });
      const topCategory = Object.keys(categories).length > 0
        ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
        : "None";

      return {
        key,
        label,
        total: grouped[key].total,
        count: grouped[key].count,
        expenses: grouped[key].expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        topCategory,
        categories,
      };
    });
  }, [expenses]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "food": return "bg-orange-500/20 text-orange-400";
      case "travel": return "bg-blue-500/20 text-blue-400";
      case "shopping": return "bg-pink-500/20 text-pink-400";
      case "bills": return "bg-purple-500/20 text-purple-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  if (monthlyData.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
        <FaCalendarAlt className="text-cyan-400" />
        Monthly History
      </h2>

      {/* Month Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {monthlyData.map((month, idx) => {
          const isNow = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") === month.key;
          return (
            <motion.button
              key={month.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                selectedIndex === idx
                  ? "bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "bg-[#1E293B]/50 border-white/10 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-bold text-lg">{month.label}</p>
                  <p className="text-gray-400 text-sm">{month.count} transaction{month.count !== 1 ? "s" : ""}</p>
                </div>
                {isNow && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
              <p className="text-cyan-400 text-2xl font-extrabold">₹{month.total.toLocaleString("en-IN")}</p>
              <p className="text-gray-500 text-xs mt-2">Top: {month.topCategory}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Month Detail */}
      <AnimatePresence>
        {selectedIndex !== null && monthlyData[selectedIndex] && (
          <motion.div
            key={monthlyData[selectedIndex].key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h3 className="text-white text-xl font-bold">
                  {monthlyData[selectedIndex].label} — Breakdown
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedIndex(Math.min(selectedIndex + 1, monthlyData.length - 1))}
                    disabled={selectedIndex >= monthlyData.length - 1}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-gray-400 text-sm">
                    {selectedIndex + 1} / {monthlyData.length}
                  </span>
                  <button
                    onClick={() => setSelectedIndex(Math.max(selectedIndex - 1, 0))}
                    disabled={selectedIndex <= 0}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              {/* Category Summary Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {Object.entries(monthlyData[selectedIndex].categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => {
                    const pct = Math.round((amount / monthlyData[selectedIndex].total) * 100);
                    return (
                      <div key={cat} className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(cat)}`}>
                            {cat}
                          </span>
                          <span className="text-white font-bold">₹{amount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-cyan-500 rounded-full"
                          />
                        </div>
                        <p className="text-gray-500 text-xs mt-1 text-right">{pct}%</p>
                      </div>
                    );
                  })}
              </div>

              {/* Expense List for that month */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {monthlyData[selectedIndex].expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex justify-between items-center bg-[#0F172A]/60 border border-white/5 p-4 rounded-xl hover:bg-[#0F172A] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{expense.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {format(new Date(expense.createdAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>
                    <p className="text-cyan-400 font-bold text-lg ml-4 whitespace-nowrap">₹{Number(expense.amount).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PastMonthsHistory;
