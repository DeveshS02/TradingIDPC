import React, { useEffect, useState } from 'react';
import { getMarketPrices } from '../api';

function MarketPrices() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await getMarketPrices();
      setPrices(data);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Market Prices</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices).map(([stock, price]) => (
            <tr key={stock}>
              <td className="py-2 px-4 border-b">{stock}</td>
              <td className="py-2 px-4 border-b">{price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketPrices;
