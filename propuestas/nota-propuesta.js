// Descripción flotante de cada propuesta.
//
// Se incluye en las cuatro páginas de cada propuesta con
//   <script src="../nota-propuesta.js" defer></script>
// Detecta la propuesta por la carpeta de la URL y muestra una tarjeta que se
// puede cerrar. Al cerrarla queda una pastilla para volver a abrirla. Durante
// la sesión recuerda que se cerró, para no reaparecer en cada página de la
// misma propuesta. Estilo neutro, igual en las tres: describe la propuesta y
// no forma parte de su diseño.
(function () {
  'use strict'

  var PROPUESTAS = {
    'A-consultor-cercano': {
      letra: 'A',
      nombre: 'Consultor senior cercano',
      transmite: 'Cercanía y experiencia. Se lee como la primera reunión: las preguntas llegan antes que la tecnología.',
      publico: 'Al dueño o gerente de una pyme que nunca contrató una consultoría y quiere que primero lo escuchen.',
      voz: 'Tuteo, directo y sin jerga.',
      tipografia: 'Lexend en títulos, Inter en texto.',
      paleta: ['#0448A3', '#0295D6', '#FE8119', '#B8E2F8', '#3A3A3C'],
      paletaNombre: 'Colores del logo (enfoque 1)',
      pendientes: 'Sin testimonios ni cifras: los reemplazan los sectores, la primera reunión y las preguntas frecuentes.',
    },
    'B-corporativo-sobrio': {
      letra: 'B',
      nombre: 'Corporativo sobrio',
      transmite: 'Rigor y método. El trabajo se explica en cuatro etapas, cada una con un resultado para la gerencia.',
      publico: 'A gerencias y directorios de empresas medianas que comparan consultoras y deben justificar la decisión.',
      voz: 'Trato de usted, formal y estructurado.',
      tipografia: 'Source Serif 4 en títulos, Inter en texto.',
      paleta: ['#1E3A5F', '#2563EB', '#F59E0B', '#F1F5F9', '#0F172A'],
      paletaNombre: 'Corporativo moderno (enfoque 2)',
      pendientes: 'Referencias de clientes y reseña de la dirección quedan como pendientes visibles, marcados en la página.',
    },
    'C-moderno-aspiracional': {
      letra: 'C',
      nombre: 'Moderno y aspiracional',
      transmite: 'Energía y ambición, con un relato propio: la minga chilota que mueve la casa, presente en el nombre y en el isotipo.',
      publico: 'A empresas en crecimiento que quieren modernizarse y buscan una consultora con aire actual y seria.',
      voz: 'Tuteo, frases cortas y verbos de acción.',
      tipografia: 'Bricolage Grotesque en títulos, Inter en texto.',
      paleta: ['#0A1A33', '#0448A3', '#0295D6', '#FE8119', '#E8321F'],
      paletaNombre: 'Propia, sacada del degradado del logo',
      pendientes: 'Sin testimonios ni cifras: casos de uso por sector, declarados como ejemplos tipo.',
    },
  }

  var carpeta = Object.keys(PROPUESTAS).filter(function (c) {
    return decodeURIComponent(location.pathname).indexOf('/' + c + '/') !== -1
  })[0]
  if (!carpeta) return
  var p = PROPUESTAS[carpeta]
  var clave = 'nota-propuesta-' + p.letra
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var estilos = document.createElement('style')
  estilos.textContent = [
    '.np-tarjeta, .np-pastilla { font-family: "Inter", system-ui, sans-serif; color: #1F2937; }',
    '.np-tarjeta { position: fixed; z-index: 1000; right: 1rem; bottom: 1rem; width: min(23rem, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); overflow: auto; background: #fff; border: 1px solid #E5E7EB; border-radius: 1rem; box-shadow: 0 24px 60px -20px rgba(15,23,42,.45); padding: 1.25rem 1.25rem 1.1rem; font-size: .9rem; line-height: 1.55; }',
    '.np-tarjeta[hidden], .np-pastilla[hidden] { display: none; }',
    '.np-entra { animation: np-entrar .35s cubic-bezier(.2,.8,.2,1) both; }',
    '@keyframes np-entrar { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }',
    '.np-cabeza { display: flex; align-items: flex-start; gap: .75rem; padding-right: 2rem; }',
    '.np-letra { flex: none; display: inline-grid; place-items: center; width: 2rem; height: 2rem; border-radius: .5rem; background: #1F2937; color: #fff; font-weight: 700; font-size: .95rem; }',
    '.np-rotulo { margin: 0; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #4B5563; }',
    '.np-tarjeta h2 { margin: .1rem 0 0; font-family: inherit; font-size: 1.1rem; line-height: 1.25; letter-spacing: -0.01em; font-weight: 700; color: #111827; }',
    '.np-cerrar { position: absolute; top: .75rem; right: .75rem; display: inline-grid; place-items: center; width: 2rem; height: 2rem; border: 0; border-radius: .5rem; background: transparent; color: #374151; cursor: pointer; }',
    '.np-cerrar:hover { background: #F3F4F6; }',
    '.np-tarjeta dl { margin: 1rem 0 0; display: grid; gap: .65rem; }',
    '.np-tarjeta dt { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #4B5563; }',
    '.np-tarjeta dd { margin: .1rem 0 0; }',
    '.np-colores { display: flex; gap: .3rem; margin-top: .3rem; }',
    '.np-colores span { width: 1.35rem; height: 1.35rem; border-radius: .35rem; border: 1px solid rgba(0,0,0,.1); }',
    '.np-aviso { margin: 1rem 0 0; padding: .65rem .8rem; border-radius: .6rem; background: #FFF7ED; border: 1px solid #FED7AA; color: #7C2D12; font-size: .82rem; }',
    '.np-pastilla { position: fixed; z-index: 1000; right: 1rem; bottom: 1rem; display: inline-flex; align-items: center; gap: .5rem; border: 0; border-radius: 999px; background: #1F2937; color: #fff; font-size: .85rem; font-weight: 600; padding: .6rem 1rem .6rem .6rem; cursor: pointer; box-shadow: 0 12px 30px -12px rgba(15,23,42,.6); }',
    '.np-pastilla b { display: inline-grid; place-items: center; width: 1.6rem; height: 1.6rem; border-radius: 999px; background: #fff; color: #1F2937; font-size: .8rem; }',
    '.np-pastilla:hover { background: #111827; }',
    '.np-tarjeta :focus-visible, .np-pastilla:focus-visible { outline: 3px solid #FE8119; outline-offset: 2px; }',
    '@media (max-width: 600px) { .np-tarjeta { right: .5rem; left: .5rem; bottom: .5rem; width: auto; max-height: 45vh; } .np-pastilla { right: .75rem; bottom: .75rem; } }',
    '@media (prefers-reduced-motion: reduce) { .np-entra { animation: none; } }',
  ].join('\n')
  document.head.appendChild(estilos)

  var colores = p.paleta.map(function (c) { return '<span style="background:' + c + '"></span>' }).join('')

  var tarjeta = document.createElement('section')
  tarjeta.className = 'np-tarjeta'
  tarjeta.setAttribute('role', 'dialog')
  tarjeta.setAttribute('aria-labelledby', 'np-titulo')
  tarjeta.innerHTML =
    '<div class="np-cabeza"><span class="np-letra" aria-hidden="true">' + p.letra + '</span>' +
    '<div><p class="np-rotulo">Propuesta ' + p.letra + '</p><h2 id="np-titulo">' + p.nombre + '</h2></div></div>' +
    '<button type="button" class="np-cerrar" aria-label="Cerrar la descripción de la propuesta">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
    '<dl>' +
    '<div><dt>Qué transmite</dt><dd>' + p.transmite + '</dd></div>' +
    '<div><dt>A quién le habla</dt><dd>' + p.publico + '</dd></div>' +
    '<div><dt>Voz</dt><dd>' + p.voz + '</dd></div>' +
    '<div><dt>Paleta</dt><dd>' + p.paletaNombre + '<div class="np-colores" aria-hidden="true">' + colores + '</div></dd></div>' +
    '<div><dt>Tipografía</dt><dd>' + p.tipografia + '</dd></div>' +
    '<div><dt>Testimonios y cifras</dt><dd>' + p.pendientes + '</dd></div>' +
    '</dl>' +
    '<p class="np-aviso">Primer enfoque. Los textos son de muestra e ilustran el tono; el contenido real se debe definir.</p>'

  var pastilla = document.createElement('button')
  pastilla.type = 'button'
  pastilla.className = 'np-pastilla'
  pastilla.setAttribute('aria-label', 'Abrir la descripción de la propuesta ' + p.letra)
  pastilla.innerHTML = '<b aria-hidden="true">' + p.letra + '</b>Sobre esta propuesta'

  var cerrar = tarjeta.querySelector('.np-cerrar')

  function leer() { try { return sessionStorage.getItem(clave) } catch (e) { return null } }
  function guardar(v) { try { sessionStorage.setItem(clave, v) } catch (e) {} }

  function abrir(conFoco) {
    tarjeta.hidden = false
    pastilla.hidden = true
    if (!quieto) {
      tarjeta.classList.remove('np-entra')
      void tarjeta.offsetWidth
      tarjeta.classList.add('np-entra')
    }
    guardar('abierta')
    if (conFoco) cerrar.focus()
  }

  function ocultar(conFoco) {
    tarjeta.hidden = true
    pastilla.hidden = false
    guardar('cerrada')
    if (conFoco) pastilla.focus()
  }

  cerrar.addEventListener('click', function () { ocultar(true) })
  pastilla.addEventListener('click', function () { abrir(true) })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !tarjeta.hidden) ocultar(tarjeta.contains(document.activeElement))
  })

  document.body.appendChild(tarjeta)
  document.body.appendChild(pastilla)

  // Se abre sola la primera vez; si ya se cerró en esta sesión, queda la pastilla.
  if (leer() === 'cerrada') { tarjeta.hidden = true; pastilla.hidden = false }
  else abrir(false)
})()
