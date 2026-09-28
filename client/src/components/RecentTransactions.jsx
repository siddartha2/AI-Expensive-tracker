function RecentTransactions({ expenses }) {
    const recentExpenses = [...expenses]
        .reverse()
        .slice(0, 5);

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-10">
            <h2 className="text-white text-2xl font-bold mb-5">
                Recent Transactions
            </h2>

            {recentExpenses.length === 0 ? (
                <p className="text-gray-400">
                    No transactions yet
                </p>
            ) : (
                recentExpenses.map((expense) => (
                    <div
                        key={expense._id}
                        className="flex justify-between border-b border-white/10 py-3"
                    >
                        <div>
                            <p className="text-white font-medium">
                                {expense.title}
                            </p>

                            <p className="text-gray-400 text-sm">
                                {expense.category}
                            </p>
                        </div>

                        <p className="text-red-400 font-semibold">
                            ₹{expense.amount}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}

export default RecentTransactions;