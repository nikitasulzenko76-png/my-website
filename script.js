// Basic state + UI
const MINE_COST = 15;
const startBtn = document.getElementById('start-mines');
const restartBtn = document.getElementById('restart-mines');
const gridEl = document.getElementById('mines-grid');
document.getElementById('mine-cost-label').textContent = MINE_COST;

// layout: 3x3 (9 cells)
const CELL_COUNT = 9;

// SVG templates
const giftSVG = `<svg viewBox="0 0 24 24"><use href="#svg-gift" /></svg>`;
const mineSVG = `<svg viewBox="0 0 24 24"><use href="#svg-mine" /></svg>`;

// create empty cell DOM
function createCell(index){
  const el = document.createElement('button');
  el.className = 'cell';
  el.dataset.index = index;
  el.setAttribute('aria-label', `Клетка ${index+1}`);
  el.innerHTML = `<div class="icon-wrap"></div>`;
  return el;
}

// initialize grid nodes (non-revealed)
function initGridDOM(){
  gridEl.innerHTML = '';
  for(let i=0;i<CELL_COUNT;i++){
    gridEl.appendChild(createCell(i));
  }
  attachCellHandlers();
}

// Random setup: place 3 gifts, 4 mines, rest zeros (matches image ratio-ish)
function generateLayout(){
  const arr = new Array(CELL_COUNT).fill('0');
  // place 3 gifts
  let idxs = shuffle([...Array(CELL_COUNT).keys()]);
  for(let i=0;i<3;i++) arr[idxs[i]] = 'gift';
  // place 3 mines (image shows many mines — we choose 4 to be challenging)
  for(let i=3;i<7;i++) arr[idxs[i]] = 'mine';
  // rest remain '0'
  return arr;
}

let layout = [];
let revealed = new Array(CELL_COUNT).fill(false);

function startGame(){
  // reset
  layout = generateLayout();
  revealed.fill(false);
  initGridDOM();
  // pre-style cells visually (closed)
  Array.from(gridEl.children).forEach((cell,i)=>{
    cell.className = 'cell';
    cell.querySelector('.icon-wrap').innerHTML = '';
    cell.disabled = false;
  });
}

// event handlers for clicks
function attachCellHandlers(){
  gridEl.addEventListener('click', (ev)=>{
    const cellEl = ev.target.closest('.cell');
    if(!cellEl) return;
    const idx = +cellEl.dataset.index;
    if(revealed[idx]) return;
    revealCell(cellEl, idx);
  });
}

// reveal logic + animation
function revealCell(cellEl, idx){
  revealed[idx] = true;
  const type = layout[idx];
  cellEl.classList.add('revealed');

  if(type === 'gift'){
    cellEl.classList.add('gift');
    // show gift svg
    cellEl.querySelector('.icon-wrap').innerHTML = giftSVG;
    // flash
    addFlash(cellEl);
    // confetti burst
    spawnConfetti(cellEl);
    // optionally increase balance / give reward (not implemented here)
  } else if(type === 'mine'){
    cellEl.classList.add('mine');
    cellEl.querySelector('.icon-wrap').innerHTML = mineSVG;
    addFlash(cellEl);
    // lose action — show red pulse
    cellEl.animate([
      { boxShadow: '0 6px 24px rgba(255,60,60,0.08)' },
      { boxShadow: '0 0 40px rgba(255,60,60,0.22)' },
      { boxShadow: '0 6px 24px rgba(255,60,60,0.08)' }
    ], { duration:520 });
  } else {
    cellEl.classList.add('zero');
    cellEl.querySelector('.icon-wrap').textContent = '0';
    addFlash(cellEl);
  }
  // disable button after reveal
  cellEl.disabled = true;
}

// small flash overlay
function addFlash(cellEl){
  const f = document.createElement('div');
  f.className = 'flash';
  cellEl.appendChild(f);
  // remove after animation
  setTimeout(()=>{ if(f && f.parentNode) f.parentNode.removeChild(f); }, 520);
}

// confetti: create 8 tiny bars with randomized positions/colors/animation delays
function spawnConfetti(cellEl){
  const conf = document.createElement('div'); conf.className='confetti';
  const colors = ['#1ea6ff','#ffd166','#7efc6a','#ff6bcb','#7aa2ff'];
  for(let i=0;i<8;i++){
    const el = document.createElement('i');
    el.style.left = 40 + (Math.random()*30 - 12) + 'px';
    el.style.top = 40 + (Math.random()*10 - 8) + 'px';
    el.style.background = colors[i % colors.length];
    el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random()*0.12)+'s';
    el.style.opacity = 1;
    conf.appendChild(el);
  }
  cellEl.appendChild(conf);
  setTimeout(()=>{ conf.remove(); }, 920);
}

// small utility shuffle
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

// hook buttons
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// init
initGridDOM();
layout = generateLayout();
