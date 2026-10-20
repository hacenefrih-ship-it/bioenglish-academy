(function(){
'use strict';
const el=id=>document.getElementById(id);
const cases=JSON.parse(el('bea-practice-data').textContent);
const lessons=JSON.parse(el('lesson-data').textContent);
const storageKey='bea-practice-v30';
let saved={};
try{const raw=localStorage.getItem(storageKey);if(raw&&typeof JSON.parse(raw)==='object')saved=JSON.parse(raw);}catch(e){saved={};}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch(e){}}
function currentId(){const heading=(el('heading')?.textContent||'').trim();const l=lessons.find(x=>x.title===heading);return l?String(l.id):null;}
function norm(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();}
function matches(text,group){const t=norm(text);return group.some(word=>t.includes(norm(word)));}
function stats(){
 const count={Licence:{total:0,done:0},Master:{total:0,done:0}};
 for(const [id,c] of Object.entries(cases)){count[c.level].total++;if(saved[id]?.passed)count[c.level].done++;}
 el('bea-practice-stats').textContent=`Licence: ${count.Licence.done} / ${count.Licence.total} · Master: ${count.Master.done} / ${count.Master.total} · Total: ${count.Licence.done+count.Master.done} / ${count.Licence.total+count.Master.total}`;
 const id=currentId(),entry=id?cases[id]:null;
 el('bea-practice-next').textContent=entry?(saved[id]?.passed?'✓ This case has been completed / Cas réussi.':'Current case / Cas actuel : '+entry.title):'Open a chapter with a case study to practise / Ouvrez un chapitre avec étude de cas.';
}
function restore(){
 const id=currentId(),entry=id?cases[id]:null;
 const answer=el('bea-practice-answer'),feedback=el('bea-practice-feedback');
 answer.value=entry?(saved[id]?.answer||''):'';
 feedback.textContent=entry?(saved[id]?.feedback||''):'';
 feedback.dataset.status=entry?(saved[id]?.passed?'pass':saved[id]?.attempted?'retry':''):'';
 stats();
}
function check(){
 const id=currentId(),entry=id?cases[id]:null;if(!entry)return;
 const answer=el('bea-practice-answer').value.trim(),feedback=el('bea-practice-feedback');
 if(!answer){feedback.textContent='Please write an answer first. / Rédigez d’abord une réponse.';feedback.dataset.status='retry';return;}
 let passed=false,txt='';
 if(id==='9'){
   const t=norm(answer).replace(/\s/g,'');
   const m=t.match(/(?:^|[^\d])(5[.,]25|5250)(?:l\/min|ml\/min|liters\/min|litres\/min)?(?:$|[^\d])/);
   passed=Boolean(m)&&((m[1].startsWith('5250')&&!/l\/min/.test(t))||(!m[1].startsWith('5250')&&!/ml\/min/.test(t)));
   txt=passed?'Correct: cardiac output = 75 × 70 = 5.25 L/min. / Correct : débit cardiaque = 5,25 L/min.':'Check your units: multiply beats/min by mL/beat, then divide by 1000. / Vérifiez les unités et divisez les mL/min par 1 000.';
 }else{
   const groups=entry.concepts,met=groups.filter(g=>matches(answer,g)).length;
   passed=met===groups.length;
   txt=passed?'Good: your answer includes the main expected scientific concepts. Compare it with the full explanation below. / Bien : les notions principales sont présentes. Comparez avec la correction.':`Keep going: ${met} of ${groups.length} expected concept groups detected. Explain the mechanism more clearly, then try again. / Continuez : ${met} groupe(s) de notions sur ${groups.length} repéré(s). Précisez le mécanisme et réessayez.`;
 }
 feedback.textContent=txt;feedback.dataset.status=passed?'pass':'retry';
 saved[id]={answer,feedback:txt,passed:passed||Boolean(saved[id]?.passed),attempted:true};persist();stats();
}
el('bea-practice-check').addEventListener('click',check);
el('bea-practice-reset').addEventListener('click',()=>{const id=currentId();if(id&&saved[id]){delete saved[id];persist();}restore();});
el('bea-practice-clear').addEventListener('click',()=>{if(!confirm('Reset all case-study practice results? / Effacer les résultats des études de cas ?'))return;saved={};persist();restore();});
const heading=el('heading');if(heading)new MutationObserver(restore).observe(heading,{childList:true,subtree:true,characterData:true});
restore();
})();