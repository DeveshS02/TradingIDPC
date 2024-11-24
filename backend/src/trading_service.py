import sys
from fastapi import FastAPI, Depends, HTTPException, status
import httpx
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Add the parent directory to sys.path for proper imports
sys.path.append("..")

from database.models import User, Holding, Trade
from database.database import SessionLocal, engine
from database.schemas import OrderCreate, TradeResponse
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

@app.post("/order", response_model=TradeResponse)
async def place_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate order
    if order.side not in ('buy', 'sell'):
        raise HTTPException(status_code=400, detail="Invalid order side")
    if order.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")

    # Get current price
    async with httpx.AsyncClient() as client:
        response = await client.get(MARKET_DATA_URL)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch market prices")
        prices = response.json()
        current_price = prices.get(order.stock_symbol.upper())

    if current_price is None:
        raise HTTPException(status_code=404, detail="Stock symbol not found")

    order_value = current_price * order.quantity

    # Process order
    if order.side == 'buy':
        if current_user.balance < order_value:
            raise HTTPException(status_code=400, detail="Insufficient funds")

        # Update balance
        current_user.balance -= order_value

        # Update holdings
        holding = db.query(Holding).filter_by(user_id=current_user.id, stock_symbol=order.stock_symbol.upper()).first()
        if holding:
            holding.quantity += order.quantity
            holding.total_cost += order_value
        else:
            holding = Holding(
                stock_symbol=order.stock_symbol.upper(),
                quantity=order.quantity,
                total_cost=order_value,
                owner=current_user
            )
            db.add(holding)

        # No profit/loss on buy orders
        profit_loss = None

    elif order.side == 'sell':
        holding = db.query(Holding).filter_by(user_id=current_user.id, stock_symbol=order.stock_symbol.upper()).first()
        if not holding or holding.quantity < order.quantity:
            raise HTTPException(status_code=400, detail="Insufficient holdings to sell")

        # Calculate profit/loss
        average_cost = holding.total_cost / holding.quantity
        profit_loss = (current_price - average_cost) * order.quantity

        # Update holdings
        holding.quantity -= order.quantity
        holding.total_cost -= average_cost * order.quantity

        if holding.quantity == 0:
            db.delete(holding)

        # Update balance
        current_user.balance += order_value

    # Record the trade
    trade = Trade(
        stock_symbol=order.stock_symbol.upper(),
        side=order.side,
        quantity=order.quantity,
        price=current_price,
        total_price=order_value,
        profit_loss=profit_loss,
        timestamp=datetime.utcnow(),
        owner=current_user
    )
    db.add(trade)
    db.commit()
    db.refresh(trade)

    return trade
