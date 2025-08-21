from ddgs import DDGS
import requests
import re
import os
import json

with open(r"src\data\questions.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

items = []
for item in data:
    if "left" in item and "label" in item["left"]:
        items.append(item["left"]["label"])
    if "right" in item and "label" in item["right"]:
        items.append(item["right"]["label"])

print(items)

# Make downloads folder if not present
os.makedirs("images", exist_ok=True)

# Fake browser headers (helps bypass some blocking)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/115.0 Safari/537.36"
}

def safe_filename(name: str) -> str:
    """Convert a label into a safe Windows filename"""
    return re.sub(r'[^a-zA-Z0-9_-]', '_', name)

with DDGS() as ddgs:
    for item in items:
        try:
            results = list(ddgs.images(item, max_results=1))
            if results:
                url = results[0]["image"]
                response = requests.get(url, headers=headers, timeout=15)
                if response.status_code == 200:
                    filename = f"images/{safe_filename(item)}.jpg"
                    with open(filename, "wb") as f:
                        f.write(response.content)
                    print(f"✅ Downloaded: {item}")
                else:
                    print(f"⚠️ Failed (HTTP {response.status_code}) for: {item}")
            else:
                print(f"❌ No image found for: {item}")
        except Exception as e:
            print(f"❌ Error for {item}: {e}")