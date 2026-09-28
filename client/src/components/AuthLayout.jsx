import { FaBullseye, FaChartLine, FaCheck, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <aside className="auth-story" aria-label="AI Expense Tracker overview">
        <Link className="auth-brand auth-story-brand" to="/">
          <span className="auth-brand-mark" aria-hidden="true">
            <FaChartLine />
          </span>
          <span>AI Expense Tracker</span>
        </Link>

        <div className="auth-story-copy">
          <span className="auth-eyebrow">Your money, with more clarity</span>
          <h1>Take control of your money.</h1>
          <p>
            Track your spending, understand your finances, and plan your goals
            with intelligent insights.
          </p>

          <ul className="auth-feature-list">
            <li><FaCheck aria-hidden="true" /> Smart Expense Tracking</li>
            <li><FaCheck aria-hidden="true" /> AI-Powered Insights</li>
            <li><FaCheck aria-hidden="true" /> Goal-Based Savings</li>
          </ul>
        </div>

        <div className="auth-visual" aria-hidden="true">
          <div className="auth-visual-topline">
            <span>Monthly overview</span>
            <span className="auth-visual-period">This month</span>
          </div>
          <div className="auth-visual-total">Spending snapshot</div>
          <div className="auth-chart">
            <div className="auth-chart-grid" />
            <svg viewBox="0 0 420 130" preserveAspectRatio="none">
              <defs>
                <linearGradient id="auth-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#b9e47a" stopOpacity=".24" />
                  <stop offset="100%" stopColor="#b9e47a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 102 C34 94 42 81 72 88 S119 104 147 72 S194 74 219 64 S266 83 292 49 S337 60 362 29 S398 37 420 12 V130 H0 Z" fill="url(#auth-chart-fill)" />
              <path d="M0 102 C34 94 42 81 72 88 S119 104 147 72 S194 74 219 64 S266 83 292 49 S337 60 362 29 S398 37 420 12" fill="none" stroke="#c6ed8d" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <circle cx="362" cy="29" r="5" fill="#d8f4ad" />
            </svg>
          </div>
          <div className="auth-visual-bottomline">
            <span>Thoughtful insights for everyday decisions</span>
            <FaRobot />
          </div>
        </div>

        <div className="auth-story-footer">
          <FaBullseye aria-hidden="true" /> Small steps. Stronger financial habits.
        </div>
      </aside>

      <main className="auth-main">
        <section className="auth-card">
          <Link className="auth-brand auth-card-brand" to="/">
            <span className="auth-brand-mark" aria-hidden="true">
              <FaChartLine />
            </span>
            <span>AI Expense Tracker</span>
          </Link>
          {children}
        </section>
        <p className="auth-privacy-note">Your financial data stays yours.</p>
      </main>
    </div>
  );
}

export default AuthLayout;