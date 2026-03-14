from sqlalchemy import Column, ForeignKey, Integer, String, DateTime , Float
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"  # actual table name in PostgreSQL

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    portfolio = relationship("Portfolio", back_populates="user")

class Portfolio(Base):
    __tablename__ = "portfolio"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    shares = Column(Integer, nullable=False)
    buy_price = Column(Float, nullable=False)  # store price in cents to avoid float issues
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="portfolio")

    