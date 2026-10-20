
(function(){
 const el=id=>document.getElementById(id),data=JSON.parse(el('bea-deep-data').textContent),panel=el('bea-deep-dive');
 let last='';
 function refresh(){
  const heading=el('heading')?.textContent||'';
  const chapters=JSON.parse(el('lesson-data').textContent);
  const chapter=chapters.find(x=>x.title===heading);
  const key=chapter?String(chapter.id):'';
  if(key===last)return;
  last=key;
  const entry=data[key];
  panel.hidden=!entry;
  if(!entry)return;
  const names={'bea-deep-en':'en','bea-deep-fr':'fr','bea-deep-qen':'question_en','bea-deep-qfr':'question_fr','bea-deep-aen':'answer_en','bea-deep-afr':'answer_fr'};
  for(const [id,field] of Object.entries(names))el(id).textContent=entry[field];
  panel.querySelectorAll('details').forEach(x=>x.open=false);
 }
 const heading=el('heading');
 if(heading){new MutationObserver(refresh).observe(heading,{childList:true,characterData:true,subtree:true});refresh();}
})();
