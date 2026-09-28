import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

function AIChatbot({ expenses, budget }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am FinAI. I can analyze your spending, predict trends, and answer questions about your budget. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Total spent calculation
    const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const remaining = budget - totalSpent;
    
    // Category calculation
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    
    const topCategory = Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
      : "None";

    if (lowerQuery.includes("budget") || lowerQuery.includes("remaining")) {
      return `You have a monthly budget of ₹${budget}. You've spent ₹${totalSpent} so far, leaving you with ₹${remaining}. ${remaining < 0 ? 'You are over budget!' : 'Keep it up!'}`;
    }
    if (lowerQuery.includes("category") || lowerQuery.includes("most") || lowerQuery.includes("highest")) {
      if (topCategory === "None") return "You haven't logged any expenses yet.";
      return `You spend the most on ${topCategory}, totaling ₹${categoryTotals[topCategory]}. Consider setting a strict limit for this category.`;
    }
    if (lowerQuery.includes("predict") || lowerQuery.includes("trend")) {
      if (expenses.length < 3) return "I need more data to make a reliable prediction. Keep logging your expenses!";
      const avgPerExpense = Math.round(totalSpent / expenses.length);
      return `Based on your ${expenses.length} transactions, your average expense is ₹${avgPerExpense}. If you continue this trend, you might spend around ₹${avgPerExpense * 30} this month.`;
    }
    if (lowerQuery.includes("save") || lowerQuery.includes("saving") || lowerQuery.includes("advice")) {
      return `To save more, try the 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings. Since your highest expense is ${topCategory}, try cutting down there first!`;
    }

    return "I'm not entirely sure, but based on your data, your total expenditure is ₹" + totalSpent + ". Can you ask something specific about your budget, trends, or categories?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = { sender: "ai", text: generateAIResponse(input) };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-cyan-500 flex justify-center items-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <FaCommentDots size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 w-[350px] md:w-[400px] h-[550px] bg-[#0F172A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 p-5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex justify-center items-center text-white">
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">FinAI Assistant</h3>
                  <span className="text-cyan-200 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-cyan-500 text-white rounded-tr-none shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                        : "bg-[#1E293B] border border-white/10 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1E293B] border border-white/10 rounded-2xl rounded-tl-none p-4 flex gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1E293B]/50 border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask about your finances..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none px-2"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-cyan-500 flex justify-center items-center text-white hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <FaPaperPlane size={14} className="-ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
