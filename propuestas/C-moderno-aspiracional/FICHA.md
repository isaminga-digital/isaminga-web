# Propuesta C: "Moderno y aspiracional"

## Idea

Un sitio con energía de firma tecnológica y un relato propio: la minga. El isotipo muestra a un grupo de personas
trasladando una casa hacia un paisaje de engranajes y circuitos; la propuesta toma esa imagen como concepto
("Movemos tu empresa a lo digital") y la sostiene con los cinco servicios y un método de cuatro pasos, sin cifras.
Le habla mejor a dueños y gerentes de empresas en crecimiento, más jóvenes o con ambición de modernizarse, que
buscan una consultora con aire actual sin perder seriedad.

## Voz

- Tuteo. Frases cortas, verbos de acción en imperativo como titulares de servicio ("Traza la ruta.", "Ordena.",
  "Invierte mejor.", "Construye.", "Conecta.").
- Promesa: "Movemos tu empresa a lo digital." El titular verificado del Diagnóstico va como etiqueta del hero.
- Cada afirmación se apoya en un servicio o en el método. Sin superlativos.

## Paleta (propia, derivada del logo)

El logo tiene un degradado de azul profundo a naranja y rojo (el atardecer del isotipo) y un wordmark en azul y
rojo anaranjado. La paleta toma esos puntos y agrega un azul noche para las secciones oscuras.

| Nombre | Valor | Origen | Uso | Contraste |
|---|---|---|---|---|
| Noche | #0A1A33 | Azul más profundo del isotipo | Secciones oscuras, botón principal | 17,4:1 con blanco |
| Azul | #0448A3 | "isaminga" del wordmark (medido en el PNG: #0048A0) | Enlaces, verbos, degradado | 8,5:1 sobre blanco |
| Cielo | #0295D6 | Nube y engranaje del isotipo | Degradado, formas | 5,2:1 sobre noche |
| Cielo claro | #5CC3F0 | Derivado de cielo | Texto de acento y etiquetas sobre noche | 8,7:1 sobre noche |
| Ámbar | #FE8119 | Atardecer del isotipo | Antetítulos sobre noche, formas | 6,9:1 sobre noche; nunca texto sobre blanco |
| Brasa | #E8321F | "digital" del wordmark (medido: #E83020) | Texto grande, formas, final del degradado | 4,3:1 sobre blanco: solo texto grande |
| Brasa profunda | #C8281A | Derivado de brasa | Antetítulos y verbos chicos sobre claro | 5,6:1 sobre blanco |
| Niebla | #F4F7FB | | Fondos claros alternos, pie | |
| Tinta | #14213D | | Texto principal | 14,9:1 sobre niebla |
| Acero | #4A5670 | | Texto secundario sobre claro | 7,4:1 sobre blanco |
| Bruma | #B8C4D6 | | Texto secundario sobre noche | 9,9:1 sobre noche |

- Degradado de marca: azul, cielo, ámbar, brasa (115°). Solo en formas y bordes.
- Degradado de texto: azul, violeta #6A3FA0, brasa. Solo en titulares grandes (cumple 3:1 para texto grande).
- **Wordmark sobre oscuro:** el encabezado es una cápsula blanca flotante y el pie es claro (niebla), así que el
  logo horizontal siempre queda sobre fondo claro. En las secciones oscuras solo aparece el isotipo, dentro de un
  hexágono blanco.

## Tipografía

- Texto: Inter 3.19 desde `/fonts`.
- Títulos: **Bricolage Grotesque** (Atelier Triay, licencia OFL 1.1), versión variable de Fontsource 5.3.0,
  autoalojada en `C-moderno-aspiracional/fonts/` (latin y latin-ext, 60 KB en total) con su licencia. Pesos 600 a 750,
  interletrado negativo. **Decisión pendiente de Camilo.** Es expresiva sin ser de juguete.

## Layout

- Encabezado flotante en cápsula, con sombra que crece al hacer scroll.
- Hero asimétrico: titular de tres líneas a la izquierda y un panal de hexágonos (forma del isotipo) con el isotipo al
  centro y tres servicios en chips flotantes.
