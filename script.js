// ----------------------------
// Coin Battle v3 - Локальные дуэли
// ----------------------------

// --- Локальные данные ---
let balance = parseInt(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let multipliers = JSON.parse(localStorage.getItem("multipliers")) || {};
let playerId = localStorage.getItem("playerId");
if (!playerId) {
    playerId = "CB" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("playerId", playerId);
}
document.getElementById("player-id").textContent = playerId;

// --- Ежедневный бонус ---
const lastBonus = localStorage.getItem("lastBonus") || 0;
const today = new Date().toDateString();
if (lastBonus !== today) {
    balance += 300;
    localStorage.setItem("lastBonus", today);
    showNotice("+300 монет за ежедневный бонус!", "success");
}

// --- Обновление интерфейса ---
function updateBalance() {
    document.getElementById("balance").textContent = balance.toFixed(0);
    document.getElementById("profile-balance").textContent = balance.toFixed(0);
    localStorage.setItem("balance", balance);
}
function updateInventory() {
    const invDiv = document.getElementById("inventory");
    invDiv.innerHTML = "";
    inventory.forEach(i => {
        const div = document.createElement("div");
        div.classList.add("inv-item");
        div.innerHTML = `<img src="${i.img}" alt="${i.name}"><p>${i.name}</p>`;
        invDiv.appendChild(div);
    });
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("multipliers", JSON.stringify(multipliers));
    updateTotalMultiplier();
}
function updateTotalMultiplier() {
    const total = 1 + Object.values(multipliers).reduce((a,b)=>a+b,0);
    document.getElementById("total-mult").textContent = total.toFixed(1);
}

// --- Вкладки ---
document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
        document.querySelectorAll(".tab").forEach(tab=>tab.classList.remove("active"));
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// --- Мины ---
const MINE_COST = 15;
let minesActive = false;
const grid = document.getElementById("mines-grid");
document.getElementById("mine-cost-label").textContent = MINE_COST;
document.getElementById("start-mines").addEventListener("click", startMines);
document.getElementById("restart-mines").addEventListener("click", startMines);

function startMines() {
    if(balance<MINE_COST){ showNotice("Недостаточно монет","error"); return; }
    balance-=MINE_COST; updateBalance();
    minesActive=true; grid.innerHTML="";
    const mines = new Set();
    while(mines.size<3) mines.add(Math.floor(Math.random()*9));
    for(let i=0;i<9;i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", ()=>revealCell(cell,i,mines));
        grid.appendChild(cell);
    }
    showNotice("Игра началась — ищи подарки!", "info");
}
function revealCell(cell,i,mines){
    if(!minesActive||cell.classList.contains("revealed")) return;
    cell.classList.add("revealed");
    if(mines.has(i)){
        cell.classList.add("mine"); cell.textContent="☠️"; minesActive=false;
        showNotice("Мина! Игра окончена","error");
    } else {
        cell.classList.add("crystal"); cell.textContent="🎁";
        const totalMult = 1+Object.values(multipliers).reduce((a,b)=>a+b,0);
        const win = 15*totalMult; balance+=win; updateBalance();
        showNotice(`+${win.toFixed(0)} монет (×${totalMult.toFixed(1)})`,"success");
    }
}

// --- Магазин ---
const items = [
    {name:"FROST ×1.2", price:100*3, mult:0.2, img:"frost.jpg"},
    {name:"SANTA ×1.5", price:150*3, mult:0.5, img:"santa.jpg"},
    {name:"NEW YEAR ×2", price:200*3, mult:1.0, img:"newyear.jpg"},
    {name:"ICE KING ×3", price:350*3, mult:2.0, img:"iceking.jpg"},
];
function renderShop(){
    const shop = document.getElementById("shop-items"); shop.innerHTML="";
    items.forEach(item=>{
        const div=document.createElement("div"); div.classList.add("shop-item");
        div.innerHTML=`<img src="${item.img}" alt="${item.name}"><p>${item.name}</p><p>${item.price} монет</p>`;
        div.addEventListener("click", ()=>{
            if(inventory.some(x=>x.name===item.name)) return showNotice("Уже куплено","info");
            if(balance<item.price) return showNotice("Недостаточно монет","error");
            balance-=item.price;
            inventory.push(item);
            multipliers[item.name]=item.mult;
            updateBalance(); updateInventory();
            showNotice(`Куплено ${item.name}!`,"success");
        });
        shop.appendChild(div);
    });
}

// --- Уведомления ---
function showNotice(text,type="info"){
    const old = document.querySelector(".notice"); if(old) old.remove();
    const notice=document.createElement("div"); notice.classList.add("notice",type); notice.textContent=text;
    document.body.appendChild(notice);
    setTimeout(()=>notice.classList.add("visible"),50);
    setTimeout(()=>{notice.classList.remove("visible"); setTimeout(()=>notice.remove(),300)},2500);
}

// --- Снег ---
const canvas=document.getElementById("snow"); const ctx=canvas.getContext("2d"); let snowflakes=[];
function resize(){canvas.width=window.innerWidth; canvas.height=window.innerHeight;}
window.addEventListener("resize",resize); resize();
function createSnow(){for(let i=0;i<150;i++){snowflakes.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*3+1,d:Math.random()+0.5});}}
createSnow();
function drawSnow(){ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle="rgba(255,255,255,0.8)"; ctx.beginPath();
for(let f of snowflakes){ctx.moveTo(f.x,f.y); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);} ctx.fill(); moveSnow();}
function moveSnow(){for(let f of snowflakes){f.y+=f.d; if(f.y>canvas.height){f.y=0; f.x=Math.random()*canvas.width;}}}
setInterval(drawSnow,33);

