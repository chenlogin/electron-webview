var myCanvas = document.createElement('canvas');
var cxt = myCanvas.getContext("2d");
myCanvas.width = 500;
myCanvas.height = 500;
myCanvas.style.backgroundColor = 'beige';
document.body.appendChild(myCanvas);

var offset_x = 0;
var offset_y = 0;
var pen = false;
var isEarser = false;

function start(e) {
    e.preventDefault();
    e = e || window.event;
    let _x = e.clientX - offset_x;
    let _y = e.clientY - offset_y;
    //开始新路径
    cxt.beginPath();
    //设置当前位置
    cxt.moveTo(_x, _y);
    pen = true;
}
function move(e) {
    e.preventDefault();
    e = e || window.event;
    let _x = e.clientX - offset_x;
    let _y = e.clientY - offset_y;
    if (pen) {
      if(!isEarser){
        cxt.lineTo(_x, _y);
        cxt.strokeStyle="red";
        cxt.stroke();
        cxt.moveTo(_x, _y);
      }else{
        cxt.save();
        cxt.arc(_x,_y,10,0,Math.PI*2);
        cxt.clip();
        cxt.clearRect(_x-10,_y-10,20,20);
        cxt.restore();
      }
    }
}
function cancel(e) {
    e.preventDefault();
    if(pen){
      pen = false;
      //关闭当前子路
      cxt.closePath();
    }
}
function clean(){
  cxt.clearRect(0, 0, 500, 500);
}
function saveToImg(){
  let dataURL = myCanvas.toDataURL();

  img = new Image();
  img.src = dataURL;
  img.style.position =  "absolute";
  img.style.top =  "20px";
  img.style.right =  "80px";
  img.style.width = "100px"
  img.style.backgroundColor = "deepskyblue";
  document.body.append(img);
}
function earser() {
  isEarser = true;
}

myCanvas.addEventListener("mousedown", start, false);
myCanvas.addEventListener("mousemove", move, false);
myCanvas.addEventListener("mouseup", cancel, false);
myCanvas.addEventListener("mouseleave", cancel, false);




