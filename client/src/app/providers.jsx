import React from "react";
import { AuthProvider } from "../features/auth/authContext";
import { ThemeProvider } from "./themeContext";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
