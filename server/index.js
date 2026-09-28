const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);

// Render provides PORT through environment variables.
// Locally, it will use port 5000.
const PORT = process.env.PORT || 5000;

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

// Connect to MongoDB and start server
connectWithRetry()
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "MongoDB connection failed after retries:",
      err.message
    );

    console.error(
      "Check: MongoDB Atlas Network Access, MONGO_URI environment variable, and database configuration."
    );

    process.exit(1);
  });

// Health/root route
app.get("/", (req, res) => {
  res.send("Finance AI Backend Running");
});