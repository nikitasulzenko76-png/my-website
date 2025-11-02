// === ДАННЫЕ ===
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// === ОБНОВЛЕНИЕ ===
function updateBalance() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("profile-balance").textContent = balance;
  localStorage.setItem("balance", balance);
}
function updateInventory() {
  document.getElementById("inventory").innerHTML =
    inventory.map(i => `<li>${i}</li>`).join("");
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// === ВКЛАДКИ ===
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// === МИНЫ (ледяной стиль) ===
const MINE_COST = 20;
let minesActive = false;
let revealedCount = 0;
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
  revealedCount = 0;
  grid.innerHTML = "";

  const mines = new Set();
  while (mines.size < 3) mines.add(Math.floor(Math.random() * 9));

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => revealCell(cell, i, mines));
    grid.appendChild(cell);
  }

  showNotice("Игра началась — ищи кристаллы", "info");
}

function revealCell(cell, i, mines) {
  if (!minesActive || cell.classList.contains("revealed")) return;
  cell.classList.add("revealed");

  if (mines.has(i)) {
    cell.classList.add("mine");
    minesActive = false;
    showNotice("Мина! Раунд окончен", "error");
    setTimeout(() => {
      document.querySelectorAll(".cell").forEach(c => {
        if (!c.classList.contains("revealed")) c.classList.add("frozen");
      });
    }, 300);
  } else {
    cell.classList.add("crystal");
    revealedCount++;
    balance += 15;
    updateBalance();

    if (revealedCount === 6) {
      minesActive = false;
      showNotice("Ты нашёл все кристаллы", "success");
    }
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
const items = [
  { name: "Тег FROST", price: 100 },
  { name: "Тег SANTA", price: 150 },
  { name: "Медаль NEW YEAR", price: 200 },
  { name: "Медаль ICE KING", price: 350 },
];
function renderShop() {
  const shop = document.getElementById("shop-items");
  shop.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `<p>${item.name}</p><p>${item.price} монет</p>`;
    div.addEventListener("click", () => {
      if (inventory.includes(item.name)) return showNotice("Уже куплено", "info");
      if (balance < item.price) return showNotice("Недостаточно монет", "error");
      balance -= item.price;
      inventory.push(item.name);
      updateBalance();
      updateInventory();
      showNotice(`Куплено: ${item.name}`, "success");
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
