// src/components/Portfolio.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { getPortfolio } from '../api';

function Portfolio() {
  const { token } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState({ balance: 0, holdings: [] });
  const [error, setError] = useState('');

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err) {
      setError(err.detail || 'Error fetching portfolio');
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolio();
      const interval = setInterval(fetchPortfolio, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
      {error && <p className="text-red-600">{error}</p>}
      <p className="mb-4">Balance: ${portfolio.balance.toFixed(2)}</p>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Stock Symbol</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Average Cost</th>
            <th className="border px-4 py-2">Current Price</th>
            <th className="border px-4 py-2">Market Value</th>
            <th className="border px-4 py-2">Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.holdings.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No holdings available.
              </td>
            </tr>
          ) : (
            portfolio.holdings.map((holding) => (
              <tr key={holding.stock_symbol}>
                <td className="border px-4 py-2">{holding.stock_symbol}</td>
                <td className="border px-4 py-2">{holding.quantity}</td>
                <td className="border px-4 py-2">${holding.average_cost.toFixed(2)}</td>
                <td className="border px-4 py-2">${holding.current_price.toFixed(2)}</td>
                <td className="border px-4 py-2">${holding.market_value.toFixed(2)}</td>
                <td
                  className={`border px-4 py-2 ${
                    holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ${holding.profit_loss.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Portfolio;
