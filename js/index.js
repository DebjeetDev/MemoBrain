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
    if(!screenName) return
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

// ---- FLIP CARDS ----
function deleteCard(id) {
  if (!id) {
    console.warn("id not come!");
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
  updateStats();
}

const cardsGrid = document.querySelector("#cardsGrid");
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
  updateStats()
}
function loadCards() {
  cardsGrid.innerHTML = ""; // pehle clear karo
  cards.forEach((card) => {
    cardsGrid.insertAdjacentHTML("beforeend", createCardHTML(card));
  });
  updateStats();
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

// ---- QUIZ MODE SELECTOR / START / API / REVEAL / KNOW / NOPE ----

// ---- TIMER / RESULT / RETRY / QUIT ----

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
