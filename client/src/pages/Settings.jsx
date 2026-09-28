import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaMoneyBillAlt, FaSave, FaPen } from "react-icons/fa";
import API from "../services/api";
import toast from "react-hot-toast";

function Settings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({ name: res.data.name, email: res.data.email });
      setNewName(res.data.name);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      // Fallback
      setProfile({ name: "FinAI User", email: "user@example.com" });
      setNewName("FinAI User");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/auth/profile", { name: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({ name: res.data.name, email: res.data.email });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-white text-4xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your futuristic account preferences.</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Profile Section */}
              <div className="bg-[#1E293B]/60 border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl text-white font-semibold flex items-center gap-3">
                    <FaUser className="text-cyan-400" /> Identity Module
                  </h2>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm bg-cyan-500/10 px-4 py-2 rounded-xl transition shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <FaPen size={12} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleUpdateProfile} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 text-sm bg-emerald-500/10 px-4 py-2 rounded-xl transition shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <FaSave size={12} /> Save
                      </button>
                      <button onClick={() => { setIsEditing(false); setNewName(profile.name); }} className="text-gray-400 hover:text-gray-300 text-sm bg-white/5 px-4 py-2 rounded-xl transition">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-cyan-200/50 text-xs uppercase tracking-wider block mb-2">Display Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-[#0F172A] border border-cyan-500/30 text-white p-4 rounded-2xl outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                      />
                    ) : (
                      <div className="bg-[#0F172A] border border-white/5 text-white p-4 rounded-2xl flex items-center gap-3 shadow-inner">
                        <FaUser className="text-cyan-500/50" />
                        <span className="font-medium tracking-wide">{profile.name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-cyan-200/50 text-xs uppercase tracking-wider block mb-2">Neural Link (Email)</label>
                    <div className="bg-[#0F172A]/50 border border-white/5 text-gray-400 p-4 rounded-2xl flex items-center gap-3 cursor-not-allowed">
                      <FaEnvelope className="text-gray-600" />
                      <span>{profile.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">* Email modification requires manual override.</p>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-[#1E293B]/60 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <h2 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
                  <FaMoneyBillAlt className="text-purple-400" /> System Preferences
                </h2>
                <div>
                  <label className="text-purple-200/50 text-xs uppercase tracking-wider block mb-2">Primary Currency</label>
                  <select className="w-full md:w-64 bg-[#0F172A] border border-purple-500/30 text-white p-4 rounded-2xl outline-none focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer">
                    <option value="INR">₹ INR (Indian Rupee)</option>
                    <option value="USD" disabled>$ USD (US Dollar)</option>
                    <option value="EUR" disabled>€ EUR (Euro)</option>
                  </select>
                  <p className="text-gray-500 text-sm mt-3">Currently optimized for INR transactions.</p>
                </div>
              </div>

              {/* Account Section */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl">
                <h2 className="text-xl text-red-400 font-semibold mb-3">Terminate Session</h2>
                <p className="text-gray-400 mb-6 text-sm">Disconnect from the FinAI neural network on this device.</p>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 px-8 py-3 rounded-2xl font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                >
                  LOGOUT
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;