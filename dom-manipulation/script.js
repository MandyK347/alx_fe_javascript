// Initialize an array to store quotes
let quotes = [];

// Load quotes from local storage on page load
function loadQoutes(){
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

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
        const newQuote = { text: quoteText, category: quotecategory };
        quotes.push(newQuote);
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote and category.');
    }
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