import { FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import ThemeContext from "../context/ThemeStore";

function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={`theme-toggle${compact ? " theme-toggle-compact" : ""}`} role="group" aria-label="Color theme">
      <button
        type="button"
        className={theme === "light" ? "active" : ""}
        aria-label="Use light theme"
        aria-pressed={theme === "light"}
        title="Light theme"
        onClick={() => setTheme("light")}
      >
        <FaSun aria-hidden="true" />
        {!compact && <span>Light</span>}
      </button>
      <button
        type="button"
        className={theme === "dark" ? "active" : ""}
        aria-label="Use dark theme"
        aria-pressed={theme === "dark"}
        title="Dark theme"
        onClick={() => setTheme("dark")}
      >
        <FaMoon aria-hidden="true" />
        {!compact && <span>Dark</span>}
      </button>
    </div>
  );
}

export default ThemeToggle;