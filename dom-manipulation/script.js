// Initialize an array to store quotes
let quotes = [];

// Load quotes from local storage on page load
function loadQoutes(){
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populatedCategories();
    showRandomQuote(); // Show a quote when loading
}

function populatedCategories() {
    const categories = new Set();
    quotes.forEach(quote => categories.add(quote.category));

    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Filtered quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value
    const filterQuotes = selectCategory === 'all'
        ? quotes
        :quotes.filter(quote => quote.category === selectCategory);

    displayQuotes(filteredQuotes);
    localStorage.setItem('selectedCategory', selectedCategory); // Save selected Category
}

// Display quotes in the container
function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes
    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.textContent = '${quote.text} - ${quote.category}';
        quoteDisplay.appendChild(quoteDiv);
    });
}

// Run this on page load to set everything up
window.onload = function() {
    loadQoutes();

    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes(); // Display quotes based on last selected category
};

// Display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = "No quotes available";
        return;
    }

     const randomIndex = Math.floor(Math.random() * quotes.length);
     const randomQuote = quotes[randomIndex];
     document.getElementById('quoteDisplay').innerHTML = '${randomQuote.text} - ${randomQuote.category}';
}

// Add event listener for showing a new quote
document.getElementById('newQoute').addEventListener('click', showRandomQuote);

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQouteText').value;
    const quoteCategory = document.getElementById('newQouteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote and category.');
    }
}

function updatedCategoryDropdown(newCategory) {
    const categoryFilter = document.getElementById('categoryFilter');
    const optionExists = Array.from(categoryFilter.options).some(option => option.value === newCategory);

    if (!optionExists) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
        categoryFilter.appendChild(option);
    }
}

// Function to create add quote form
function createAddQuoteForm(){
    // Create a container div for the form
    const formContainer = document.createElement("div");

    // Create input fields for quote text and category
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText"; // Assign id
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory"; // Assign id
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    // Create a button to submit the form 
    const addButton = document.createElement("button");
    addButton.onclick = addQuote;
    addButton.textContent = "Add Quote";

    // Append element to the form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    // Append the form container to the body
    document.body.appendChild(formContainer);

}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add event listener for adding a new quote
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Load quotes on page Load
loadQoutes();

// Export quotes to JSON file
function exportQuotes() {
    const blod = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Add event listener for experting quotes
document.getElementById('exportButton').addEventListener('click', exportQuotes);

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);

}

// Add event listener for importing quotes
document.getElementById('importFile').addEventListener('change', importFromJsonFile);