# QuoteVault — 100 Well-Known Quotes Web App

A clean, responsive web application built with **Python Flask**, **Vanilla JavaScript (ES6+)**, and **HTML5/CSS3** to explore 100 hand-curated, famous quotes from history's greatest philosophers, scientists, writers, and leaders.

---

## Features

- **🎲 Random Quote Generator**: Display a featured quote with smooth transitions.
- **🔍 Real-Time Search**: Search instantly across quote text and author names with debounced input.
- **🏷️ Category Filtering**: Filter quotes across 7 categories:
  - Philosophy (20 quotes)
  - Science (16 quotes)
  - Literature (16 quotes)
  - Leadership (16 quotes)
  - Wisdom (14 quotes)
  - Humor (9 quotes)
  - Art & Creativity (9 quotes)
- **✍️ Author Filtering**: Select from 61 distinct authors or click an author's name on any card to isolate their quotes.
- **🎯 Filter-Constrained Randomizer**: Pick a random quote constrained to a selected category or author.
- **📋 Clipboard Integration**: One-click copying of quotes formatted with author attributions.
- **🌗 Theme Toggle**: Dark Mode (default) and Light Mode with persistent user preference in `localStorage`.
- **🧪 100% Test Coverage**: Full suite of automated unit tests validating API endpoints and data schema integrity.

---

## Project Structure

```
quote-app/
├── app.py                  # Flask backend with REST API endpoints
├── data/
│   └── quotes.json         # Curated dataset of exactly 100 quotes
├── static/
│   ├── css/
│   │   └── style.css       # Responsive design, light/dark themes, animations
│   └── js/
│       └── app.js          # Pure vanilla JavaScript frontend client
├── templates/
│   └── index.html          # Semantic HTML5 single-page application
└── tests/
    └── test_app.py         # Automated unit test suite (12 tests)
```

---

## Getting Started

### 1. Run the Application

```bash
cd /home/mglaesle/agy-cli-projects/quote-app
python3 app.py
```

The application will start on `http://127.0.0.1:5000`. Open this URL in your web browser.

### 2. Run Automated Tests

```bash
cd /home/mglaesle/agy-cli-projects/quote-app
python3 -m unittest discover -s tests -v
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the web UI |
| `GET` | `/api/quotes/random` | Returns a single random quote (`?category=`, `?author=`) |
| `GET` | `/api/quotes` | Searches/filters quotes (`?q=`, `?category=`, `?author=`) |
| `GET` | `/api/categories` | Lists all 7 categories and quote counts |
| `GET` | `/api/authors` | Lists all 61 authors and quote counts |
