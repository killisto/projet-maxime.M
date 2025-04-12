document.addEventListener("DOMContentLoaded", () => {
  // --- Animation Style Injection ---
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    .answer-correct {
      animation: popCorrect 0.4s ease-in-out;
    }
    .answer-incorrect {
      animation: popIncorrect 0.4s ease-in-out;
    }
    @keyframes popCorrect {
      0% { transform: scale(1); background-color: transparent; }
      50% { transform: scale(1.1); background-color: #16a34a; }
      100% { transform: scale(1); background-color: #22c55e; }
    }
    @keyframes popIncorrect {
      0% { transform: scale(1); background-color: transparent; }
      50% { transform: scale(1.1); background-color: #dc2626; }
      100% { transform: scale(1); background-color: #ef4444; }
    }
  `;
  document.head.appendChild(style);

  // --- Section Display Logic ---
  function showSection(sectionId) {
    const sections = ['cv', 'quiz', 'calc'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        if (id === sectionId) {
          section.classList.remove('hidden');
          section.classList.add('animate-fade-in');
        } else {
          section.classList.add('hidden');
          section.classList.remove('animate-fade-in');
        }
      }
    });
    if (sectionId === 'quiz') {
      // Reset quiz state when switching to quiz section.
      currentQuestionIndex = 0;
      selectedAnswers = {};
      loadQuestion();
    }
  }
  window.showSection = showSection;

  // --- Calculator Functions ---
  window.appendCalc = function(char) {
    const input = document.getElementById('calcInput');
    input.value += char;
  };

  window.clearCalc = function() {
    const input = document.getElementById('calcInput');
    input.value = '';
  };

  window.calculateResult = function() {
    const input = document.getElementById('calcInput');
    try {
      input.value = eval(input.value);
    } catch {
      input.value = 'Erreur';
    }
  };

  // --- Quiz Data & Functions ---
  const questions = [
    {
      question: "Who is the best League player?",
      answers: ["Me", "Faker", "Polak", "You"],
      correctIndex: 0
    },
    {
      question: "What is the best role in League?",
      answers: ["Top", "Jungle", "Mid", "Support"],
      correctIndex: 0
    },
    {
      question: "Which champion is the best?",
      answers: ["Zed", "Ahri", "Lee Sin", "Jinx"],
      correctIndex: 0
    }
  ];

  let currentQuestionIndex = 0;
  let selectedAnswers = {};

  function loadQuestion() {
    const questionEl = document.getElementById("quiz-question");
    const answersEl = document.getElementById("quiz-answers");
    const prevBtn = document.getElementById("quiz-prev");
    const nextBtn = document.getElementById("quiz-next");
    const resultEl = document.getElementById("quizResult");

    const q = questions[currentQuestionIndex];
    questionEl.textContent = `Question ${currentQuestionIndex + 1}: ${q.question}`;
    answersEl.innerHTML = "";

    q.answers.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.classList.add("btn", "btn-outline", "w-full", "text-white", "transition", "duration-300");

      const selected = selectedAnswers[currentQuestionIndex];

      if (selected !== undefined) {
        btn.disabled = true;
        if (index === selected) {
          if (index === q.correctIndex) {
            btn.classList.add("bg-green-500", "answer-correct");
          } else {
            btn.classList.add("bg-red-500", "answer-incorrect");
          }
        }
        if (index === q.correctIndex && selected !== q.correctIndex) {
          btn.classList.add("bg-green-300", "answer-correct");
        }
      } else {
        btn.addEventListener("click", () => selectAnswer(index));
      }
      answersEl.appendChild(btn);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = selectedAnswers[currentQuestionIndex] === undefined;
    resultEl.innerHTML = "";
  }

  function selectAnswer(index) {
    selectedAnswers[currentQuestionIndex] = index;
    loadQuestion();
  }

  function showScore() {
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        score++;
      }
    });
    const resultEl = document.getElementById("quizResult");
    resultEl.innerHTML = `<p class="text-lg font-bold text-green-500">Your score: ${score} / ${questions.length}</p>`;
    
    // If all answers are correct, display the redirection button.
    if (score === questions.length) {
      const wpBtn = document.createElement("button");
      wpBtn.className = "btn btn-success mt-4";
      wpBtn.textContent = "Proceed";
      wpBtn.addEventListener("click", () => {
        window.location.href = "wp.html";
      });
      resultEl.appendChild(wpBtn);
    }
  }

  // --- Next & Previous Button Handlers ---
  document.getElementById("quiz-next").addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showScore();
    }
  });
  document.getElementById("quiz-prev").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  });

  // --- Brute Force Quiz Simulation ---
  // This helper function simulates trying every possibility for a given question.
  function simulateBruteForceForQuestion(questionIndex, callback) {
    const q = questions[questionIndex];
    // Refresh display for current question
    loadQuestion();
    // Get the current buttons for the answers.
    const answersEl = document.getElementById("quiz-answers");
    const answerButtons = answersEl.querySelectorAll("button");
    
    let attempt = 0;
    function tryNextOption() {
      if (attempt < q.answers.length) {
        // Highlight current option as a simulation.
        const btn = answerButtons[attempt];
        if (attempt === q.correctIndex) {
          // Animate as correct if it’s the right answer.
          btn.classList.add("answer-correct");
        } else {
          // Animate as wrong if it’s not the right one.
          btn.classList.add("answer-incorrect");
        }
        // Hold the animation momentarily.
        setTimeout(() => {
          btn.classList.remove("answer-incorrect", "answer-correct");
          attempt++;
          tryNextOption();
        }, 300);
      } else {
        // After cycling through, actually select the correct answer.
        selectAnswer(q.correctIndex);
        setTimeout(callback, 500); // Wait briefly before moving on.
      }
    }
    tryNextOption();
  }

  // Updated bruteForceQuiz uses the simulation function above.
  function bruteForceQuiz() {
    currentQuestionIndex = 0;
    selectedAnswers = {};
    loadQuestion();
    
    function simulateNextQuestion() {
      if (currentQuestionIndex < questions.length) {
        simulateBruteForceForQuestion(currentQuestionIndex, () => {
          currentQuestionIndex++;
          simulateNextQuestion();
        });
      } else {
        showScore();
      }
    }
    simulateNextQuestion();
  }
  document.getElementById("brute-force").addEventListener("click", bruteForceQuiz);
});
