let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let multipliers = JSON.parse(localStorage.getItem("multipliers")) || {};
let playerId = localStorage.getItem("playerId") || Math.floor(Math.random()*1000000);
localStorage.setItem("playerId", playerId);
document.getElementById("player-id").textContent = playerId;

// Ежедневный бонус
let lastBonus = localStorage.getItem("lastBonus") || 0;
let today = new Date().setHours(0,0,0,0);
if(today > lastBonus){
  balance += 300;
  localStorage.setItem("lastBonus", today);
  alert("Ежедневный бонус: +300 монет!");
}

function updateBalance(){
  document.getElementById("balance").textContent = balance.toFixed(0);
  document.getElementById("profile-balance").textContent = balance.toFixed(0);
  localStorage.setItem("balance", balance);
}

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

function updateTotalMultiplier(){
  const total = 1 + Object.values(multipliers).reduce((a,b)=>a+b,0);
  document.getElementById("total-mult").textContent = total.toFixed(1);
}

// Делегирование для табов
document.body.addEventListener("click", function(e){
  if(e.target.matches(".tab-btn")){
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    e.target.classList.add("active");
    document.querySelectorAll(".tab").forEach(tab=>tab.classList.remove("active"));
    document.getElementById(e.target.dataset.tab).classList.add("active");
  }
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
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"><p>${item.name}</p><p>${item.price} монет</p>`;
    div.addEventListener("click", ()=>{
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

// Уведомления
function showNotice(text,type="info"){
  const old = document.querySelector(".notice"); if(old) old.remove();
  const notice = document.createElement("div");
  notice.classList.add("notice",type);
  notice.textContent = text;
  document.body.appendChild(notice);
  setTimeout(()=>notice.classList.add("visible"),50);
  setTimeout(()=>{notice.classList.remove("visible"); setTimeout(()=>notice.remove(),300)},2500);
}

// Инициализация
updateBalance();
updateInventory();
renderShop();
updateTotalMultiplier();
