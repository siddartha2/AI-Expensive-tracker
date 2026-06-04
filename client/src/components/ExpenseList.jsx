import { motion } from "framer-motion";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import API from "../services/api";
import toast from "react-hot-toast";

function ExpenseList({ expenses, fetchExpenses }) {
  const [editingExpense, setEditingExpense] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
  });
  const deleteExpense = async (id) => {
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
    switch (category.toLowerCase()) {
      case "food":
        return "bg-orange-500/20 text-orange-400";

      case "travel":
        return "bg-blue-500/20 text-blue-400";

      case "shopping":
        return "bg-pink-500/20 text-pink-400";

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
  
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-gray-400">
              No expenses added yet.
            </p>
          ) : (
            expenses.map((expense) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={expense._id}
                className="flex justify-between items-center bg-[#1E293B]/80 border border-white/5 p-5 rounded-2xl transition-all"
              >
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {expense.title}
                  </h3>
  
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
  
                    <span className="text-gray-500 text-sm">
                      Expense
                    </span>
                  </div>
                </div>
  
                <div className="flex items-center gap-6">
                  <h2 className="text-cyan-400 text-2xl font-bold">
                    ₹{expense.amount}
                  </h2>
  
                  <button
                    onClick={() => handleEditClick(expense)}
                    className="bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white p-3 rounded-xl transition"
                  >
                    <FaEdit />
                  </button>
  
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-3 rounded-xl transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
  
      {/* EDIT MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
  
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
  
            <h2 className="text-white text-3xl font-bold mb-6">
              Edit Expense
            </h2>
  
            <div className="space-y-5">
  
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value,
                  })
                }
                className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
              />
  
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    amount: e.target.value,
                  })
                }
                className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
              />
  
              <input
                type="text"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    category: e.target.value,
                  })
                }
                className="w-full bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
              />
  
              <div className="flex gap-4 pt-4">
  
                <button
                  onClick={updateExpense}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-2xl font-semibold transition"
                >
                  Update
                </button>
  
                <button
                  onClick={() => setEditingExpense(null)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-semibold transition"
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