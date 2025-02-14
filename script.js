// script.js
document.addEventListener("DOMContentLoaded", () => {
  const baseQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "Rome", "Berlin"],
      answer: 0
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Gold", "Silver"],
      answer: 0
    },
    {
      question: "How many continents are there?",
      options: ["5", "6", "7"],
      answer: 2
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Diamond", "Graphite", "Steel"],
      answer: 0
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Leonardo da Vinci", "Michelangelo", "Raphael"],
      answer: 0
    },
    {
      question: "What is the smallest prime number?",
      options: ["1", "2", "3"],
      answer: 1
    },
    {
      question: "Which ocean is the largest?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean"],
      answer: 2
    },
    {
      question: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen"],
      answer: 1
    },
    {
      question: "Who is known as the father of computers?",
      options: ["Charles Babbage", "Alan Turing", "Bill Gates"],
      answer: 0
    },
    {
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Cucumber"],
      answer: 1
    },
    {
      question: "Which instrument has keys, pedals, and strings?",
      options: ["Guitar", "Piano", "Violin"],
      answer: 1
    },
    {
      question: "In which country did the Olympic Games originate?",
      options: ["Italy", "Greece", "Egypt"],
      answer: 1
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Uranus"],
      answer: 1
    },
    {
      question: "What is the currency of Japan?",
      options: ["Dollar", "Yen", "Euro"],
      answer: 1
    },
    {
      question: "Which language is primarily spoken in Brazil?",
      options: ["Spanish", "Portuguese", "French"],
      answer: 1
    }
  ]
  ;

  let quizQuestions = [];
  let currentQuestion = 0;
  let totalQuestions = 0;
  let score = 0;
  let questionTimerInterval;
  let userAnswers = [];

  const elements = {
    questionContainer: document.getElementById("question-container"),
    questionSelection: document.getElementById("question-selection"),
    quizInterface: document.getElementById("quiz-interface"),
    questionTimer: document.getElementById("question-timer"),
    result: document.getElementById("result"),
    questionCount: document.getElementById("question-count")
  };

  // Initialize question count options
  function initQuestionCount() {
    const maxQuestions = baseQuestions.length;
    elements.questionCount.innerHTML = '';

    // Generate options in increments of 5 up to maxQuestions
    for (let i = 5; i <= maxQuestions; i += 5) {
      if (i <= maxQuestions) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        elements.questionCount.appendChild(option);
      }
    }

    // Add final option for max questions if not divisible by 5
    if (maxQuestions % 5 !== 0 || maxQuestions < 5) {
      const option = document.createElement('option');
      option.value = maxQuestions;
      option.textContent = maxQuestions;
      elements.questionCount.appendChild(option);
    }
  }

  function generateQuestions(count) {
    // Shuffle questions and select unique ones
    const shuffled = [...baseQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    return shuffled;
  }

  function loadQuestion() {
    clearInterval(questionTimerInterval);
    const q = quizQuestions[currentQuestion];

    elements.questionContainer.innerHTML = `
      <h3>${q.question}</h3>
      <div class="options-container">
        ${q.options.map((opt, i) => `
          <button class="option" 
                  data-index="${i}"
                  ${userAnswers[currentQuestion] !== undefined ? 'disabled' : ''}>
            ${opt}
            ${userAnswers[currentQuestion] === i ?
        (i === q.answer ? ' ✓' : ' ✗') : ''}
          </button>
        `).join('')}
      </div>
    `;

    startQuestionTimer();
  }

  function startQuestionTimer() {
    let timeLeft = 30;
    elements.questionTimer.textContent = `Time left: ${timeLeft}s`;

    questionTimerInterval = setInterval(() => {
      timeLeft--;
      elements.questionTimer.textContent = `Time left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(questionTimerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function handleAnswer(selectedIndex) {
    userAnswers[currentQuestion] = selectedIndex;
    const q = quizQuestions[currentQuestion];

    if (selectedIndex === q.answer) score++;

    if (currentQuestion < totalQuestions - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      endQuiz();
    }
  }

  function endQuiz() {
    clearInterval(questionTimerInterval);
    elements.quizInterface.style.display = 'none';
    elements.result.innerHTML = `
      <h3>Quiz Completed!</h3>
      <p>Your score: ${score}/${totalQuestions}</p>
      <button onclick="location.reload()">Restart Quiz</button>
    `;
  }

  // Event Listeners
  document.getElementById("start-quiz").addEventListener("click", () => {
    totalQuestions = parseInt(document.getElementById("question-count").value);
    quizQuestions = generateQuestions(totalQuestions);
    userAnswers = new Array(totalQuestions).fill(undefined);
    elements.questionSelection.style.display = 'none';
    elements.quizInterface.style.display = 'block';
    elements.result.innerHTML = '';
    currentQuestion = 0;
    score = 0;
    loadQuestion();
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestion < totalQuestions - 1) {
      currentQuestion++;
      loadQuestion();
    }
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    }
  });

  document.getElementById("submit-btn").addEventListener("click", endQuiz);

  elements.questionContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("option") &&
      userAnswers[currentQuestion] === undefined) {
      handleAnswer(parseInt(e.target.dataset.index));
    }
  });
  initQuestionCount();
});