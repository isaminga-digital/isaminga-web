# Isaminga Digital — sitio institucional

Sitio de un solo dominio: **isamingadigital.cl**, servido desde este repo vía GitHub Pages.
Es la variante de un solo dominio del flujo documentado en
`C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md` (basado en `INCBA/incba-web`).

**Estado (03-09-2026): andamiaje técnico.** El contenido de `src/sections/` es borrador,
marcado con `[Pendiente]`, mientras se cierran las definiciones del Manual de marca
(paleta y tipografía de la web todavía en revisión). No editar como si fuera contenido final.

## Cómo se edita

**Los `.html` de la raíz son generados. No los edites.** Se editan las fuentes de `src/`
y se regenera:

```bash
node tools/build.mjs --out=.    # -> los .html de la raíz + sitemap + robots
```

| Qué querés cambiar | Dónde |
|---|---|
| Texto de una sección | `src/sections/<nombre>.html` |
| Título, descripción o ruta de una página | `src/site.config.mjs` |
| Menú, pie o etiquetas del `<head>` | `src/partials/` |
| Colores, tipografía | `css/styles.css` (tokens al principio del archivo) |

Para verlo local, con las URLs resueltas como las resuelve GitHub Pages:

```bash
node tools/build.mjs           # -> dist/
node tools/serve.mjs dist      # -> http://localhost:8080
node tools/verify.mjs --port=8099   # con serve.mjs corriendo en ese puerto
```

### Agregar una página

1. Creá `src/sections/mi-pagina.html` con el contenido.
2. Agregá la entrada en `PAGES` de `src/site.config.mjs`.
3. Regenerá. El menú y el sitemap salen solos.

### Si el build falla

El generador valida antes de escribir y no deja nada a medias: título/descripción
demasiado largos, metadatos repetidos entre páginas, falta de `<h1>`, rutas de asset
relativas, o contenido por debajo del piso de palabras (bajo mientras el contenido es
borrador, ver `MINIMO_PALABRAS_DEFAULT` en `site.config.mjs`).

## Publicación

Push a `main` publica directo en isamingadigital.cl (GitHub Pages sirve la raíz de esta
rama). El workflow `verificar.yml` corre en cada push y en cada PR: regenera el sitio y
compara contra lo comiteado, para atrapar ediciones manuales de los `.html` generados.

## Pendientes conocidos

- **DNS**: falta apuntar isamingadigital.cl a GitHub Pages (registros A a
  185.199.108/109/110/111.153). Depende del acceso a la cuenta de Cloudflare de Marcelo.
  Ver `Flujo-Sitios-Web-GitHub-Pages.md` sección 5, y **el DNS tiene que quedar "DNS only"
  (nube gris), nunca proxiado**, o GitHub deja de renovar el certificado HTTPS.
- **Favicon**: el recorte provisorio de `img/favicon.png` sale del logo actual (solo PNG,
  sin vectorial) y pierde legibilidad a 32px, como ya se documentó en el Diagnóstico.
  Reemplazar cuando exista una versión del logo apta para tamaños chicos.
- **Paleta**: `css/styles.css` usa el Enfoque 1 (`Paleta-Isaminga.md`) como placeholder.
  Actualizar los tokens de `:root` cuando Marcelo elija entre los 2 enfoques.
- **Tipografía de títulos**: Inter en todo el sitio por ahora. Roboto está en evaluación
  solo para títulos y subtítulos (sin confirmar); si se adopta, cambiar `--f-titulo` en
  `css/styles.css` y la línea de Google Fonts en `src/partials/head.html`.
- **Teléfono de contacto**: no está en `src/sections/contacto.html` a propósito. Pregunta
  abierta a Marcelo (ver `Desarrollo-Marca-Isaminga.md`).
- **Contenido real**: todas las secciones con `[Pendiente]` esperan las definiciones del
  Manual de marca y el copy final.
