<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Casino 💀</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      background: radial-gradient(circle at center, #1a001d, #000);
      color: #fff;
      text-align: center;
    }

    h1 {
      font-size: 90px;
      margin-top: 100px;
      letter-spacing: 8px;
      color: #ff0040;
      text-shadow: 0 0 25px #ff0040, 0 0 60px #ff0040;
    }

    .container {
      margin-top: 60px;
    }

    .item {
      background: rgba(30, 0, 30, 0.8);
      border-radius: 25px;
      padding: 40px;
      display: inline-block;
      box-shadow: 0 0 30px rgba(255, 0, 100, 0.6);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }

    .item:hover {
      transform: scale(1.05);
      box-shadow: 0 0 60px rgba(255, 0, 120, 0.8);
    }

    .item img {
      width: 300px;
      height: 300px;
      border-radius: 20px;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .price {
      font-size: 24px;
      margin: 20px 0;
    }

    button {
      background: linear-gradient(90deg, #ff0040, #ff6600);
      border: none;
      color: white;
      padding: 15px 40px;
      border-radius: 15px;
      font-size: 22px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.3s ease;
      box-shadow: 0 0 20px rgba(255, 0, 100, 0.7);
    }

    button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 40px rgba(255, 80, 0, 1);
    }

    .balance {
      margin-top: 40px;
      font-size: 26px;
      color: #ffd700;
      text-shadow: 0 0 10px #ff0040;
    }

    .bought {
      background: #333;
      color: #888;
      cursor: not-allowed;
      box-shadow: none;
    }
  </style>
</head>
<body>

  <h1>CASINO 💀</h1>

  <div class="container">
    <div class="item">
      <img 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+7n3aAAAABHNCSVQICAgIfAhkiAAAA6dJREFUeJzt3TtOwzAQQNF+6A6E2JoA4gX7YhE06yQs1A9xvB9n+2mZ8/ryZvnP1XoEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYGH8KJnyM8kXwvFv04U6nKnH7h6xg0PCz+qU2Z3FTcP48FTwqkFChQwAAAgAECBAgQIAAAQIECBBoEsD5Zb7PQeDOnXzZbhOeYnnYry8I7c41ftgJH0CcOgz58jhcGxzI3gPABtQeejQQAQIECBAgQIAAAQIECAQCBAYMoc7wLQj8U8VAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYH3I/gGgRk7JxUuSSQAAAABJRU5ErkJggg=="
        alt="Зелье"
      >
      <div class="price">Цена: 1000 💰</div>
      <button id="buyBtn">Купить</button>
      <div class="balance">Баланс: <span id="balance">1000</span> 💰</div>
    </div>
  </div>

  <script>
    let balance = parseInt(localStorage.getItem('balance')) || 1000;
    let bought = localStorage.getItem('bought') === 'true';
    const balanceEl = document.getElementById('balance');
    const buyBtn = document.getElementById('buyBtn');

    function updateDisplay() {
      balanceEl.textContent = balance;
      if (bought) {
        buyBtn.textContent = 'Куплено';
        buyBtn.disabled = true;
        buyBtn.classList.add('bought');
      }
    }

    buyBtn.addEventListener('click', () => {
      if (balance >= 1000 && !bought) {
        balance -= 1000;
        bought = true;
        localStorage.setItem('balance', balance);
        localStorage.setItem('bought', true);
        updateDisplay();
        alert('Поздравляем с покупкой!');
      } else {
        alert('Недостаточно средств!');
      }
    });

    updateDisplay();
  </script>
</body>
</html>
