async function generateQuote() {
  // Get the selected theme
  const theme = document.getElementById('themeSelector').value.trim();
  
  // Build the URL for the API request
  const url = theme ? `/quotes?theme=${encodeURIComponent(theme)}` : '/quotes';
  
  // Fetch quotes from the backend (SQLite database)
  const res = await fetch(url);
  
  // If the request was successful, get the JSON data
  const quotes = await res.json();

  // Select the quote display area
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // If no quotes were returned, show the message "No quotes found for this theme"
  if (quotes.length === 0) {
    typeWriter("No quotes found for this theme.", quoteDisplay);
    return;
  }

  // Pick a random quote from the returned list
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Display the selected quote with a typewriter effect
  typeWriter(randomQuote.text, quoteDisplay);
}

function typeWriter(text, element, speed = 40) {
  element.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Handle form submission to add a new quote
document.getElementById('quoteForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const text = document.getElementById('newQuote').value.trim();
  const theme = document.getElementById('newTheme').value;

  if (!text || !theme) return;

  // Send the new quote to the backend (SQLite database)
  const res = await fetch('/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, theme })
  });

  if (res.ok) {
    document.getElementById('formMessage').style.display = 'block';
    document.getElementById('quoteForm').reset();
    setTimeout(() => {
      document.getElementById('formMessage').style.display = 'none';
    }, 3000);
  } else {
    alert('Error submitting quote.');
  }
});
