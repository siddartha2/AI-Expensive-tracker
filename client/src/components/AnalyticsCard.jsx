import { motion } from "framer-motion";

function AnalyticsCard({
  title,
  value,
  gradient,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      className={`p-6 rounded-3xl shadow-2xl text-white cursor-pointer relative overflow-hidden ${gradient}`}
    >

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg opacity-80 mb-3">
          {title}
        </h3>

        <h1 className="text-4xl font-bold">
          {value}
        </h1>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute bottom-3 right-4 text-xs bg-black/30 px-3 py-1 rounded-full opacity-0 hover:opacity-100 transition duration-300">
        Smart Insight 🚀
      </div>

    </motion.div>
  );
}

export default AnalyticsCard;