(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* menu mobilne */
  var ham = $('.ham'), panel = $('#panel');
  function zamknij() { panel.hidden = true; ham.setAttribute('aria-expanded', 'false'); ham.setAttribute('aria-label', 'Otwórz menu'); }
  ham.addEventListener('click', function () {
    var otw = panel.hidden;
    panel.hidden = !otw;
    ham.setAttribute('aria-expanded', String(otw));
    ham.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  $$('#panel a').forEach(function (a) { a.addEventListener('click', zamknij); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) zamknij(); });
  window.addEventListener('resize', function () { if (innerWidth > 1024) zamknij(); });

  /* przelacznik jezyka - w wizualizacji tylko element nawigacji */
  $$('.jezyk a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.hasAttribute('aria-current')) return;
      e.preventDefault();
    });
  });

  /* dolny pasek: dopiero po przewinieciu za przyciski hero */
  var mob = $('#mob'), heroCta = $('.hero-cta');
  function pasek(w) {
    mob.classList.toggle('widac', w);
    mob.setAttribute('aria-hidden', String(!w));
    $$('a', mob).forEach(function (a) { a.tabIndex = w ? 0 : -1; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) { pasek(!x.isIntersecting && x.boundingClientRect.top < 0); });
    }).observe(heroCta);
  }

  /* formularz: bez backendu - przygotowuje wiadomosc e-mail */
  var form = $('#form'), info = $('#formInfo');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var zle = !el.value.trim();
      el.closest('.pole').classList.toggle('blad', zle);
      if (zle) ok = false;
    });
    if (!ok) { info.textContent = 'Uzupełnij wszystkie pola.'; return; }
    var typ = $('input[name="typ"]:checked', form).value;
    var hurt = typ === 'Oferta hurtowa';
    var adres = hurt ? 'paulinap.psomar@gmail.com' : 'sklep@sztucznechoinki.com.pl';
    var tresc = form.tresc.value.trim() + '\n\n' + form.kto.value.trim() + '\n' + form.kontakt.value.trim();
    info.textContent = 'Otwieramy program pocztowy z gotową wiadomością do: ' + adres;
    location.href = 'mailto:' + adres + '?subject=' + encodeURIComponent(typ + ' - zapytanie ze strony') + '&body=' + encodeURIComponent(tresc);
  });
  $$('[required]', form).forEach(function (el) {
    el.addEventListener('input', function () { el.closest('.pole').classList.remove('blad'); });
  });
})();
