import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { Car } from "../services/carApi";
import { cartApi, CartItem as ApiCartItem } from "../services/cartApi";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: number; // Cart item ID from API
  car: Car;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (car: Car, quantity?: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Toast notification functions
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showInfoToast = (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Convert API cart item to local cart item format
  const convertApiCartItem = (apiItem: ApiCartItem): CartItem => {
    return {
      id: apiItem.id, // Store the cart item ID
      car: {
        id: apiItem.car.id,
        make: apiItem.car.make,
        model: apiItem.car.model,
        variant: apiItem.car.variant,
        year: apiItem.car.year,
        price_amount: apiItem.car.price_amount,
        price_currency: apiItem.car.price_currency,
        mileage_km: apiItem.car.mileage_km,
        transmission: apiItem.car.transmission,
        fuel: apiItem.car.fuel,
        color: apiItem.car.color,
        status: apiItem.car.status,
        category: apiItem.car.category,
        image: apiItem.car.primary_photo?.image_url || "",
        isAvailable: apiItem.car.status === "available",
      },
      quantity: apiItem.quantity,
    };
  };

  // Load cart from API when user is authenticated
  const loadCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.getCartItems();
      if (response && response.success) {
        const convertedItems = response.data.items.map(convertApiCartItem);
        setItems(convertedItems);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      // Don't show error to user on initial load, just log it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (car: Car, quantity: number = 1) => {
    if (!user) {
      showErrorToast("Please log in to add items to your cart");
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.addToCart({
        car_id: car.id,
        quantity,
      });

      if (response.success) {
        showSuccessToast(
          `🚗 ${car.make} ${car.model} added to cart successfully!`
        );
        // Reload cart to get updated data
        await loadCart();
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      showErrorToast("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartId: number) => {
    if (!user) {
      console.error("User must be logged in to remove items from cart");
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.removeFromCart(cartId);

      if (response.success) {
        showInfoToast("Item removed from cart");
        // Reload cart to get updated data
        await loadCart();
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      showErrorToast("Failed to remove item from cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    if (!user) {
      console.error("User must be logged in to update cart");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.updateCartItem(cartId, { quantity });

      if (response.success) {
        // Reload cart to get updated data
        await loadCart();
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      console.error("User must be logged in to clear cart");
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.clearCart();

      if (response.success) {
        showInfoToast("Cart cleared successfully");
        setItems([]);
      } else {
        // If API call fails, still clear local state
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      // Even if API call fails, clear local state
      setItems([]);
      showErrorToast("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + (item.car.price_amount || 0) * item.quantity,
      0
    );
  };

  const value = {
    items,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    refreshCart,
    setItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
