import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hello World! 🚗
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome to your Car Management System
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Tech Stack
              </h2>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Modern UI/UX</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
