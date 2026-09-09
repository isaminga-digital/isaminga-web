# Isaminga Digital: sitio institucional

Sitio de un solo dominio: **isamingadigital.cl**, servido desde este repo vía GitHub Pages.
Es la variante de un solo dominio del flujo documentado en
`C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md` (basado en `INCBA/incba-web`).

**Estado (09-09-2026): la estructura y la presentación reproducen el diseño de referencia
elegido por Camilo (saas-kit-demo.vercel.app), reconstruido en HTML estático con Tailwind CSS
compilado localmente y JavaScript propio, sin dependencias en el navegador.** Landing con
hero centrado y sectores, servicios en pestañas sobre fondo azul, "Cómo trabajamos" en
pestañas, bloque de cierre, testimonios en tres columnas, fases en tarjetas sobre fondo
oscuro, preguntas frecuentes y pie centrado. Contacto usa el panel angosto con imagen de
fondo (como la página de acceso del diseño de referencia). El texto de prosa es placeholder
(Lorem Ipsum) donde falta el contenido real; los datos verificados (servicios, oficina,
contacto, sectores) son los del Diagnóstico.

**Preview público mientras no hay DNS:** https://isaminga-digital.github.io/ (repo espejo
`isaminga-digital.github.io`, sin CNAME; ver "Actualizar el preview" abajo).

## Cómo se edita

**Los `.html` de la raíz y `css/styles.css` son generados. No los edites.** Se editan las
fuentes de `src/` y se regenera todo:

```bash
npm install          # una vez: instala Tailwind
npm run build        # -> css/styles.css + los .html de la raíz + sitemap + robots
```

| Qué querés cambiar | Dónde |
|---|---|
| Texto de una sección | `src/sections/<nombre>.html` |
| Qué secciones componen cada página, título, descripción y layout | `PAGES` en `src/site.config.mjs` |
| Header, pie, `<head>` o el layout angosto de Contacto | `src/partials/` (`{{navLinks}}` y `{{mobileLinks}}` se resuelven solos) |
| Colores, tipografía y escala | `tailwind.config.cjs` (tema) y `src/css/tailwind.css` (reglas propias) |
| Íconos | SVG inline (Lucide, licencia ISC) pegados en cada sección |
| Pestañas, menú móvil y formulario de contacto | `js/main.js` |
| Capturas y fondos decorativos | `img/captura-*.png`, `img/fondo-*.jpg` (placeholders propios, reemplazables) |

Secciones del inicio, en orden: `hero`, `servicios-principales`, `metodo-pasos`, `cta`,
`testimonios`, `metodo-fases-resumen`, `faq`. Las páginas internas usan su propia sección más
`cta`. Cada página lleva exactamente un `<h1>`; el resto usa `<h2>`.

Para verlo local, con las URLs resueltas como las resuelve GitHub Pages:

```bash
node tools/build.mjs           # -> dist/
node tools/serve.mjs dist      # -> http://localhost:8080
node tools/verify.mjs --port=8099   # con serve.mjs corriendo en ese puerto
npm run test:ui                     # pestañas, menú móvil y capturas con Chrome headless (serve.mjs en 8100)
```

### Agregar una página

1. Creá `src/sections/mi-pagina.html` con el contenido, reutilizando las clases de las
   secciones existentes (contenedor `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`, títulos
   `font-display`, botones `rounded-full`).
2. Agregá la entrada en `PAGES` de `src/site.config.mjs` (`layout: 'slim'` si va sin header
   ni pie, como Contacto).
3. `npm run build`. El menú, el pie, el CSS y el sitemap salen solos.

### Si el build falla

El generador valida antes de escribir y no deja nada a medias: título/descripción demasiado
largos, metadatos repetidos entre páginas, más o menos de un `<h1>` por página (cuenta el
texto literal, también dentro de comentarios), tokens sin resolver, rutas de asset relativas,
o contenido por debajo del piso de palabras (bajo mientras el contenido es borrador, ver
`MINIMO_PALABRAS_DEFAULT` en `site.config.mjs`).

## Publicación

Push a `main` publica directo en isamingadigital.cl (GitHub Pages sirve la raíz de esta
rama). El workflow `verificar.yml` corre en cada push y en cada PR: instala Tailwind, regenera
CSS y HTML y compara contra lo comiteado, para atrapar ediciones manuales de los archivos
generados o un CSS desactualizado.

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
  Marcelo (mensaje del hero, descripciones de los servicios, la cuarta pestaña de servicios,
  las etapas de "Cómo trabajamos", nombres y viñetas de las seis fases, preguntas frecuentes,
  trayectoria en "Quiénes somos").
- **Servicios**: los cinco definidos por Camilo (09-09-2026): Transformación digital, Análisis de
  procesos, Análisis presupuestario en TI, Desarrollo de sistemas a medida y Automatización.
  Descripciones en Lorem Ipsum. "Desarrollo de sistemas a medida" llevará una imagen de un
  software real (pendiente de Camilo); hoy muestra la maqueta `img/captura-sistemas.png`.
  Los dos últimos corresponden al portafolio de soluciones (ver documento base); el pie y las
  meta descripciones del inicio siguen con la bajada de consultoría hasta que se decida ampliarla.
- **Testimonios y sectores**: placeholders. Los nombres son genéricos a propósito; los
  "logos" de sectores son ícono + nombre hasta tener logos de clientes autorizados.
- **Capturas y fondos**: `img/captura-*.png` son maquetas propias de una aplicación genérica
  con el logo; `img/fondo-*.jpg` son degradados propios. Reemplazar por capturas reales o
  fotografías cuando existan.
- **Formulario de contacto**: el sitio es estático y no tiene servicio de envío. Por ahora el
  botón abre el programa de correo con el mensaje armado. Definir un servicio de formularios
  si se quiere recibir los mensajes sin depender del correo del visitante.
- **Favicon**: derivado del isotipo del logo actual; pierde legibilidad a 32 px. Reemplazar
  cuando exista una versión del logo apta para tamaños chicos.
- **Paleta**: el sitio usa la escala azul y gris pizarra del diseño de referencia. Para
  aplicar el Enfoque 1 o el Enfoque 2 del Manual se redefine `colors.blue` (y si hace falta
  `colors.slate`) en `tailwind.config.cjs` y se regenera.
- **Tipografía**: Lexend para títulos e Inter para texto, como el diseño de referencia, y
  en las mismas versiones que sirve ese diseño (Inter 3.19, Lexend 1.007), autoalojadas en
  `fonts/` (licencia OFL, sin peticiones a Google Fonts). Inter 4 se ve distinta (letras y
  espaciado), por eso se fijó la 3.19. Roboto sigue en evaluación; si se adopta, agregar su
  `@font-face` en `src/css/tailwind.css` y cambiar `fontFamily.display` en `tailwind.config.cjs`.
- **Caché tras publicar**: las URLs de `css/styles.css` y `js/main.js` llevan `?v=<hash del
  contenido>` (lo pone el generador), así una publicación nueva nunca se muestra con el CSS
  viejo que GitHub Pages deja cacheado 10 minutos.
