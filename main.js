
// Debounce function to limit the frequency of API calls
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

debounce();

function fetchWordDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
     .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json();
     })
     .then((data) => {
        if (data.length > 0 && data[0].meanings) {
            updateWordOnBrowser(word); 
            updateDefinitionsOnBrowser(data[0].meanings);
            updatePhoneticsOnBrowser(data[0].phonetics[0] && data[0].phonetics[0].text ? data[0].phonetics[0].text : '');

              // Handle synonyms if they exist
              const synonyms = data[0].meanings[0].synonyms; // Assuming synonyms are in the first meaning
              if (synonyms) {
                  updateSynonymsOnBrowser(synonyms);
              } else {
                  updateSynonymsOnBrowser([]); // Pass empty array if no synonyms
              }
        } else {
            throw new Error('No meanings found for this word.')
        }
     })
    //  .then((data) => updateDefinitionsOnBrowser(data[0].meanings))
     .catch((error) => console.error('Fetch error:', error))
            updateWordOnBrowser(''); // Clear the word
            updatePhoneticsOnBrowser(''); // Clear the phonetics
            updateDefinitionsOnBrowser([]); // Clear definitions
}

fetchWordDefinition('Dictionary');

// code for menu settings toggle
// Function to toggle the theme
function toggleTheme() {
    const bodyElement = document.body;
    const containerElement = document.querySelector('.container');
    const wordElement = document.querySelector('.word');
    const pronunciationElement = document.querySelector('.pronunciation');
    const selectFont = document.getElementById('#fontSelect');

  // Toggle classes for body
  bodyElement.classList.toggle('dark-mode');
  bodyElement.classList.toggle('light-mode');

  // Also toggle classes for the container, word, and pronunciation elements
  containerElement.classList.toggle('dark-mode');
  containerElement.classList.toggle('light-mode');
  wordElement.classList.toggle('dark-mode');
  wordElement.classList.toggle('light-mode');
  pronunciationElement.classList.toggle('dark-mode');
  pronunciationElement.classList.toggle('light-mode');

if( bodyElement.classList.contains('dark-mode')) {
    selectFont.classList.add('white-text');
} else {
    selectFont.classList.remove('white-text');
}
  
}

// Initial theme setup
document.body.classList.add('light-mode'); // Set the initial theme to light
// Set the initial theme for the container, word, and pronunciation as well
const containerElement = document.querySelector('.container');
const wordElement = document.querySelector('.word');
const pronunciationElement = document.querySelector('.pronunciation');

if (containerElement) {
  containerElement.classList.add('light-mode');
}
if (wordElement) {
  wordElement.classList.add('light-mode');
}
if (pronunciationElement) {
  pronunciationElement.classList.add('light-mode');
}


// Event listener for the theme toggle button
document.getElementById('toggleThemeButton').addEventListener('click', toggleTheme);

// Initial theme setup
document.body.classList.add('light-mode'); // Set the initial theme to light

// Function to change the font
function changeFont(font) {
    document.body.style.fontFamily = font;
}

// Event listener for the font select dropdown
document.getElementById('fontSelect').addEventListener('change', function() {
    changeFont(this.value);
});

// end of code for menu settings

function updatePhoneticsOnBrowser(phoneticText) {
    const pronunciationElement = document.querySelector('.pronunciation');
    pronunciationElement.textContent = phoneticText;
}

updatePhoneticsOnBrowser();

// FUNCTION that updates the word on the browser
function updateWordOnBrowser(word) {
    const defineWordElement = document.querySelector('.word');
    if (defineWordElement) { 
        defineWordElement.textContent = word; 
    }
}


// FUNCTION that updates the definitions nouns and verbs
function updateDefinitionsOnBrowser(meanings) {
    // Clear previous definitions
    const definitionContainers = document.querySelectorAll('.part-of-speech .definition ul');
    definitionContainers.forEach(container => container.innerHTML = '');

    meanings.forEach((meaning) => {
        const partOfSpeech = meaning.partOfSpeech;
        const definitions = meaning.definitions.map(def => `<li>${def.definition}</li>`).join('');

        // Find the container for the current part of speech
        const definitionList = document.querySelector(`.part-of-speech.${partOfSpeech} .definition ul`);
        if (definitionList) {
            definitionList.innerHTML = definitions;
        }
    });
}

// we're passing an empty array as an argument because we're using the forEach method and this method can only be used for arrays before i tried passing a string and it gave me an error because forEach can only be used with arrays 
updateDefinitionsOnBrowser([]);
console.log(updateDefinitionsOnBrowser([]));

// New function to update synonyms
function updateSynonymsOnBrowser(synonyms) {
    const synonymsElement = document.querySelector('.synonyms');
    
    // Check if the synonyms container exists
    if (synonymsElement) {
        let content;
        if (synonyms && synonyms.length > 0) {
            // Create links for each synonym
            const synonymsLinks = synonyms.map(synonym => 
                `<a href="#" onclick="fetchWordDefinition('${synonym}'); return false;">${synonym}</a>`
            ).join(', ');
            // Set the content to "Synonyms: " followed by the links
            content = `Synonyms: ${synonymsLinks}`;
        } else {
            // If there are no synonyms, display a message
            content = 'No synonyms available.';
        }
        // Update the innerHTML of the synonyms container
        synonymsElement.innerHTML = content;
    }
}

// Event listener for the input field
document.getElementById('searchBar').addEventListener('input', debounce(function() {
    const word = this.value.trim();
    if (word) {
        fetchWordDefinition(word);
    }
}, 500)); // Adjust the delay as needed (500 milliseconds in this case)