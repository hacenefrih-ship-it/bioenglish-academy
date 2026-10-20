
(function(){
'use strict';
const $=id=>document.getElementById(id);
const menu=$('bea-toggle-menu'),side=document.querySelector('.sidebar'),course=$('heading'),progress=$('frisa-progress');
const isMobile=()=>window.matchMedia('(max-width:750px)').matches;
function scrollToElement(el){if(!el)return;el.scrollIntoView({behavior:'smooth',block:'start'});}
function showMenu(){
 if(document.body.classList.contains('bea-collapsed'))menu.click();
 scrollToElement($('search'));
 $('search').focus({preventScroll:true});
}
function showCourse(){
 if(isMobile()&&!document.body.classList.contains('bea-collapsed'))menu.click();
 scrollToElement(course);
}
$('bea-mobile-chapters').addEventListener('click',showMenu);
$('bea-mobile-course').addEventListener('click',showCourse);
$('bea-mobile-tour').addEventListener('click',()=>$('bea-help-open').click());
$('nav').addEventListener('click',event=>{
 const b=event.target.closest('button[data-index]');
 if(!b)return;
 // The existing chapter handler is synchronous; wait until it renders.
 requestAnimationFrame(()=>{
   if(isMobile() && $('bea-tour-overlay')?.hidden!==false)showCourse();
 });
});
if(progress){
 const header=progress.querySelector('h3');
 if(header){
  const details=document.createElement('details');
  details.id='bea-progress-details';
  details.open=!isMobile();
  const summary=document.createElement('summary');
  summary.textContent=header.textContent.trim()+' — afficher / masquer';
  details.appendChild(summary);
  header.remove();
  while(progress.firstChild)details.appendChild(progress.firstChild);
  progress.appendChild(details);
  window.addEventListener('resize',()=>{if(!isMobile()&&!details.open)details.open=true;});
 }
}
const search=$('search');
if(search){
 search.setAttribute('autocomplete','off');
 search.setAttribute('enterkeyhint','search');
 search.addEventListener('keydown',e=>{
   if(e.key==='Enter'){
    const b=$('nav').querySelector('button[data-index]');
    if(b){b.click();e.preventDefault();search.blur();}
   }
 });
}
// Prevent invisible chapters after closing the guided tour.
// The tour search term is instructional and should not persist unless entered by the student.
const closeTour=$('bea-tour-exit');
if(closeTour){
 closeTour.addEventListener('click',()=>{
  const search=$('search');
  if(search?.value==='Mitochondria'){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
 });
}
})();
