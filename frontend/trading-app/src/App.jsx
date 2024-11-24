// src/App.jsx

import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import PlaceOrder from './components/PlaceOrder';
import TradeHistory from './components/TradeHistory';
import LiveStocks from './components/LiveStocks'; // Import LiveStocks
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './AuthContext';
import { getPortfolio } from './api';

function App() {
  const [currentView, setCurrentView] = useState('portfolio'); // Default view
  const { token } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState({ balance: 0, holdings: [] });

  useEffect(() => {
    if (!token) {
      setCurrentView('login'); // Redirect to login if not authenticated
    } else if (currentView === 'login' || currentView === 'register') {
      setCurrentView('portfolio'); // Redirect to portfolio after login/register
    }
  }, [token]);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolio();
      const interval = setInterval(fetchPortfolio, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [token]);

  const renderView = () => {
    switch (currentView) {
      case 'portfolio':
        return <Portfolio portfolio={portfolio} />;
      case 'placeOrder':
        return <PlaceOrder setCurrentView={setCurrentView} refreshPortfolio={fetchPortfolio} />;
      case 'tradeHistory':
        return <TradeHistory />;
      case 'liveStocks':
        return <LiveStocks />;
      case 'login':
        return <Login setCurrentView={setCurrentView} />;
      case 'register':
        return <Register setCurrentView={setCurrentView} />;
      default:
        return <Portfolio portfolio={portfolio} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4">{renderView()}</main>
    </div>
  );
}

export default App;
