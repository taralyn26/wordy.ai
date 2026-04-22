// quiz.js
let qNum=10,qA={},qUserAnswers={};
const QT=6;
const QDATA=[{"word": "despondent", "correct": "in low spirits from loss of hope or courage", "wrong": ["hopeful and cheerful", "vivacious and energetic", "bright and shining"]}, {"word": "effervescent", "correct": "vivacious and enthusiastic", "wrong": ["melancholy and sad", "lasting briefly", "pleasant to hear"]}, {"word": "mellifluous", "correct": "sweet or musical; pleasant to hear", "wrong": ["harsh and grating", "bright or shining", "in low spirits"]}, {"word": "ephemeral", "correct": "lasting for a very short time", "wrong": ["eternal and lasting", "in low spirits", "vivacious"]}, {"word": "luminous", "correct": "bright or shining, especially in the dark", "wrong": ["dull and grey", "pleasant to hear", "lasting briefly"]}, {"word": "petrichor", "correct": "the pleasant smell of rain on dry earth", "wrong": ["the sound of thunder", "vivacious and enthusiastic", "in low spirits"]}];
function openQ(){document.getElementById('qso').classList.add('open');}
function closeQ(){document.getElementById('qso').classList.remove('open');}
function cN(d){qNum=Math.max(1,Math.min(20,qNum+d));document.getElementById('qnd').textContent=qNum;}
function sT(el){document.querySelectorAll('.qradio').forEach(r=>r.classList.remove('chk'));el.classList.add('chk');}
function startQ(){closeQ();closeQuizExit();rQ();document.getElementById('qa').classList.add('vis');document.getElementById('qres').classList.remove('vis');document.getElementById('qrevpanel').style.display='none';go('quiz');}
function sc(el,ic,idx){
  const card=el.closest('.qqc');if(card.dataset.a)return;
  card.dataset.a='1';
  qA[idx]=ic;
  qUserAnswers[idx]=el.textContent;
  // Highlight selected only (no reveal)
  card.querySelectorAll('.qc').forEach(c=>c.classList.remove('qc-sel'));
  el.classList.add('qc-sel');
  document.getElementById('qprogl').textContent=Object.keys(qA).length+' of '+QT+' answered';
  const nx=document.getElementById('qcard'+(idx+1));
  if(nx)setTimeout(()=>nx.scrollIntoView({behavior:'smooth',block:'start'}),400);
  else setTimeout(showR,700);
}
function showR(){
  const c=Object.values(qA).filter(v=>v).length,w=QT-c,p=Math.round(c/QT*100);
  document.getElementById('qcpill').textContent=c;
  document.getElementById('qwpill').textContent=w;
  document.getElementById('qringpct').textContent=p+'%';
  // Animate ring arc: circumference=2*pi*48=301.6
  const circ=301.6,offset=circ*(1-p/100);
  document.getElementById('ringArc').setAttribute('stroke-dashoffset',offset);
  const msgs=['Keep going — practice makes perfect!','Nice effort! Review the ones you missed.','Good work! You know your words.','Great job! Almost there!','Excellent! You crushed it!','Perfect score! Outstanding!'];
  document.getElementById('qresmsg').textContent=p===100?msgs[5]:p>=80?msgs[4]:p>=60?msgs[3]:p>=40?msgs[2]:p>=20?msgs[1]:msgs[0];
  document.getElementById('qa').classList.remove('vis');
  document.getElementById('qres').classList.add('vis');
  buildReview();
  confetti();
}
function buildReview(){
  QDATA.forEach((q,i)=>{
    const card=document.getElementById('rvcard'+i);
    if(!card)return;
    const isCorrect=qA[i]===true;
    const lbl=card.querySelector('.qqc-lbl');
    lbl.textContent=isCorrect?'\u2713 Correct':'\u2717 Incorrect';
    lbl.style.color=isCorrect?'var(--gg)':'#e57373';
    const choicesDiv=document.getElementById('rv-choices-'+i);
    choicesDiv.innerHTML='';
    const userAns=qUserAnswers[i]||'(no answer)';
    const allC=[q.correct,...q.wrong];
    allC.forEach(c=>{
      const d=document.createElement('div');
      d.className='qc';
      d.textContent=c;
      if(c===q.correct){d.style.background='#e8f5e9';d.style.borderColor='#66bb6a';}
      else if(c===userAns&&!isCorrect){d.style.background='#ffebee';d.style.borderColor='#ef9a9a';}
      else{d.style.opacity='0.4';}
      choicesDiv.appendChild(d);
    });
  });
}
let rvIdx=0;
function openReview(){
  rvIdx=0;
  document.getElementById('qres').classList.remove('vis');
  document.getElementById('qrevpanel').style.display='flex';
  showRevCard();
}
function closeReview(){
  document.getElementById('qrevpanel').style.display='none';
  document.getElementById('qres').classList.add('vis');
}
function showRevCard(){
  document.querySelectorAll('[id^="rvcard"]').forEach(c=>c.style.display='none');
  const card=document.getElementById('rvcard'+rvIdx);
  if(card)card.style.display='block';
  document.getElementById('revprogress').textContent='Question '+(rvIdx+1)+' of '+QT;
}
function nextRev(){if(rvIdx<QT-1){rvIdx++;showRevCard();}}
function prevRev(){if(rvIdx>0){rvIdx--;showRevCard();}}
function rQ(){
  qA={};qUserAnswers={};
  document.querySelectorAll('.qqc').forEach(c=>{
    delete c.dataset.a;
    c.querySelectorAll('.qc').forEach(ch=>ch.classList.remove('qc-sel','cor','wrg'));
  });
  document.getElementById('qprogl').textContent='0 of '+QT+' answered';
  const s=document.getElementById('qss');if(s)s.scrollTop=0;
  document.getElementById('qa').classList.remove('vis');
  document.getElementById('qres').classList.remove('vis');
  document.getElementById('qrevpanel').style.display='none';
}
function openQuizExit(){
  const qa=document.getElementById('qa');
  const qaVis=qa&&qa.classList.contains('vis');
  const inProgress=qaVis&&!document.getElementById('qres').classList.contains('vis');
  const title=document.getElementById('quiz-exit-title');
  const msg=document.getElementById('quiz-exit-msg');
  const btn=document.getElementById('quiz-exit-confirm');
  if(inProgress){
    if(title)title.textContent='End quiz?';
    if(msg)msg.textContent='Are you sure you want to end the quiz? Your progress so far will be lost.';
    if(btn)btn.textContent='Yes, end quiz';
  }else{
    if(title)title.textContent='Leave quiz?';
    if(msg)msg.textContent='Are you sure you want to leave? This will clear your results and review from this session.';
    if(btn)btn.textContent='Yes, leave';
  }
  const m=document.getElementById('quiz-exit-modal');
  if(m)m.classList.add('open');
}
function closeQuizExit(){const m=document.getElementById('quiz-exit-modal');if(m)m.classList.remove('open');}
function confirmQuizExit(){closeQuizExit();rQ();go('words');}
function confetti(){const cv=document.getElementById('confettiCanvas'),ctx=cv.getContext('2d');cv.width=window.innerWidth;cv.height=window.innerHeight;const ps=Array.from({length:140},()=>({x:Math.random()*cv.width,y:Math.random()*-200,w:Math.random()*10+5,h:Math.random()*6+3,color:['#9bc78b','#d8e9d1','#ffd54f','#ef9a9a','#90caf9','#b39ddb'][Math.floor(Math.random()*6)],rot:Math.random()*360,vx:(Math.random()-.5)*4,vy:Math.random()*5+3,vr:(Math.random()-.5)*8}));let fr=0;(function draw(){ctx.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;});fr++;if(fr<200)requestAnimationFrame(draw);else ctx.clearRect(0,0,cv.width,cv.height);})();}