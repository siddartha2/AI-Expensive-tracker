import { useEffect, useState } from "react";
import {
  FaChartPie,
  FaWallet,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`app-sidebar fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 w-64 bg-[#111827] border-r border-gray-800 p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-between items-center mb-10">
          <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
            <h1 className="text-xl font-bold whitespace-nowrap text-emerald-400 hover:text-emerald-300 transition-colors">AI Expense Tracker</h1>
          </NavLink>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-700"
                  : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600"
              }`
            }
          >
            <FaChartPie />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-700"
                  : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600"
              }`
            }
          >
            <FaWallet />
            <span>Expenses</span>
          </NavLink>

          <NavLink
            to="/budgets"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-700"
                  : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600"
              }`
            }
          >
            <FaMoneyBillWave />
            <span>Budgets</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-700"
                  : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600"
              }`
            }
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* User Section / Logout */}
        <div className="mt-auto pt-6 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;