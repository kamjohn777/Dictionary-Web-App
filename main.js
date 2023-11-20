
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

function fetchWordDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
     .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json();
     })
     .then((data) => console.log(data))
    //  .then((data) => updateDefinitionsOnBrowser(data[0].meanings))
     .catch((error) => console.error('Fetch error:', error))
}

fetchWordDefinition("hey");


// This function is going to take the API response and update the definitions of the web page based on the users input
function updateDefinitionsOnBrowser(data) {
    // const nounDefinitionList = document.querySelector('.parf-of-speech noun');
    // const verbDefinitionList = document.querySelector('.part-of-speech verb');
    const nounDefinitionList = document.querySelector('.part-of-speech.noun .definition ul');
    const verbDefinitionList = document.querySelector('.part-of-speech.verb .definition ul');


    // this clears the previous definitions
    nounDefinitionList.innerHTML = '';
    verbDefinitionList.innerHTML = '';

    // Logic for definitions
    data.forEach((part) => {
        if (part.partOfSpeech === 'noun') {
            part.definitions.forEach((def) => {
                const li = document.createElement('li');
                li.textContent = def.definition;
                nounDefinitionList.appendChild(li);
            });
        } else if (part.partOfSpeech === 'verb') {
            part.definitions.forEach((def) => {
                const li = document.createElement('li');
                li.textContent = def.definition;
                verbDefinitionList.appendChild(li);
            });
        }
    });
} 



// Event listener for the input field
document.getElementById('searchBar').addEventListener('input', debounce(function() {
    const word = this.value.trim();
    if (word) {
        fetchWordDefinition(word);
    }
}, 500)); // Adjust the delay as needed (500 milliseconds in this case)