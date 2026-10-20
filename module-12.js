(function(){
'use strict';
const $=id=>document.getElementById(id),items=JSON.parse($('bea-path-data').textContent),levels=['A1','A2','B1','B2','C1'];
const storageKey='bea-scientific-english-v31';let progress={};
try{const v=JSON.parse(localStorage.getItem(storageKey)||'{}');if(v&&typeof v==='object')progress=v;}catch(e){}
let currentLevel='A1',currentIndex=0;
const levelItems=()=>items.filter(x=>x.level===currentLevel);
const key=()=>currentLevel+':'+currentIndex;
function save(){try{localStorage.setItem(storageKey,JSON.stringify(progress));}catch(e){}}
function stats(){
 const parts=levels.map(level=>{const n=Object.keys(progress).filter(k=>k.startsWith(level+':')&&progress[k]===true).length;return level+' '+n+'/'+items.filter(x=>x.level===level).length;});
 $('bea-path-progress').textContent='Your progress / Votre progression : '+parts.join(' · ');
}
function render(){
 const list=levelItems(),q=list[currentIndex];
 $('bea-path-question').innerHTML='';
 list.forEach((x,i)=>{const opt=document.createElement('option');opt.value=i;opt.textContent='Exercise '+(i+1)+' — '+x.kind;$('bea-path-question').appendChild(opt);});
 $('bea-path-question').value=String(currentIndex);
 $('bea-path-tag').textContent=q.level+' · '+q.kind+' · Exercise '+(currentIndex+1)+' of '+list.length;
 $('bea-path-prompt').textContent=q.kind==='Listening'?'🎧 Listening practice: press Listen in English, then choose the correct answer. / Écoutez puis répondez.':q.prompt;
 const options=$('bea-path-options');options.replaceChildren();
 q.choices.forEach((choice,i)=>{const label=document.createElement('label'),radio=document.createElement('input'),span=document.createElement('span');radio.type='radio';radio.name='bea-path-choice';radio.value=String(i);span.textContent=choice;label.append(radio,span);options.appendChild(label);});
 const fb=$('bea-path-feedback');fb.textContent=progress[key()]?'✓ Completed / Déjà réussi. Vous pouvez recommencer.':'';delete fb.dataset.correct;
 stats();
}
function check(){
 const q=levelItems()[currentIndex],selected=document.querySelector('input[name="bea-path-choice"]:checked'),fb=$('bea-path-feedback');
 if(!selected){fb.textContent='Please choose an answer. / Choisissez une réponse.';delete fb.dataset.correct;return;}
 const answer=q.choices[Number(selected.value)],ok=answer===q.answer;
 if(ok){progress[key()]=true;save();}
 fb.dataset.correct=String(ok);
 fb.textContent=(ok?'✓ Correct!':'↻ Try again.')+'\n'+(q.kind==='Listening'?'Audio script: '+q.prompt+'\n':'')+'Correct answer: '+q.answer+'\nEN: '+q.explain_en+'\nFR : '+q.explain_fr;
 stats();
}
function speak(){
 if(!('speechSynthesis' in window)){$('bea-path-feedback').textContent='Speech is not available in this browser. / Lecture vocale indisponible.';return;}
 const q=levelItems()[currentIndex];try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(q.prompt);u.lang='en-US';u.rate=.82;const v=window.speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang));if(v)u.voice=v;window.speechSynthesis.speak(u);}catch(e){}
}
$('bea-path-level').addEventListener('change',e=>{currentLevel=e.target.value;currentIndex=0;render();});
$('bea-path-question').addEventListener('change',e=>{currentIndex=Number(e.target.value);render();});
$('bea-path-check').addEventListener('click',check);
$('bea-path-speak').addEventListener('click',speak);
$('bea-path-next').addEventListener('click',()=>{if(currentIndex<levelItems().length-1)currentIndex++;else{const i=levels.indexOf(currentLevel);currentLevel=levels[(i+1)%levels.length];$('bea-path-level').value=currentLevel;currentIndex=0;}render();});
render();
})();