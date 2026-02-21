import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (userData) => {
    setRole(userData.role);
    setUser(userData);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
