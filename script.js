// --- Данные пользователя ---
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let multipliers = JSON.parse(localStorage.getItem("multipliers")) || {};

// --- Баланс и профиль ---
function updateBalance() {
  document.getElementById("balance").textContent = balance.toFixed(0);
  document.getElementById("profile-balance").textContent = balance.toFixed(0);
  localStorage.setItem("balance", balance);
}

function updateInventory() {
  document.getElementById("inventory").innerHTML =
    inventory.map(i => `<li>${i}</li>`).join("");
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("multipliers", JSON.stringify(multipliers));
  updateTotalMultiplier();
}

function updateTotalMultiplier() {
  const total = 1 + Object.values(multipliers).reduce((a, b) => a + b, 0);
  document.getElementById("total-mult").textContent = total.toFixed(1);
}

// --- Переключение вкладок ---
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// --- Ежедневный бонус ---
function dailyBonus() {
  const today = new Date().toISOString().slice(0, 10);
  const lastClaim = localStorage.getItem("lastDailyBonus");

  if (lastClaim !== today) {
    balance += 300;
    updateBalance();
    localStorage.setItem("lastDailyBonus", today);
    showNotice("+300 монет за ежедневный бонус!", "success");
  }
}

// --- Мины ---
const MINE_COST = 15;
let minesActive = false;
const grid = document.getElementById("mines-grid");

document.getElementById("start-mines").addEventListener("click", startMines);
document.getElementById("restart-mines").addEventListener("click", startMines);

function startMines() {
  if (balance < MINE_COST) {
    showNotice("Недостаточно монет", "error");
    return;
  }
  balance -= MINE_COST;
  updateBalance();
  minesActive = true;
  grid.innerHTML = "";

  const mines = new Set();
  while (mines.size < 3) mines.add(Math.floor(Math.random() * 9));

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => revealCell(cell, i, mines));
    grid.appendChild(cell);
  }

  showNotice(`Игра началась — ищи подарки! Стоимость: ${MINE_COST} монет`, "info");
}

function revealCell(cell, i, mines) {
  if (!minesActive || cell.classList.contains("revealed")) return;
  cell.classList.add("revealed");

  if (mines.has(i)) {
    cell.classList.add("mine");
    cell.textContent = "☠️";
    minesActive = false;
    showNotice("Мина! Игра окончена", "error");
  } else {
    cell.classList.add("crystal");
    cell.textContent = "🎁";
    const totalMult = 1 + Object.values(multipliers).reduce((a, b) => a + b, 0);
    const win = 15 * totalMult;
    balance += win;
    updateBalance();
    showNotice(`+${win.toFixed(0)} монет (×${totalMult.toFixed(1)})`, "success");
  }
}

// --- Магазин ---
const items = [
  { name: "FROST ×1.2", price: 100, mult: 0.2, img: "https://i.imgur.com/Knw9D7K.png" },
  { name: "SANTA ×1.5", price: 150, mult: 0.5, img: "https://i.imgur.com/Yv0wc6I.png" },
  { name: "NEW YEAR ×2", price: 200, mult: 1.0, img: "https://i.imgur.com/WX7tkFq.png" },
  { name: "ICE KING ×3", price: 350, mult: 2.0, img: "https://i.imgur.com/62uozc1.png" },
  { name: "MEDAL SILVER ×2.2", price: 300, mult: 1.2, img: "https://i.imgur.com/n1jMPlX.png" },
  { name: "MEDAL GOLD ×2.5", price: 400, mult: 1.5, img: "https://i.imgur.com/EHbxTtM.png" }
];

function renderShop() {
  const shop = document.getElementById("shop-items");
  shop.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p><b>${item.name}</b></p>
      <p>${item.price} монет</p>
    `;
    div.addEventListener("click", () => {
      if (inventory.includes(item.name)) return showNotice("Уже куплено", "info");
      if (balance < item.price) return showNotice("Недостаточно монет", "error");
      balance -= item.price;
      inventory.push(item.name);
      multipliers[item.name] = item.mult;
      updateBalance();
      updateInventory();
      showNotice(`Куплено ${item.name}!`, "success");
    });
    shop.appendChild(div);
  });
}

// --- Уведомления ---
function showNotice(text, type = "info") {
  const old = document.querySelector(".notice");
  if (old) old.remove();
  const notice = document.createElement("div");
  notice.classList.add("notice", type);
  notice.textContent = text;
  document.body.appendChild(notice);
  setTimeout(() => notice.classList.add("visible"), 50);
  setTimeout(() => {
    notice.classList.remove("visible");
    setTimeout(() => notice.remove(), 300);
  }, 2500);
}

// --- Инициализация ---
dailyBonus();
updateBalance();
updateInventory();
renderShop();
updateTotalMultiplier();
