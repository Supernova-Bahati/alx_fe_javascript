// ===============================
// Storage Keys
// ===============================
const QUOTES_KEY = "dynamic_quotes";
const FILTER_KEY = "selected_category";

// ===============================
// Mock Server Endpoint
// ===============================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ===============================
// Load Quotes
// ===============================
let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// ===============================
// DOM Elements
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportQuotes");
const syncStatus = document.getElementById("syncStatus");

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

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = localStorage.getItem(FILTER_KEY) || "all";
}

// ===============================
// Display Quotes
// ===============================
function displayQuotes(list) {
  quoteDisplay.innerHTML = "";
  list.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" (${q.category})`;
    quoteDisplay.appendChild(p);
  });
}

// ===============================
// Filter Quotes
// ===============================
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  displayQuotes(filtered);
}

// ===============================
// Add Quote
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Fill all fields");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
}

// ===============================
// Create Form
// ===============================
function createAddQuoteForm() {
  const div = document.createElement("div");

  const text = document.createElement("input");
  text.id = "newQuoteText";
  text.placeholder = "Quote";

  const cat = document.createElement("input");
  cat.id = "newQuoteCategory";
  cat.placeholder = "Category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.onclick = addQuote;

  div.append(text, cat, btn);
  formContainer.appendChild(div);
}

// ===============================
// SERVER SYNC LOGIC
// ===============================
async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate server quotes
    const serverQuotes = serverData.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();

    syncStatus.textContent = "Status: Synced with server (server data applied)";
  } catch (error) {
    syncStatus.textContent = "Status: Sync failed";
  }
}

// ===============================
// Periodic Sync
// ===============================
setInterval(syncWithServer, 15000); // every 15 seconds

// ===============================
// Export / Import
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

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    quotes.push(...JSON.parse(e.target.result));
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported");
  };
  reader.readAsText(event.target.files[0]);
}

// ===============================
// Init
// ===============================
newQuoteBtn.addEventListener("click", filterQuotes);
exportBtn.addEventListener("click", exportQuotesToJson);

createAddQuoteForm();
populateCategories();
filterQuotes();
syncWithServer();



