/**
 * Verificación funcional del sitio generado, contra un servidor levantado con
 * tools/serve.mjs (que resuelve las URLs igual que GitHub Pages).
 *
 *   node tools/serve.mjs dist --port=8099 &
 *   node tools/verify.mjs --port=8099
 */
import { PAGES } from '../src/site.config.mjs'

const port = Number((process.argv.find((a) => a.startsWith('--port=')) || '--port=8099').split('=')[1])
const BASE = `http://localhost:${port}`
const rutaDe = (slug) => (slug ? `/${slug}` : '/')

const fallas = []
const falla = (msg) => fallas.push(msg)

for (const p of PAGES) {
  const ruta = rutaDe(p.slug)
  const res = await fetch(BASE + ruta)
  if (res.status !== 200) {
    falla(`${ruta}: respondió ${res.status}`)
    continue
  }
  const html = await res.text()

  const h1 = (html.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) falla(`${ruta}: ${h1} etiquetas <h1>`)
  if (!/<html lang="es-[A-Z]{2}"[^>]*>/.test(html)) falla(`${ruta}: falta lang="es-*" en <html>`)
  if (!html.includes('application/ld+json')) falla(`${ruta}: sin datos estructurados`)
}

if (fallas.length) {
  console.error('\nVerificación falló:\n')
  console.error(fallas.map((f) => `  ${f}`).join('\n'))
  process.exit(1)
}
console.log(`Verificación OK: ${PAGES.length} páginas.`)
