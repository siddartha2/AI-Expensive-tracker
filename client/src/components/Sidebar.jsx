import {
    FaChartPie,
    FaWallet,
    FaMoneyBillWave,
    FaCog,
  } from "react-icons/fa";
  
  function Sidebar() {
    return (
      <div className="w-64 h-screen bg-[#111827] border-r border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          FinAI
        </h1>
  
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white hover:bg-cyan-500/10 p-3 rounded-xl cursor-pointer transition">
            <FaChartPie />
            <span>Dashboard</span>
          </div>
  
          <div className="flex items-center gap-3 text-gray-300 hover:bg-cyan-500/10 p-3 rounded-xl cursor-pointer transition">
            <FaWallet />
            <span>Expenses</span>
          </div>
  
          <div className="flex items-center gap-3 text-gray-300 hover:bg-cyan-500/10 p-3 rounded-xl cursor-pointer transition">
            <FaMoneyBillWave />
            <span>Budgets</span>
          </div>
  
          <div className="flex items-center gap-3 text-gray-300 hover:bg-cyan-500/10 p-3 rounded-xl cursor-pointer transition">
            <FaCog />
            <span>Settings</span>
          </div>
        </div>
      </div>
    );
  }
  
  export default Sidebar;