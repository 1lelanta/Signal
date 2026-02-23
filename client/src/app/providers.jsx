import React from "react";
import { AuthProvider } from "../features/auth/authContext";

const Providers = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
