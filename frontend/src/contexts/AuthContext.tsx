import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (username === "admin" && password === "admin123") {
      const adminUser: User = {
        id: "1",
        username: "admin",
        role: "admin",
        email: "admin@carselling.com",
        name: "Admin User",
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (username === "user" && password === "user123") {
      const regularUser: User = {
        id: "2",
        username: "user",
        role: "user",
        email: "user@carselling.com",
        name: "John Doe",
      };
      setUser(regularUser);
      localStorage.setItem("user", JSON.stringify(regularUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    try {
      // Clear user state
      setUser(null);
      // Remove user data from localStorage
      localStorage.removeItem("user");
      // Clear any other user-related data that might be stored
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      // You can add more cleanup here if needed
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, ensure user is logged out
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
