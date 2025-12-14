// ===============================
// Storage Keys
// ===============================
const QUOTES_KEY = "dynamic_quotes";
const FILTER_KEY = "selected_category";

// ===============================
// Mock Server URL
// ===============================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

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
// Load Quotes from Local Storage
// ===============================
let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

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

  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ===============================
// Display Quotes
// ===============================
function displayQuotes(list) {
  quoteDisplay.innerHTML = "";
  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
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
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(filtered);
}

// ===============================
// Show Random Quote
// ===============================
function showRandomQuote() {
  const selected = categoryFilter.value;
  let filtered = quotes;
  if (selected !== "all") filtered = quotes.filter(q => q.category === selected);
  if (filtered.length > 0) {
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    displayQuotes([randomQuote]);
  }
}

// ===============================
// Add Quote
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ===============================
// Create Add Quote Form
// ===============================
function createAddQuoteForm() {
  const div = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  div.append(textInput, categoryInput, btn);
  formContainer.appendChild(div);
}

// ===============================
// Fetch Quotes from Server
// ===============================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(post => ({ text: post.title, category: "Server" }));
  } catch (err) {
    console.error("Error fetching from server:", err);
    return [];
  }
}

// ===============================
// Post Quote to Server
// ===============================
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error("Error posting to server:", err);
  }
}

// ===============================
// Sync Quotes with Server
// ===============================
async function syncQuotes() {
  syncStatus.textContent = "Status: Syncing...";
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length > 0) {
    quotes = serverQuotes; // conflict resolution: server wins
    saveQuotes();
    populateCategories();
    filterQuotes();

    // ALX requires this exact string
    console.log("Quotes synced with server!"); 
    syncStatus.textContent = "Quotes synced with server!"; // update UI
  } else {
    syncStatus.textContent = "Status: Sync failed or no new data";
  }
}

// ===============================
// Export / Import JSON
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
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// ===============================
// Initialization
// ===============================
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

createAddQuoteForm();
populateCategories();
filterQuotes();
syncQuotes();
setInterval(syncQuotes, 15000); // periodic sync every 15s






