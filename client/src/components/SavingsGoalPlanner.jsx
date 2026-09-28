import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBullseye, FaPiggyBank, FaCalendarAlt, FaRocket, FaChevronDown, FaChevronUp, FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa";

function SavingsGoalPlanner({ expenses }) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalCost, setGoalCost] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [calculated, setCalculated] = useState(null);

  // Current month's total expenses (what the user actually spent THIS month in the app)
  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((acc, e) => acc + Number(e.amount), 0);
  }, [expenses]);

  // Category breakdown for current month
  const currentMonthCategories = useMemo(() => {
    const now = new Date();
    const cats = {};
    expenses
      .filter((e) => {
        const d = new Date(e.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .forEach((e) => {
        cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
      });
    return Object.entries(cats).sort(([, a], [, b]) => b - a);
  }, [expenses]);

  const topCategory = currentMonthCategories.length > 0 ? currentMonthCategories[0][0] : "None";
  const topCategoryAmount = currentMonthCategories.length > 0 ? currentMonthCategories[0][1] : 0;

  const handleCalculate = () => {
    const cost = Number(goalCost);
    const income = Number(monthlyIncome);

    if (!goalName || cost <= 0 || income <= 0) return;

    const monthlySavings = income - currentMonthTotal;
    const spendingPercent = Math.round((currentMonthTotal / income) * 100);

    // Aggressive plan: cut top category by 30%
    const cutAmount = Math.round(topCategoryAmount * 0.3);
    const aggressiveSavings = monthlySavings + cutAmount;

    if (monthlySavings <= 0) {
      setCalculated({
        goalName,
        goalCost: cost,
        income,
        spent: currentMonthTotal,
        monthlySavings: 0,
        spendingPercent,
        months: Infinity,
        aggressiveMonths: aggressiveSavings > 0 ? Math.ceil(cost / aggressiveSavings) : Infinity,
        aggressiveSavings: Math.max(aggressiveSavings, 0),
        cutAmount,
        possible: false,
        topCategory,
        topCategoryAmount,
        categories: currentMonthCategories,
      });
    } else {
      const months = Math.ceil(cost / monthlySavings);
      const aggressiveMonths = aggressiveSavings > 0 ? Math.ceil(cost / aggressiveSavings) : months;

      setCalculated({
        goalName,
        goalCost: cost,
        income,
        spent: currentMonthTotal,
        monthlySavings,
        spendingPercent,
        months,
        aggressiveMonths,
        aggressiveSavings,
        cutAmount,
        possible: true,
        topCategory,
        topCategoryAmount,
        categories: currentMonthCategories,
      });
    }
  };

  const getTargetDate = (months) => {
    if (!isFinite(months)) return "—";
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  };

  const formatINR = (n) => Number(n).toLocaleString("en-IN");

  return (
    <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0F172A]/60 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.08)] overflow-hidden">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <FaBullseye className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-white text-xl font-bold group-hover:text-emerald-400 transition-colors">
              AI Savings Goal Planner
            </h3>
            <p className="text-gray-400 text-sm">Plan your next big purchase based on your real spending</p>
          </div>
        </div>
        <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 space-y-6">
              {/* Current Month Spending Reality */}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Your Spending This Month (from app data)</p>
                <div className="flex items-center gap-3">
                  <FaWallet className="text-cyan-400 text-2xl" />
                  <span className="text-white text-3xl font-extrabold">₹{formatINR(currentMonthTotal)}</span>
                </div>
                {currentMonthCategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentMonthCategories.map(([cat, amt]) => (
                      <span key={cat} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full">
                        {cat}: ₹{formatINR(amt)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">What do you want to buy?</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Enfield Bike"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/10 text-white p-4 rounded-2xl outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">How much does it cost? (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 200000"
                    value={goalCost}
                    onChange={(e) => setGoalCost(e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/10 text-white p-4 rounded-2xl outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Your monthly income (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 30000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/10 text-white p-4 rounded-2xl outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={!goalName || !goalCost || !monthlyIncome}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <FaRocket /> Calculate My Savings Plan
              </button>

              {/* Results */}
              <AnimatePresence>
                {calculated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-6"
                  >
                    {/* Income vs Expense Breakdown Bar */}
                    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6">
                      <h4 className="text-white font-bold mb-4">Monthly Money Flow</h4>
                      <div className="space-y-4">
                        {/* Income */}
                        <div className="flex items-center gap-4">
                          <FaArrowDown className="text-emerald-400 shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Income</span>
                              <span className="text-emerald-400 font-bold">₹{formatINR(calculated.income)}</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Expenses */}
                        <div className="flex items-center gap-4">
                          <FaArrowUp className="text-rose-400 shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">This Month's Expenses</span>
                              <span className="text-rose-400 font-bold">₹{formatINR(calculated.spent)} ({calculated.spendingPercent}%)</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(calculated.spendingPercent, 100)}%` }}
                                transition={{ duration: 0.8 }}
                                className={`h-full rounded-full ${calculated.spendingPercent > 90 ? 'bg-rose-500' : calculated.spendingPercent > 70 ? 'bg-orange-500' : 'bg-rose-400'}`}
                              ></motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Savings */}
                        <div className="flex items-center gap-4">
                          <FaPiggyBank className={`shrink-0 ${calculated.monthlySavings > 0 ? 'text-cyan-400' : 'text-gray-500'}`} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">You Can Save</span>
                              <span className={`font-bold ${calculated.monthlySavings > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                {calculated.monthlySavings > 0 ? `₹${formatINR(calculated.monthlySavings)}` : `₹0 (Over budget!)`}
                              </span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(100 - calculated.spendingPercent, 0)}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-full bg-cyan-500 rounded-full"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Result Message */}
                    <div className={`rounded-2xl p-6 border ${calculated.possible ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                      <h4 className="text-white text-lg font-bold mb-2">
                        {calculated.possible
                          ? `🎯 You can buy "${calculated.goalName}" in ~${calculated.months} months!`
                          : `⚠️ You're spending more than you earn this month.`}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {calculated.possible ? (
                          <>
                            You earn <strong className="text-emerald-400">₹{formatINR(calculated.income)}</strong> and 
                            spend <strong className="text-rose-400">₹{formatINR(calculated.spent)}</strong> this month. 
                            That leaves <strong className="text-cyan-400">₹{formatINR(calculated.monthlySavings)}/month</strong> for savings. 
                            At this rate, you'll reach ₹{formatINR(calculated.goalCost)} by <strong className="text-white">{getTargetDate(calculated.months)}</strong>.
                          </>
                        ) : (
                          <>
                            Your expenses this month (₹{formatINR(calculated.spent)}) exceed your income (₹{formatINR(calculated.income)}). 
                            You need to cut <strong className="text-white">₹{formatINR(calculated.spent - calculated.income)}</strong> from 
                            your spending before you can start saving. Start with <strong className="text-orange-400">{calculated.topCategory}</strong> (₹{formatINR(calculated.topCategoryAmount)}/month).
                          </>
                        )}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 text-center">
                        <FaPiggyBank className="text-emerald-400 mx-auto text-xl mb-2" />
                        <p className="text-gray-400 text-xs mb-1">Can Save/Month</p>
                        <p className="text-white font-bold text-lg">
                          ₹{formatINR(Math.max(calculated.monthlySavings, 0))}
                        </p>
                      </div>
                      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 text-center">
                        <FaCalendarAlt className="text-blue-400 mx-auto text-xl mb-2" />
                        <p className="text-gray-400 text-xs mb-1">Months Needed</p>
                        <p className="text-white font-bold text-lg">
                          {isFinite(calculated.months) ? calculated.months : "—"}
                        </p>
                      </div>
                      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 text-center">
                        <FaBullseye className="text-purple-400 mx-auto text-xl mb-2" />
                        <p className="text-gray-400 text-xs mb-1">Goal Price</p>
                        <p className="text-white font-bold text-lg">₹{formatINR(calculated.goalCost)}</p>
                      </div>
                      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 text-center">
                        <FaWallet className="text-rose-400 mx-auto text-xl mb-2" />
                        <p className="text-gray-400 text-xs mb-1">Spent This Month</p>
                        <p className="text-white font-bold text-lg">₹{formatINR(calculated.spent)}</p>
                      </div>
                    </div>

                    {/* Visual Timeline Progress */}
                    {calculated.possible && (
                      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-400 text-sm">Savings Timeline</span>
                          <span className="text-emerald-400 text-sm font-bold">{getTargetDate(calculated.months)}</span>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full relative"
                            >
                              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'shimmer 2s infinite' }}></div>
                            </motion.div>
                          </div>

                          <div className="flex justify-between mt-3">
                            {(() => {
                              const totalMonths = calculated.months;
                              const markers = [];
                              const step = totalMonths <= 6 ? 1 : totalMonths <= 24 ? 3 : 6;
                              for (let i = 0; i <= totalMonths; i += step) markers.push(i);
                              if (markers[markers.length - 1] !== totalMonths) markers.push(totalMonths);
                              const display = markers.length > 8 
                                ? [markers[0], ...markers.filter((_, i) => i % Math.ceil(markers.length / 7) === 0).slice(1), markers[markers.length - 1]]
                                : markers;
                              return display.map((m, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className={`w-2 h-2 rounded-full ${m === totalMonths ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`}></div>
                                  <span className="text-gray-500 text-[10px] mt-1">
                                    {m === 0 ? "Now" : m === totalMonths ? "🎉" : `${m}m`}
                                  </span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Savings milestones */}
                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {[0.25, 0.5, 0.75].map((pct) => {
                            const amt = Math.round(calculated.goalCost * pct);
                            const mo = Math.ceil(amt / calculated.monthlySavings);
                            return (
                              <div key={pct} className="text-center bg-white/5 rounded-xl p-3">
                                <p className="text-gray-400 text-xs">{Math.round(pct * 100)}% saved</p>
                                <p className="text-white font-bold text-sm">₹{formatINR(amt)}</p>
                                <p className="text-emerald-400 text-xs">{mo} months</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Smart Tips */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-5">
                      <h4 className="text-cyan-400 font-bold mb-3">💡 AI Smart Tips</h4>
                      <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                        {calculated.possible && calculated.months > 6 && (
                          <li>
                            🔻 Cut <strong className="text-white">{calculated.topCategory}</strong> spending by 30% 
                            (save ₹{formatINR(calculated.cutAmount)} extra/month) → reach your goal 
                            in <strong className="text-emerald-400">~{calculated.aggressiveMonths} months</strong> instead 
                            ({getTargetDate(calculated.aggressiveMonths)}).
                          </li>
                        )}
                        {calculated.possible && (
                          <li>
                            💰 Every extra ₹1,000/month you save reduces your timeline 
                            by <strong className="text-white">~{Math.max(calculated.months - Math.ceil(calculated.goalCost / (calculated.monthlySavings + 1000)), 1)} months</strong>.
                          </li>
                        )}
                        {!calculated.possible && (
                          <li>
                            🎯 Cut your {calculated.topCategory} budget by 30% (₹{formatINR(calculated.cutAmount)}) 
                            {calculated.aggressiveSavings > 0 
                              ? <> and you could save ₹{formatINR(calculated.aggressiveSavings)}/month → goal in <strong className="text-emerald-400">~{calculated.aggressiveMonths} months</strong>.</>
                              : <> to start moving in the right direction.</>
                            }
                          </li>
                        )}
                        <li>
                          📊 You're currently spending <strong className={`${calculated.spendingPercent > 80 ? 'text-rose-400' : calculated.spendingPercent > 60 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {calculated.spendingPercent}%
                          </strong> of your income. 
                          {calculated.spendingPercent > 70 
                            ? " Try to keep it under 70% using the 50/30/20 rule."
                            : " Great discipline! You're in a strong position to save."}
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SavingsGoalPlanner;
