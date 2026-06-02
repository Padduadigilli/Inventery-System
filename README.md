# Inventory & Order Management System

A full-stack production-ready containerized inventory and order management system built with React, Python FastAPI, PostgreSQL, and Docker.

## Features

### Product Management
- Create, read, update, and delete products
- Track SKU/product codes
- Manage inventory stock levels
- Real-time stock validation

### Customer Management
- Create and manage customer profiles
- Email and phone number tracking
- Unique email validation

### Order Management
- Create orders with multiple products
- Automatic inventory reduction
- Order cancellation with inventory restoration
- Real-time order tracking

### Dashboard
- System statistics (total products, customers, orders)
- Low stock alerts
- Quick overview of system metrics

## Technology Stack

**Backend:**
- Python 3.11
- FastAPI
- SQLAlchemy ORM
- PostgreSQL

**Frontend:**
- React 18
- TypeScript
- React Router
- Axios

**Containerization:**
- Docker
- Docker Compose

**Database:**
- PostgreSQL 15

## Project Structure

```
InventoryManagementSystem/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── products.py
│   │       ├── customers.py
│   │       └── orders.py
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   └── OrderManagement.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── .env
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd InventoryManagementSystem
```

2. Build and start services:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://inventory_user:inventory_password@db:5432/inventory_db
DEBUG=True
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:8000
```

## API Endpoints

### Products
- `POST /products` - Create product
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Customers
- `POST /customers` - Create customer
- `GET /customers` - Get all customers
- `GET /customers/{id}` - Get customer by ID
- `DELETE /customers/{id}` - Delete customer

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get all orders
- `GET /orders/{id}` - Get order by ID
- `DELETE /orders/{id}` - Cancel order

### System
- `GET /` - Welcome endpoint
- `GET /health` - Health check
- `GET /stats` - System statistics
- `GET /low-stock-products` - Get low stock products

## Business Logic

- ✅ Product SKU must be unique
- ✅ Customer email must be unique
- ✅ Product quantity cannot be negative
- ✅ Orders cannot be placed with insufficient inventory
- ✅ Order creation automatically reduces stock
- ✅ Order cancellation restores inventory
- ✅ Total order amount calculated automatically
- ✅ Comprehensive error handling
- ✅ Input validation on all endpoints

## Deployment

### Backend Deployment (Render/Railway)

1. Push repository to GitHub
2. Connect GitHub repo to Render/Railway
3. Set environment variables:
   ```
   DATABASE_URL=<production-postgresql-url>
   DEBUG=False
   ```
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repo to Vercel/Netlify
2. Set environment variables:
   ```
   REACT_APP_API_URL=<production-backend-url>
   ```
3. Deploy

### Docker Hub

Build and push backend image:
```bash
docker build -t <username>/inventory-backend:latest ./backend
docker push <username>/inventory-backend:latest
```

## Running Tests

```bash
# Backend tests
docker-compose run backend pytest

# Frontend tests
docker-compose run frontend npm test
```

## Docker Commands

```bash
# Build all services
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Author

Developed as a full-stack inventory management solution.
