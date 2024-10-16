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


// Function to populate categories
function populateCategories() {
    const categories = new Set(quotes.map(quote => quote.category));
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

const quoteDisplay = document.getElementById('quoteDisplay');

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://api.example.com/quotes');
        if (!response.ok) {
            throw new Error('Newwork response was not ok');
        }
        const quotes = await response.json();
        return quotes;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function for post data to the server

async function postDataToServer(data) {
    const url = 'https://jsonplaceholder.typicode.com/post'; // Example mock API

    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set the content type
            },
            body: JSON.stringify(data) // Convert the data to JSON format
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json(); // Parse the JSON response
        return responseData; // Return the response data
    } catch (error) {
        console.error('Error posting data', error);
    }
}

// Example usage
const data = {
    title: 'foo',
    body: 'bar',
    userId: 1,
};

postDataToServer(data).then(response => {
    console.log('Response from server:', response);
});

// Function to fetch quotes from JSONPlaceholder
async function  fetchQuotes() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const quotes = await response.json();

        // Display the first quote as an example
        if (quotes.length >0) {
            const randomQuote = quote[Math.floor(Math.random() * quote.length)];
            quoteDisplay.innerHTML = '<p>${randomQuote.title}</p>';
        }
    } catch (error) {
        console.error('Error feching quotes:', error);
    }
}

// Function to update local storage
function updateLocalStorage(newQoutes) {
    const existingQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    let conflictDetected = false;
    
    // Check for conflicts
    newQoutes.forEach(newQuote => {
        const exportQuote = existingQuotes.find(eq => eq.id === newQuote.id);
        if (existingQuote && existingQuote.tittle !== newQuote.tittle) {
            conflictDetected = true;
            notifyConflictResolution(newQuote, existingQuote);
        }
    });

    // Combine existing quotes with new quotes, favoring new ones
    const updatedQuotes = [...existingQuotes.filter(eq => !newQoutes.some(nq => nq.id === eq.id)), ...newQuotes];

    localStorage.setItem('quotes',JSON.stringify(updatedQuotes));

    if (!conflictDetected) {
        showNotification("Local storage updated successfully.");
    }
}

// Function to notify users of a conflict
function notifyConflictResolution(newQoute, existingQuote) {
    notification.innerHTML = `Conflict detected! New quote: "${newQuote.title}" conflicts with existing quote: "${existingQuote.title}". <button onclick="resolveConflict(${newQuote.id}, '${newQuote.title}')">Resolve</button>`;
    notification.style.display = 'block'
}

// Function to resolve conflict by updating the local storage
function resolveConflict(id, newTitle) {
    const existingQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const updatedQuotes = existingQuotes.map(quote => quote.id === id ? { ...quote, title: newTitle } :quote);

    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
    notification.style.display = 'none'; // Hide notification after resolving
    showNotification("Conflict resolved successfully");
}

// Function show notifications
function showNotification(message) {
    notification.innerHTML = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000); // Hide after 5 seconds
}

// Periodically fetch new quotes every 10 seconds
setInterval(fetchQuotes, 10000);

// Initial fetch to display a quote when the page loads
fetchQuotes();