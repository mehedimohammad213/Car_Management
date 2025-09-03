import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomeRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      console.log("HomeRedirect: User authenticated, redirecting to dashboard");
      // Redirect authenticated users to their dashboard
      if (user.role === "admin") {
        console.log("HomeRedirect: Redirecting admin to /admin");
        navigate("/admin");
      } else {
        console.log("HomeRedirect: Redirecting user to /dashboard");
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading while determining redirect
  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, show the car catalog
  return null;
};

export default HomeRedirect;
