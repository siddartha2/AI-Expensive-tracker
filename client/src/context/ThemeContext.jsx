import { useEffect, useState } from "react";
import ThemeContext from "./ThemeStore";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("ai-expense-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ai-expense-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}