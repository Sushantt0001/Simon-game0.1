let gameSeq=[];
let userSeq=[];
let btns=["red","yellow","green","purple"];
let level = 0;
let started = false;
let h2=document.querySelector("h2");
document.addEventListener("keypress", function(){
  if(started==false){
    console.log("game is started");
    started=true;
    levelUp();
  }
});
function gameFlash(btn){
  btn.classList.add("flash");
  setTimeout(function(){
    btn.classList.remove("flash");
  },200);
}
function userFlash (btn){
  btn.classList.add("userflash");
  setTimeout(function(){
    btn.classList.remove("userflash");
  },200);
}

function levelUp(){
  userSeq=[];
  level++;
  h2.innerText = `Level ${level}`;
  let randomIdx=Math.floor(Math.random()*4);
  let randomcolor=btns[randomIdx];
  let rndbtn = document.querySelector(`.${randomcolor}`);
  gameSeq.push(randomcolor);
  console.log(gameSeq);
  gameFlash(rndbtn);
}
function checkAns(idx){
  if(userSeq[idx] === gameSeq[idx]){
    if(userSeq.length === gameSeq.length){
      setTimeout(levelUp, 1000);
    }
  } else {
    h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key to restart.`;
    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function(){
      document.querySelector("body").style.backgroundColor = "white";
    }, 200);
    reset();
  }
}
function btnPress() {
  let btn = this;
  userFlash(btn);
  let usercolor = btn.getAttribute("id");
  userSeq.push(usercolor);
  checkAns(userSeq.length - 1);
}

let allBtns=document.querySelectorAll(".btn");
for(btn of allBtns){
  btn.addEventListener("click",btnPress);
}function reset(){
  level=0;
  gameSeq=[];
  userSeq=[];
  started=false;
}