const express = require("express");

const router = express.Router();

const {
    saveBudget,
    getBudget,
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");


// Save Budget
router.post(
    "/",
    authMiddleware,
    saveBudget
);


// Get Budget
router.get(
    "/",
    authMiddleware,
    getBudget
);

module.exports = router;