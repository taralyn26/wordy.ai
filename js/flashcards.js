// flashcards.js
// ── FLASHCARDS ──
const FC_DATA = [["despondent", "in low spirits from loss of hope or courage", "Jo groaned and leaned both elbows on the table in a despondent attitude.", "Little Women"], ["luminous", "bright or shining, especially in the dark", "The luminous moon cast long shadows across the garden path.", "Little Women"], ["effervescent", "vivacious and enthusiastic", "Her effervescent personality lit up every room she entered.", "Little Women"], ["ephemeral", "lasting for a very short time", "She paused to appreciate the ephemeral beauty of the sunset.", "Little Women"], ["mellifluous", "sweet or musical; pleasant to hear", "The singer’s mellifluous voice hushed the entire audience.", "Little Women"], ["petrichor", "the pleasant smell of rain on dry earth", "She stepped outside and breathed in the sweet petrichor after the storm.", "Little Women"]];
let fcIdx=0, fcKnown=[], fcDontKnow=[], fcCurrentSet=[...FC_DATA];

function fcInit(set){
  fcIdx=0; fcKnown=[]; fcDontKnow=[];
  fcCurrentSet=set;
  fcShowCard();
  document.getElementById('fc-results').classList.remove('vis');
  document.getElementById('fc-scene').style.display='';
  document.querySelectorAll('.fc-know-row')[0].style.display='flex';
  document.getElementById('fc-restart-modal').classList.remove('open');
  const fem=document.getElementById('fc-exit-modal');
  if(fem)fem.classList.remove('open');
}

function fcShowCard(){
  const [word,def,sentence,book] = fcCurrentSet[fcIdx];
  const card = document.getElementById('fc-card');
  card.classList.remove('flipped');
  document.getElementById('fc-word').textContent = word;
  document.getElementById('fc-def').textContent = def;
  document.getElementById('fc-hint-text').textContent = '\u201c'+sentence+'\u201d';
  document.getElementById('fc-hint-source').textContent = '\u2013 '+book;
  document.getElementById('fc-hint-text').classList.remove('show');
  document.getElementById('fc-hint-source').classList.remove('show');
  document.getElementById('fc-progress').textContent = (fcIdx+1)+' of '+fcCurrentSet.length;
}

function fcTap(e){
  if(e.target.closest('.fc-hint-btn')||e.target.closest('.fc-next-btn'))return;
  document.getElementById('fc-card').classList.toggle('flipped');
}

function fcHint(e){
  e.stopPropagation();
  document.getElementById('fc-hint-text').classList.add('show');
  document.getElementById('fc-hint-source').classList.add('show');
  e.target.style.opacity='0.4';
}

function fcNext(e){
  e.stopPropagation();
  fcIdx++;
  if(fcIdx>=fcCurrentSet.length){ fcShowResults(); return; }
  fcShowCard();
}

function fcKnow(known){
  const word=fcCurrentSet[fcIdx][0];
  if(known)fcKnown.push(word); else fcDontKnow.push(word);
  fcIdx++;
  if(fcIdx>=fcCurrentSet.length){ fcShowResults(); return; }
  fcShowCard();
}

function fcShowResults(){
  document.getElementById('fc-scene').style.display='none';
  document.querySelectorAll('.fc-know-row')[0].style.display='none';
  const total=fcCurrentSet.length;
  const pct=Math.round(fcKnown.length/total*100);
  const msgs=['Keep at it! Practice makes perfect.','Good effort! Review the tricky ones.','Nice work! You know most of these.','Great job! Almost got them all.','Outstanding! You know this set!'];
  const msg=pct===100?msgs[4]:pct>=75?msgs[3]:pct>=50?msgs[2]:pct>=25?msgs[1]:msgs[0];
  document.getElementById('fc-results-msg').textContent=msg;
  document.getElementById('fc-results').classList.add('vis');
}

function openFcExit(){
  const onResults=document.getElementById('fc-results').classList.contains('vis');
  const title=document.getElementById('fc-exit-title');
  const msg=document.getElementById('fc-exit-msg');
  const btn=document.getElementById('fc-exit-confirm');
  if(onResults){
    if(title)title.textContent='Leave flashcards?';
    if(msg)msg.textContent='Go back to Words? You can open this set again anytime.';
    if(btn)btn.textContent='Yes, go to Words';
  }else{
    if(title)title.textContent='End flashcards?';
    if(msg)msg.textContent='Are you sure you want to end? Your progress in this session will be lost.';
    if(btn)btn.textContent='Yes, end session';
  }
  document.getElementById('fc-exit-modal').classList.add('open');
}
function closeFcExit(){const m=document.getElementById('fc-exit-modal');if(m)m.classList.remove('open');}
function confirmFcExit(){closeFcExit();go('words');}

function fcRestart(onlyWrong){
  const set = onlyWrong && fcDontKnow.length>0
    ? FC_DATA.filter(c=>fcDontKnow.includes(c[0]))
    : [...FC_DATA];
  // shuffle
  for(let i=set.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[set[i],set[j]]=[set[j],set[i]];}
  fcInit(set);
}


// hi