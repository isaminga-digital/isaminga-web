/**
 * Generador del sitio de Isaminga Digital.
 *
 *   node tools/build.mjs [--out DIR]   -> isamingadigital.cl
 *
 * Variante de un solo dominio del generador de incba-web (ver
 * C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md). Las páginas se
 * arman con los partials de src/partials/ y las secciones de src/sections/;
 * todo lo que describe cada página sale de src/site.config.mjs.
 *
 * Layouts: 'default' (header + main + footer) y 'slim' (panel angosto con
 * imagen de fondo, sin header ni footer; lo usa Contacto, como la página de
 * acceso del diseño de referencia).
 *
 * El CSS (css/styles.css) lo genera Tailwind a partir de las clases usadas en
 * src/ y js/: `npm run build:css`. `npm run build` hace las dos cosas.
 *
 * El build es determinista y valida antes de escribir: si algo no cumple,
 * aborta sin tocar el disco y dice qué.
 */

import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, cpSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOST, SITES, PAGES, LIMITES, MINIMO_PALABRAS_DEFAULT } from '../src/site.config.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')

const read = (...p) => readFileSync(join(SRC, ...p), 'utf8')
const countOf = (hay, needle) => hay.split(needle).length - 1
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m))
}

const urlOf = (site, slug) => (slug ? `${site.host}/${slug}` : `${site.host}/`)
const pathOf = (slug) => (slug ? `/${slug}` : '/')

// Clases de los enlaces de navegación del diseño de referencia.
const CLASE_ENLACE = 'inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'
const CLASE_ENLACE_MOVIL = 'block w-full p-2'

function jsonLd(site, page) {
  const blocks = []
  if (page.slug === '') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Isaminga Digital',
      url: site.host,
      logo: `${site.host}/img/logo.png`,
      description: 'Consultora de transformación digital: análisis de procesos y análisis presupuestario en tecnología.',
      address: { '@type': 'PostalAddress', addressCountry: site.addressCountry },
    })
  } else {
    const trail = [{ name: 'Inicio', path: '/' }, { name: page.breadcrumb }]
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((n, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: n.name,
        item: n.path ? `${site.host}${n.path}` : urlOf(site, page.slug),
      })),
    })
  }
  return blocks
    .map((b) => `  <script type="application/ld+json">\n${JSON.stringify(b, null, 2).replace(/^/gm, '  ')}\n  </script>`)
    .join('\n')
}

function navLinks(currentSlug, clase, sangria) {
  const pad = ' '.repeat(sangria)
  return PAGES.filter((p) => p.nav)
    .map((p) => {
      const current = p.slug === currentSlug ? ' aria-current="page"' : ''
      return `${pad}<a class="${clase}" href="${pathOf(p.slug)}"${current}>${p.nav}</a>`
    })
    .join('\n')
}

// Versión corta del contenido de css/ y js/: va como ?v= en las URLs para que
// una publicación nueva no conviva con un CSS viejo en la caché del navegador
// (GitHub Pages cachea 10 minutos).
function versionDe(...archivos) {
  const h = createHash('sha1')
  for (const a of archivos) if (existsSync(join(ROOT, a))) h.update(readFileSync(join(ROOT, a)))
  return h.digest('hex').slice(0, 8)
}

function buildPage(site, page, sections, partials) {
  const vars = { lang: site.lang, host: site.host, locale: site.locale, robots: site.robots, cssv: versionDe('css/styles.css'), jsv: versionDe('js/main.js') }
  const layout = page.layout || 'default'

  const title = page.title
  const description = page.description

  const body = page.sections
    .map((name) => {
      if (!(name in sections)) throw new Error(`falta src/sections/${name}.html (página /${page.slug})`)
      return sections[name]
    })
    .join('\n')

  const head = fill(partials.head, {
    ...vars,
    title: esc(title),
    description: esc(description),
    canonical: urlOf(site, page.slug),
    jsonld: jsonLd(site, page),
  })

  const nav = fill(partials.nav, {
    navLinks: navLinks(page.slug, CLASE_ENLACE, 12),
    mobileLinks: navLinks(page.slug, CLASE_ENLACE_MOVIL, 16),
    ctaCurrent: page.slug === 'contacto' ? ' aria-current="page"' : '',
  })

  // El pie también lista las páginas (enlaces rápidos), con el mismo token.
  const footer = fill(partials.footer, { navLinks: navLinks(page.slug, CLASE_ENLACE, 12) })

  const partes =
    layout === 'slim'
      ? [head, partials.slimOpen, '      <main class="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">', body, '      </main>', partials.slimClose]
      : [head, nav, '', '  <main>', body, '  </main>', '', footer]

  const html = partes.join('\n')

  return { title, description, canonical: urlOf(site, page.slug), html, page }
}

