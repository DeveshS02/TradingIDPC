// src/api.js

import axios from 'axios';

let token = null;

export const setAuthToken = (newToken) => {
  token = newToken;
};

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const register = async (username, password) => {
  try {
    const response = await axios.post(`http://localhost:8001/register`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Registration failed' };
  }
};

export const login = async (username, password) => {
  try {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);
    const response = await axios.post(`http://localhost:8001/token`, data);
    console.log(response.data);
    setAuthToken(response.data.access_token); // Set token after login
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Login failed' };
  }
};

export const placeOrder = async (order) => {
  try {
    const response = await axios.post(`http://localhost:8002/order`, order, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Order failed' };
  }
};

export const getPortfolio = async () => {
  try {
    const response = await axios.get(`http://localhost:8003/portfolio`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Error fetching portfolio' };
  }
};

export const getTradeHistory = async () => {
  try {
    const response = await axios.get(`http://localhost:8003/trade_history`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Error fetching trade history' };
  }
};

export const getBalance = async () => {
  try {
    const response = await axios.get(`http://localhost:8003/balance`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Error fetching balance' };
  }
};

// **New Function: Fetch Live Stocks**
export const getLiveStocks = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/prices`, getAuthHeaders()); // Adjust URL if different
    console.log(response);
    
    return response.data; // Assuming the data is in the expected format
  } catch (error) {
    throw error.response?.data || { detail: 'Error fetching live stock data' };
  }
};
