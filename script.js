// Данные игрока
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || []; 
let multipliers = JSON.parse(localStorage.getItem("multipliers")) || {};
let playerId = localStorage.getItem("playerId") || Math.floor(Math.random()*1000000);

// Обновление баланса
function updateBalance(){
  document.getElementById("balance").textContent = balance.toFixed(0);
  document.getElementById("profile-balance").textContent = balance.toFixed(0);
  localStorage.setItem("balance", balance);
}

// Обновление инвентаря
function updateInventory(){
  const invDiv = document.getElementById("inventory");
  invDiv.innerHTML = "";
  inventory.forEach(item=>{
    const div = document.createElement("div");
    div.classList.add("inv-item");
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"><p>${item.name}</p>`;
    invDiv.appendChild(div);
  });
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("multipliers", JSON.stringify(multipliers));
  updateTotalMultiplier();
}

// Множители
function updateTotalMultiplier(){
  const total = 1 + Object.values(multipliers).reduce((a,b)=>a+b,0);
  document.getElementById("total-mult").textContent = total.toFixed(1);
}

// Показываем ID игрока
document.getElementById("player-id").textContent = playerId;

// Табуляция
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(tab=>tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Магазин
const items = [
  {name:"FROST ×1.2", price:300, mult:0.2, img:"frost.jpg"},
  {name:"SANTA ×1.5", price:450, mult:0.5, img:"santa.jpg"},
  {name:"NEW YEAR ×2", price:600, mult:1.0, img:"newyear.jpg"},
  {name:"ICE KING ×3", price:1050, mult:2.0, img:"iceking.jpg"},
  {name:"MEDAL BRONZE", price:150, mult:0, img:"medal_bronze.jpg"},
  {name:"MEDAL SILVER", price:300, mult:0, img:"medal_silver.jpg"},
  {name:"MEDAL GOLD", price:450, mult:0, img:"medal_gold.jpg"},
];

function renderShop(){
  const shop = document.getElementById("shop-items");
  shop.innerHTML = "";
  items.forEach(item=>{
    const div = document.createElement("div");
    div.classList.add("shop-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p>${item.name}</p>
      <p>${item.price} монет</p>
    `;
    div.addEventListener("click", ()=>{
      // Проверка покупки
      if(inventory.find(i=>i.name===item.name)) return showNotice("Уже куплено","info");
      if(balance<item.price) return showNotice("Недостаточно монет","error");
      balance -= item.price;
      inventory.push({name:item.name,img:item.img});
      if(item.mult) multipliers[item.name]=item.mult;
      updateBalance();
      updateInventory();
      showNotice(`Куплено ${item.name}!`,"success");
    });
    shop.appendChild(div);
  });
}

// Инициализация
updateBalance();
updateInventory();
renderShop();
updateTotalMultiplier();
