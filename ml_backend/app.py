from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["shopcart"]  # 🔁 Change to your real DB
review_collection = db["reviews"]
product_collection = db["products"]

analyzer = SentimentIntensityAnalyzer()

def compute_sentiment_score(product_id):
    reviews = list(review_collection.find({"productId": ObjectId(product_id)}))
    print(f"Reviews found for {product_id}: {len(reviews)}")
    if not reviews:
        product_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"score": 0}}
        )
        return 0

    total_score = 0
    for review in reviews:
        sentiment = analyzer.polarity_scores(review.get("reviewText", ""))
        print(f"Review: {review.get('reviewText')} => Compound: {sentiment['compound']}")
        compound = sentiment["compound"]
        mapped_score = round((compound + 1) * 50)  # Normalize to 0–100
        total_score += mapped_score

    avg_score = round(total_score / len(reviews))
    product_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"score": avg_score}}
    )
    print(f"Updated product {product_id} with score: {avg_score}")
    return avg_score


@app.route("/api/sentiment/update_scores", methods=["GET"])
def update_scores():
    products = product_collection.find({}, {"_id": 1})
    updated = []
    for product in products:
        pid = str(product["_id"])
        print(f"Processing product: {pid}")
        score = compute_sentiment_score(pid)
        updated.append({"productId": pid, "score": score})
    print("Sentiment scoring triggered:", updated)
    return jsonify(updated)


@app.route("/api/sentiment/scores", methods=["GET"])
def get_scores():
    products = list(product_collection.find({}, {"name": 1, "price": 1, "image": 1, "score": 1}))
    for p in products:
        p["_id"] = str(p["_id"])
    return jsonify(products)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
