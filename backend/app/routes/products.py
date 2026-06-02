from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=schemas.Product, status_code=201)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    # Check if SKU already exists
    existing_product = (
        db.query(models.Product).filter(models.Product.sku == product.sku).first()
    )
    if existing_product:
        raise HTTPException(status_code=400, detail="SKU already exists")

    # Validate quantity is not negative
    if product.quantity_in_stock < 0:
        raise HTTPException(
            status_code=400, detail="Quantity in stock cannot be negative"
        )

    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get("", response_model=list[schemas.Product])
def get_all_products(db: Session = Depends(get_db)):
    """Retrieve all products"""
    return db.query(models.Product).all()


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific product by ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)
):
    """Update product details"""
    db_product = (
        db.query(models.Product).filter(models.Product.id == product_id).first()
    )
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Validate quantity is not negative
    if product.quantity_in_stock is not None and product.quantity_in_stock < 0:
        raise HTTPException(
            status_code=400, detail="Quantity in stock cannot be negative"
        )

    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return None
