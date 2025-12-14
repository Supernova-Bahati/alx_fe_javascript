// ===============================
// Storage Keys
// ===============================
const QUOTES_KEY = "dynamic_quotes";
const FILTER_KEY = "selected_category";

// ===============================
// Load Quotes
// ===============================
let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not let yesterday take up too much of today.", category: "Inspiration" }
];

// ===============================
// DOM Elements
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportQuotes");

// ===============================
// Save Quotes
// ===============================
function saveQuotes() {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

// ===============================
// Populate Categories
// ===============================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// ===============================
// Filter Quotes
// ===============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  displayQuotes(filteredQuotes);
}

// ===============================
// Display Quotes
// ===============================
function displayQuotes(quotesToDisplay) {
  quoteDisplay.innerHTML = "";

  if (quotesToDisplay.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  quotesToDisplay.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" (${quote.category})`;
    quoteDisplay.appendChild(p);
  });
}

// ===============================
// Show Random Quote
// ===============================
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) return;

  displayQuotes([filtered[Math.floor(Math.random() * filtered.length)]]);
}

// ===============================
// Add Quote
// ===============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
}

// ===============================
// Create Add Quote Form
// ===============================
function createAddQuoteForm() {
  const div = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  div.append(quoteInput, categoryInput, btn);
  formContainer.appendChild(div);
}

// ===============================
// Export Quotes
// ===============================
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===============================
// Import Quotes
// ===============================
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };

  reader.readAsText(event.target.files[0]);
}

// ===============================
// Events & Init
// ===============================
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

createAddQuoteForm();
populateCategories();
filterQuotes();


