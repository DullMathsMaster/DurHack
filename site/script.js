document.addEventListener("DOMContentLoaded", () => {
    const quizWordElement = document.getElementById("quiz-word");
    const optionsContainer = document.getElementById("options-container");
    const optionsForm = document.getElementById("options-form");
    const startBtn = document.getElementById("start-btn");
    const newWordBtn = document.getElementById("new-word-btn");
    const submitBtn = document.getElementById("submit-btn");
    const feedback = document.getElementById("feedback");

    let wordsList = [];
    let currentWord = {};
    
    // Load words from JSON
    fetch("words.json")
        .then(response => response.json())
        .then(data => {
            wordsList = data.words;
        })
        .catch(error => console.error("Error loading words:", error));

    // Function to get a random word
    function getRandomWord() {
        if (wordsList.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordsList.length);
            return wordsList[randomIndex];
        } else {
            return null;
        }
    }

    // Function to get random options
    function getRandomOptions(correctDefinition) {
        const options = new Set();
        options.add(correctDefinition); // Include the correct definition

        while (options.size < 4) { // Ensure we have exactly 4 options
            const randomWord = getRandomWord();
            options.add(randomWord.definition);
        }

        return Array.from(options).sort(() => Math.random() - 0.5); // Shuffle options
    }

    // Function to display a new quiz question
    function displayNewQuestion() {
        currentWord = getRandomWord();
        if (currentWord) {
            quizWordElement.textContent = `Guess the meaning of: "${currentWord.word}"`;
            const options = getRandomOptions(currentWord.definition);

            // Clear previous options
            optionsForm.innerHTML = "";

            // Add new options as radio buttons
            options.forEach((option, index) => {
                const label = document.createElement("label");
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "definition";
                radio.value = option;
                radio.required = true;
                
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                optionsForm.appendChild(label);
                optionsForm.appendChild(document.createElement("br"));
            });

            feedback.textContent = ""; // Clear previous feedback
            optionsContainer.style.display = "block";
        } else {
            quizWordElement.textContent = "No words available.";
        }
    }

    // Event listener for Start Quiz button
    startBtn.addEventListener("click", () => {
        displayNewQuestion();
        startBtn.style.display = "none";
        newWordBtn.style.display = "inline-block";
    });

    // Event listener for New Word button
    newWordBtn.addEventListener("click", displayNewQuestion);

    // Event listener for Submit Answer button
    submitBtn.addEventListener("click", () => {
        const selectedOption = optionsForm.elements["definition"].value;
        if (selectedOption === currentWord.definition) {
            feedback.textContent = "Correct!";
            feedback.style.color = "green";
        } else {
            feedback.textContent = "Incorrect. Try again!";
            feedback.style.color = "red";
        }
    });
});
