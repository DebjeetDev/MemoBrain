lucide.createIcons();

let cards = JSON.parse(localStorage.getItem("memoBrain") || "[]");
// ---- NAVIGATION ----
const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const screenName = item.dataset.screen;
    navItems.forEach((i) => i.classList.remove("active"));
    screens.forEach((s) => s.classList.remove("active"));
    if (!screenName) return;
    item.classList.add("active");
    document.querySelector(`#screen-${screenName}`).classList.add("active");
    lucide.createIcons();
  });
});

// ---- HAMBURGER ----
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#sidebarOverlay");
const hamburger = document.querySelector("#hamburger");

hamburger.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("open");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
});

// ---- MODAL ----
//open
const heroCreateBtn = document.getElementById("heroCreateBtn");
const cardsCreateBtn = document.querySelector("#cardsCreateBtn");
const sidebarCreateBtn = document.querySelector("#sidebarCreateBtn");
//close
const closeModal = document.querySelector("#closeModal");
const cancelModal = document.querySelector("#cancelModalBtn");

//all open and close Btn make an array >
const createBtn = [heroCreateBtn, cardsCreateBtn, sidebarCreateBtn];
const closeBtn = [closeModal, cancelModal];

createBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("#createModal").classList.add("open");
  });
});

closeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("#createModal").classList.remove("open");
  });
});
const cardsGrid = document.querySelector("#cardsGrid");
const recentCardsList = document.querySelector("#recentCardsList");

function deleteCard(id) {
  if (!id) {
    showToast("something wrong!", "error");
    return;
  }
  if (!cards.some((c) => c.id === id)) {
    return showToast("id not found", "error");
  }
  cards = cards.filter((c) => c.id !== id);
  localStorage.setItem("memoBrain", JSON.stringify(cards));
  document.querySelector(`.flip-card[data-id="${id}"]`).remove();
  showToast("card deleted successfully");
  recentCard()
  updateStats();
}

cardsGrid.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    const cardId = deleteBtn.dataset.id;
    return deleteCard(cardId);
  }
  const card = e.target.closest(".flip-card");
  if (card) {
    card.classList.toggle("flipped");
  }
});

// ---- SAVE CARD ----
// Validate → localStorage push → DOM insert → modal close → toast → stats update

function createCardHTML(card) {
  const { id, front, back, category } = card;
  return `
    <div class="flip-card" data-id="${id}">
          <div class="flip-inner">
            <div class="flip-front">
              <div class="flip-top">
                <span class="cat-tag">
                  <i data-lucide="code-2"></i>
                  ${category}
                </span>
                <div class="card-menu">
                  <button class="btn btn-ghost btn-icon delete-btn" data-id="${id}">
                    <i data-lucide="trash-2"></i>
                  </button>
                </div>
              </div>
              <div class="flip-body">
                <p class="flip-question">${front}</p>
              </div>
              <div class="flip-footer">
                <span class="flip-hint">
                  <i data-lucide="rotate-cw"></i>
                  Click to flip
                </span>
              </div>
            </div>
            <div class="flip-back">
              <div class="flip-top">
                <span class="flip-answer-label">Answer</span>
              </div>
              <div class="flip-body">
                <p class="flip-answer">${back}</p>
              </div>
              <div class="flip-footer">
                <span class="flip-hint">
                  <i data-lucide="rotate-cw"></i>
                  Flip back
                </span>
              </div>
            </div>
          </div>
        </div>
  `;
}
function saveCard(data) {
  const { front, back, category } = data;
  if (!front || !back) {
    showToast("Please fill all fields!", "error");
    return;
  }
  const createCards = {
    id: crypto.randomUUID(),
    front,
    back,
    category,
  };
  cards.push(createCards);
  localStorage.setItem("memoBrain", JSON.stringify(cards));
  loadCards();
  document.querySelector("#createModal").classList.remove("open");
  showToast("Card saved!");
  document.querySelector("#cardQuestion").value = "";
  document.querySelector("#cardAnswer").value = "";
  document.querySelector("#cardCategory").value = "JavaScript";
}
function loadCards() {
  renderCards(cards, cardsGrid);
  updateStats();
  recentCard()
}

function renderCards(arr, place) {
  place.innerHTML = "";
  arr.forEach((card) => {
    place.insertAdjacentHTML("beforeend", createCardHTML(card));
  });
  lucide.createIcons();
}

