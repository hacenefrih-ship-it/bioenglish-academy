
(function(){
  function ready(){
    var toggle=document.getElementById('bea-toggle-menu');
    if(toggle) toggle.addEventListener('click',function(){
      var hidden=document.body.classList.toggle('bea-collapsed');
      toggle.textContent=hidden?'☰ Afficher les disciplines':'☰ Masquer les disciplines';
      toggle.setAttribute('aria-expanded',String(!hidden));
    });
    document.querySelectorAll('.bea-step[data-go]').forEach(function(button){
      button.addEventListener('click',function(){
        var target=document.getElementById(button.getAttribute('data-go'));
        if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
