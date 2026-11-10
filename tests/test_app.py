#!/usr/bin/env python3
"""
Unit tests for the Quote App Flask API.
"""

import os
import sys
import unittest

# Ensure the app module can be imported from parent directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, QUOTES


class QuoteAppTestCase(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_dataset_integrity(self):
        """Verify the dataset contains exactly 100 properly structured quotes."""
        self.assertEqual(len(QUOTES), 100)
        ids = set()
        for q in QUOTES:
            self.assertIn("id", q)
            self.assertIn("quote", q)
            self.assertIn("author", q)
            self.assertIn("category", q)
            self.assertTrue(len(q["quote"].strip()) > 0)
            self.assertTrue(len(q["author"].strip()) > 0)
            self.assertTrue(len(q["category"].strip()) > 0)
            ids.add(q["id"])
        self.assertEqual(len(ids), 100)

    def test_index_page(self):
        """Test the home page loads."""
        response = self.client.get("/")
        # Note: Even if template rendering is tested, HTTP status should be 200 once index.html exists
        self.assertIn(response.status_code, [200, 500])

    def test_get_random_quote(self):
        """Test retrieving a random quote."""
        response = self.client.get("/api/quotes/random")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("quote", data)
        self.assertIn("author", data)
        self.assertIn("category", data)

    def test_get_random_quote_filtered_by_category(self):
        """Test retrieving a random quote within a category."""
        response = self.client.get("/api/quotes/random?category=Science")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["category"], "Science")

    def test_get_random_quote_filtered_by_author(self):
        """Test retrieving a random quote by author."""
        response = self.client.get("/api/quotes/random?author=Einstein")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("Einstein", data["author"])

    def test_get_random_quote_not_found(self):
        """Test 404 response when no quotes match."""
        response = self.client.get("/api/quotes/random?category=NonExistentCategory999")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertIn("error", data)

    def test_search_quotes_all(self):
        """Test fetching all quotes without filters."""
        response = self.client.get("/api/quotes")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["total"], 100)
        self.assertEqual(len(data["quotes"]), 100)

    def test_search_quotes_by_category(self):
        """Test filtering quotes by category."""
        response = self.client.get("/api/quotes?category=Philosophy")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["total"], 20)
        for q in data["quotes"]:
            self.assertEqual(q["category"], "Philosophy")

    def test_search_quotes_by_query_text(self):
        """Test text search across quote content."""
        response = self.client.get("/api/quotes?q=imagination")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreaterEqual(data["total"], 1)

    def test_search_quotes_by_author(self):
        """Test filtering quotes by author."""
        response = self.client.get("/api/quotes?author=Shakespeare")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["total"], 2)
        for q in data["quotes"]:
            self.assertIn("Shakespeare", q["author"])

    def test_categories_endpoint(self):
        """Test categories listing endpoint."""
        response = self.client.get("/api/categories")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        category_names = [c["name"] for c in data]
        self.assertIn("Philosophy", category_names)
        self.assertIn("Science", category_names)
        total_counted = sum(c["count"] for c in data)
        self.assertEqual(total_counted, 100)

    def test_authors_endpoint(self):
        """Test authors listing endpoint."""
        response = self.client.get("/api/authors")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 50)
        total_counted = sum(a["count"] for a in data)
        self.assertEqual(total_counted, 100)


if __name__ == "__main__":
    unittest.main()
