// Menú móvil accesible, aparición al hacer scroll y formulario que arma un correo (sitio estático).
(function () {
  var boton = document.querySelector('[data-menu-boton]')
  var panel = document.getElementById('menu-movil')
  if (boton && panel) {
    var texto = boton.querySelector('[data-menu-texto]')
    var cerrar = function (devolverFoco) {
      panel.hidden = true
      boton.setAttribute('aria-expanded', 'false')
      if (texto) texto.textContent = 'Menú'
      if (devolverFoco) boton.focus()
    }
    boton.addEventListener('click', function () {
      if (boton.getAttribute('aria-expanded') === 'true') return cerrar(false)
      panel.hidden = false
      boton.setAttribute('aria-expanded', 'true')
      if (texto) texto.textContent = 'Cerrar'
      var primero = panel.querySelector('a')
      if (primero) primero.focus()
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) cerrar(true)
    })
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrar(false)
    })
  }

  var bloques = document.querySelectorAll('.revela')
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if ('IntersectionObserver' in window && !quieto) {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); vigia.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 })
    bloques.forEach(function (el) { vigia.observe(el) })
  } else {
    bloques.forEach(function (el) { el.classList.add('visible') })
  }

  var encabezado = document.querySelector('.encabezado')
  if (encabezado) {
    var sombra = function () { encabezado.classList.toggle('con-sombra', window.scrollY > 8) }
    window.addEventListener('scroll', sombra, { passive: true })
    sombra()
  }

  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : '' }
      var asunto = 'Solicitud de reunión desde isamingadigital.cl' + (v('empresa') ? ' - ' + v('empresa') : '')
      var cuerpo = ['Nombre: ' + v('nombre'), 'Cargo: ' + v('cargo'), 'Empresa: ' + v('empresa'), 'Correo: ' + v('correo'), 'Línea de interés: ' + v('linea'), '', v('mensaje')].join('\n')
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo)
    })
  })
})()
