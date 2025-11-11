const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Панорамирование и масштаб
let offsetX = 0;
let offsetY = 0;
let scale = 1;
const minScale = 0.5;
const maxScale = 2;

// Рисование
let drawing = false;
let erasing = false;
let currentTool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = parseInt(document.getElementById("thickness").value);

// Хранилище объектов (линии, картинки)
let objects = [];

// Фоновая сетка
function drawGrid() {
    const gridSize = 50;
    ctx.save();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    for(let x=0; x<width/scale; x+=gridSize){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height/scale);
        ctx.stroke();
    }
    for(let y=0; y<height/scale; y+=gridSize){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width/scale, y);
        ctx.stroke();
    }
    ctx.restore();
}

// Перерисовка всего
function redraw() {
    ctx.clearRect(0,0,width,height);
    drawGrid();
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    objects.forEach(obj => {
        if(obj.type === "line"){
            ctx.beginPath();
            ctx.strokeStyle = obj.color;
            ctx.lineWidth = obj.thickness;
            ctx.moveTo(obj.points[0].x,obj.points[0].y);
            for(let i=1;i<obj.points.length;i++){
                ctx.lineTo(obj.points[i].x,obj.points[i].y);
            }
            ctx.stroke();
        }
        else if(obj.type === "image"){
            ctx.drawImage(obj.img,obj.x,obj.y,obj.width,obj.height);
        }
    });
    ctx.restore();
}

// Работа с мышью и стилусом
let currentLine = null;

function getPos(e){
    if(e.touches){
        const t = e.touches[0];
        return {x:(t.clientX - offsetX)/scale, y:(t.clientY - offsetY)/scale};
    }else{
        return {x:(e.clientX - offsetX)/scale, y:(e.clientY - offsetY)/scale};
    }
}

canvas.addEventListener("mousedown",(e)=>{ drawing=true; startLine(e); });
canvas.addEventListener("mouseup",(e)=>{ drawing=false; currentLine=null; });
canvas.addEventListener("mousemove",(e)=>{ if(drawing) addPoint(e); });

canvas.addEventListener("touchstart",(e)=>{
    if(e.touches.length===1){ drawing=true; startLine(e); }
});
canvas.addEventListener("touchend",(e)=>{ drawing=false; currentLine=null; });
canvas.addEventListener("touchmove",(e)=>{
    if(e.touches.length===1 && drawing) addPoint(e);
    else if(e.touches.length===2){ // панорамирование двумя пальцами
        e.preventDefault();
        let dx = e.touches[1].clientX - e.touches[0].clientX;
        let dy = e.touches[1].clientY - e.touches[0].clientY;
        // здесь можно добавить сдвиг offsetX/offsetY по движению
    }
});

// Линии
function startLine(e){
    const pos = getPos(e);
    currentLine = {type:"line", color:erasing?"#f5f5f5":color, thickness, points:[pos]};
    objects.push(currentLine);
    redraw();
}
function addPoint(e){
    const pos = getPos(e);
    currentLine.points.push(pos);
    redraw();
}

// Zoom колесом мыши
canvas.addEventListener("wheel",(e)=>{
    e.preventDefault();
    const zoomFactor = 0.1;
    let newScale = scale + (e.deltaY<0?zoomFactor:-zoomFactor);
    newScale = Math.max(minScale, Math.min(maxScale,newScale));
    scale = newScale;
    redraw();
});

// Меню
document.getElementById("pen").addEventListener("click",()=>{erasing=false; currentTool="pen";});
document.getElementById("erase").addEventListener("click",()=>{erasing=true; currentTool="erase";});
document.getElementById("colorPicker").addEventListener("input",(e)=> color=e.target.value);
document.getElementById("thickness").addEventListener("input",(e)=> thickness=parseInt(e.target.value));
document.getElementById("clear").addEventListener("click",()=>{objects=[]; redraw();});
document.getElementById("save").addEventListener("click",()=>{ localStorage.setItem("board",JSON.stringify(objects)); alert("Сохранено!"); });
document.getElementById("load").addEventListener("click",()=>{
    const saved = localStorage.getItem("board");
    if(saved){ objects = JSON.parse(saved); redraw(); }
});

// Добавление картинки
const imageLoader = document.getElementById("imageLoader");
document.getElementById("addImage").addEventListener("click",()=>imageLoader.click());
imageLoader.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload=function(event){
        const img = new Image();
        img.src = event.target.result;
        img.onload = ()=>{
            objects.push({type:"image", img, x:50, y:50, width:img.width/2, height:img.height/2});
            redraw();
        }
    }
    reader.readAsDataURL(file);
});

// Начальная отрисовка
redraw();
