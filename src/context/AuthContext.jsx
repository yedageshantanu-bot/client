import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser, logoutUser } from "@/lib/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("alaira_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await getCurrentUser();
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("alaira_token");
        setUser(null);
      }
    } catch (error) {
      console.warn("Failed to load user profile:", error.message);
      localStorage.removeItem("alaira_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
        toast.success(data.message || "Signed in successfully!");
        return { success: true };
      }
      return { success: false, error: data?.error || "Login failed" };
    } catch (error) {
      const errMsg = error.response?.data?.error || "Invalid email or password";
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const data = await registerUser({ name, email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
        toast.success(data.message || "Account created successfully!");
        return { success: true };
      }
      return { success: false, error: data?.error || "Registration failed" };
    } catch (error) {
      const errMsg = error.response?.data?.error || "Registration failed. Try again.";
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