document.querySelector("#saveCardBtn").addEventListener("click", () => {
  //new
  const front = document.querySelector("#cardQuestion").value.trim();
  const back = document.querySelector("#cardAnswer").value.trim();
  const category = document.querySelector("#cardCategory").value;
  saveCard({ front, back, category });
});

loadCards();

// ---- FILTER / SEARCH / DELETE / STATS / RECENT ----
function updateStats() {
  const category = cards.reduce((acc, cur) => {
    let key = cur.category;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const bestCategory = Object.keys(category).length
    ? Object.keys(category).reduce((a, b) =>
      category[a] > category[b] ? a : b,
    )
    : "—";

  const updates = {
    ".js-total": cards.length,
    ".js-categories": Object.keys(category).length,
    ".js-best": bestCategory,
  };

  Object.entries(updates).forEach(([selector, value]) => {
    document
      .querySelectorAll(selector)
      .forEach((el) => (el.textContent = value));
  });
}
function debouncing(fnc, delay) {
  let timeId;
  return function (...arg) {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      fnc.apply(this, arg);
    }, delay);
  };
}
function handleSearch(e) {
  const value = e.target.value.trim().toLowerCase();
  if (!value) return loadCards();
  const matches = cards.filter((c) => {
    return (
      c.front.toLowerCase().includes(value) ||
      c.back.toLowerCase().includes(value) ||
      c.category.toLowerCase().includes(value)
    );
  });
  renderCards(matches, cardsGrid);
}
const debouncedSearch = debouncing(handleSearch, 300);

document
  .querySelector("#searchInput")
  .addEventListener("input", debouncedSearch);

const filterAllchip = document.querySelectorAll(".chip");

document.querySelector("#filterChips").addEventListener("click", (e) => {
  const targetchip = e.target.closest(".chip");
  if (!targetchip) return;
  const chips = targetchip.dataset.filter;
  filterAllchip.forEach((c) => c.classList.remove("active"));
  targetchip.classList.add("active");
  if (chips === "all") return loadCards();
  const filterBychip = cards.filter((c) => c.category === chips);
  renderCards(filterBychip, cardsGrid);
});

function recentCard() {
  const recents = cards.slice(-3)
  renderCards(recents, recentCardsList);
}

