import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import CarManagement from "./pages/CarManagement";
import CategoryManagement from "./pages/CategoryManagement";
import CreateCar from "./pages/CreateCar";
import ViewCar from "./pages/ViewCar";
import UpdateCar from "./pages/UpdateCar";
import StockManagement from "./pages/stock/StockManagement";
import SellManagement from "./pages/SellManagement";
import OrderManagement from "./pages/OrderManagement";
import ClientManagement from "./pages/ClientManagement";

import Settings from "./pages/Settings";

import CarCatalog from "./pages/CarCatalog";
import CarDetails from "./pages/CarDetails";
import UserCarCatalog from "./pages/UserCarCatalog";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import AuthTest from "./pages/AuthTest";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth-test" element={<AuthTest />} />
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
                    path="/admin/categories"
                    element={
                      <ProtectedRoute role="admin">
                        <CategoryManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-car"
                    element={
                      <ProtectedRoute role="admin">
                        <CreateCar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/view-car/:id"
                    element={
                      <ProtectedRoute role="admin">
                        <ViewCar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/update-car/:id"
                    element={
                      <ProtectedRoute role="admin">
                        <UpdateCar />
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
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/browse" element={<CarCatalog />} />
                  <Route path="/car/:id" element={<CarDetails />} />
                  <Route path="/cars" element={<UserCarCatalog />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute role="user">
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-dashboard"
                    element={
                      <ProtectedRoute role="user">
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route
                    path="/user-dashboard"
                    element={
                      <ProtectedRoute role="user">
                        <UserDashboard />
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
