const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      user: req.userId,
      title,
      amount,
      category,
    });

    res.status(201).json({
      message: "Expense added",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId });

    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    const totalTransactions = expenses.length;

    res.status(200).json({
      totalExpenses,
      totalTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
