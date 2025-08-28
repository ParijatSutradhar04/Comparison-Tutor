import os
import json

# Load both question files
image_questions_file = r"src\data\imageQuestions.json"
word_questions_file = r"src\data\wordQuestions.json"

with open(image_questions_file, "r", encoding="utf-8-sig") as f:
    image_data = json.load(f)

with open(word_questions_file, "r", encoding="utf-8-sig") as f:
    word_data = json.load(f)

data = image_data + word_data

pairs = []
for item in data:
    pair = {
        "left": item["left"]["label"],
        "right": item["right"]["label"],
        "difficulty": item["difficulty"],
    }
    if item["location"] == ["India", "default"]:
        pair["location"] = "default"
    else:
        pair["location"] = item["location"]
    pairs.append(pair)

print(json.dumps(pairs, indent=2, ensure_ascii=False))