function contarPalabras(html) {
  const t = html
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<head\b[\s\S]*?<\/head>/g, ' ')
    .replace(/<header\b[\s\S]*?<\/header>/g, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  return t.split(/\s+/).filter(Boolean).length
}

function validate(site, built) {
  const problems = []
  const seen = { title: new Map(), description: new Map(), canonical: new Map() }

  for (const [slug, page] of built) {
    const ruta = pathOf(slug)

    if (page.title.length > LIMITES.title) {
      problems.push(`${ruta}: título de ${page.title.length} caracteres (máximo ${LIMITES.title})`)
    }
    if (page.description.length > LIMITES.description) {
      problems.push(`${ruta}: descripción de ${page.description.length} caracteres (máximo ${LIMITES.description})`)
    }
    for (const campo of ['title', 'description', 'canonical']) {
      const previo = seen[campo].get(page[campo])
      if (previo !== undefined) problems.push(`${ruta}: ${campo} repetido, ya lo usa ${pathOf(previo)}`)
      else seen[campo].set(page[campo], slug)
    }

    const h1 = countOf(page.html, '<h1')
    if (h1 !== 1) problems.push(`${ruta}: ${h1} etiquetas <h1> (tiene que haber exactamente 1)`)

    const sinResolver = page.html.match(/\{\{\w+\}\}/g)
    if (sinResolver) problems.push(`${ruta}: tokens sin resolver ${[...new Set(sinResolver)].join(', ')}`)

    const relativos = page.html.match(/(?:src|href)="(?:img|css|js|site\.webmanifest)/g)
    if (relativos) problems.push(`${ruta}: ${relativos.length} rutas de asset relativas`)

    const palabras = contarPalabras(page.html)
    const minimo = page.page.minPalabras ?? MINIMO_PALABRAS_DEFAULT
    if (palabras < minimo) {
      problems.push(`${ruta}: ${palabras} palabras de contenido (mínimo ${minimo})`)
    }
  }
  return problems
}

function robotsTxt(site) {
  if (!site.sitemap) return '# No indexar.\nUser-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\nSitemap: ${site.host}/sitemap.xml\n`
}

function sitemapXml(site) {
  const urls = PAGES.map(
    (p) => `  <url>\n    <loc>${urlOf(site, p.slug)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${p.slug === '' ? '1.0' : '0.8'}</priority>\n  </url>`
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function build({ siteId, out }) {
  const site = SITES[siteId]
  if (!site) throw new Error(`sitio desconocido: ${siteId}`)

  const partials = {
    head: read('partials', 'head.html'),
    nav: read('partials', 'nav.html'),
    footer: read('partials', 'footer.html'),
    slimOpen: read('partials', 'slim-open.html'),
    slimClose: read('partials', 'slim-close.html'),
  }

  const sections = {}
  for (const f of readdirSync(join(SRC, 'sections'))) {
    if (f.endsWith('.html')) sections[f.slice(0, -5)] = read('sections', f)
  }

  const built = PAGES.map((p) => [p.slug, buildPage(site, p, sections, partials)])

  const problems = validate(site, built)
  if (problems.length) {
    console.error(`\nEl build no pasa las validaciones:\n`)
    console.error(problems.map((p) => `  ${p}`).join('\n'))
    console.error('\nNada se escribió en disco.\n')
    process.exit(1)
  }

  const dir = join(ROOT, out)
  if (out !== '.') {
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    for (const asset of ['css', 'js', 'img', 'fonts']) {
      if (existsSync(join(ROOT, asset))) cpSync(join(ROOT, asset), join(dir, asset), { recursive: true })
    }
    writeFileSync(join(dir, 'CNAME'), `${site.cname}\n`)
    writeFileSync(join(dir, '.nojekyll'), '')
  }

  for (const [slug, page] of built) {
    const archivo = join(dir, slug ? `${slug}.html` : 'index.html')
    mkdirSync(dirname(archivo), { recursive: true })
    writeFileSync(archivo, page.html)
  }
  writeFileSync(join(dir, 'robots.txt'), robotsTxt(site))
  if (site.sitemap) writeFileSync(join(dir, 'sitemap.xml'), sitemapXml(site))

  return { site, count: built.length, dir: out }
}

const DEFAULT_OUT = { cl: 'dist' }

// Comparación de rutas nativas en vez de comparar contra "file://" a mano:
// en Windows fileURLToPath resuelve barras y unidad correctamente, la
// comparación de strings cruda fallaba en silencio en este entorno.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=')
      return [k, v ?? true]
    })
  )
  const siteId = args.site || 'cl'
  const out = args.out || DEFAULT_OUT[siteId]
  const r = build({ siteId, out })
  console.log(`${siteId}: ${r.count} páginas en ${r.dir}/ (${r.site.cname})`)
}
