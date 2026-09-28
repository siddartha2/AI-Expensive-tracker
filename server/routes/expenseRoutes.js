const express = require("express");

const expenseController = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

router.post("/", authMiddleware, expenseController.addExpense);

router.get("/", authMiddleware, expenseController.getExpenses);

router.get(
  "/summary",
  authMiddleware,
  expenseController.getExpenseSummary
);

router.put("/:id", authMiddleware, expenseController.updateExpense);

router.delete("/:id", authMiddleware, expenseController.deleteExpense);

module.exports = router;