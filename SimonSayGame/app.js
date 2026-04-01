const pads = Array.from(document.querySelectorAll('.pad'));
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const strictBtn = document.getElementById('strict');
const levelEl = document.getElementById('level');
const msgEl = document.getElementById('message');
let sequence = [];
let player = [];
let level = 0;
let playingSequence = false;
let strictMode = false;
const freqs = [329.63, 261.63, 220.00, 164.81];
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
function playTone(freq, duration = 350){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  g.gain.value = 0.0001;
  o.connect(g);
  g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.linearRampToValueAtTime(0.18, now + 0.02);
  o.start(now);
  g.gain.linearRampToValueAtTime(0.0001, now + (duration/1000));
  o.stop(now + (duration/1000) + 0.02);
}
function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
function randInt(max){ return Math.floor(Math.random()*max); }
function setMessage(text){
  msgEl.textContent = text || '';
}
function updateLevel(){
  levelEl.textContent = level > 0 ? level : '--';
}
async function startGame(){
  if(audioCtx.state === 'suspended') audioCtx.resume();
  sequence = [];
  level = 0;
  setMessage('Game started. Watch closely!');
  nextRound();
}
function resetGame(){
  sequence = [];
  player = [];
  level = 0;
  playingSequence = false;
  updateLevel();
  setMessage('Game reset. Press Start to play.');
}
function toggleStrict(){
  strictMode = !strictMode;
  strictBtn.classList.toggle('active', strictMode);
  strictBtn.textContent = `Strict: ${strictMode ? 'On' : 'Off'}`;
}
async function nextRound(){
  level++;
  updateLevel();
  player = [];
  sequence.push(randInt(4));
  await playSequence();
}
async function playSequence(){
  playingSequence = true;
  disablePads(true);
  setMessage('Playing sequence...');
  await sleep(400);
  for(let i=0;i<sequence.length;i++){
    const idx = sequence[i];
    await flashPad(idx, 420);
    await sleep(160);
  }
  setMessage('Your turn — repeat the sequence.');
  playingSequence = false;
  disablePads(false);
}
async function flashPad(index, duration=350){
  const pad = pads[index];
  pad.classList.add('active');
  playTone(freqs[index], duration);
  await sleep(duration);
  pad.classList.remove('active');
}
function disablePads(disabled){
  pads.forEach(p => {
    p.disabled = disabled;
    p.style.pointerEvents = disabled ? 'none' : 'auto';
    p.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  });
}
async function handlePadClick(e){
  if(playingSequence) return;
  const idx = Number(e.currentTarget.dataset.color);
  await flashPad(idx, 200);
  player.push(idx);
  checkPlayer();
}
function checkPlayer(){
  const currentMoveIndex = player.length - 1;
  if(player[currentMoveIndex] !== sequence[currentMoveIndex]){
    loseRound();
    return;
  }
  if(player.length === sequence.length){
    setMessage('Good! Next round...');
    disablePads(true);
    setTimeout(()=> nextRound(), 900);
  } else {
    setMessage(`Keep going (${player.length}/${sequence.length})`);
  }
}
async function loseRound(){
  setMessage('Wrong move!');
  for(let f of [120, 80, 60]){
    playTone(200 + f, 80);
    await sleep(90);
  }

  if(strictMode){
    setMessage('Strict is ON — restarting game.');
    await sleep(800);
    startGame();
  } else {
    setMessage('Try again — replaying sequence.');
    player = [];
    await sleep(1000);
    await playSequence();
  }
}
pads.forEach(p => p.addEventListener('click', handlePadClick));
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
strictBtn.addEventListener('click', toggleStrict);
resetGame();
setMessage('Press Start to begin.'); 
