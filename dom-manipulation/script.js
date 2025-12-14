// ===============================
// Storage Keys
// ===============================
const STORAGE_KEY = "dynamic_quotes";
const SESSION_KEY = "last_viewed_quote";

// ===============================
// Load Quotes from Local Storage
// ===============================
let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do not let yesterday take up too much of today.", category: "Inspiration" }
];

// ===============================
// DOM References
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportQuotes");

// ===============================
// Save Quotes to Local Storage
// ===============================
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// ===============================
// Show Random Quote
// ===============================
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const textEl = document.createElement("p");
  textEl.textContent = `"${quote.text}"`;

  const categoryEl = document.createElement("small");
  categoryEl.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(textEl);
  quoteDisplay.appendChild(categoryEl);

  // Save last viewed quote (Session Storage)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(quote));
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

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote();
}

// ===============================
// Create Add Quote Form
// ===============================
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  container.append(quoteInput, categoryInput, addBtn);
  formContainer.appendChild(container);
}

// ===============================
// Export Quotes to JSON
// ===============================
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===============================
// Import Quotes from JSON
// ===============================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ===============================
// Event Listeners
// ===============================
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

// ===============================
// Initialize App
// ===============================
createAddQuoteForm();

// Load last viewed quote from session storage
const lastQuote = sessionStorage.getItem(SESSION_KEY);
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
} else {
  showRandomQuote();
}

