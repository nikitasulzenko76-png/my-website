// === Локальное хранилище ===
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// === Обновление интерфейса ===
function updateBalance() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("profile-balance").textContent = balance;
  localStorage.setItem("balance", balance);
}

function updateInventory() {
  const list = document.getElementById("inventory");
  list.innerHTML = inventory.map(i => `<li>${i}</li>`).join("");
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// === Переключение вкладок ===
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// === Игра "Мины" ===
function initMines() {
  const grid = document.getElementById("mines-grid");
  grid.innerHTML = "";
  const mines = new Set();
  while (mines.size < 3) mines.add(Math.floor(Math.random() * 9));
  const cells = Array.from({ length: 9 }, (_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => {
      if (cell.classList.contains("revealed")) return;
      cell.classList.add("revealed");
      if (mines.has(i)) {
        cell.textContent = "💣";
        alert("💥 Мина! Игра окончена.");
        initMines();
      } else {
        cell.textContent = "🎁";
        balance += 10;
        updateBalance();
      }
    });
    return cell;
  });
  cells.forEach(c => grid.appendChild(c));
}
document.getElementById("restart-mines").addEventListener("click", initMines);

// === Магазин ===
const items = [
  { name: "Тег KING 👑", price: 200 },
  { name: "Тег PRO ⚡", price: 150 },
  { name: "Новогодняя медаль 🎄", price: 300 },
  { name: "Магия ❄️", price: 500 },
];

function renderShop() {
  const shop = document.getElementById("shop-items");
  shop.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `<img src="https://via.placeholder.com/80?text=${encodeURIComponent(item.name)}"><br>
                     <b>${item.name}</b><br>
                     💰 ${item.price}`;
    div.addEventListener("click", () => {
      if (inventory.includes(item.name)) return alert("Уже куплено!");
      if (balance < item.price) return alert("Недостаточно монет!");
      balance -= item.price;
      inventory.push(item.name);
      updateBalance();
      updateInventory();
      alert(`Куплено: ${item.name}!`);
    });
    shop.appendChild(div);
  });
}

// === Инициализация ===
updateBalance();
updateInventory();
renderShop();
initMines();
