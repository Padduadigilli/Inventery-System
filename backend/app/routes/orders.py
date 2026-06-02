from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import insert
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=schemas.Order, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    # Verify customer exists
    customer = (
        db.query(models.Customer)
        .filter(models.Customer.id == order.customer_id)
        .first()
    )
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_amount = 0
    products_to_order = []

    # Check inventory and calculate total
    for item in order.items:
        product = (
            db.query(models.Product)
            .filter(models.Product.id == item.product_id)
            .first()
        )
        if not product:
            raise HTTPException(
                status_code=404, detail=f"Product {item.product_id} not found"
            )

        # Check if inventory is sufficient
        if product.quantity_in_stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient inventory for product {product.name}",
            )

        total_amount += product.price * item.quantity
        products_to_order.append((product, item.quantity))

    # Create order
    db_order = models.Order(
        customer_id=order.customer_id, total_amount=total_amount
    )
    db.add(db_order)
    db.flush()

    # Reduce inventory and link products to order
    for product, quantity in products_to_order:
        product.quantity_in_stock -= quantity
        db.add(product)

        # Insert into association table with quantity
        db.execute(
            insert(models.order_products).values(
                order_id=db_order.id, product_id=product.id, quantity=quantity
            )
        )

    db.commit()
    db.refresh(db_order)
    return db_order


@router.get("", response_model=list[schemas.Order])
def get_all_orders(db: Session = Depends(get_db)):
    """Retrieve all orders"""
    return db.query(models.Order).all()


@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Retrieve order details by ID"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Cancel/Delete an order and restore inventory"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore inventory
    for product in order.products:
        # Get quantity from association table
        result = db.execute(
            "SELECT quantity FROM order_products WHERE order_id = :order_id AND product_id = :product_id",
            {"order_id": order_id, "product_id": product.id},
        ).first()
        if result:
            quantity = result[0]
            product.quantity_in_stock += quantity
            db.add(product)

    db.delete(order)
    db.commit()
    return None
