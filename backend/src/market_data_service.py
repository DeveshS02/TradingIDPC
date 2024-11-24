from fastapi import FastAPI
import asyncio
import random
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (for simplicity)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for stock prices
stock_prices: Dict[str, float] = {
    'AAPL': 150.0,
    'GOOGL': 2800.0,
    'MSFT': 300.0,
    'AMZN': 3400.0,
    'TSLA': 700.0,
}

# Background task to update stock prices
async def update_stock_prices():
    while True:
        for stock in stock_prices:
            # Simulate price change
            change_percent = random.uniform(-0.5, 0.5)
            stock_prices[stock] += stock_prices[stock] * (change_percent / 100)
            # Ensure price doesn't drop below zero
            stock_prices[stock] = max(stock_prices[stock], 1.0)
        await asyncio.sleep(1)  # Update every second

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_stock_prices())

@app.get("/prices")
async def get_prices():
    return stock_prices
