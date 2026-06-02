import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import CustomerManagement from './components/CustomerManagement';
import OrderManagement from './components/OrderManagement';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">Inventory Management System</h1>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={activeTab === 'dashboard' ? 'active' : ''}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={activeTab === 'products' ? 'active' : ''}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/customers"
                  className={activeTab === 'customers' ? 'active' : ''}
                  onClick={() => setActiveTab('customers')}
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={activeTab === 'orders' ? 'active' : ''}
                  onClick={() => setActiveTab('orders')}
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
