from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app import models
from app.routes import products, customers, orders
from app.config import settings

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.api_title, version=settings.api_version)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)


@app.get("/")
def read_root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to Inventory Management System API",
        "version": settings.api_version,
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get system statistics"""
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    low_stock_products = (
        db.query(models.Product).filter(models.Product.quantity_in_stock < 10).count()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products,
    }


@app.get("/low-stock-products")
def get_low_stock_products(threshold: int = 10, db: Session = Depends(get_db)):
    """Get products with low stock"""
    products_list = (
        db.query(models.Product)
        .filter(models.Product.quantity_in_stock < threshold)
        .all()
    )
    return products_list


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