- Cinta oscura con los cinco servicios en desplazamiento continuo (se detiene al pasar el puntero). Nació inclinada 1,2 grados; Camilo pidió dejarla recta (24-09-2026).
- "La minga digital" en sección oscura con halos de luz azul y ámbar.
- Servicios en mosaico asimétrico: una tesela grande oscura y cuatro claras, cada una con su verbo.
- Método como pista de cuatro pasos con barra de progreso en degradado.
- Casos de uso por sector: carrusel con scroll-snap en móvil y grilla de 3 columnas en escritorio.
- Cierre con degradado cónico difuminado que gira lento detrás de un velo oscuro.

## Movimiento

- Entrada escalonada del hero; hexágonos que aparecen girando y luego flotan; chips que flotan a ritmos distintos.
- Cinta de servicios en desplazamiento continuo.
- Aparición al hacer scroll con desfase entre hermanos (`IntersectionObserver`, clase `visible`).
- Teselas con luz que sigue al puntero (variables `--x` y `--y` desde `app.js`), elevación y flecha que se desplaza.
- Números de paso en hexágono que giran y se llenan del degradado al pasar el puntero; números de servicio en contorno
  que se rellenan en brasa.
- Subrayado en degradado que crece en el menú; botón oscuro que se llena de degradado profundo.
- Con `prefers-reduced-motion` se anula todo y la cinta queda estática y centrada.

## Secciones y por qué

| Página | Secciones |
|---|---|
| Inicio | Hero con panal, cinta de servicios, la minga digital, servicios en mosaico, método (ancla `#metodo`), casos de uso por sector, cierre |
| Servicios | Cabecera, cinco filas con verbo, descripción, casos de uso y "Se combina con", cierre |
| Quiénes somos | "Somos la minga digital del sur.", presentación del Diagnóstico, tarjeta de Marcelo, tres ideas, cierre |
| Contacto | Panel oscuro con isotipo y datos, formulario mailto |

**Método:** sin página propia; sección del inicio con cuatro pasos (Entender, Diseñar, Construir, Evolucionar),
marcados como pendientes de Marcelo.

## Decisión sobre placeholders

**Se reemplazan por contenido respaldable.** En lugar de casos de clientes, "casos de uso" por sector y por servicio:
situaciones tipo, declaradas como tales ("Son ejemplos tipo, sin datos de clientes"), que muestran qué servicio
resuelve cada problema. Sin testimonios, logos ni cifras. Motivo: esta propuesta vive de la energía y un bloque
"[Pendiente]" la corta; los casos de uso cumplen la función de "prueba" sin afirmar nada que no se pueda sostener.

## Paso a `tailwind.config.cjs` (Fase 2)

```js
colors: {
  noche: '#0A1A33', azul: '#0448A3', cielo: { DEFAULT: '#0295D6', claro: '#5CC3F0' }, ambar: '#FE8119',
  brasa: { DEFAULT: '#E8321F', profunda: '#C8281A' }, niebla: '#F4F7FB', tinta: '#14213D', acero: '#4A5670', bruma: '#B8C4D6',
},
fontFamily: { sans: ['Inter', ...], display: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'] },
backgroundImage: { marca: 'linear-gradient(115deg, #0448A3 0%, #0295D6 38%, #FE8119 72%, #E8321F 100%)' },
```

- Reglas propias en `src/css/tailwind.css`: `clip-path` hexagonal, keyframes (`desplazar`, `flotar`, `girar`),
  texto en degradado, contorno de números (`-webkit-text-stroke`).
- Clases alternadas por JavaScript: `visible`, `con-sombra`. Variables `--x`, `--y`, `--i` por `style`.

## Limitaciones y notas

- **El relato de la minga está confirmado** (23-09-2026): "minga" en el nombre viene de la tradición chilota de mover
  casas en conjunto. El prefijo del nombre tiene un origen familiar que el sitio no menciona; incluirlo o no lo decide
  Marcelo.
- Es la propuesta más pesada en animación; en equipos modestos conviene revisar el desenfoque del cierre.
- Se descartó una marca tipográfica gigante en el pie: aunque usaba otra fuente, se leía como un segundo wordmark.
