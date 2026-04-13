// utils.js
function goFocus(idx){
  wMode('focus');
  setTimeout(()=>{
    const cards=document.querySelectorAll('.fc');
    if(cards[idx])cards[idx].scrollIntoView({behavior:'instant',block:'start'});
  },50);
}