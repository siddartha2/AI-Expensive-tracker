# 💰 AI Expense Tracker

A full-stack personal finance management application built with the MERN stack. The application helps users track expenses, manage budgets, analyze spending patterns, and plan future financial goals using AI-powered insights.

## 🚀 Features

### 🔐 Authentication

* User registration and login
* Secure password handling
* JWT-based authentication
* Protected user-specific data

### 💸 Expense Management

* Add and manage expenses
* Categorize expenses
* View recent transactions
* Track spending history
* View expense data through charts

### 📊 Financial Dashboard

* Monthly expense overview
* Category-wise expense analysis
* Weekly spending trends
* Monthly spending trends
* Recent transaction history

### 💰 Budget Management

* Create and manage budgets
* Set category-wise budgets
* Monitor budget usage
* Budget alerts when spending approaches limits
* Edit existing budgets

### 🤖 AI-Powered Financial Assistant

* AI chatbot for interacting with financial data
* Personalized financial insights based on user data
* Spending analysis
* Financial recommendations based on income and expenses

### 🎯 Savings Goal Planner

Users can create a future financial goal, such as purchasing a bike.

The system analyzes factors such as:

* Monthly income
* Monthly expenses
* Existing financial commitments
* Target amount
* Available monthly savings

Based on these factors, the application calculates a suggested monthly savings amount and estimates the time required to reach the goal.

### 📈 Data Visualization

* Category-wise expense charts
* Weekly trend charts
* Monthly trend charts
* Historical expense analysis

### 📥 Export

* Export financial/expense data for further analysis

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Axios
* Charting libraries

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### AI

* AI-powered financial analysis
* User-data-based financial insights
* AI chatbot

### Development Tools

* Git
* GitHub
* VS Code

---

## 🏗️ Project Structure

```text
AI-Expense-Tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate into the project

```bash
cd AI-expense-tracker
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

Open another terminal or navigate to the server directory:

```bash
cd server
npm install
```

### 5. Configure environment variables

Create a `.env` file inside the appropriate backend directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
```

Do not commit your `.env` file to GitHub.

### 6. Start the backend

```bash
npm run dev
```

### 7. Start the frontend

From the client directory:

```bash
npm run dev
```

The application can then be accessed through the local development URL provided by Vite.

---

## 🔒 Security

Sensitive credentials and environment variables are excluded from the repository using `.gitignore`.

Examples include:

* Database credentials
* JWT secrets
* API keys
* Environment-specific configuration

---

## 🎯 Project Objective

The goal of this project is to build a practical personal finance platform that goes beyond basic expense tracking.

Instead of only recording expenses, the application combines expense tracking, budgeting, data visualization, AI-based analysis, and future savings planning to help users understand their financial behavior and plan for future purchases.

---

## 📌 Future Improvements

* Advanced AI financial recommendations
* More detailed financial reports
* Investment planning features
* Improved financial forecasting
* Mobile application
* Production deployment
* More personalized AI recommendations

---

## 👨‍💻 Author

**Siddartha**

B.Tech Computer Science Engineering

This project was developed as a full-stack software development project to demonstrate skills in:

* Full-stack web development
* React.js
* Node.js
* Express.js
* MongoDB
* REST APIs
* Authentication
* Data visualization
* AI integration
* Git & GitHub
