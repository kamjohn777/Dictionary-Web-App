
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

fetchWordDefinition();

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


// Event listener for the input field
document.getElementById('searchBar').addEventListener('input', debounce(function() {
    const word = this.value.trim();
    if (word) {
        fetchWordDefinition(word);
    }
}, 500)); // Adjust the delay as needed (500 milliseconds in this case)