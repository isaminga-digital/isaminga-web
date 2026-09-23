// Menú móvil, aparición al hacer scroll, luz que sigue al puntero en las teselas
// y formulario que arma un correo (sitio estático).
(function () {
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var boton = document.querySelector('[data-menu-boton]')
  var panel = document.getElementById('menu-movil')
  if (boton && panel) {
    var cerrar = function (devolverFoco) {
      panel.hidden = true
      boton.setAttribute('aria-expanded', 'false')
      boton.setAttribute('aria-label', 'Abrir menú')
      if (devolverFoco) boton.focus()
    }
    boton.addEventListener('click', function () {
      if (boton.getAttribute('aria-expanded') === 'true') return cerrar(false)
      panel.hidden = false
      boton.setAttribute('aria-expanded', 'true')
      boton.setAttribute('aria-label', 'Cerrar menú')
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

  // Aparición: los hermanos con la clase .revela entran con un pequeño desfase.
  var bloques = document.querySelectorAll('.revela')
  if ('IntersectionObserver' in window && !quieto) {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); vigia.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })
    bloques.forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentNode.children, function (h) { return h.classList.contains('revela') })
      var i = hermanos.indexOf(el)
      if (i > 0) el.style.setProperty('--i', Math.min(i, 6))
      vigia.observe(el)
    })
  } else {
    bloques.forEach(function (el) { el.classList.add('visible') })
  }

  // Luz que sigue al puntero en las teselas de servicios.
  if (!quieto) {
    document.querySelectorAll('.tesela').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect()
        t.style.setProperty('--x', (e.clientX - r.left) + 'px')
        t.style.setProperty('--y', (e.clientY - r.top) + 'px')
      })
    })
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
      var asunto = 'Contacto desde isamingadigital.cl' + (v('empresa') ? ' - ' + v('empresa') : '')
      var cuerpo = ['Nombre: ' + v('nombre'), 'Empresa: ' + v('empresa'), 'Correo: ' + v('correo'), '', v('mensaje')].join('\n')
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo)
    })
  })
})()
