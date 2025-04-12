const questions = [
    {
        question: "Who is the best League player?",
        answers: ["Me", "Faker", "Polak", "You"],
        correctIndex: 0, // Correct answer is "Me"
    },
    {
        question: "What is the best role in League?",
        answers: ["Top", "Jungle", "Mid", "Support"],
        correctIndex: 0, // Correct answer is "Top"
    },
    {
        question: "Which champion is the best?",
        answers: ["Zed", "Ahri", "Lee Sin", "Jinx"],
        correctIndex: 0, // Correct answer is "Zed"
    },
];

let currentQuestionIndex = 0;
let selectedAnswers = {}; // Stores selected answers

const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.classList.add("answer-button");
        button.textContent = answer;
        button.dataset.index = index;

        // Check if an answer was already selected
        if (selectedAnswers[currentQuestionIndex] !== undefined) {
            button.disabled = true; // Lock previous selection
            if (selectedAnswers[currentQuestionIndex] === index) {
                button.classList.add(
                    index === currentQuestion.correctIndex ? "correct" : "wrong"
                );
            }
        } else {
            button.addEventListener("click", () => selectAnswer(index));
        }

        answersContainer.appendChild(button);
    });

    // Enable or disable navigation buttons
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = selectedAnswers[currentQuestionIndex] === undefined;
}

// Function to handle answer selection
function selectAnswer(index) {
    selectedAnswers[currentQuestionIndex] = index;
    loadQuestion(); // Reload to lock selection and enable Next button
}

// Handle Next button
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Handle Previous button
prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

// Load first question
loadQuestion();
