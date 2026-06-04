import { motion } from "framer-motion";

function SummaryCard({ title, value, color, gradient }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl border border-white/10 ${gradient}`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>

      <div className="relative z-10">
        <h2 className="text-white/70 text-sm mb-3 font-medium">
          {title}
        </h2>

        <h1 className={`text-5xl font-bold ${color}`}>
          {value}
        </h1>
      </div>
    </motion.div>
  );
}

export default SummaryCard;