const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let width = window.innerWidth * 2;
let height = window.innerHeight * 2;
canvas.width = width;
canvas.height = height;

let drawing = false;
let erasing = false;
let currentTool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = parseInt(document.getElementById("thickness").value);
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Загрузка инструмента
if (localStorage.getItem("currentTool")) {
    currentTool = localStorage.getItem("currentTool");
    erasing = currentTool === "erase";
}

// Рисование
function drawLine(x, y) {
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.strokeStyle = erasing ? "#f5f5f5" : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function getPos(e) {
    if(e.touches) { // для сенсорного экрана
        return { x: (e.touches[0].clientX - offsetX) / scale, y: (e.touches[0].clientY - offsetY) / scale };
    } else {
        return { x: (e.clientX - offsetX) / scale, y: (e.clientY - offsetY) / scale };
    }
}

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener("mousemove", (e) => { if(drawing) drawLine(getPos(e).x, getPos(e).y); });

// Сенсорные события
canvas.addEventListener("touchstart", () => drawing = true);
canvas.addEventListener("touchend", () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); if(drawing) drawLine(getPos(e).x, getPos(e).y); });

// Zoom колесом мыши
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    if (e.deltaY < 0) scale += zoomFactor;
    else scale = Math.max(0.1, scale - zoomFactor);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    redraw();
});

// Меню
document.getElementById("pen").addEventListener("click", () => { erasing = false; currentTool="pen"; localStorage.setItem("currentTool", currentTool); });
document.getElementById("erase").addEventListener("click", () => { erasing = true; currentTool="erase"; localStorage.setItem("currentTool", currentTool); });
document.getElementById("colorPicker").addEventListener("input", (e)=> color = e.target.value);
document.getElementById("thickness").addEventListener("input", (e)=> thickness = parseInt(e.target.value));

document.getElementById("clear").addEventListener("click", () => { ctx.clearRect(0,0,canvas.width,canvas.height); localStorage.removeItem("myBoard"); });
document.getElementById("save").addEventListener("click", () => { localStorage.setItem("myBoard", canvas.toDataURL()); alert("Доска сохранена!"); });
document.getElementById("load").addEventListener("click", () => { redraw(); });

// Добавление картинки
const imageLoader = document.getElementById("imageLoader");
document.getElementById("addImage").addEventListener("click", () => imageLoader.click());

imageLoader.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event){
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => ctx.drawImage(img, 50, 50, img.width/2, img.height/2);
    }
    reader.readAsDataURL(file);
});

// Функция автозагрузки
function redraw() {
    const saved = localStorage.getItem("myBoard");
    if(saved){
        const img = new Image();
        img.src = saved;
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

window.onload = () => { redraw(); };
