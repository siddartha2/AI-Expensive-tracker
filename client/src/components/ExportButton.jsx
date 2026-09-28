import { saveAs } from "file-saver";

function ExportButton({ expenses }) {
    const exportCSV = () => {
        const headers =
            "Title,Category,Amount,Date\n";

        const rows = expenses
            .map(
                (expense) =>
                    `${expense.title},${expense.category},${expense.amount},${new Date(expense.createdAt).toLocaleDateString()}`
            )
            .join("\n");

        const csv = headers + rows;

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        saveAs(blob, "expenses-report.csv");
    };

    return (
        <button
            onClick={exportCSV}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl"
        >
            Export Report
        </button>
    );
}

export default ExportButton;