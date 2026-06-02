import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderManagement.css';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity_in_stock: number;
}

interface Customer {
  id: number;
  full_name: string;
}

interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  created_at: string;
  products: Product[];
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customer_id: 0,
    items: [{ product_id: 0, quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/orders`, formData);
      setOrders([...orders, response.data]);
      setFormData({
        customer_id: 0,
        items: [{ product_id: 0, quantity: 1 }]
      });
      setSuccess('Order created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchProducts(); // Refresh products to show updated stock
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.delete(`${API_URL}/orders/${id}`);
        setOrders(orders.filter(o => o.id !== id));
        setSuccess('Order cancelled successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchProducts(); // Refresh products to show restored stock
      } catch (err) {
        setError('Failed to cancel order');
      }
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, customer_id: parseInt(e.target.value) });
  };

  const handleProductChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItems = [...formData.items];
    newItems[index].product_id = parseInt(e.target.value);
    setFormData({ ...formData, items: newItems });
  };

  const handleQuantityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newItems = [...formData.items];
    newItems[index].quantity = parseInt(e.target.value) || 1;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="order-form">
        <h3>Create New Order</h3>
        <div className="form-group">
          <label>Customer:</label>
          <select
            value={formData.customer_id}
            onChange={handleCustomerChange}
            required
          >
            <option value="0">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="items-section">
          <h4>Order Items</h4>
          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <select
                value={item.product_id}
                onChange={(e) => handleProductChange(index, e)}
                required
              >
                <option value="0">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e)}
                min="1"
                required
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>

      <div className="orders-list">
        <h3>Orders</h3>
        {loading && <p>Loading...</p>}
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Total Amount</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_id}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(order.id)} className="delete-btn">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
