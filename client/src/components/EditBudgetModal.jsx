import { useState } from "react";

function EditBudgetModal({
    currentBudget,
    onSave,
    onClose,
}) {
    const [value, setValue] = useState(currentBudget);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-[#1E293B] p-8 rounded-3xl w-96 border border-white/10">

                <h2 className="text-white text-2xl font-bold mb-6">
                    Update Budget
                </h2>

                <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                    className="w-full p-4 rounded-xl bg-[#0F172A] text-white border border-white/10"
                />

                <div className="flex gap-3 mt-6">

                    <button
                        onClick={() => onSave(Number(value))}
                        className="flex-1 bg-cyan-500 text-white py-3 rounded-xl"
                    >
                        Save
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 text-white py-3 rounded-xl"
                    >
                        Cancel
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EditBudgetModal;