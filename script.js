document.addEventListener("DOMContentLoaded", ()=>{
  const projectContainer = document.getElementById("projectContainer");
  const boardContainer = document.getElementById("boardContainer");

  const projectList = document.getElementById("projectList");
  const createBtn = document.getElementById("createProject");
  const backBtn = document.getElementById("backProjects");

  let projects = JSON.parse(localStorage.getItem("projects") || "[]");
  let currentIndex = null;
  let objects = [];

  // ----------------- Проекты -----------------
  function renderProjects() {
    projectList.innerHTML = "";
    projects.forEach((p, index) => {
      const li = document.createElement("li");
      li.textContent = p.name;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        currentIndex = index;
        objects = projects[currentIndex].objects || [];
        showBoard();
      });
      projectList.appendChild(li);
    });
  }

  createBtn.addEventListener("click", () => {
    const name = prompt("Название нового проекта:");
    if(name){
      projects.push({name, objects: []});
      localStorage.setItem("projects", JSON.stringify(projects));
      renderProjects();
    }
  });

  backBtn.addEventListener("click", ()=>{
    boardContainer.style.display="none";
    projectContainer.style.display="block";
    currentIndex = null;
  });

  renderProjects();

  // ----------------- Доска -----------------
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  let offsetX = 0, offsetY = 0, scale = 1, minScale = 0.5, maxScale = 2;
  let drawMode = true, drawing=false, erasing=false;
  let currentTool="pen", color="#000000", thickness=2;
  const toggleBtn = document.getElementById("toggleMode");
  toggleBtn.addEventListener("click", ()=>{
    drawMode=!drawMode;
    toggleBtn.textContent=drawMode?"✏️ Режим Рисования":"🖱️ Режим Курсора";
  });

  const penBtn = document.getElementById("pen");
  const eraseBtn = document.getElementById("erase");
  const colorInput = document.getElementById("colorPicker");
  const thicknessInput = document.getElementById("thickness");
  const clearBtn = document.getElementById("clear");
  const saveBtn = document.getElementById("save");
  const imageLoader = document.getElementById("imageLoader");
  const addImageBtn = document.getElementById("addImage");

  // ----------------- Отображение доски -----------------
  function showBoard(){
    projectContainer.style.display="none";
    boardContainer.style.display="block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
  }

  // ----------------- Сетка -----------------
  function drawGrid(){
    const gridSize=50;
    ctx.save();
    ctx.strokeStyle="#ddd";
    ctx.lineWidth=1;
    ctx.setTransform(scale,0,0,scale,offsetX,offsetY);
    for(let x=0;x<canvas.width/scale;x+=gridSize){
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height/scale); ctx.stroke();
    }
    for(let y=0;y<canvas.height/scale;y+=gridSize){
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width/scale,y); ctx.stroke();
    }
    ctx.restore();
  }

  function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid();
    ctx.save();
    ctx.setTransform(scale,0,0,scale,offsetX,offsetY);
    objects.forEach(obj=>{
      if(obj.type==="line"){
        ctx.beginPath();
        ctx.strokeStyle=obj.color;
        ctx.lineWidth=obj.thickness;
        ctx.moveTo(obj.points[0].x,obj.points[0].y);
        for(let i=1;i<obj.points.length;i++) ctx.lineTo(obj.points[i].x,obj.points[i].y);
        ctx.stroke();
      } else if(obj.type==="image"){
        ctx.drawImage(obj.img,obj.x,obj.y,obj.width,obj.height);
      }
    });
    ctx.restore();
  }

  // ----------------- Рисование -----------------
  let currentLine=null;
  let isDragging=false, dragStart={x:0,y:0};
  let selectedImage=null, imgOffset={x:0,y:0};

  function getPos(e){
    if(e.touches){ const t=e.touches[0]; return {x:(t.clientX-offsetX)/scale, y:(t.clientY-offsetY)/scale}; }
    else return {x:(e.clientX-offsetX)/scale, y:(e.clientY-offsetY)/scale};
  }

  canvas.addEventListener("mousedown",(e)=>{
    if(drawMode){ drawing=true; startLine(e); }
    else{
      isDragging=true;
      dragStart={x:e.clientX-offsetX, y:e.clientY-offsetY};
      const pos=getPos(e);
      selectedImage=null;
      for(let i=objects.length-1;i>=0;i--){
        const obj=objects[i];
        if(obj.type==="image"){
          if(pos.x>=obj.x && pos.x<=obj.x+obj.width && pos.y>=obj.y && pos.y<=obj.y+obj.height){
            selectedImage=obj;
            imgOffset={x:pos.x-obj.x, y:pos.y-obj.y};
            break;
          }
        }
      }
    }
  });
  canvas.addEventListener("mousemove",(e)=>{
    if(drawMode && drawing) addPoint(e);
    else if(!drawMode && isDragging){
      if(selectedImage){
        const pos=getPos(e);
        selectedImage.x=pos.x-imgOffset.x;
        selectedImage.y=pos.y-imgOffset.y;
      } else {
        offsetX=e.clientX-dragStart.x;
        offsetY=e.clientY-dragStart.y;
      }
      redraw();
    }
  });
  canvas.addEventListener("mouseup",()=>{drawing=false; currentLine=null; isDragging=false; selectedImage=null;});

  canvas.addEventListener("touchstart",(e)=>{
    if(drawMode && e.touches.length===1){drawing=true; startLine(e);}
    else if(!drawMode && e.touches.length===1){
      isDragging=true;
      dragStart={x:e.touches[0].clientX-offsetX, y:e.touches[0].clientY-offsetY};
      const pos=getPos(e);
      selectedImage=null;
      for(let i=objects.length-1;i>=0;i--){
        const obj=objects[i];
        if(obj.type==="image"){
          if(pos.x>=obj.x && pos.x<=obj.x+obj.width && pos.y>=obj.y && pos.y<=obj.y+obj.height){
            selectedImage=obj;
            imgOffset={x:pos.x-obj.x, y:pos.y-obj.y};
            break;
          }
        }
      }
    }
  });
  canvas.addEventListener("touchmove",(e)=>{
    if(drawMode && drawing) addPoint(e);
    else if(!drawMode && e.touches.length===1){
      e.preventDefault();
      const pos=getPos(e);
      if(selectedImage){ selectedImage.x=pos.x-imgOffset.x; selectedImage.y=pos.y-imgOffset.y; }
      else{ offsetX=e.touches[0].clientX-dragStart.x; offsetY=e.touches[0].clientY-dragStart.y; }
      redraw();
    }
  });
  canvas.addEventListener("touchend",()=>{drawing=false; currentLine=null; isDragging=false; selectedImage=null;});

  function startLine(e){
    const pos=getPos(e);
    currentLine={type:"line", color:erasing?"#f5f5f5":color, thickness, points:[pos]};
    objects.push(currentLine);
    redraw();
  }
  function addPoint(e){
    const pos=getPos(e);
    currentLine.points.push(pos);
    redraw();
  }

  canvas.addEventListener("wheel",(e)=>{
    e.preventDefault();
    let newScale=scale+(e.deltaY<0?0.1:-0.1);
    scale=Math.min(maxScale,Math.max(minScale,newScale));
    redraw();
  });

  penBtn.addEventListener("click",()=>{erasing=false; currentTool="pen";});
  eraseBtn.addEventListener("click",()=>{erasing=true; currentTool="erase";});
  colorInput.addEventListener("input",(e)=>color=e.target.value);
  thicknessInput.addEventListener("input",(e)=>thickness=parseInt(e.target.value));
  clearBtn.addEventListener("click",()=>{objects=[]; redraw();});
  saveBtn.addEventListener("click",()=>{
    projects[currentIndex].objects=objects;
    localStorage.setItem("projects",JSON.stringify(projects));
    alert("Сохранено!");
  });

  addImageBtn.addEventListener("click",()=>imageLoader.click());
  imageLoader.addEventListener("change",(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=function(event){
      const img=new Image();
      img.src=event.target.result;
      img.onload=()=>{
        objects.push({type:"image", img, x:50, y:50, width:img.width/2, height:img.height/2});
        redraw();
      }
    }
    reader.readAsDataURL(file);
  });

});
