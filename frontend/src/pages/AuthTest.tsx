import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest: React.FC = () => {
  const { user, login, logout, isLoading, validateToken } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginResult, setLoginResult] = useState<string>('');
  const [validationResult, setValidationResult] = useState<string>('');

  const handleLogin = async () => {
    setLoginResult('Logging in...');
    try {
      const success = await login(username, password);
      if (success) {
        setLoginResult('Login successful!');
      } else {
        setLoginResult('Login failed');
      }
    } catch (error) {
      setLoginResult(`Login error: ${error}`);
    }
  };

  const handleValidateToken = async () => {
    setValidationResult('Validating token...');
    try {
      const isValid = await validateToken();
      setValidationResult(`Token validation result: ${isValid ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      setValidationResult(`Validation error: ${error}`);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginResult('');
    setValidationResult('');
  };

  useEffect(() => {
    // Check localStorage on component mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('AuthTest: localStorage check:', { token: !!token, user: !!storedUser });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        {/* Current Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'None'}</p>
            <p><strong>Stored User:</strong> {localStorage.getItem('user') ? 'Present' : 'None'}</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Login Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
            {loginResult && (
              <p className="text-sm text-gray-600">{loginResult}</p>
            )}
          </div>
        </div>

        {/* Token Validation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Validation</h2>
          <button
            onClick={handleValidateToken}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Validate Token
          </button>
          {validationResult && (
            <p className="text-sm text-gray-600 mt-2">{validationResult}</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              Clear All Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
