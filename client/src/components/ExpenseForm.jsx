import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function ExpenseForm({ fetchExpenses }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    customCategory: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const finalCategory =
        formData.category === "Custom"
          ? formData.customCategory
          : formData.category;

      await API.post(
        "/expenses",
        {
          title: formData.title,
          amount: formData.amount,
          category: finalCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

      toast.success("Expense added successfully 🚀");

      setFormData({
        title: "",
        amount: "",
        category: "",
        customCategory: "",
      });

    } catch (error) {
      console.log(error);

      toast.error("Failed to add expense");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 mt-10 shadow-2xl">
      <h2 className="text-white text-3xl font-bold mb-8">
        Add New Expense
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          className="bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
          required
        />

        {/* AMOUNT */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
          required
        />

        {/* CATEGORY SELECT */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="bg-[#1E293B] border border-white/10 text-white p-4 rounded-2xl outline-none"
          required
        >
          <option value="">Select Category</option>

          <option value="Food">Food</option>

          <option value="Travel">Travel</option>

          <option value="Shopping">Shopping</option>

          <option value="Bills">Bills</option>

          <option value="Custom">Custom Category</option>
        </select>

        {/* CUSTOM CATEGORY INPUT */}
        {formData.category === "Custom" && (
          <input
            type="text"
            name="customCategory"
            placeholder="Enter Custom Category"
            value={formData.customCategory}
            onChange={handleChange}
            className="bg-[#1E293B] border border-cyan-500 text-white p-4 rounded-2xl outline-none"
            required
          />
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 transition-all text-white font-semibold p-4 rounded-2xl md:col-span-2"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;