/* Isaminga Digital — comportamiento mínimo del sitio, sin dependencias.
   1. Menú móvil (equivalente al drawer del template, resuelto con un panel
      bajo el header y un botón con aria-expanded).
   2. Formulario de contacto: el sitio es estático y todavía no tiene un
      servicio de envío. Mientras se define, el botón arma un correo con los
      datos ingresados y abre el cliente de correo del visitante. */
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.getElementById('mobile-menu');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var abrir = panel.hasAttribute('hidden');
      if (abrir) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      document.body.classList.toggle('menu-open', abrir);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  var form = document.querySelector('form[data-mailto]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var para = form.getAttribute('data-mailto');
      var quien = d.get('empresa') || d.get('nombre') || '';
      var asunto = encodeURIComponent('Contacto desde el sitio: ' + quien);
      var cuerpo = encodeURIComponent(
        'Nombre: ' + (d.get('nombre') || '') + '\n' +
        'Empresa: ' + (d.get('empresa') || '') + '\n' +
        'Correo: ' + (d.get('correo') || '') + '\n\n' +
        (d.get('mensaje') || '')
      );
      window.location.href = 'mailto:' + para + '?subject=' + asunto + '&body=' + cuerpo;
    });
  }
})();
