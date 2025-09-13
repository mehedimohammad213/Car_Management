import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import CarManagement from "./pages/car/CarManagement";
import CategoryManagement from "./pages/category/CategoryManagement";
import CreateCar from "./pages/car/CreateCar";
import ViewCar from "./pages/car/ViewCar";
import UpdateCar from "./pages/car/UpdateCar";
import StockManagement from "./pages/stock/StockManagement";
import OrderManagement from "./pages/order/OrderManagement";

import Settings from "./pages/Settings";

import CarDetails from "./pages/car/CarDetails";
import UserCarCatalog from "./pages/car/UserCarCatalog";
import Cart from "./pages/cart/Cart";
import Orders from "./pages/order/Orders";
import UserOrders from "./pages/order/UserOrders";
import AdminOrders from "./pages/order/AdminOrders";
import UserProfile from "./pages/UserProfile";
import UserPassword from "./pages/UserPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import AuthTest from "./pages/AuthTest";

function App() {
  return (
    <ErrorBoundary>
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
                      path="/admin/orders"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminOrders />
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
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute role="user">
                          <UserOrders />
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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              className="toast-container"
              toastClassName="custom-toast"
              progressClassName="custom-toast-progress"
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
