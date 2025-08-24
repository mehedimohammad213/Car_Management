import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  category: string;
  fuelType: string;
  transmission: string;
  mileage: number;
}

interface CartItem {
  car: Car;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (car: Car, quantity?: number) => void;
  removeFromCart: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (car: Car, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.car.id === car.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.car.id === car.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { car, quantity }];
      }
    });
  };

  const removeFromCart = (carId: string) => {
    setItems(prevItems => prevItems.filter(item => item.car.id !== carId));
  };

  const updateQuantity = (carId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(carId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.car.id === carId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.car.price * item.quantity), 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
