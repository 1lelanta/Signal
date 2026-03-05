import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "signal-background-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "warm" ? "warm" : "dark";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.body.classList.remove("bg-slate-950", "bg-stone-100");
    document.body.classList.add(theme === "warm" ? "bg-stone-100" : "bg-slate-950");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "warm" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      isWarm: theme === "warm",
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
