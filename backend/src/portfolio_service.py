# src/portfolio_service.py

import sys
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from fastapi.middleware.cors import CORSMiddleware

# Add the parent directory to sys.path for proper imports
sys.path.append("..")
from database.dependencies import get_db
from database.models import User, Holding, Trade
from database.database import engine
from database.schemas import PortfolioResponse, TradeHistoryResponse
from auth import get_current_user, get_db

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables if they don't exist
from database.models import Base
Base.metadata.create_all(bind=engine)

MARKET_DATA_URL = 'http://localhost:8000/prices'

@app.get("/balance")
def get_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"balance": current_user.balance}

@app.get("/portfolio", response_model=PortfolioResponse)
async def get_portfolio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    holdings = db.query(Holding).filter_by(user_id=current_user.id).all()
    balance = current_user.balance

    if not holdings:
        return {"balance": balance, "holdings": []}

    # Fetch current prices
    async with httpx.AsyncClient() as client:
        response = await client.get(MARKET_DATA_URL)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch market prices")
        prices = response.json()

    holdings_data = []
    for holding in holdings:
        quantity = holding.quantity
        total_cost = holding.total_cost
        average_cost = total_cost / quantity
        current_price = prices.get(holding.stock_symbol.upper(), 0.0)
        market_value = current_price * quantity
        profit_loss = market_value - total_cost

        holdings_data.append({
            'stock_symbol': holding.stock_symbol.upper(),
            'quantity': quantity,
            'average_cost': average_cost,
            'current_price': current_price,
            'market_value': market_value,
            'profit_loss': profit_loss
        })

    return {"balance": balance, "holdings": holdings_data}

@app.get("/trade_history", response_model=TradeHistoryResponse)
def get_trade_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trades = db.query(Trade).filter_by(user_id=current_user.id).order_by(Trade.timestamp.desc()).all()
    trade_history = [
        {
            'timestamp': trade.timestamp.isoformat(),
            'stock_symbol': trade.stock_symbol.upper(),
            'side': trade.side,
            'quantity': trade.quantity,
            'price': trade.price,
            'total_price': trade.total_price,
            'profit_loss': trade.profit_loss if trade.side == 'sell' else None
        }
        for trade in trades
    ]
    return {"trade_history": trade_history}