// --- Дуэли ---
let duelData = null;
const duelStartBtn=document.getElementById("duel-start");
const duelArena=document.getElementById("duel-arena");
const duelBoard1=document.getElementById("duel-board1");
const duelBoard2=document.getElementById("duel-board2");
const duelLabel=document.getElementById("duel-label");
const duelTurnInfo=document.getElementById("duel-turn-info");
const duelForfeit=document.getElementById("duel-forfeit");

duelStartBtn.addEventListener("click",()=>{
    const p1 = document.getElementById("duel-player1").value||playerId;
    const p2 = document.getElementById("duel-player2").value||"Friend";
    if(balance<50){showNotice("Недостаточно монет для ставки","error"); return;}
    duelData={
        p1:{id:p1,balance:balance,board:Array(9).fill(null)},
        p2:{id:p2,balance:50,board:Array(9).fill(null)},
        turn:"p1",
        minesActive:true
    };
    balance-=50; updateBalance();
    duelArena.classList.remove("hidden");
    duelLabel.textContent=`Дуэль: ${p1} vs ${p2}`;
    document.getElementById("duel-p1-name").textContent=p1;
    document.getElementById("duel-p2-name").textContent=p2;
    renderDuelBoards();
    updateDuelTurnInfo();
});
duelForfeit.addEventListener("click",()=>{endDuel(duelData.turn==="p1"?"p2":"p1","Сдался");});

function renderDuelBoards(){
    duelBoard1.innerHTML=""; duelBoard2.innerHTML="";
    [duelBoard1,duelBoard2].forEach((boardDiv,idx)=>{
        const player = idx===0?duelData.p1:duelData.p2;
        player.board.forEach((cell,i)=>{
            const div = document.createElement("div"); div.classList.add("cell");
            if(player.board[i]==="mine"){div.classList.add("mine"); div.textContent="☠️";}
            else if(player.board[i]==="gift"){div.classList.add("crystal"); div.textContent="🎁";}
            div.addEventListener("click",()=>duelCellClick(idx===0?"p1":"p2",i));
            boardDiv.appendChild(div);
        });
    });
}

function duelCellClick(playerKey,index){
    if(!duelData.minesActive) return;
    if(duelData.turn!==playerKey) return;
    const player = duelData[playerKey];
    if(player.board[index]) return;
    const minesSet = new Set();
    while(minesSet.size<3) minesSet.add(Math.floor(Math.random()*9));
    if(minesSet.has(index)){ player.board[index]="mine"; showNotice("☠️ Мина!","error"); endDuel(playerKey==="p1"?"p2":"p1","Выиграл");}
    else { player.board[index]="gift"; showNotice("🎁 Найдено!","success"); }
    duelData.turn = duelData.turn==="p1"?"p2":"p1";
    renderDuelBoards(); updateDuelTurnInfo();
}

function updateDuelTurnInfo(){
    duelTurnInfo.textContent=`Ход: ${duelData.turn==="p1"?duelData.p1.id:duelData.p2.id}`;
}

function endDuel(winnerKey,msg){
    showNotice(`${duelData[winnerKey].id} победил! ${msg}`,"success");
    if(winnerKey==="p1") balance+=100; else balance+=100;
    updateBalance();
    duelArena.classList.add("hidden");
    duelData=null;
}

// --- Инициализация ---
updateBalance();
updateInventory();
renderShop();
updateTotalMultiplier();
