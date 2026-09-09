/**
 * Pruebas de interacción y capturas con Chrome headless (protocolo de depuración).
 *
 *   node tools/serve.mjs dist --port=8100      (en otra terminal)
 *   npm run test:ui                            (o: node --experimental-websocket tools/pruebas-ui.mjs http://localhost:8100)
 *
 * Deja las capturas en dist-pruebas/. Usa el Chrome instalado (variable CHROME
 * para otra ruta). No requiere dependencias.
 */
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333
const BASE = process.argv[2] || 'http://localhost:8100'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist-pruebas')
mkdirSync(OUT, { recursive: true })

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(tmpdir(), 'isaminga-pruebas-ui')}`,
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function wsUrl() {
  for (let i = 0; i < 100; i++) {
    try {
      const tabs = await (await fetch(`http://localhost:${PORT}/json`)).json()
      const t = tabs.find((t) => t.type === 'page')
      if (t) return t.webSocketDebuggerUrl
    } catch {}
    await sleep(200)
  }
  throw new Error('Chrome no respondió')
}
const ws = new WebSocket(await wsUrl())
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) }
}
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
await send('Page.enable'); await send('Runtime.enable')

const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails))
  return r.result?.result?.value
}
const metrics = (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 })
const goto = async (path) => { await send('Page.navigate', { url: BASE + path }); await sleep(2500) }
async function shot(name, { full = false } = {}) {
  const params = { format: 'png' }
  if (full) {
    const h = await evaluate('document.documentElement.scrollHeight')
    const w = await evaluate('window.innerWidth')
    params.clip = { x: 0, y: 0, width: w, height: h, scale: 1 }
    params.captureBeyondViewport = true
  }
  const r = await send('Page.captureScreenshot', params)
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, 'base64'))
  console.log('captura', name)
}
const results = []
const check = (nombre, ok, detalle = '') => { results.push([nombre, ok, detalle]); console.log(ok ? 'OK ' : 'FALLA', nombre, detalle) }

try {
  // ---- Escritorio: páginas internas completas
  await metrics(1440, 900)
  for (const p of ['quienes-somos', 'servicios', 'metodo', 'contacto']) {
    await goto('/' + p)
    await shot(`captura-${p}-desktop`, { full: true })
  }

  // ---- Escritorio: pestañas de servicios
  await goto('/')
  check('sin errores de consola al cargar', await evaluate('!window.__err'))
  await evaluate(`document.querySelectorAll('[data-tabs="servicios"] [role=tab]')[2].click(); 'ok'`)
  await sleep(300)
  check('pestaña servicios 3 muestra su panel', await evaluate(`!document.getElementById('panel-servicio-3').hidden && document.getElementById('panel-servicio-1').hidden`))
  check('pestaña servicios 3 marcada seleccionada', await evaluate(`document.getElementById('tab-servicio-3').getAttribute('aria-selected')==='true' && document.getElementById('tab-servicio-3').closest('[data-tab]').classList.contains('lg:bg-white/10')`))
  await evaluate(`document.getElementById('servicios').scrollIntoView(); 'ok'`); await sleep(300)
  await shot('captura-tabs-servicios-3')

  // ---- Escritorio: pestañas del método
  await evaluate(`document.querySelectorAll('[data-tabs="metodo"] [role=tab]')[1].click(); 'ok'`)
  await sleep(700)
  check('pestaña método 2 desliza el panel', await evaluate(`document.getElementById('panel-metodo-2').style.transform==='translateX(-100%)' && !document.getElementById('panel-metodo-2').classList.contains('opacity-60') && document.getElementById('panel-metodo-1').classList.contains('opacity-60')`))
  await evaluate(`document.getElementById('como-trabajamos').scrollIntoView(); window.scrollBy(0, 380); 'ok'`); await sleep(300)
  await shot('captura-tabs-metodo-2')

  // ---- Móvil: página completa y menú
  await metrics(390, 844)
  await goto('/')
  check('menú móvil cerrado al cargar', await evaluate(`getComputedStyle(document.getElementById('menu-movil')).display==='none' && getComputedStyle(document.querySelector('[data-mobile-overlay]')).display==='none'`))
  await shot('captura-home-mobile', { full: true })
  await evaluate(`window.scrollTo(0,0); document.querySelector('[data-mobile-toggle]').click(); 'ok'`)
  await sleep(400)
  check('menú móvil se abre', await evaluate(`getComputedStyle(document.getElementById('menu-movil')).display==='flex' && document.querySelector('[data-mobile-toggle]').getAttribute('aria-expanded')==='true'`))
  await shot('captura-menu-mobile')
  await evaluate(`document.querySelector('[data-mobile-overlay]').click(); 'ok'`); await sleep(300)
  check('menú móvil se cierra con el velo', await evaluate(`getComputedStyle(document.getElementById('menu-movil')).display==='none'`))
  check('sin desborde horizontal en móvil', await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), await evaluate(`document.documentElement.scrollWidth + 'px de ' + window.innerWidth`))
  await metrics(390, 844)
  await goto('/contacto')
  await shot('captura-contacto-mobile', { full: true })
} finally {
  ws.close()
  chrome.kill()
}
const fallas = results.filter((r) => !r[1])
console.log(`\n${results.length - fallas.length}/${results.length} comprobaciones OK`)
process.exit(fallas.length ? 1 : 0)
