# 📜 QuoteVault

> *"The only true wisdom is in knowing you know nothing."* — Socrates

A clean, responsive web application to discover and explore **100 hand-curated quotes** from history's greatest philosophers, scientists, writers, and leaders. Built with **Python Flask**, **Vanilla JavaScript (ES6+)**, and **HTML5/CSS3** — no frameworks, no databases, no fuss.

🔗 **Live URL:** `http://127.0.0.1:5000` (after running locally)

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🎲 **Random Quote** | Showcases a featured random quote with smooth fade animation |
| 🔍 **Real-Time Search** | Debounced live search across quote text and author names |
| 🏷️ **Category Filter** | Filter across 7 categories via a dropdown |
| ✍️ **Author Filter** | Select from 61 distinct authors or click any author name on a card |
| 🎯 **Smart Randomizer** | "Random from Filters" — pick a random quote within your active selection |
| 📋 **Copy to Clipboard** | One-click copy of any quote with toast feedback |
| 🌗 **Dark / Light Mode** | Theme toggle with preference saved in `localStorage` |
| 🧪 **Unit Tests** | 12 automated tests with 100% pass rate |

---

## 📚 Quote Categories

| Category | Quotes | Sample Authors |
| :--- | :---: | :--- |
| Philosophy | 20 | Socrates, Aristotle, Marcus Aurelius, Lao Tzu, Nietzsche |
| Science | 16 | Einstein, Marie Curie, Carl Sagan, Stephen Hawking, Feynman |
| Literature | 16 | Shakespeare, Hemingway, Tolkien, Orwell, J.K. Rowling |
| Leadership | 16 | Mandela, Churchill, Gandhi, MLK Jr., Lincoln |
| Wisdom | 14 | Rumi, Maya Angelou, Bruce Lee, Emerson, Franklin |
| Humor | 9 | Oscar Wilde, Mark Twain, Groucho Marx, Douglas Adams |
| Art & Creativity | 9 | Da Vinci, Picasso, Van Gogh, Frida Kahlo, Dalí |

---

## 🏗️ Project Structure

```
quote-app/
├── app.py                      # Flask backend — routes, filtering, JSON API
├── data/
│   └── quotes.json             # Curated dataset of exactly 100 quotes
├── static/
│   ├── css/
│   │   └── style.css           # Responsive design, CSS variables, light/dark themes
│   └── js/
│       └── app.js              # Vanilla JS — search, filters, fetch, DOM rendering
├── templates/
│   └── index.html              # Semantic HTML5 single-page application
├── tests/
│   └── test_app.py             # Automated unit test suite (12 tests)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Flask 3.x (`pip install flask`)

### 1. Clone the Repository

```bash
git clone https://github.com/MaxiG-Alice/MaxiG-famous-quotes.git
cd MaxiG-famous-quotes
```

### 2. Install Dependencies

```bash
pip install flask
```

> No virtual environment is strictly required, but recommended for clean isolation:
> ```bash
> python3 -m venv venv && source venv/bin/activate
> pip install flask
> ```

### 3. Run the Application

```bash
python3 app.py
```

Open **`http://127.0.0.1:5000`** in your browser.

### 4. Run Automated Tests

```bash
python3 -m unittest discover -s tests -v
```

**Expected output:**
```
test_authors_endpoint ... ok
test_categories_endpoint ... ok
test_dataset_integrity ... ok
test_get_random_quote ... ok
...
Ran 12 tests in 0.037s
OK
```

---

## 🔌 API Reference

All endpoints return `Content-Type: application/json`.

### `GET /api/quotes/random`

Returns a single random quote. Optionally constrained by filters.

| Query Parameter | Type | Description |
| :--- | :--- | :--- |
| `category` | `string` | Filter by category (e.g. `Science`) |
| `author` | `string` | Filter by author substring (e.g. `Einstein`) |

**Example:**
```bash
curl "http://127.0.0.1:5000/api/quotes/random?category=Science"
```
```json
{
  "id": 27,
  "quote": "We are a way for the cosmos to know itself.",
  "author": "Carl Sagan",
  "category": "Science"
}
```

---

### `GET /api/quotes`

Search and filter quotes. Returns a list with a total count.

| Query Parameter | Type | Description |
| :--- | :--- | :--- |
| `q` | `string` | Search in quote text or author name |
| `category` | `string` | Filter by exact category |
| `author` | `string` | Filter by author substring |

**Example:**
```bash
curl "http://127.0.0.1:5000/api/quotes?author=Einstein"
```
```json
{
  "total": 2,
  "quotes": [
    { "id": 21, "quote": "Imagination is more important than knowledge...", "author": "Albert Einstein", "category": "Science" },
    { "id": 22, "quote": "Life is like riding a bicycle...", "author": "Albert Einstein", "category": "Science" }
  ]
}
```

---

### `GET /api/categories`

Returns all categories with quote counts, sorted alphabetically.

```json
[
  { "name": "Art & Creativity", "count": 9 },
  { "name": "Humor", "count": 9 },
  { "name": "Leadership", "count": 16 },
  ...
]
```

---

### `GET /api/authors`

Returns all 61 unique authors with quote counts, sorted alphabetically.

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Python 3.12, Flask 3.1 |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **Data** | Static JSON file (no database) |
| **Testing** | Python `unittest` |
| **Styling** | CSS custom properties (variables), Flexbox, CSS Grid |

---

## 🗺️ How It Works

```
Browser                     Flask Server              Data
  │                              │                      │
  │── GET /api/quotes?q=Einstein ──▶│                   │
  │                              │── filter(QUOTES) ──▶ │
  │                              │◀─ 2 matches ─────────│
  │◀── 200 OK { total:2, quotes:[...] } ───────────────│
  │                              │                      │
  │  renderQuotesGrid()          │                      │
  │  (builds DOM cards)          │                      │
```

The Flask server loads `quotes.json` **once at startup** into memory (`QUOTES`), making every query a fast in-memory list comprehension with no I/O overhead.

---

## 📄 Licence

This project is open source and available for educational and personal use.
