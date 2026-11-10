/**
 * QuoteVault - Vanilla JavaScript Client
 * Handles random quote generation, search, filtering, and theme switching.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Hero
  const heroCard = document.getElementById("heroCard");
  const heroQuoteText = document.getElementById("heroQuoteText");
  const heroQuoteAuthor = document.getElementById("heroQuoteAuthor");
  const heroQuoteCategory = document.getElementById("heroQuoteCategory");
  const randomQuoteBtn = document.getElementById("randomQuoteBtn");
  const copyHeroBtn = document.getElementById("copyHeroBtn");

  // DOM Elements - Search & Filters
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const categoryFilter = document.getElementById("categoryFilter");
  const authorFilter = document.getElementById("authorFilter");
  const randomFromFilterBtn = document.getElementById("randomFromFilterBtn");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const emptyResetBtn = document.getElementById("emptyResetBtn");

  // DOM Elements - Results Gallery
  const quotesGrid = document.getElementById("quotesGrid");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");

  // DOM Elements - Theme & Toast
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  const toast = document.getElementById("toast");

  // State
  let currentHeroQuote = null;
  let searchDebounceTimer = null;

  // -------------------------------------------------------------------------
  // 1. Theme Management
  // -------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem("quotevault_theme") || "dark";
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("quotevault_theme", theme);
    if (theme === "dark") {
      themeIcon.textContent = "☀️";
      themeText.textContent = "Light Mode";
    } else {
      themeIcon.textContent = "🌙";
      themeText.textContent = "Dark Mode";
    }
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });

  // -------------------------------------------------------------------------
  // 2. Toast Notifications & Clipboard
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older environments
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = text;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);
      }
      showToast("Quote copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy quote:", err);
      showToast("Failed to copy to clipboard");
    }
  }

  // -------------------------------------------------------------------------
  // 3. API Integrations
  // -------------------------------------------------------------------------
  async function fetchRandomQuote(category = "", author = "") {
    try {
      heroQuoteText.classList.add("fade-out");
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (author) params.append("author", author);

      const url = `/api/quotes/random${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch random quote");

      const quote = await res.json();
      currentHeroQuote = quote;

      setTimeout(() => {
        heroQuoteText.textContent = `“${quote.quote}”`;
        heroQuoteAuthor.textContent = `— ${quote.author}`;
        heroQuoteCategory.textContent = quote.category;
        heroQuoteCategory.dataset.category = quote.category;
        heroQuoteText.classList.remove("fade-out");
      }, 150);
    } catch (err) {
      console.error(err);
      heroQuoteText.textContent = "Could not load quote. Please try again.";
      heroQuoteText.classList.remove("fade-out");
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const categories = await res.json();
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = `${cat.name} (${cat.count})`;
        categoryFilter.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  async function fetchAuthors() {
    try {
      const res = await fetch("/api/authors");
      const authors = await res.json();
      authors.forEach(auth => {
        const option = document.createElement("option");
        option.value = auth.name;
        option.textContent = `${auth.name} (${auth.count})`;
        authorFilter.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading authors:", err);
    }
  }

  async function searchQuotes() {
    const query = searchInput.value.trim();
    const category = categoryFilter.value;
    const author = authorFilter.value;

    // Toggle clear search button
    if (query.length > 0) {
      clearSearchBtn.classList.remove("hidden");
    } else {
      clearSearchBtn.classList.add("hidden");
    }

    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    if (author) params.append("author", author);

    resultsCount.textContent = "Searching...";

    try {
      const res = await fetch(`/api/quotes?${params.toString()}`);
      if (!res.ok) throw new Error("Search request failed");

      const data = await res.json();
      renderQuotesGrid(data.quotes);
      resultsCount.textContent = `Showing ${data.quotes.length} of ${data.total} quote${data.total === 1 ? "" : "s"}`;
    } catch (err) {
      console.error("Error searching quotes:", err);
      resultsCount.textContent = "Error loading quotes";
    }
  }

  // -------------------------------------------------------------------------
  // 4. Rendering
  // -------------------------------------------------------------------------
  function renderQuotesGrid(quotes) {
    quotesGrid.innerHTML = "";

    if (!quotes || quotes.length === 0) {
      emptyState.classList.remove("hidden");
      quotesGrid.classList.add("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    quotesGrid.classList.remove("hidden");

    const fragment = document.createDocumentFragment();

    quotes.forEach(quote => {
      const card = document.createElement("div");
      card.className = "quote-item-card";

      const quoteText = document.createElement("p");
      quoteText.className = "quote-item-text";
      quoteText.textContent = `“${quote.quote}”`;

      const footer = document.createElement("div");
      footer.className = "quote-item-footer";

      const author = document.createElement("span");
      author.className = "quote-item-author";
      author.textContent = `— ${quote.author}`;
      author.title = `Filter quotes by ${quote.author}`;
      author.addEventListener("click", () => {
        authorFilter.value = quote.author;
        searchQuotes();
      });

      const actions = document.createElement("div");
      actions.className = "quote-item-actions";

      const categoryPill = document.createElement("span");
      categoryPill.className = "category-pill";
      categoryPill.textContent = quote.category;
      categoryPill.title = `Filter quotes in ${quote.category}`;
      categoryPill.addEventListener("click", () => {
        categoryFilter.value = quote.category;
        searchQuotes();
      });

      const copyBtn = document.createElement("button");
      copyBtn.className = "btn-card-copy";
      copyBtn.title = "Copy quote";
      copyBtn.textContent = "📋";
      copyBtn.addEventListener("click", () => {
        copyToClipboard(`"${quote.quote}" — ${quote.author}`);
      });

      actions.appendChild(categoryPill);
      actions.appendChild(copyBtn);

      footer.appendChild(author);
      footer.appendChild(actions);

      card.appendChild(quoteText);
      card.appendChild(footer);

      fragment.appendChild(card);
    });

    quotesGrid.appendChild(fragment);
  }

  // -------------------------------------------------------------------------
  // 5. Event Listeners
  // -------------------------------------------------------------------------
  randomQuoteBtn.addEventListener("click", () => {
    fetchRandomQuote();
  });

  randomFromFilterBtn.addEventListener("click", () => {
    const selectedCategory = categoryFilter.value;
    const selectedAuthor = authorFilter.value;
    fetchRandomQuote(selectedCategory, selectedAuthor);
    // Scroll hero card smoothly into view
    heroCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  heroQuoteCategory.addEventListener("click", () => {
    if (heroQuoteCategory.dataset.category) {
      categoryFilter.value = heroQuoteCategory.dataset.category;
      searchQuotes();
    }
  });

  copyHeroBtn.addEventListener("click", () => {
    if (currentHeroQuote) {
      copyToClipboard(`"${currentHeroQuote.quote}" — ${currentHeroQuote.author}`);
    }
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      searchQuotes();
    }, 220);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuotes();
    searchInput.focus();
  });

  categoryFilter.addEventListener("change", () => {
    searchQuotes();
  });

  authorFilter.addEventListener("change", () => {
    searchQuotes();
  });

  function resetFilters() {
    searchInput.value = "";
    clearSearchBtn.classList.add("hidden");
    categoryFilter.value = "";
    authorFilter.value = "";
    searchQuotes();
  }

  resetFiltersBtn.addEventListener("click", resetFilters);
  emptyResetBtn.addEventListener("click", resetFilters);

  // -------------------------------------------------------------------------
  // 6. Initialization
  // -------------------------------------------------------------------------
  initTheme();
  fetchCategories();
  fetchAuthors();
  fetchRandomQuote();
  searchQuotes();
});
