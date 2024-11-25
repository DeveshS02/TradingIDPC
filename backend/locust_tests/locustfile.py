# locust_tests/locustfile.py

import sys
from locust import HttpUser, TaskSet, task, between, events
import httpx
import random
# Global variable to store the token
auth_token = None

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """
    This function runs before the Locust test starts.
    It authenticates once and stores the token globally.
    """
    global auth_token
    token_url = "http://localhost:8001/token"  # Authentication service URL
    data = {
        'username': 'bruh',
        'password': 'bruh'
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    print("Starting authentication...")

    try:
        # Use httpx to perform the POST request
        with httpx.Client() as client:
            response = client.post(token_url, data=data, headers=headers)

        print(f"Authentication response status: {response.status_code}")
        print(f"Authentication response body: {response.text}")

        response.raise_for_status()  # Raise an exception for HTTP errors

        auth_token = response.json().get('access_token')

        if auth_token:
            print(f"Authentication successful. Token obtained: {auth_token}")
        else:
            print("Authentication failed: No access token returned.")
            raise Exception("No access token returned.")

    except Exception as e:
        print(f"Authentication failed: {e}")
        # Optionally, you can exit the test if authentication fails
        sys.exit(1)

class UserBehavior(TaskSet):
    def on_start(self):
        """
        This function runs when a simulated user starts executing tasks.
        It sets the Authorization header using the global auth_token.
        """
        global auth_token
        if auth_token:
            self.client.headers.update({"Authorization": f"Bearer {auth_token}"})
            print("Authorization header set for user.")
        else:
            print("No auth token available. Aborting tasks.")
            sys.exit(1)
            self.interrupt()  # Stop executing tasks for this user

    # @task(1)
    # def get_prices(self):
    #     """
    #     GET request to Market Data Service.
    #     """
    #     self.client.get("http://localhost:8000/prices", name="/prices")

    @task(2)
    def get_balance(self):
        """
        GET request to Portfolio Service to retrieve balance.
        """
        self.client.get("http://localhost:8003/balance", name="/balance")

    @task(3)
    def get_portfolio(self):
        """
        GET request to Portfolio Service to retrieve portfolio holdings.
        """
        self.client.get("http://localhost:8003/portfolio", name="/portfolio")

    @task(4)
    def get_trade_history(self):
        """
        GET request to Portfolio Service to retrieve trade history.
        """
        self.client.get("http://localhost:8003/trade_history", name="/trade_history")

    # @task(5)
    # def place_order_buy(self):
    #     """
    #     POST request to Trading Service to place a buy order.
    #     """
    #     stock_symbol = random.choice(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'])
    #     quantity = random.randint(1, 10)
    #     payload = {
    #         "stock_symbol": stock_symbol,
    #         "side": "buy",
    #         "quantity": quantity
    #     }
    #     with self.client.post("http://localhost:8002/order", json=payload, name="/order_buy", catch_response=True) as response:
    #         if response.status_code != 200:
    #             response.failure("Failed to place buy order")
    #         else:
    #             response.success()

    # @task(5)
    # def place_order_sell(self):
    #     """
    #     POST request to Trading Service to place a sell order.
    #     """
    #     stock_symbol = random.choice(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'])
    #     quantity = random.randint(1, 5)
    #     payload = {
    #         "stock_symbol": stock_symbol,
    #         "side": "sell",
    #         "quantity": quantity
    #     }
    #     self.client.post("http://localhost:8002/order", json=payload, name="/order_sell")

class TradingUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)  # Wait between 1 to 3 seconds between tasks
    # host is not set here since we are using absolute URLs in tasks
