<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Казино 🎰</title>
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle at top, #111, #000);
      color: white;
      font-family: 'Poppins', sans-serif;
      text-align: center;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    header {
      font-size: 3rem;
      padding: 20px;
      background: linear-gradient(90deg, gold, orange, red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
      animation: glow 2s infinite alternate;
    }

    @keyframes glow {
      from { text-shadow: 0 0 10px gold; }
      to { text-shadow: 0 0 30px orange; }
    }

    .case {
      width: 200px;
      height: 200px;
      margin: 0 auto 50px;
      border: 3px solid gold;
      border-radius: 20px;
      background: linear-gradient(145deg, #222, #000);
      box-shadow: 0 0 20px gold;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .case:hover {
      transform: scale(1.1);
      box-shadow: 0 0 40px orange;
    }
  </style>
</head>
<body>
  <header>КАЗИНО 🎰</header>
  <div class="case" onclick="openCase()">🎁 Открыть кейс</div>

  <script>
    function openCase() {
      alert("Кейс открыт! 🎉 (тут можно добавить выпадение приза)");
    }
  </script>
</body>
</html>
