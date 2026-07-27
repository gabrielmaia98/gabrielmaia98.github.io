document.addEventListener('DOMContentLoaded', function () {
  var mq = window.matchMedia('(max-width:860px)');
  if (mq.matches) return;

  document.querySelectorAll('.logo-animated').forEach(function (logo) {
    var mark = logo.querySelector('.mark');
    var bar = logo.querySelector('.mark-bar');
    var textEl = logo.querySelector('.logo-text');
    if (!mark || !bar || !textEl) return;

    var fullText = textEl.getAttribute('data-full') || textEl.textContent;
    textEl.textContent = fullText;

    var fullWidth = textEl.scrollWidth; // mede a largura real com o texto completo
    logo.style.minWidth = (mark.offsetWidth + 10 + fullWidth) + 'px'; // reserva o espaço no elemento pai, desde já

    textEl.textContent = '';

    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    logo.appendChild(cursor);
    cursor.style.left = (mark.offsetLeft + 6) + 'px';

    bar.classList.add('is-blinking');

    window.setTimeout(function () {
      bar.classList.add('is-hidden');
      cursor.classList.add('is-active');

      var i = 0;
      function typeNext () {
        if (i >= fullText.length) {
          window.setTimeout(function () {
            cursor.classList.remove('is-active');
            bar.classList.remove('is-hidden', 'is-blinking');
          }, 250);
          return;
        }
        textEl.textContent += fullText[i];
        i++;
        cursor.style.left = (mark.offsetLeft + mark.offsetWidth + 10 + textEl.scrollWidth) + 'px';
        window.setTimeout(typeNext, 45);
      }
      typeNext();
    }, 2000);
  });
});
