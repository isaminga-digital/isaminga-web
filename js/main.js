/**
 * Comportamiento del sitio de Isaminga Digital (sin dependencias).
 *
 * - Menú móvil del header (botón, panel y velo).
 * - Pestañas de servicios (lista vertical en escritorio, píldoras en móvil).
 * - Pestañas del método (tres columnas y panel deslizante en escritorio).
 * - Formulario de contacto: arma un correo con lo escrito (sitio estático).
 */
(function () {
  'use strict'

  /* ---------- Menú móvil ---------- */
  document.querySelectorAll('[data-mobile-nav]').forEach(function (root) {
    var btn = root.querySelector('[data-mobile-toggle]')
    var overlay = root.querySelector('[data-mobile-overlay]')
    var panel = root.querySelector('[data-mobile-panel]')
    var iconMenu = root.querySelector('[data-icon-menu]')
    var iconClose = root.querySelector('[data-icon-close]')
    if (!btn || !panel) return

    function set(open) {
      btn.setAttribute('aria-expanded', String(open))
      btn.setAttribute('aria-label', open ? 'Cerrar la navegación' : 'Abrir la navegación')
      // Clase en vez del atributo hidden: el atributo pierde contra las
      // utilidades de display de Tailwind (flex, fixed) por especificidad.
      overlay.classList.toggle('hidden', !open)
      panel.classList.toggle('hidden', !open)
      iconMenu.classList.toggle('scale-90', open)
      iconMenu.classList.toggle('opacity-0', open)
      iconClose.classList.toggle('scale-90', !open)
      iconClose.classList.toggle('opacity-0', !open)
    }
    btn.addEventListener('click', function () {
      set(btn.getAttribute('aria-expanded') !== 'true')
    })
    overlay.addEventListener('click', function () { set(false) })
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false) })
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false) })
  })

  /* ---------- Utilidades de pestañas ---------- */
  function swap(el, quitar, poner) {
    quitar.forEach(function (c) { el.classList.remove(c) })
    poner.forEach(function (c) { el.classList.add(c) })
  }
  function wireTabs(tabs, onSelect) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { onSelect(i) })
      tab.addEventListener('keydown', function (e) {
        var n = tabs.length
        var j = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % n
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n
          : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
        if (j < 0) return
        e.preventDefault()
        onSelect(j)
        tabs[j].focus()
      })
    })
  }

  /* ---------- Pestañas de servicios ---------- */
  var SEL_ITEM = ['bg-white', 'lg:bg-white/10', 'lg:ring-1', 'lg:ring-inset', 'lg:ring-white/10']
  var NOSEL_ITEM = ['hover:bg-white/10', 'lg:hover:bg-white/5']
  var SEL_BTN = ['text-blue-600', 'lg:text-white']
  var NOSEL_BTN = ['text-blue-100', 'hover:text-white', 'lg:text-white']
  var SEL_P = ['text-white']
  var NOSEL_P = ['text-blue-100', 'group-hover:text-white']

  document.querySelectorAll('[data-tabs="servicios"]').forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'))
    var tabs = items.map(function (it) { return it.querySelector('[role="tab"]') })
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-panel]'))

    function select(idx) {
      items.forEach(function (it, i) {
        var on = i === idx
        var btn = tabs[i]
        var p = it.querySelector('p')
        swap(it, on ? NOSEL_ITEM : SEL_ITEM, on ? SEL_ITEM : NOSEL_ITEM)
        swap(btn, on ? NOSEL_BTN : SEL_BTN, on ? SEL_BTN : NOSEL_BTN)
        if (p) swap(p, on ? NOSEL_P : SEL_P, on ? SEL_P : NOSEL_P)
        btn.setAttribute('aria-selected', String(on))
        btn.tabIndex = on ? 0 : -1
      })
      panels.forEach(function (pn, i) {
        var on = i === idx
        pn.hidden = !on
        pn.style.display = on ? '' : 'none'
        pn.tabIndex = on ? 0 : -1
      })
    }
    wireTabs(tabs, select)
  })

  /* ---------- Pestañas del método (escritorio) ---------- */
  document.querySelectorAll('[data-tabs="metodo"]').forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'))
    var tabs = items.map(function (it) { return it.querySelector('[role="tab"]') })
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-panel]'))

    function select(idx) {
      items.forEach(function (it, i) {
        var on = i === idx
        var icon = it.querySelector('[data-icon]')
        var h3 = it.querySelector('h3')
        swap(it, on ? ['opacity-75', 'hover:opacity-100'] : [], on ? [] : ['opacity-75', 'hover:opacity-100'])
        if (icon) swap(icon, on ? ['bg-slate-500'] : ['bg-blue-600'], on ? ['bg-blue-600'] : ['bg-slate-500'])
        if (h3) swap(h3, on ? ['text-slate-600'] : ['text-blue-600'], on ? ['text-blue-600'] : ['text-slate-600'])
        tabs[i].setAttribute('aria-selected', String(on))
        tabs[i].tabIndex = on ? 0 : -1
      })
      panels.forEach(function (pn, i) {
        var on = i === idx
        pn.style.transform = 'translateX(-' + idx * 100 + '%)'
        pn.classList.toggle('opacity-60', !on)
        pn.setAttribute('aria-hidden', String(!on))
        pn.tabIndex = on ? 0 : -1
      })
    }
    wireTabs(tabs, select)
  })

  /* ---------- Formulario de contacto (mailto) ---------- */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : '' }
      var asunto = 'Contacto desde isamingadigital.cl' + (v('empresa') ? ' - ' + v('empresa') : '')
      var cuerpo = [
        'Nombre: ' + v('nombre'),
        'Empresa: ' + v('empresa'),
        'Correo: ' + v('correo'),
        '',
        v('mensaje'),
      ].join('\n')
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo)
    })
  })
})()
