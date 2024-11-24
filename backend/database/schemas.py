from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class OrderCreate(BaseModel):
    stock_symbol: str
    quantity: int
    side: str  # 'buy' or 'sell'

class TradeResponse(BaseModel):
    stock_symbol: str
    side: str
    quantity: int
    price: float
    total_price: float
    profit_loss: Optional[float]  # Can be None for buy orders
    timestamp: datetime

    class Config:
        orm_mode = True

class HoldingDetail(BaseModel):
    stock_symbol: str
    quantity: int
    average_cost: float
    current_price: float
    market_value: float
    profit_loss: float

class PortfolioResponse(BaseModel):
    balance: float
    holdings: List[HoldingDetail]

    class Config:
        orm_mode = True

class TradeDetail(BaseModel):
    timestamp: datetime
    stock_symbol: str
    side: str
    quantity: int
    price: float
    total_price: float
    profit_loss: Optional[float]  # Present only for sell orders

    class Config:
        orm_mode = True

class TradeHistoryResponse(BaseModel):
    trade_history: List[TradeDetail]