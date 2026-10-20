
(()=>{'use strict';const canvas=document.getElementById('diagram-canvas'),modal=document.getElementById('frisa-diagram-modal'),large=document.getElementById('frisa-diagram-large'),close=document.getElementById('frisa-diagram-close');let previous=null;
function open(){if(!canvas.querySelector('svg,img'))return;previous=document.activeElement;large.innerHTML=canvas.innerHTML;document.getElementById('frisa-diagram-title').textContent=document.getElementById('heading').textContent;modal.hidden=false;close.focus();}
function hide(){modal.hidden=true;large.replaceChildren();if(previous&&previous.focus)previous.focus()}
canvas.addEventListener('click',open);canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});close.addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)hide()});
})();