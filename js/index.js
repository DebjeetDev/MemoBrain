lucide.createIcons();

// ================================================
// BHAI — YAHAN SE TERA JS SHURU HOGA
// ================================================

// ---- NAVIGATION ----
const navItems = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const screenName = item.dataset.screen;
    navItems.forEach((i) => i.classList.remove("active"));
    screens.forEach((s) => s.classList.remove("active"));
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
// Open: #heroCreateBtn, #cardsCreateBtn, #sidebarCreateBtn
// Close: #closeModal, #cancelModalBtn
// Toggle class: 'open' on #createModal

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
// Event delegation on #cardsGrid
// delete-btn click pe flip mat ho — e.target.closest('.delete-btn') check karo



// ---- SAVE CARD ----
// Validate → localStorage push → DOM insert → modal close → toast → stats update

// ---- LOAD CARDS ----
// localStorage se load + render (sample cards replace ya keep — teri choice)

// ---- FILTER / SEARCH / DELETE / STATS / RECENT ----

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
