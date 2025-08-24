import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CarManagement from "./pages/CarManagement";
import StockManagement from "./pages/StockManagement";
import SellManagement from "./pages/SellManagement";
import OrderManagement from "./pages/OrderManagement";
import ClientManagement from "./pages/ClientManagement";

import Settings from "./pages/Settings";

import CarCatalog from "./pages/CarCatalog";
import CarDetails from "./pages/CarDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute role="admin">
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/cars"
                    element={
                      <ProtectedRoute role="admin">
                        <CarManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/stock"
                    element={
                      <ProtectedRoute role="admin">
                        <StockManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/sell"
                    element={
                      <ProtectedRoute role="admin">
                        <SellManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute role="admin">
                        <OrderManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/clients"
                    element={
                      <ProtectedRoute role="admin">
                        <ClientManagement />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute role="admin">
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Routes */}
                  <Route path="/" element={<CarCatalog />} />
                  <Route path="/car/:id" element={<CarDetails />} />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute role="user">
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute role="user">
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute role="user">
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/edit"
                    element={
                      <ProtectedRoute role="user">
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/password"
                    element={
                      <ProtectedRoute role="user">
                        <UserPassword />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
