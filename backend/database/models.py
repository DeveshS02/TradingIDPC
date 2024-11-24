# database/models.py

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base  # Adjusted import for Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    balance = Column(Float, default=10000.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    holdings = relationship("Holding", back_populates="owner")
    trades = relationship("Trade", back_populates="owner")

class Holding(Base):
    __tablename__ = 'holdings'
    
    id = Column(Integer, primary_key=True, index=True)
    stock_symbol = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_cost = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="holdings")

class Trade(Base):
    __tablename__ = 'trades'
    
    id = Column(Integer, primary_key=True, index=True)
    stock_symbol = Column(String, nullable=False)
    side = Column(String, nullable=False)  # 'buy' or 'sell'
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    profit_loss = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey('users.id'))
    
    owner = relationship("User", back_populates="trades")
