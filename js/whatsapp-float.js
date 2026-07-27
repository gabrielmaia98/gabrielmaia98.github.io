document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.whatsapp-float');
  var footer = document.querySelector('body > footer');
  if (!btn || !footer) return;

  var isContactPage = window.location.pathname.replace(/\/$/, '') === '/contato';
  var mobileQuery = window.matchMedia('(max-width:860px)');

  if (isContactPage) {
    var margin = 24;
    function update () {
      if (mobileQuery.matches) {
        btn.style.transform = ''; // mobile: fica fixo, sobre o rodapé, sem reposicionar
        return;
      }
      var footerTop = footer.getBoundingClientRect().top;
      var overlap = window.innerHeight - footerTop;
      btn.style.transform = overlap > 0 ? 'translateY(-' + (overlap + margin) + 'px)' : '';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        btn.classList.toggle('whatsapp-float--hidden', entry.isIntersecting);
      });
    });
    observer.observe(footer);
  }
});
