"""Manual connectivity probe. Importing this module never contacts Google Sheets."""
import time
import requests


def main():
    from sync import urls

    url = urls["q510"]
    response = requests.get(f"{url}&_={int(time.time())}", timeout=(5, 30))
    response.raise_for_status()
    print(f"Status: {response.status_code}")
    print(f"Content length: {len(response.content)}")


if __name__ == "__main__":
    main()
