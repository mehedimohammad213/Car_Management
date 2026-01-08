import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

const Layout: React.FC = () => {
  const { user } = useAuth();


  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Header />

      {/* Main content */}
      <main className="bg-slate-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-3 sm:p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
