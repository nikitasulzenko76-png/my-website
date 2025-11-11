const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let erasing = false;

// Инструмент по умолчанию
let currentTool = "pen";

// Загрузка состояния меню и инструмента
if (localStorage.getItem("currentTool")) {
    currentTool = localStorage.getItem("currentTool");
    erasing = currentTool === "erase";
}

// Рисование
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = erasing ? "#f5f5f5" : "black";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

// Кнопки меню
document.getElementById("pen").addEventListener("click", () => {
    erasing = false;
    currentTool = "pen";
    localStorage.setItem("currentTool", currentTool);
});
document.getElementById("erase").addEventListener("click", () => {
    erasing = true;
    currentTool = "erase";
    localStorage.setItem("currentTool", currentTool);
});
document.getElementById("clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem("myBoard");
});
document.getElementById("save").addEventListener("click", () => {
    const image = canvas.toDataURL();
    localStorage.setItem("myBoard", image);
    alert("Доска сохранена!");
});
document.getElementById("load").addEventListener("click", () => {
    const saved = localStorage.getItem("myBoard");
    if (saved) {
        const img = new Image();
        img.src = saved;
        img.onload = () => ctx.drawImage(img, 0, 0);
    } else {
        alert("Нет сохранённой доски!");
    }
});

// Автозагрузка при открытии
window.onload = () => {
    const saved = localStorage.getItem("myBoard");
    if (saved) {
        const img = new Image();
        img.src = saved;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
};
