import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const searchInventory = async (sku: string) => {
  const response = await api.get(`/api/inventory/${sku}`);
  return response.data;
};

export const searchSKUs = async (query: string) => {
  const response = await api.get(`/api/inventory/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
