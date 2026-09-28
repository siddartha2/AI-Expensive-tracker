import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [profile, setProfile] = useState({ name: "User" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.log("Failed to load profile in Navbar");
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <div className="h-20 bg-[#111827]/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between gap-4 px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white transition-colors"
        >
          <FaBars size={24} />
        </button>
        <div>
          <h1 className="text-2xl text-white font-semibold tracking-wide">Dashboard</h1>
          <p className="text-gray-400 text-sm hidden sm:block">
            Welcome back, <span className="text-cyan-400 font-medium">{profile.name}</span> 👋
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle compact />
        <Link to="/settings" className="group" aria-label="Open settings">
          <div className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-600 to-green-800 flex items-center justify-center font-bold text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;