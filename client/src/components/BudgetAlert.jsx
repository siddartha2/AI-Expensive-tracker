function BudgetAlert({ budget, spent }) {
    const percentage =
        budget > 0
            ? (spent / budget) * 100
            : 0;

    let message = "";
    let color = "";

    if (percentage >= 100) {
        message = "🚨 Budget Exceeded!";
        color = "text-red-500";
    } else if (percentage >= 80) {
        message = "⚠ Approaching Budget Limit";
        color = "text-yellow-400";
    } else {
        message = "✅ You are within Budget";
        color = "text-green-400";
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-6">
            <h2 className="text-white text-xl font-bold mb-3">
                Budget Status
            </h2>

            <p className={`${color} font-semibold`}>
                {message}
            </p>

            <p className="text-gray-300 mt-2">
                Budget Used: {percentage.toFixed(0)}%
            </p>
        </div>
    );
}

export default BudgetAlert;