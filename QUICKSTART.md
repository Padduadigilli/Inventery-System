# Quick Start Guide

Get the Inventory & Order Management System up and running in minutes!

## Prerequisites

- Docker and Docker Compose installed
- Git
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

## Option 1: Docker Compose (Recommended)

### Start the Application

```bash
cd InventoryManagementSystem

# Build all services
docker-compose build

# Start all services
docker-compose up
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Database:** localhost:5432

### Stop the Application

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Option 2: Local Development

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up database
# Ensure PostgreSQL is running locally

# Run migrations (if using Alembic)
# alembic upgrade head

# Start backend
python -m uvicorn main:app --reload
```

Backend will be available at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at: http://localhost:3000

## API Examples

### Create a Product

```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "quantity_in_stock": 50
  }'
```

### Create a Customer

```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "555-1234"
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ]
  }'
```

### Get All Products

```bash
curl http://localhost:8000/products
```

### Get System Statistics

```bash
curl http://localhost:8000/stats
```

## Docker Commands Reference

```bash
# Build specific service
docker-compose build backend
docker-compose build frontend

# View logs
docker-compose logs
docker-compose logs -f backend
docker-compose logs frontend

# Run commands in service
docker-compose exec backend python -m uvicorn main:app --reload
docker-compose exec frontend npm start

# Remove containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache
```

## Environment Variables

### Backend (.env or docker-compose.yml)

```
DATABASE_URL=postgresql://inventory_user:inventory_password@db:5432/inventory_db
DEBUG=True
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
# On Windows:
netstat -ano | findstr :8000
# On macOS/Linux:
lsof -i :8000

# Kill process
# On Windows:
taskkill /PID <PID> /F
# On macOS/Linux:
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose logs db

# Check database connection
psql -h localhost -U inventory_user -d inventory_db
```

### Frontend Can't Connect to Backend

- Verify backend is running: `curl http://localhost:8000/health`
- Check REACT_APP_API_URL in frontend/.env
- Ensure CORS is enabled in backend

### Docker Build Fails

```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up
```

## File Structure

```
InventoryManagementSystem/
├── backend/
│   ├── app/                 # FastAPI application
│   ├── main.py              # Entry point
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Backend container image
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/                 # React source code
│   ├── package.json         # Node dependencies
│   ├── Dockerfile           # Frontend container image
│   └── .env                 # Frontend environment
├── docker-compose.yml       # Container orchestration
├── README.md                # Project documentation
├── DEPLOYMENT.md            # Deployment guide
└── QUICKSTART.md           # This file
```

## Next Steps

1. **Explore the Dashboard:** View system statistics and low-stock alerts
2. **Create Products:** Add inventory items with SKU and pricing
3. **Add Customers:** Register customers with contact information
4. **Place Orders:** Create orders and manage inventory automatically
5. **Review API Docs:** Visit http://localhost:8000/docs for full API reference

## Common Tasks

### Add Sample Data

Create a Python script `seed.py`:

```python
import requests

BASE_URL = "http://localhost:8000"

# Create products
products = [
    {"name": "Laptop", "sku": "LAP-001", "price": 999.99, "quantity_in_stock": 10},
    {"name": "Mouse", "sku": "MOU-001", "price": 29.99, "quantity_in_stock": 100},
    {"name": "Keyboard", "sku": "KEY-001", "price": 79.99, "quantity_in_stock": 50},
]

for product in products:
    requests.post(f"{BASE_URL}/products", json=product)

# Create customers
customers = [
    {"full_name": "Alice Smith", "email": "alice@example.com", "phone_number": "555-0001"},
    {"full_name": "Bob Johnson", "email": "bob@example.com", "phone_number": "555-0002"},
]

for customer in customers:
    requests.post(f"{BASE_URL}/customers", json=customer)

print("Sample data created!")
```

Run it:
```bash
python seed.py
```

### Reset Database

```bash
# Remove database volume
docker-compose down -v

# Restart services (creates new database)
docker-compose up
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review API documentation: http://localhost:8000/docs
3. Check GitHub issues
4. Review DEPLOYMENT.md for production setup

## Performance Tips

- Use pagination for large datasets
- Implement caching in production
- Monitor database query performance
- Use connection pooling
- Optimize React components with React.memo

---

**Happy Developing!** 🚀

For more information, see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
