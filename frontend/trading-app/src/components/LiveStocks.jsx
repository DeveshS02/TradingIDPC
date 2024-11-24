// src/components/LiveStocks.jsx

import React, { useEffect, useState } from 'react';
import { getLiveStocks } from '../api';

function LiveStocks() {
  // State to hold current and previous prices
  const [stocks, setStocks] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch live stocks
  const fetchLiveStocks = async () => {
    try {
      setLoading(true);
      const data = await getLiveStocks(); // Fetch live stock data

      setStocks((prevStocks) => {
        const updatedStocks = {};

        // Iterate over each stock in the fetched data
        Object.entries(data).forEach(([symbol, currentPrice]) => {
          const previousPrice = prevStocks[symbol]?.currentPrice || currentPrice;
          const change = currentPrice - previousPrice;
          const percentChange = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

          updatedStocks[symbol] = {
            currentPrice,
            previousPrice,
            change,
            percentChange,
          };
        });

        return updatedStocks;
      });

      setError('');
    } catch (err) {
      console.error('Error fetching live stock data:', err);
      setError(err.detail || 'Error fetching live stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStocks(); // Initial fetch

    const interval = setInterval(fetchLiveStocks, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Stocks</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr>
              <th className="border px-4 py-2">Stock Symbol</th>
              <th className="border px-4 py-2">Current Price ($)</th>
              <th className="border px-4 py-2">Change ($)</th>
              <th className="border px-4 py-2">% Change</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stocks).length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No live stock data available.
                </td>
              </tr>
            ) : (
              Object.entries(stocks).map(([symbol, details]) => (
                <tr key={symbol}>
                  <td className="border px-4 py-2">{symbol}</td>
                  <td className="border px-4 py-2">${details?.currentPrice?.toFixed(2)}</td>
                  <td
                    className={`border px-4 py-2 ${
                      details.change > 0
                        ? 'text-green-600'
                        : details.change < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {details.change > 0 && '+'}
                    {details.change.toFixed(2)}
                  </td>
                  <td
                    className={`border px-4 py-2 ${
                      details.percentChange > 0
                        ? 'text-green-600'
                        : details.percentChange < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {details.percentChange > 0 && '+'}
                    {details.percentChange.toFixed(2)}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LiveStocks;
