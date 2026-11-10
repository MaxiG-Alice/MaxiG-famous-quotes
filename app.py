#!/usr/bin/env python3
"""
Quote App - Flask Backend
Provides REST API endpoints and serves the frontend for exploring 100 well-known quotes.
"""

import json
import os
import random
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "quotes.json")


def load_quotes():
    """Load quotes dataset from JSON file."""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


QUOTES = load_quotes()


@app.route("/")
def index():
    """Serve the single-page application."""
    return render_template("index.html")


@app.route("/api/quotes/random", methods=["GET"])
def get_random_quote():
    """
    Return a random quote, optionally filtered by category or author.
    Query parameters:
      - category: filter by category (case-insensitive)
      - author: filter by author name substring (case-insensitive)
    """
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    candidates = QUOTES

    if category:
        candidates = [q for q in candidates if q["category"].lower() == category]

    if author:
        candidates = [q for q in candidates if author in q["author"].lower()]

    if not candidates:
        return jsonify({
            "error": "No quotes found matching the specified criteria."
        }), 404

    return jsonify(random.choice(candidates))


@app.route("/api/quotes", methods=["GET"])
def search_quotes():
    """
    Search and filter quotes.
    Query parameters:
      - q: search in quote text or author (case-insensitive)
      - category: filter by category
      - author: filter by author
    """
    q_term = request.args.get("q", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    results = QUOTES

    if category:
        results = [item for item in results if item["category"].lower() == category]

    if author:
        results = [item for item in results if author in item["author"].lower()]

    if q_term:
        results = [
            item for item in results
            if q_term in item["quote"].lower() or q_term in item["author"].lower()
        ]

    return jsonify({
        "total": len(results),
        "quotes": results
    })


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Return all categories with quote counts."""
    category_counts = {}
    for q in QUOTES:
        cat = q["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1

    sorted_categories = sorted(
        [{"name": k, "count": v} for k, v in category_counts.items()],
        key=lambda x: x["name"]
    )
    return jsonify(sorted_categories)


@app.route("/api/authors", methods=["GET"])
def get_authors():
    """Return all unique authors with quote counts."""
    author_counts = {}
    for q in QUOTES:
        auth = q["author"]
        author_counts[auth] = author_counts.get(auth, 0) + 1

    sorted_authors = sorted(
        [{"name": k, "count": v} for k, v in author_counts.items()],
        key=lambda x: x["name"]
    )
    return jsonify(sorted_authors)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
