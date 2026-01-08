"use client";

import { useCallback, useEffect, useState } from "react";
import { stockApi, Stock } from "../services/stockApi";
import { useStockFilters } from "./useStockFilters";
import { useStockActions } from "./useStockActions";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

export const useStockManagement = () => {
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailableCars, setIsLoadingAvailableCars] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const fetchStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await stockApi.getStocks({
        sort_by: "created_at",
        sort_order: "desc",
        per_page: 10000,
        page: 1,
      });

      if (response.success && response.data) {
        setAllStocks(response.data);
      } else {
        setAllStocks([]);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      showMessage("error", "Failed to fetch stocks");
      setAllStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [showMessage]);

  const fetchAvailableCars = useCallback(async () => {
    try {
      setIsLoadingAvailableCars(true);
      const response = await stockApi.getAvailableCars();
      if (response.success && response.data) {
        setAvailableCars(response.data);
      } else {
        setAvailableCars([]);
      }
    } catch (error) {
      console.error("Error fetching available cars:", error);
      setAvailableCars([]);
    } finally {
      setIsLoadingAvailableCars(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const stockFilters = useStockFilters(allStocks);
  const stockActions = useStockActions(
    fetchStocks,
    showMessage,
    stockFilters.searchTerm,
    stockFilters.sortBy,
    stockFilters.sortOrder
  );

  return {
    ...stockFilters,
    ...stockActions,
    allStocks,
    availableCars,
    isLoading,
    isLoadingAvailableCars,
    message,
    fetchStocks,
    fetchAvailableCars,
    showMessage,
  };
};
