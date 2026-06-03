import requests
import time

url = "https://docs.google.com/spreadsheets/d/19Z3iRQ9kZ8WIDQveBIyI-QjbOEFFWmqTFeUKZTMjVHI/export?format=xlsx"
url_busted = f"{url}&_={int(time.time())}"

resp = requests.get(url_busted)
print(f"Status: {resp.status_code}")
print(f"Content length: {len(resp.content)}")
