
import { toast } from "sonner";
import axios from "axios";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  message?: string;
}

// API URL for serverless functions
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8888/.netlify/functions";

// Authentication service with real MongoDB backend
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Attempting login to:", `${API_URL}/auth-login`);
      const response = await axios.post(`${API_URL}/auth-login`, credentials);
      const data = response.data;
      
      if (data.token) {
        // Store auth data in localStorage
        localStorage.setItem("auth", JSON.stringify({
          success: true,
          token: data.token,
          user: data.user
        }));
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: "Login failed"
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password"
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log("Attempting registration to:", `${API_URL}/auth-register`);
      const response = await axios.post(`${API_URL}/auth-register`, data);
      const responseData = response.data;
      
      return {
        success: true,
        user: responseData.user
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  },

  // Check if user is logged in
  isAuthenticated(): boolean {
    const auth = localStorage.getItem("auth");
    return !!auth;
  },

  // Get current user
  getCurrentUser() {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    
    try {
      const { user } = JSON.parse(auth) as AuthResponse;
      return user;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("auth");
  }
};
