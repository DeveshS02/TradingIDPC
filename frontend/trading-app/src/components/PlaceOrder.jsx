// src/components/PlaceOrder.jsx

import React, { useState, useContext } from 'react';
import { placeOrder } from '../api';
import { AuthContext } from '../AuthContext';

function PlaceOrder({ setCurrentView }) {
  const [stockSymbol, setStockSymbol] = useState('');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    try {
      const data = await placeOrder({ stock_symbol: stockSymbol, side, quantity });
      setResponse(data);
      // Optionally, refresh the portfolio or notify parent to refresh
    } catch (err) {
      setError(err.detail || 'Error placing order');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Place Order</h2>
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <div>
          <label className="block mb-1">Stock Symbol:</label>
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Order Side:</label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Place Order
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p className="font-semibold">Order placed successfully!</p>
          <p>Stock: {response.stock_symbol}</p>
          <p>Side: {response.side}</p>
          <p>Quantity: {response.quantity}</p>
          <p>Price: ${response.price.toFixed(2)}</p>
          <p>Total Price: ${response.total_price.toFixed(2)}</p>
          {response.side === 'sell' && response.profit_loss !== null && (
            <p>Profit/Loss: ${response.profit_loss.toFixed(2)}</p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default PlaceOrder;
