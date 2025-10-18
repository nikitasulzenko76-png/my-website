<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Casino 💀</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000;
      color: #fff;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    /* вращающийся заголовок */
    h1 {
      font-size: 70px;
      margin: 50px 0 20px;
      display: inline-block;
      animation: spin 5s linear infinite;
      transform-style: preserve-3d;
    }

    @keyframes spin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }

    .balance {
      font-size: 26px;
      margin-bottom: 30px;
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
      background: #1a1a1a;
      border-radius: 20px;
      padding: 20px;
      width: 250px;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .item:hover {
      transform: scale(1.05);
      box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
    }

    .item img {
      width: 200px;
      height: 200px;
      object-fit: contain;
      border-radius: 10px;
      margin-bottom: 10px;
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
      background: #cc0000;
      transform: scale(1.1);
    }

    .bought {
      background: #333 !important;
      color: #888 !important;
      cursor: not-allowed !important;
    }

    .flash {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.2);
      animation: fadeOut 0.3s forwards;
      z-index: 1000;
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  </style>
</head>
<body>
  <h1>Casino 💀</h1>
  <div class="balance">Баланс: <span id="balance">1000</span>💰</div>

  <div class="shop">
    <div class="item">
      <img src="https://i.imgur.com/lZyJPSV.png" alt="Череп" />
      <p>Цена: 1000💰</p>
      <button id="buy1">Купить</button>
    </div>

    <div class="item">
      <img src="https://i.imgur.com/3qAZGu7.png" alt="Зелье" />
      <p>Цена: 1000💰</p>
      <button id="buy2">Купить</button>
    </div>
  </div>

  <script>
    // Загружаем данные
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

    function buyItem(button, itemKey) {
      if (balance >= 1000 && !window[itemKey]) {
        balance -= 1000;
        window[itemKey] = true;
        saveState();
        updateDisplay();

        const flash = document.createElement('div');
        flash.className = 'flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
      } else {
        alert('Недостаточно денег!');
      }
    }

    buy1Btn.addEventListener('click', () => buyItem(buy1Btn, 'bought1'));
    buy2Btn.addEventListener('click', () => buyItem(buy2Btn, 'bought2'));

    updateDisplay();
  </script>
</body>
</html>
