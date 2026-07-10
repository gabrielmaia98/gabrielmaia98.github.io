document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('header');
  function setHeaderHeight () {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('nav.links');
  if (!toggle || !links) return;

  var originalParent = links.parentNode;
  var originalNextSibling = links.nextSibling;

  function openMenu () {
    document.body.appendChild(links);
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
  }

  function closeMenu () {
    links.classList.remove('is-open');
    if (links.parentNode === document.body) {
      originalParent.insertBefore(links, originalNextSibling);
    }
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  toggle.addEventListener('click', function () {
    links.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.querySelectorAll('.nav-dropdown > a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
});
