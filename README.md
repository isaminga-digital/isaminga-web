# Isaminga Digital — sitio institucional

Sitio de un solo dominio: **isamingadigital.cl**, servido desde este repo vía GitHub Pages.
Es la variante de un solo dominio del flujo documentado en
`C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md` (basado en `INCBA/incba-web`).

**Estado (09-09-2026): estructura y presentación siguen el modelo de landing del template
abierto `kizivat/saas-kit` (shadcn-svelte), reconstruido en HTML y CSS puro, sin
dependencias.** Hero en dos columnas, nube de sectores, servicios en zigzag, testimonios en
mosaico, método en tarjetas, bloque de cierre, contacto en tarjeta con formulario, header
sticky con menú móvil y footer en grilla. El texto de prosa es placeholder (Lorem Ipsum)
donde falta el contenido real; los datos verificados (servicios, oficina, contacto, bajada)
son los del Diagnóstico.

**Preview público mientras no hay DNS:** https://isaminga-digital.github.io/ (repo espejo
`isaminga-digital.github.io`, sin CNAME; ver "Actualizar el preview" abajo).

## Cómo se edita

**Los `.html` de la raíz son generados. No los edites.** Se editan las fuentes de `src/`
y se regenera:

```bash
node tools/build.mjs --out=.    # -> los .html de la raíz + sitemap + robots
```

| Qué querés cambiar | Dónde |
|---|---|
| Texto de una sección | `src/sections/<nombre>.html` |
| Qué secciones componen cada página, título y descripción | `PAGES` en `src/site.config.mjs` |
| Menú, pie o etiquetas del `<head>` | `src/partials/` (`{{navLinks}}` se resuelve solo, también en el pie) |
| Colores y tipografía | tokens de `:root` al principio de `css/styles.css` |
| Íconos | SVG inline de Lucide (licencia ISC), pegados en cada sección |
| Menú móvil y formulario de contacto | `js/main.js` |

Secciones del inicio, en orden: `hero`, `sectores`, `servicios-resumen`, `testimonios`,
`metodo-resumen`, `cta`. Las páginas internas usan su propia sección más `cta`. Cada página
lleva exactamente un `<h1>`; el resto de las secciones usa `<h2>`.

Para verlo local, con las URLs resueltas como las resuelve GitHub Pages:

```bash
node tools/build.mjs           # -> dist/
node tools/serve.mjs dist      # -> http://localhost:8080
node tools/verify.mjs --port=8099   # con serve.mjs corriendo en ese puerto
```

### Agregar una página

1. Creá `src/sections/mi-pagina.html` con el contenido (patrones disponibles en
   `css/styles.css`: `.section-header`, `.features`, `.cards`, `.plans`, `.cta-box`).
2. Agregá la entrada en `PAGES` de `src/site.config.mjs`.
3. Regenerá. El menú, el pie y el sitemap salen solos.

### Si el build falla

El generador valida antes de escribir y no deja nada a medias: título/descripción
demasiado largos, metadatos repetidos entre páginas, más o menos de un `<h1>` por página
(cuenta el texto literal, también dentro de comentarios), tokens sin resolver, rutas de
asset relativas, o contenido por debajo del piso de palabras (bajo mientras el contenido es
borrador, ver `MINIMO_PALABRAS_DEFAULT` en `site.config.mjs`).

## Publicación

Push a `main` publica directo en isamingadigital.cl (GitHub Pages sirve la raíz de esta
rama). El workflow `verificar.yml` corre en cada push y en cada PR: regenera el sitio y
compara contra lo comiteado, para atrapar ediciones manuales de los `.html` generados.

### Actualizar el preview

La URL genérica de este repo no sirve para previsualizar (con `CNAME` redirige al dominio, y
sin él las rutas absolutas se rompen bajo el subpath). El preview vive en el repo espejo
`isaminga-digital.github.io`, que se sirve en la raíz:

```bash
node tools/build.mjs --out=dist-preview
# borrar dist-preview/CNAME, copiar el contenido a un checkout de
# isaminga-digital/isaminga-digital.github.io, commit y push
```

## Pendientes conocidos

- **DNS**: falta apuntar isamingadigital.cl a GitHub Pages (registros A a
  185.199.108/109/110/111.153). Depende del acceso a la cuenta de Cloudflare de Marcelo.
  **El DNS tiene que quedar "DNS only" (nube gris), nunca proxiado**, o GitHub deja de
  renovar el certificado HTTPS.
- **Contenido real**: todo lo marcado `LOREM IPSUM` en `src/sections/` espera el texto de
  Marcelo (trayectoria en "Quiénes somos", las 6 fases del método, descripciones de los
  servicios, mensaje principal del hero).
- **Testimonios y sectores**: placeholders. Los nombres son genéricos a propósito; no hay
  testimonios ni logos de clientes autorizados todavía.
- **Imágenes de apoyo**: las cajas grises "Imagen" junto a cada servicio son el lugar para
  fotos o capturas reales, igual que en el template.
- **Formulario de contacto**: el sitio es estático y no tiene servicio de envío. Por ahora el
  botón abre el programa de correo con el mensaje armado. Definir un servicio de formularios
  si se quiere recibir los mensajes sin depender del correo del visitante.
- **Favicon**: derivado del isotipo del logo actual; pierde legibilidad a 32 px. Reemplazar
  cuando exista una versión del logo apta para tamaños chicos.
- **Paleta**: `css/styles.css` usa el Enfoque 1 como supuesto de trabajo. Si Marcelo elige
  el Enfoque 2, cambiar solo los tokens de `:root`.
- **Tipografía de títulos**: Inter en todo el sitio. Roboto sigue en evaluación solo para
  títulos y subtítulos; si se adopta, cambiar `--f-titulo` y la línea de Google Fonts en
  `src/partials/head.html`.
