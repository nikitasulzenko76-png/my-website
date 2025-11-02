// === ДАННЫЕ ===
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let multipliers = JSON.parse(localStorage.getItem("multipliers")) || {}; // {itemName: value}

// === ОБНОВЛЕНИЕ ===
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
}

// === ВКЛАДКИ ===
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// === МИНЫ ===
const MINE_COST = 20;
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

  showNotice("Игра началась — ищи подарки!", "info");
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

// === УВЕДОМЛЕНИЯ ===
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

// === МАГАЗИН ===
// теперь картинки можно просто положить рядом с index.html
const items = [
  { name: "FROST ×1.2", price: 100, mult: 0.2, img: "frost.png" },
  { name: "SANTA ×1.5", price: 150, mult: 0.5, img: "santa.png" },
  { name: "NEW YEAR ×2", price: 200, mult: 1.0, img: "newyear.png" },
  { name: "ICE KING ×3", price: 350, mult: 2.0, img: "iceking.png" },
];

function renderShop() {
  const shop = document.getElementById("shop-items");
  shop.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p>${item.name}</p>
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

// === СНЕГ ===
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let snowflakes = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createSnow() {
  for (let i = 0; i < 150; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      d: Math.random() + 0.5,
    });
  }
}
createSnow();

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  for (let f of snowflakes) {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }
  ctx.fill();
  moveSnow();
}
function moveSnow() {
  for (let f of snowflakes) {
    f.y += f.d;
    if (f.y > canvas.height) {
      f.y = 0;
      f.x = Math.random() * canvas.width;
    }
  }
}
setInterval(drawSnow, 33);

// === ИНИЦИАЛИЗАЦИЯ ===
updateBalance();
updateInventory();
renderShop();
