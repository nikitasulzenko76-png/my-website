// Защищаем выполнение скрипта до полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // --- Константы и элементы ---
  const MINE_COST = 15;
  const CELL_COUNT = 9;

  const startBtn = document.getElementById('start-mines');
  const restartBtn = document.getElementById('restart-mines');
  const gridEl = document.getElementById('mines-grid');
  const shopEl = document.getElementById('shop-items');
  const invEl = document.getElementById('inventory');
  const playerIdEl = document.getElementById('player-id');
  const profileBalanceEl = document.getElementById('profile-balance');
  const headerBalanceEl = document.getElementById('balance');

  // --- Вкладки (работают) ---
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabName = btn.dataset.tab;
    if (!tabName) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const section = document.getElementById(tabName);
    if (section) section.classList.add('active');
  });

  // --- Игрок / баланс / инвентарь ---
  let balance = parseInt(localStorage.getItem('balance')) || 100;
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  let multipliers = JSON.parse(localStorage.getItem('multipliers')) || {};
  const playerId = localStorage.getItem('playerId') || String(Math.floor(Math.random()*900000)+100000);
  localStorage.setItem('playerId', playerId);
  playerIdEl.textContent = playerId;

  function updateBalanceUI(){
    // показываем и в шапке, и в профиле
    if (headerBalanceEl) headerBalanceEl.textContent = balance.toFixed(0);
    if (profileBalanceEl) profileBalanceEl.textContent = balance.toFixed(0);
    localStorage.setItem('balance', balance);
  }

  function updateInventoryUI(){
    invEl.innerHTML = '';
    inventory.forEach(it => {
      const d = document.createElement('div');
      d.className = 'shop-item';
      d.innerHTML = `<p style="font-weight:700">${it.name}</p>`;
      invEl.appendChild(d);
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('multipliers', JSON.stringify(multipliers));
  }

  updateBalanceUI();
  updateInventoryUI();

  // --- Магазин (демо) ---
  const items = [
    {name:"FROST ×1.2", price:300, mult:0.2},
    {name:"MEDAL GOLD", price:450, mult:0},
    {name:"NEW YEAR ×2", price:600, mult:1.0},
  ];

  function renderShop(){
    shopEl.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `<p style="font-weight:700">${item.name}</p><p>${item.price} монет</p>`;
      div.addEventListener('click', () => {
        if (inventory.find(i => i.name === item.name)) return alert('Уже куплено');
        if (balance < item.price) return alert('Недостаточно монет');
        balance -= item.price;
        inventory.push({name: item.name});
        if (item.mult) multipliers[item.name] = item.mult;
        updateBalanceUI();
        updateInventoryUI();
        alert(`Куплено: ${item.name}`);
      });
      shopEl.appendChild(div);
    });
  }
  renderShop();

  // --- Поле и логика игры ---
  let layout = []; // 'gift' | 'mine' | 'zero'
  let revealed = [];
  let gameOver = false;

  function createCell(index){
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.dataset.index = index;
    btn.setAttribute('aria-label', `Клетка ${index+1}`);
    btn.innerHTML = `<div class="icon-wrap"></div>`;
    return btn;
  }

  function generateLayout(){
    const arr = new Array(CELL_COUNT).fill('0');
    let idxs = [...Array(CELL_COUNT).keys()];
    idxs = idxs.sort(() => Math.random() - 0.5);
    // 3 gifts
    for (let i = 0; i < 3; i++) arr[idxs[i]] = 'gift';
    // 4 mines
    for (let i = 3; i < 7; i++) arr[idxs[i]] = 'mine';
    // rest '0'
    return arr;
  }

  function initGridDOM(){
    gridEl.innerHTML = '';
    for (let i = 0; i < CELL_COUNT; i++){
      gridEl.appendChild(createCell(i));
    }
  }

  function startGame(){
    layout = generateLayout();
    revealed = new Array(CELL_COUNT).fill(false);
    gameOver = false;
    initGridDOM();
    attachCellHandlers();
  }

  // reveal single cell
  function revealCell(cellEl, idx){
    if (revealed[idx] || gameOver) return;
    revealed[idx] = true;
    const type = layout[idx];
    cellEl.classList.add('revealed');

    if (type === 'gift'){
      cellEl.classList.add('gift');
      cellEl.querySelector('.icon-wrap').innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><use href="#svg-gift" /></svg>`;
      addFlash(cellEl);
      spawnConfetti(cellEl);
      // награда: +15 монет (можешь изменить)
      balance += 15;
      updateBalanceUI();
    } else if (type === 'mine'){
      cellEl.classList.add('mine');
      cellEl.querySelector('.icon-wrap').innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><use href="#svg-mine" /></svg>`;
      addFlash(cellEl);
      // штраф: -25 монет (пример)
      balance = Math.max(0, balance - 25);
      updateBalanceUI();
      // конец игры: reveal all and lock
      gameOver = true;
      setTimeout(() => {
        revealAll(); // покажем остальные клетки
        setTimeout(()=> alert('Бомба! Игра окончена.'), 80);
      }, 120);
    } else {
      // zero — не показываем '0', оставляем пустую и лёгкую стилизацию
      cellEl.classList.add('zero');
      // оставляем пустую иконку — ничего не пишем
      addFlash(cellEl);
    }
    cellEl.disabled = true;
    // если все непустые открыты — можно автоматически закончить игру (опция)
  }

  // reveal all cells (used on mine)
  function revealAll(){
    Array.from(gridEl.children).forEach((cellEl, idx) => {
      if (revealed[idx]) return; // уже открыто
      revealed[idx] = true;
      const type = layout[idx];
      cellEl.classList.add('revealed');
      if (type === 'gift'){
        cellEl.classList.add('gift');
        cellEl.querySelector('.icon-wrap').innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><use href="#svg-gift" /></svg>`;
      } else if (type === 'mine'){
        cellEl.classList.add('mine');
        cellEl.querySelector('.icon-wrap').innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44"><use href="#svg-mine" /></svg>`;
      } else {
        cellEl.classList.add('zero');
      }
      cellEl.disabled = true;
    });
  }

  function addFlash(cellEl){
    const f = document.createElement('div');
    f.className = 'flash';
    cellEl.appendChild(f);
    setTimeout(()=>{ if (f.parentNode) f.parentNode.removeChild(f); }, 520);
  }

  function spawnConfetti(cellEl){
    const conf = document.createElement('div'); conf.className = 'confetti';
    const colors = ['#1ea6ff','#ffd166','#7efc6a','#ff6bcb','#7aa2ff'];
    for (let i=0;i<8;i++){
      const el = document.createElement('i');
      el.style.left = 44 + (Math.random()*40 - 20) + 'px';
      el.style.top = 44 + (Math.random()*20 - 10) + 'px';
      el.style.background = colors[i % colors.length];
      el.style.animationDelay = (Math.random()*0.12)+'s';
      el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
      conf.appendChild(el);
    }
    cellEl.appendChild(conf);
    setTimeout(()=>{ conf.remove(); }, 920);
  }

  // делегируем клики по ячейкам
  function attachCellHandlers(){
    // очищаем предыдущий слушатель (на всякий случай)
    gridEl.replaceWith(gridEl.cloneNode(true));
    const newGrid = document.getElementById('mines-grid');
    newGrid.addEventListener('click', (ev) => {
      if (gameOver) return;
      const c = ev.target.closest('.cell');
      if (!c) return;
      const idx = +c.dataset.index;
      revealCell(c, idx);
    });
  }

  // хуки кнопок
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  // начальная отрисовка пустого поля
  initGridDOM();

  // --- готово ---
});
