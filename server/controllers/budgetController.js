const Budget = require("../models/Budget");


// Save Budget
exports.saveBudget = async (req, res) => {
    try {
        const { monthlyBudget } = req.body;

        let budget = await Budget.findOne({
            user: req.userId,
        });

        if (budget) {
            budget.monthlyBudget = monthlyBudget;
            await budget.save();
        } else {
            budget = await Budget.create({
                user: req.userId,
                monthlyBudget,
            });
        }

        res.status(200).json(budget);
    } catch (error) {
        console.log("BUDGET ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};


// Get Budget
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            user: req.userId,
        });

        res.status(200).json(
            budget || { monthlyBudget: 0 }
        );
    } catch (error) {
        console.log("BUDGET ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message,
        });

    }
};