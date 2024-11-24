import asyncio
import httpx

MARKET_DATA_URL = 'http://localhost:8000/prices'
TRADING_SERVICE_URL = 'http://localhost:8001/order'
PORTFOLIO_SERVICE_URL = 'http://localhost:8002'

USER_ID = 'user1'

async def display_menu():
    print("\n--- Trading Platform ---")
    print("1. View Market Prices")
    print("2. Place Order")
    print("3. View Portfolio")
    print("4. View Trade History")
    print("5. Exit")
    choice = input("Enter your choice: ")
    return choice

async def view_market_prices():
    async with httpx.AsyncClient() as client:
        response = await client.get(MARKET_DATA_URL)
        prices = response.json()
        print("\nCurrent Market Prices:")
        for stock, price in prices.items():
            print(f"{stock}: ${price:.2f}")

async def place_order():
    stock_symbol = input("Enter stock symbol: ").upper()
    side = input("Enter side (buy/sell): ").lower()
    quantity = int(input("Enter quantity: "))

    order = {
        "user_id": USER_ID,
        "stock_symbol": stock_symbol,
        "quantity": quantity,
        "side": side
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(TRADING_SERVICE_URL, json=order)
        if response.status_code == 200:
            print("Order placed successfully.")
        else:
            print(f"Error placing order: {response.json()['detail']}")

async def view_portfolio():
    url = f"{PORTFOLIO_SERVICE_URL}/portfolio/{USER_ID}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        portfolio = response.json().get('portfolio', {})
        print("\nYour Portfolio:")
        for stock, quantity in portfolio.items():
            print(f"{stock}: {quantity} shares")

async def view_trade_history():
    url = f"{PORTFOLIO_SERVICE_URL}/trade_history/{USER_ID}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        trade_history = response.json().get('trade_history', [])
        print("\nYour Trade History:")
        for trade in trade_history:
            print(trade)

async def main():
    while True:
        choice = await display_menu()
        if choice == '1':
            await view_market_prices()
        elif choice == '2':
            await place_order()
        elif choice == '3':
            await view_portfolio()
        elif choice == '4':
            await view_trade_history()
        elif choice == '5':
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

# Run the client application
asyncio.run(main())
