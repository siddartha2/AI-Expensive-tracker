const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    default: "Other",
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);