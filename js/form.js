document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-loaded-at').forEach(function (input) {
    input.value = Date.now();
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get('envio') === 'erro') {
    var form = document.querySelector('.orcamento-form');
    if (form) {
      var banner = document.createElement('div');
      banner.className = 'form-error-banner';
      banner.textContent = 'Não conseguimos enviar sua solicitação agora. Tente novamente ou fale conosco pelo WhatsApp.';
      form.parentNode.insertBefore(banner, form);
    }
  }
});
