"use client";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { UserDashboard } from "./dashboard/UserDashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const {
    dashboardData,
    isLoading,
    error,
    recentOrders,
    loadingOrders,
    handleRefresh,
  } = useDashboardData(user);

  if (user?.role === "admin") {
    return (
      <AdminDashboard
        data={dashboardData}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <UserDashboard
      totalCartItems={getTotalItems()}
      recentOrders={recentOrders}
      loadingOrders={loadingOrders}
    />
  );
};

export default Dashboard;
