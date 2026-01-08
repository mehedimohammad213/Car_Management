import { useState, useEffect, useCallback } from "react";
import { dashboardApi, DashboardData } from "../services/dashboardApi";
import { orderApi, Order } from "../services/orderApi";

export const useDashboardData = (user: any) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const fetchData = useCallback(async (showRefresh = false) => {
        if (user?.role !== "admin") return;

        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const data = await dashboardApi.getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [user?.role]);

    const fetchUserOrders = useCallback(async () => {
        if (user?.role === "admin" || !user) {
            return;
        }

        try {
            setLoadingOrders(true);
            const response = await orderApi.getUserOrders();
            if (response.success && response.data?.orders) {
                // Get the 3 most recent orders
                const orders = response.data.orders.slice(0, 3);
                setRecentOrders(orders);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    }, [user]);

    const handleRefresh = useCallback(() => {
        if (user?.role === "admin") {
            fetchData(true);
        } else {
            fetchUserOrders();
        }
    }, [user?.role, fetchData, fetchUserOrders]);

    useEffect(() => {
        if (user?.role === "admin") {
            fetchData();
        } else if (user) {
            fetchUserOrders();
        }
    }, [user, fetchData, fetchUserOrders]);

    return {
        dashboardData,
        isLoading,
        error,
        refreshing,
        recentOrders,
        loadingOrders,
        handleRefresh,
    };
};
