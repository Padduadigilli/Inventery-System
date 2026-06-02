from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity_in_stock: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity_in_stock: Optional[int] = None


class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemBase]


class Order(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    updated_at: datetime
    products: List[Product] = []

    class Config:
        from_attributes = True


class CustomerWithOrders(Customer):
    orders: List[Order] = []


class ProductWithOrders(Product):
    orders: List[Order] = []
