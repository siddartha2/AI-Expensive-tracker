function Navbar() {
    return (
      <div className="h-20 bg-[#111827]/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-8">
        <div>
          <h1 className="text-2xl text-white font-semibold">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome back 👋
          </p>
        </div>
  
        <div className="w-11 h-11 rounded-full bg-cyan-400 flex items-center justify-center font-bold text-black">
          S
        </div>
      </div>
    );
  }
  
  export default Navbar;