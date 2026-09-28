function BudgetGoalCard({
    budget,
    spent,
    onEdit,
}) {
    const percentage =
        budget > 0
            ? Math.min((spent / budget) * 100, 100)
            : 0;

    const remaining = budget - spent;

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg shadow-2xl">
            <h2 className="text-white text-2xl font-bold mb-5">
                🎯 Budget Goal
            </h2>

            <div className="space-y-3">
                <p className="text-gray-300">
                    Monthly Budget:
                    <span className="text-white font-semibold ml-2">
                        ₹{budget}
                    </span>
                </p>

                <p className="text-gray-300">
                    Spent:
                    <span className="text-red-400 font-semibold ml-2">
                        ₹{spent}
                    </span>
                </p>

                <p className="text-gray-300">
                    Remaining:
                    <span className="text-green-400 font-semibold ml-2">
                        ₹{remaining}
                    </span>
                </p>
            </div>

            <div className="w-full h-4 bg-gray-700 rounded-full mt-6">
                <div
                    className="h-4 rounded-full bg-cyan-500"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <div className="flex items-center justify-between mt-4">
                <p className="text-white">
                    {percentage.toFixed(0)}% Used
                </p>

                <button
                    onClick={onEdit}
                    className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl text-white font-semibold transition"
                >
                    Edit Budget
                </button>
            </div>
        </div>
    );
}

export default BudgetGoalCard;