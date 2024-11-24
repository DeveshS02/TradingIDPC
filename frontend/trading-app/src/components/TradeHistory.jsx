// src/components/TradeHistory.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { getTradeHistory } from '../api';

function TradeHistory() {
  const { token } = useContext(AuthContext);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchTradeHistory = async () => {
    try {
      const data = await getTradeHistory();
      setTradeHistory(data.trade_history);
    } catch (err) {
      setError(err.detail || 'Error fetching trade history');
    }
  };

  useEffect(() => {
    if (token) {
      fetchTradeHistory();
      const interval = setInterval(fetchTradeHistory, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trade History</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border px-4 py-2">Timestamp</th>
            <th className="border px-4 py-2">Stock Symbol</th>
            <th className="border px-4 py-2">Side</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {tradeHistory.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No trade history available.
              </td>
            </tr>
          ) : (
            tradeHistory.map((trade, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {new Date(trade.timestamp).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{trade.stock_symbol}</td>
                <td className="border px-4 py-2 capitalize">{trade.side}</td>
                <td className="border px-4 py-2">{trade.quantity}</td>
                <td className="border px-4 py-2">${trade.price.toFixed(2)}</td>
                <td className="border px-4 py-2">${trade.total_price.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {trade.side === 'sell' && trade.profit_loss !== null ? (
                    <span
                      className={`${
                        trade.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${trade.profit_loss.toFixed(2)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TradeHistory;
