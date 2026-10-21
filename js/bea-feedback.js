
/* BioEnglish Academy — optional, isolated feedback link. */
(function () {
  'use strict';

  // Replace the empty string with your published Google Forms respondent URL.
  // Example: https://docs.google.com/forms/d/e/.../viewform
  var GOOGLE_FORM_URL = '';

  function init() {
    var link = document.getElementById('bea-feedback-form-link');
    var note = document.getElementById('bea-feedback-setup');

    if (!link || !note) return;

    if (/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/i.test(GOOGLE_FORM_URL)) {
      link.href = GOOGLE_FORM_URL;
      link.hidden = false;
      note.textContent = 'Le formulaire s’ouvre dans un nouvel onglet. Ne partagez aucune information médicale ou confidentielle.';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
