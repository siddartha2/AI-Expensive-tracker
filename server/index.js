const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = 5000;

const MONGO_OPTS = {
  serverSelectionTimeoutMS: 20000,
  maxPoolSize: 10,
};

async function connectWithRetry(attempts = 4, delayMs = 2500) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, MONGO_OPTS);
      return;
    } catch (err) {
      lastErr = err;
      console.error(
        `MongoDB connection attempt ${i}/${attempts} failed:`,
        err.message
      );
      if (i < attempts) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr;
}

connectWithRetry()
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed after retries:", err.message);
    console.error(
      "Check: Atlas Network Access (your IP or 0.0.0.0/0), MONGO_URI in .env, and try Node 20 LTS if SSL errors persist."
    );
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Finance AI Backend Running");
});