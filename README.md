<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Casino 💀</title>
  <style>
    body {
      background-color: #0a0a0a;
      color: #fff;
      font-family: 'Trebuchet MS', sans-serif;
      text-align: center;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    h1 {
      font-size: 70px;
      margin: 50px 0 20px;
      text-shadow: 0 0 25px #ff0000, 0 0 50px #ff0000;
      animation: blink 1.5s infinite;
    }

    @keyframes blink {
      0%, 100% { color: #ff0000; text-shadow: 0 0 25px #ff0000, 0 0 50px #ff0000; }
      50% { color: #ff6f00; text-shadow: 0 0 25px #ff6f00, 0 0 50px #ff6f00; }
    }

    .balance {
      font-size: 26px;
      margin-bottom: 30px;
      text-shadow: 0 0 10px #00ff00;
    }

    .shop {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 40px;
      padding-bottom: 60px;
    }

    .item {
      background: #1b1b1b;
      border-radius: 20px;
      padding: 20px;
      width: 260px;
      box-shadow: 0 0 25px rgba(255, 0, 0, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .item:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(255, 0, 0, 0.6);
    }

    .item img {
      width: 220px;
      height: 220px;
      border-radius: 15px;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
      transition: transform 0.3s;
    }

    .item img:hover {
      transform: rotate(3deg) scale(1.05);
    }

    p {
      font-size: 18px;
      margin: 10px 0;
    }

    button {
      background: #ff0000;
      border: none;
      color: white;
      padding: 10px 25px;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }

    button:hover {
      background: #ff6f00;
      transform: scale(1.1);
    }

    .bought {
      background: #333 !important;
      color: #888 !important;
      cursor: not-allowed !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .buy-effect {
      animation: pop 0.3s ease;
    }

    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  </style>
</head>
<body>
  <h1>Casino 💀</h1>
  <div class="balance">Баланс: <span id="balance">1000</span>💰</div>

  <div class="shop">
    <div class="item">
      <img src="https://files.catbox.moe/m7yxlf.png" alt="Череп">
      <p>Цена: 1000💰</p>
      <button id="buy1">Купить</button>
    </div>

    <div class="item">
      <img src="https://files.catbox.moe/hum5d3.png" alt="Зелье">
      <p>Цена: 1000💰</p>
      <button id="buy2">Купить</button>
    </div>
  </div>

  <script>
    let balance = parseInt(localStorage.getItem('balance')) || 1000;
    let bought1 = localStorage.getItem('bought1') === 'true';
    let bought2 = localStorage.getItem('bought2') === 'true';

    const balanceEl = document.getElementById('balance');
    const buy1Btn = document.getElementById('buy1');
    const buy2Btn = document.getElementById('buy2');

    function updateDisplay() {
      balanceEl.textContent = balance;
      if (bought1) markBought(buy1Btn);
      if (bought2) markBought(buy2Btn);
    }

    function markBought(button) {
      button.textContent = 'Куплено';
      button.disabled = true;
      button.classList.add('bought');
    }

    function saveState() {
      localStorage.setItem('balance', balance);
      localStorage.setItem('bought1', bought1);
      localStorage.setItem('bought2', bought2);
    }

    function handleBuy(button, itemVar) {
      if (balance >= 1000 && !itemVar.value) {
        balance -= 1000;
        itemVar.value = true;
        button.classList.add('buy-effect');
        setTimeout(() => button.classList.remove('buy-effect'), 300);
        saveState();
        updateDisplay();
      } else {
        alert('Недостаточно денег!');
      }
    }

    buy1Btn.addEventListener('click', () => {
      handleBuy(buy1Btn, { get value() { return bought1 }, set value(v) { bought1 = v } });
    });

    buy2Btn.addEventListener('click', () => {
      handleBuy(buy2Btn, { get value() { return bought2 }, set value(v) { bought2 = v } });
    });

    updateDisplay();
  </script>
</body>
</html>