// ---- QUIZ MODE SELECTOR / START / API / REVEAL / KNOW / NOPE ----
async function genQuizByApi(numberOfquestion, Difficulty, combinedSignal) {
  const errors = {
    1: "Not enough question available",
    2: "Invalid parameters!",
    5: "Too many requests - wait 5 seconds!",
  };
  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${numberOfquestion}&category=18&difficulty=${Difficulty}`,
      {
        signal: combinedSignal
      },
    );
    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }
    const data = await res.json();
    if (data.response_code !== 0) {
      showToast(errors[data.response_code] || "something went wrong!", "error");
      return;
    }
    return data.results;
  } catch (error) {
    if (error.name === "AbortError") {
      if (controller.signal.aborted) return; // user quit — silent
      return showToast("Request timed out!", "error"); // timeout
    }
    showToast("Couldn't load questions. Try again.", "error"); // FIX 2
    return null;
  }
}

document.querySelector(".quiz-modes").addEventListener("click", (e) => {
  const selectedCard = e.target.closest(".mode-card");
  if (!selectedCard) return;
  document
    .querySelectorAll(".mode-card")
    .forEach((c) => c.classList.remove("selected"));
  selectedCard.classList.add("selected");
});
let controller = null;

const startQuiz = async (e) => {
  if (controller) controller.abort();
  controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(8000)
  const combinedSignal = AbortSignal.any([
    controller.signal,
    timeoutSignal,
  ]);

  const btn = document.querySelector("#startQuizBtn");

  btn.disabled = true;
  btn.textContent = "Loading...";
  const mode = document.querySelector(".mode-card.selected").dataset.mode;
  const count = document.querySelector("#quizCount").value;
  const difficulty = document.querySelector("#quizDifficulty").value;
 // const category = document.querySelector("#quizCategory").value;

  if (mode === "my-cards") {
  btn.disabled = false;
  btn.textContent = "Start Quiz";
  return showToast("coming soon !");
}

  const quiz = await genQuizByApi(count, difficulty, combinedSignal)
  if (!quiz || quiz.length === 0) return;
  btn.disabled = false;
  btn.textContent = "Start Quiz";
  renderQuizs(quiz);
}
document.querySelector("#startQuizBtn").addEventListener("click", startQuiz);
let currentIndex = 0;
let score = 0;
let quiz = []
let seconds = 0;
let timerInterval = null

function decodeHTML(str) {
  const text = document.createElement("textarea");
  text.innerHTML = str
  return text.value
}

function showQuestion(quiz) {
  const quizQuestion = decodeHTML(quiz[currentIndex].question);
  let quesNumber = currentIndex + 1
  let percent = ((currentIndex + 1) / quiz.length) * 100;

  document.querySelector("#quizScore").textContent = score;
  document.querySelector("#quizProgress").textContent = `${quesNumber}/${quiz.length}`;
  document.querySelector("#quizQNum").textContent = `Question-${quesNumber}`;
  document.querySelector("#quizAnswerBox").classList.remove("show");
  document.querySelector("#progressLabel").textContent =
    `Question ${quesNumber} of ${quiz.length}`;
  document.querySelector("#progressPercent").textContent = `${percent}%`;
  document.querySelector("#quizProgressFill").style.width = `${percent}%`;
  document.querySelector("#quizQuestionText").textContent = quizQuestion;

}

document.querySelector("#knowBtn").addEventListener("click", () => {
  score++;
  currentIndex++;
  if (currentIndex === quiz.length) return showResult(); // result baad mein
  showQuestion(quiz);
});

document.querySelector("#nopeBtn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex === quiz.length) return showResult(); // result baad mein
  showQuestion(quiz);
});

document.querySelector("#revealBtn").addEventListener("click", () => {
  document.querySelector("#quizAnswerText").textContent = decodeHTML(
    quiz[currentIndex].correct_answer,
  );
  document.querySelector("#quizAnswerBox").classList.add("show");
});

function renderQuizs(quizData) {
  currentIndex = 0;
  score = 0;
  clearInterval(timerInterval)
  seconds = 0
  quiz = quizData
  // 1. Setup hide — Active show
  document.querySelector("#quizSetupArea").style.display = "none";
  document.querySelector("#quizActiveArea").style.display = "block";

  // 2. Progress reset
  document.querySelector("#quizProgressFill").style.width = "0%";
  document.querySelector("#progressLabel").textContent =
    `Question 1 of ${quiz.length}`;
  document.querySelector("#progressPercent").textContent = "0%";

  // 3. Score reset
  document.querySelector("#quizScore").textContent = "0";
  document.querySelector("#quizProgress").textContent = `1/${quiz.length}`;

  // 4. Answer box hide
  document.querySelector("#quizAnswerBox").classList.remove("show");

  // 5. Pehla question render
  showQuestion(quiz);
   timerInterval = setInterval(() => {
    seconds++;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    document.querySelector("#quizTimer").textContent =
      `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, 1000);
}

function showResult() {
  clearInterval(timerInterval);
  const resultPercent = Math.round((score/quiz.length)*100);
  const quizTime = document.querySelector("#quizTimer").textContent;
 //show/hind part of ui
 document.querySelector("#quizActiveArea").style.display = "none";
 document.querySelector("#resultArea").classList.add("show");
 //update Doms
 document.querySelector("#resultScore").textContent = `${score}/${quiz.length}`;
 document.querySelector("#resultPercent").textContent = `${resultPercent}%`;
 document.querySelector("#resultTime").textContent = quizTime;
}

document.querySelector("#retryBtn").addEventListener("click",()=>{
  document.querySelector("#resultArea").classList.remove("show");
   document.querySelector("#quizSetupArea").style.display = "block";
});

document.querySelector("#goCards").addEventListener("click",(e)=>{
   document.querySelector("#cardnav").click();
});

document.querySelector("#quitQuizBtn").addEventListener('click',()=>{
  clearInterval(timerInterval);
  controller?.abort()
  document.querySelector("#quizActiveArea").style.display = "none";
  document.querySelector("#quizSetupArea").style.display = "block";

});

// ---- TOAST FUNCTION ---- (already ready, use karo poore project mein)
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast";

  const iconMap = {
    success: "check-circle",
    error: "alert-circle",
    info: "info",
  };

  toast.innerHTML = `
      <div class="toast-icon ${type}">
        <i data-lucide="${iconMap[type]}"></i>
      </div>
      <span>${message}</span>
    `;
  container.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => {
    setTimeout(() => toast.classList.add("show"), 10);
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
