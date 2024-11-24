// src/components/Header.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Header({ setCurrentView }) {
  const { token, logout } = useContext(AuthContext);

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login'); // Redirect to login view after logout
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleNavigation('portfolio')}
          className="text-2xl font-bold focus:outline-none"
        >
          My Trading App
        </button>
        {token && (
          <>
            <button
              onClick={() => handleNavigation('portfolio')}
              className="hover:bg-gray-700 px-3 py-2 rounded focus:outline-none"
            >
              Portfolio
            </button>
            <button
              onClick={() => handleNavigation('placeOrder')}
              className="hover:bg-gray-700 px-3 py-2 rounded focus:outline-none"
            >
              Place Order
            </button>
            <button
              onClick={() => handleNavigation('tradeHistory')}
              className="hover:bg-gray-700 px-3 py-2 rounded focus:outline-none"
            >
              Trade History
            </button>
            <button
              onClick={() => handleNavigation('liveStocks')}
              className="hover:bg-gray-700 px-3 py-2 rounded focus:outline-none"
            >
              Live Stocks
            </button>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNavigation('login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigation('register')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
