
(function(){
'use strict';
const $=id=>document.getElementById(id);
const lessons=JSON.parse($('lesson-data').textContent);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function activeLesson(){
 const m=($('section').textContent||'').match(/UNIT\s+(\d+)/i);
 return m?lessons.find(x=>Number(x.id)===Number(m[1])):lessons.find(x=>x.title===$('heading').textContent);
}
function printable(kind){
 const l=activeLesson();if(!l){alert('Choisissez un chapitre.');return;}
 const isQuiz=kind==='quiz',t=isQuiz?'QCM — '+l.title:'Cours — '+l.title;
 const diagram=String(l.diagram||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 const main=isQuiz?`<p>Nom : _______________________ &nbsp; Date : ________________</p><p>Choisissez une seule réponse par question.</p>${l.mcqs.map((q,j)=>`<section class="question"><h3>Question ${j+1}. ${esc(q.q)}</h3>${q.choices.map((a,i)=>`<p>□ ${String.fromCharCode(65+i)}. ${esc(a)}</p>`).join('')}</section>`).join('')}<section class="correction"><h2>Corrigé et explications (page suivante)</h2>${l.mcqs.map((q,j)=>`<p><b>Question ${j+1} : ${String.fromCharCode(65+q.answer)} — ${esc(q.choices[q.answer])}</b><br>${esc(q.why)}</p>`).join('')}</section>`
 :`<section><h2>Scientific illustration</h2><div class="diagram">${diagram}</div></section><section><h2>Scientific explanation — English</h2><p>${esc(l.en)}</p></section><section><h2>Traduction française intégrale</h2><p>${esc(l.fr)}</p></section><section><h2>Scientific vocabulary / IPA</h2><table><tr><th>English</th><th>Français</th></tr>${l.gloss.map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td></tr>`).join('')}</table></section>`;
 const doc=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(t)}</title><style>@page{size:A4;margin:16mm}body{font:11.5pt/1.55 Georgia,serif;color:#1b3036}h1{font:700 21pt/1.2 Arial,sans-serif;color:#155e58}h2{font:700 15pt Arial,sans-serif;color:#1c7163;margin-top:22px}h3{font:700 12pt Arial,sans-serif}header{border-bottom:2px solid #70ad9e;margin-bottom:20px;padding-bottom:12px}header p{margin:3px 0;color:#536b67}.diagram svg{max-width:100%;height:auto}.diagram{max-width:100%;overflow:hidden}p{text-align:justify}table{border-collapse:collapse;width:100%}td,th{border:1px solid #b9d5cc;padding:7px;text-align:left}.question{break-inside:avoid;margin:15px 0}.question p{margin:6px 0}.correction{break-before:page}.correction p{break-inside:avoid}section{break-inside:auto}button{display:none}</style></head><body><header><h1>BioEnglish Academy</h1><p>Biological Sciences &amp; Animal Physiology</p><p>Pr Hacène FRIH — Annaba, Algeria</p><p>${esc(l.category)} · UNIT ${esc(l.id)} · ${esc(t)}</p></header><h2>${esc(l.title)}</h2>${main}</body></html>`;
 const w=window.open('','_blank');if(!w){alert('Autorisez les fenêtres contextuelles pour imprimer en PDF.');return;}
 w.document.open();w.document.write(doc);w.document.close();
 w.focus();setTimeout(()=>{try{w.print();}catch(e){console.error(e);}},350);
}

$('bea-pdf-course').addEventListener('click',()=>printable('course'));
$('bea-pdf-quiz').addEventListener('click',()=>printable('quiz'));
const overlay=$('bea-tour-overlay'),card=$('bea-tour-card');
const steps=[
 {title:"Welcome! Let's explore mitochondria.",text:"We will use a real lesson called Mitochondria and ATP Production. Follow the highlighted areas. Press Next to continue.",target:'#bea-help-open'},
 {title:"1. Find a lesson",text:"This is the search box. We type Mitochondria here to find our lesson.",target:'#search',action:()=>{ $('search').value='Mitochondria';$('search').dispatchEvent(new Event('input',{bubbles:true})); }},
 {title:"2. Open the lesson",text:"Look at the list of lessons. We will open Mitochondria and ATP Production. This lesson is about how cells make energy.",target:'#nav',action:()=>{let b=[...document.querySelectorAll('#nav button')].find(x=>/Mitochondria and ATP Production/i.test(x.textContent));if(b){let p=b.closest('details');while(p){p.open=true;p=p.parentElement?.closest('details');}b.click();}}},
 {title:"3. Look at the diagram",text:"Here is the mitochondrion diagram. Tap the picture to make it bigger. Press Escape to close it.",target:'#diagram-panel'},
 {title:"4. Read in English",text:"Read the English sentences below the diagram. English text is dark blue. Take your time.",target:'#en .bea-sentence'},
 {title:"5. Translate one sentence",text:"Look under the English sentence. Tap the small Translation arrow. You will see the French meaning in green.",target:'#en .bea-translation summary',action:()=>{let e=document.querySelector('#en .bea-translation');if(e)e.open=true;}},
 {title:"6. Read the full French text",text:"At the end of the English lesson, open the full French translation. You can read the whole lesson in French.",target:'#en .bea-full-fr',action:()=>{let e=document.querySelector('#en .bea-full-fr');if(e)e.open=true;}},
 {title:"7. Learn a word",text:"Tap the English word mitochondria. You can see its meaning and its IPA pronunciation. IPA shows how a word sounds.",target:'#en .word',action:()=>{let w=[...document.querySelectorAll('#en .word')].find(x=>x.textContent.toLowerCase().includes('mitochond'));if(w)w.click();}},
 {title:"8. Listen to a word",text:"Use the sound button to hear the word mitochondria. Listen, and then try to say it yourself.",target:'#pop',action:()=>{let w=[...document.querySelectorAll('#en .word')].find(x=>x.textContent.toLowerCase().includes('mitochond'));if(w)w.click();}},
 {title:"9. Listen to the lesson",text:"Here is the audio player, just below the lesson. Choose a language and a speed. Press Play to listen.",target:'.audio-studio',action:()=>{if($('pop'))$('pop').hidden=true;}},
 {title:"10. Study new words",text:"Open Vocabulary and IPA. You can study important biology words, their meanings, and their pronunciation.",target:'[data-tab="vocab"]',action:()=>{document.querySelector('[data-tab="vocab"]')?.click();}},
 {title:"11. Try the quiz",text:"Open the quiz. Choose an answer for each question. Then check your score out of twenty and read the explanations.",target:'[data-tab="quiz"]',action:()=>{document.querySelector('[data-tab="quiz"]')?.click();}},
 {title:"12. Save a PDF",text:"Use these buttons to save the lesson or the quiz. In the print window, choose Save as PDF.",target:'.bea-pdf-tools',action:()=>{document.querySelector('[data-tab="en"]')?.click();}},
 {title:"Well done!",text:"You have finished the tour. Now you can study mitochondria, or choose another biology lesson. Enjoy learning English!",target:'#bea-help-open'}
];let idx=0,highlight=null,previousFocus=null;

let tourVoiceEnabled=true;
let tourVoiceToken=0;
function stopTourVoice(){
  tourVoiceToken++;
  try{if('speechSynthesis' in window)window.speechSynthesis.cancel();}catch(e){}
}
function narrateTour(){
  stopTourVoice();
  if(!tourVoiceEnabled)return;
  if(!('speechSynthesis' in window)){
    $('bea-tour-sound').textContent='🔇 Voice unavailable';
    $('bea-tour-sound').disabled=true;
    return;
  }
  const step=steps[idx];
  const utterance=new SpeechSynthesisUtterance(step.title+'. '+step.text);
  utterance.lang='en-US';
  utterance.rate=Number($('bea-tour-speed').value)||0.95;
  utterance.pitch=1;
  const voices=window.speechSynthesis.getVoices();
  const en=voices.find(v=>/^en-US$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
  if(en)utterance.voice=en;
  try{window.speechSynthesis.speak(utterance);}catch(e){console.warn('Narration indisponible',e);}
}
$('bea-tour-sound').addEventListener('click',()=>{
 tourVoiceEnabled=!tourVoiceEnabled;
 $('bea-tour-sound').textContent=tourVoiceEnabled?'🔊 English voice on':'🔇 Voice off';
 $('bea-tour-sound').setAttribute('aria-pressed',String(tourVoiceEnabled));
 if(tourVoiceEnabled)narrateTour();else stopTourVoice();
});
$('bea-tour-repeat').addEventListener('click',narrateTour);
$('bea-tour-speed').addEventListener('change',()=>{if(tourVoiceEnabled)narrateTour();});

function clearHighlight(){if(highlight){highlight.classList.remove('bea-tour-focus');highlight=null;}}
function placeCard(target){
 const rect=target.getBoundingClientRect(),c=card.getBoundingClientRect();
 let top=rect.bottom+14;
 if(top+c.height>window.innerHeight-10)top=rect.top-c.height-14;
 if(top<8)top=Math.max(8,window.innerHeight-c.height-12);
 let left=Math.max(10,Math.min(window.innerWidth-c.width-10,rect.left));
 card.style.top=top+'px';card.style.left=left+'px';
}
function showStep(){
 clearHighlight();
 const s=steps[idx];
 if(s.action){try{s.action();}catch(e){console.warn('Visite : étape non disponible',e);}}
 $('bea-tour-title').textContent=s.title;
 $('bea-tour-text').textContent=s.text;
 $('bea-tour-progress').textContent=(idx+1)+' / '+steps.length;
 $('bea-tour-prev').disabled=idx===0;
 $('bea-tour-next').textContent=idx===steps.length-1?'Finish ✓':'Next →';
 let el=document.querySelector(s.target);
 if(!el)el=$('heading');
 if(el.closest('details:not([open])')){let p=el.closest('details:not([open])');while(p){p.open=true;p=el.closest('details:not([open])');}}
 el.scrollIntoView({behavior:'instant',block:'center'});
 el.classList.add('bea-tour-focus');highlight=el;
 requestAnimationFrame(()=>requestAnimationFrame(()=>placeCard(el)));
 narrateTour();
}
function closeTour(){stopTourVoice();clearHighlight();overlay.hidden=true;document.body.classList.remove('bea-tour-active');if($('pop'))$('pop').hidden=true;if(previousFocus)previousFocus.focus();}
$('bea-help-open').addEventListener('click',()=>{previousFocus=document.activeElement;idx=0;overlay.hidden=false;document.body.classList.add('bea-tour-active');showStep();$('bea-tour-next').focus();});
$('bea-tour-exit').addEventListener('click',closeTour);
$('bea-tour-prev').addEventListener('click',()=>{if(idx>0){idx--;showStep();}});
$('bea-tour-next').addEventListener('click',()=>{if(idx===steps.length-1)closeTour();else{idx++;showStep();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();closeTour();}});
window.addEventListener('resize',()=>{if(!overlay.hidden&&highlight)placeCard(highlight);});
})();
