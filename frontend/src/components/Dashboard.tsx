import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Stats {
  total_products: number;
  total_customers: number;
  total_orders: number;
  low_stock_products: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  quantity_in_stock: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchStats();
    fetchLowStockProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/low-stock-products`);
      setLowStockProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch low stock products');
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {error && <div className="alert error">{error}</div>}
      {loading && <p>Loading...</p>}

      {stats && (
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.total_products}</p>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.total_customers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.total_orders}</p>
          </div>
          <div className="stat-card warning">
            <h3>Low Stock Products</h3>
            <p className="stat-value">{stats.low_stock_products}</p>
          </div>
        </div>
      )}

      {lowStockProducts.length > 0 && (
        <div className="low-stock-section">
          <h3>Low Stock Alert</h3>
          <div className="low-stock-products">
            {lowStockProducts.map(product => (
              <div key={product.id} className="low-stock-item">
                <span className="product-name">{product.name}</span>
                <span className="stock-level">{product.quantity_in_stock} in stock</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
