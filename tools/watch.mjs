/**
 * Modo de trabajo local: sirve la raíz del repo (lo mismo que publica GitHub
 * Pages, propuestas incluidas) y regenera CSS y HTML cada vez que cambia algo
 * en src/, js/ o tailwind.config.cjs.
 *
 *   npm run dev            -> http://localhost:8080
 *   npm run dev -- --port=8090
 *
 * Las propuestas (propuestas/) son HTML estático: se ven al recargar, sin
 * regenerar nada. El servidor responde sin caché, así que basta con F5.
 */
import { spawn, spawnSync } from 'node:child_process'
import { watch } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = (process.argv.find((a) => a.startsWith('--port=')) || '--port=8080').split('=')[1]
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function build(motivo) {
  const inicio = Date.now()
  const r = spawnSync(NPM, ['run', 'build', '--silent'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' })
  const salida = (r.stdout + '' + r.stderr).trim().split('\n').filter((l) => l && !/^>|^$|Rebuilding|Done in/.test(l))
  const hora = new Date().toLocaleTimeString('es-CL', { hour12: false })
  if (r.status === 0) {
    console.log(`[${hora}] regenerado (${motivo}) en ${Date.now() - inicio} ms`)
  } else {
    console.log(`[${hora}] el build falló (${motivo}):\n  ${salida.join('\n  ')}`)
  }
}

build('inicio')

const servidor = spawn(process.execPath, [join(ROOT, 'tools', 'serve.mjs'), '.', `--port=${port}`], { cwd: ROOT, stdio: 'inherit' })
servidor.on('exit', (code) => process.exit(code ?? 0))
process.on('SIGINT', () => { servidor.kill(); process.exit(0) })

// fs.watch recursivo funciona en Windows y macOS; en Linux requiere Node 20+.
let temporizador = null
function programar(archivo) {
  clearTimeout(temporizador)
  temporizador = setTimeout(() => build(archivo || 'cambio'), 300)
}
for (const dir of ['src', 'js']) {
  watch(join(ROOT, dir), { recursive: true }, (_, archivo) => programar(`${dir}/${archivo}`))
}
watch(join(ROOT, 'tailwind.config.cjs'), () => programar('tailwind.config.cjs'))
console.log('vigilando src/, js/ y tailwind.config.cjs; Ctrl+C para salir')
