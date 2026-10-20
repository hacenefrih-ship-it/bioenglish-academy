(function(){
'use strict';
const $=id=>document.getElementById(id);
const data=JSON.parse($('bea-writing-data').textContent),selector=$('bea-writing-section'),field=$('bea-writing-text');
let current=data[0],timer;
const key=id=>'bea-writing-v33-'+id;
const safe=(fn,fallback)=>{try{return fn();}catch(e){return fallback;}};
function render(){
 current=data.find(x=>x.id===selector.value)||data[0];
 $('bea-writing-title').textContent=current.title;
 $('bea-writing-goal').textContent=current.goal;
 $('bea-writing-prompt').textContent=current.prompt;
 for(const [id,arr] of [['bea-writing-structure',current.structure],['bea-writing-phrases',current.phrases]]){
  const target=$(id);target.replaceChildren();
  arr.forEach(t=>{const li=document.createElement('li');li.textContent=t;target.appendChild(li);});
 }
 $('bea-writing-model-en').textContent=current.model;
 $('bea-writing-model-fr').textContent=current.fr;
 $('bea-writing-model-panel').open=false;
 field.value=safe(()=>localStorage.getItem(key(current.id)),'')||'';
 $('bea-writing-feedback').textContent='';
 $('bea-writing-saved').textContent='';
 count();
}
function count(){const n=(field.value.trim().match(/\S+/g)||[]).length;$('bea-writing-count').textContent=n+' words';}
data.forEach(x=>{const option=document.createElement('option');option.value=x.id;option.textContent=x.title;selector.appendChild(option);});
selector.addEventListener('change',render);
field.addEventListener('input',()=>{
 count();$('bea-writing-saved').textContent='Unsaved changes / Modifications non enregistrées';
 clearTimeout(timer);timer=setTimeout(()=>{const ok=safe(()=>{localStorage.setItem(key(current.id),field.value);return true;},false);$('bea-writing-saved').textContent=ok?'✓ Saved locally / Sauvegardé':'Local storage unavailable';},500);
});
$('bea-writing-check').addEventListener('click',()=>{
 const value=field.value.trim(),n=(value.match(/\S+/g)||[]).length;
 if(n<20){$('bea-writing-feedback').textContent='Write at least 20 words before checking. / Rédigez au moins 20 mots.';return;}
 const patterns={
 abstract:[/\b(aim|objective|purpose)\b/i,/\b(method|measured|participant|sample)\b/i,/\b(result|increase|decrease|mean)\b/i,/\b(conclu|suggest|indicat|further)\w*/i],
 introduction:[/\b(heart|physiolog|exercise|cardiovascular)\w*/i,/\b(question|whether|gap|unknown)\b/i,/\b(aim|objective|purpose)\b/i,/\b(hypothes|expect|predict)\w*/i],
 methods:[/\b(design|pre.post|protocol|study)\b/i,/\b(participant|volunteer|adult|sample)\w*/i,/\b(measur|monitor|heart rate)\w*/i,/\b(analys|statistic|descript)\w*/i,/\b(ethic|consent|approval)\w*/i],
 results:[/\b(30|thirty|participant)\b/i,/\b(72|108|heart rate)\b/i,/\b(36|difference|increas)\w*/i,/\b(descript|no inferential|not tested|without)\w*/i],
 discussion:[/\b(finding|observ|increase|result)\w*/i,/\b(mechanism|autonomic|demand|physiolog)\w*/i,/\b(limit|lack|absence|small sample)\w*/i,/\b(future|further|next)\w*/i]
 };
 const found=patterns[current.id].map((p,i)=>p.test(value)?i:-1).filter(i=>i>=0);
 const missing=current.checks.filter((x,i)=>!found.includes(i));
 $('bea-writing-feedback').textContent='Structure cues found: '+found.length+'/'+current.checks.length+'. '+(missing.length?'Consider adding: '+missing.join(', ')+'.':'All suggested cues appear in your text.')+' This is not a scientific grade.';
});
$('bea-writing-model').addEventListener('click',()=>{$('bea-writing-model-panel').open=true;$('bea-writing-model-panel').scrollIntoView({block:'nearest',behavior:'smooth'});});
$('bea-writing-listen').addEventListener('click',()=>{if(!('speechSynthesis' in window)){$('bea-writing-feedback').textContent='Speech synthesis unavailable.';return;}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(current.model);u.lang='en-US';u.rate=.85;const v=speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){$('bea-writing-feedback').textContent='Audio unavailable on this device.';}});
$('bea-writing-export').addEventListener('click',()=>{
 const txt=current.title+'\n\n'+field.value+'\n';
 const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='BioEnglish_Writing_'+current.id+'.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
});
render();
})();