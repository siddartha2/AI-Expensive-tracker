import { motion } from "framer-motion";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import API from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

function ExpenseList({ expenses, fetchExpenses }) {
  const [editingExpense, setEditingExpense] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();

      toast.success("Expense deleted");

    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
  };

  const updateExpense = async () => {
    try {
      const token = localStorage.getItem("token");
  
      await API.put(
        `/expenses/${editingExpense._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Expense updated 🚀");
  
      setEditingExpense(null);
  
      fetchExpenses();
  
    } catch (error) {
      console.log(error);
  
      toast.error("Update failed");
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "food":
        return "bg-orange-500/20 text-orange-400";
      case "travel":
        return "bg-blue-500/20 text-blue-400";
      case "shopping":
        return "bg-pink-500/20 text-pink-400";
      case "bills":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-cyan-500/20 text-cyan-400";
    }
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-6 mt-10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-2xl font-bold">
            Recent Expenses
          </h2>
  
          <div className="text-gray-400 text-sm">
            {expenses.length} Transactions
          </div>
        </div>
  
        {expenses.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-white text-xl font-semibold mb-2">No expenses yet</h3>
            <p className="text-gray-400">Start tracking your spending to see insights here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-4 font-medium pl-4">Date</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <motion.tr 
                      key={expense._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 pl-4 text-gray-300">
                        {format(new Date(expense.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 text-white font-medium">{expense.title}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-4 text-cyan-400 font-bold">₹{expense.amount}</td>
                      <td className="py-4 pr-4">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white p-2 rounded-lg transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense._id)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {expenses.map((expense) => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  key={expense._id}
                  className="flex flex-col gap-4 bg-[#1E293B]/80 border border-white/5 p-5 rounded-2xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {expense.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {format(new Date(expense.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <h2 className="text-cyan-400 text-xl font-bold">
                      ₹{expense.amount}
                    </h2>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white p-2.5 rounded-xl transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense._id)}
                        className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2.5 rounded-xl transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
  
      {/* EDIT MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-white text-3xl font-bold mb-6">
              Edit Expense
            </h2>
  
            <div className="space-y-5">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Description</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
  
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Amount</label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
  
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>
  
              <div className="flex gap-4 pt-4">
                <button
                  onClick={updateExpense}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-2xl font-semibold transition shadow-lg shadow-cyan-500/20"
                >
                  Update
                </button>
  
                <button
                  onClick={() => setEditingExpense(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenseList;