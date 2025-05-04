import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, AuthResponse } from "@/services/authService";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string; name?: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      } else {
        toast.error(response.message || "Login failed");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during login");
      return false;
    }
  };

  const register = async (fullName: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ fullName, email, password });
      
      if (response.success) {
        toast.success("Registration successful! Please login.");
        return true;
      } else {
        toast.error(response.message || "Registration failed");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
