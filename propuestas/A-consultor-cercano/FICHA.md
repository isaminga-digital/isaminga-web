# Propuesta A: "Consultor senior cercano"

## Idea

Un sitio que se lee como la primera reunión con Marcelo. El visitante encuentra preguntas antes que
respuestas: qué le preocupa, cómo trabaja su empresa, qué quiere resolver. La tecnología aparece al final
de cada bloque, como consecuencia de haber escuchado. Le habla mejor al dueño o gerente de una pyme que
nunca contrató una consultoría y teme que le vendan software que no necesita.

## Voz

- Tuteo, frases cortas, sin jerga. Primera persona plural ("conversamos", "te acompañamos").
- Promesa central: "Primero entendemos tu negocio. Después, la tecnología."
- Los problemas se escriben entre comillas, con las palabras del cliente ("Todo depende de dos personas...").
- El titular verificado del Diagnóstico ("Transformación digital con método") queda como antetítulo del hero.

## Paleta (Enfoque 1)

| Rol | Valor | Uso | Contraste |
|---|---|---|---|
| Azul corporativo | #0448A3 | Titulares, botón principal, enlaces, bloque de cierre | 8,5:1 sobre blanco |
| Azul cielo | #0295D6 | Solo trazos y hover de bordes | 3,3:1: no se usa para texto |
| Naranja | #FE8119 | Subrayado del hero, filetes de antetítulos, números de pasos, botón de acento | Con texto #3A3A3C: 4,5:1 |
| Celeste | #B8E2F8 | Formas de fondo, sombras de tarjetas, bordes | Como texto sobre azul: 6,2:1 |
| Celeste hielo | #F1FAFE | Fondo de secciones alternas y tarjetas | |
| Gris | #9D9EA0 | Solo bordes y separadores | 2,7:1: no se usa para texto |
| Grafito | #3A3A3C | Texto principal | 11,4:1 sobre blanco |
| Grafito suave | #58595C | Texto secundario (derivado de #3A3A3C, fuera de la paleta original) | 7:1 sobre blanco |

El naranja nunca lleva texto blanco (2,5:1). En el botón de acento el texto va en grafito.

## Tipografía

- Texto: Inter 3.19 desde `/fonts` (decisión firme).
- Títulos: Lexend 1.007, ya autoalojada. Peso 500, interletrado negativo en el hero.
  **Decisión pendiente de Camilo** (Lexend se mantiene del diseño actual; Roboto sigue en evaluación).

## Layout

- Hero a dos columnas: titular grande a la izquierda y una "libreta" con las cuatro preguntas de la primera
  conversación a la derecha. En móvil la libreta pasa abajo.
- Sectores: seis tarjetas con ícono (los mismos íconos Lucide del sitio actual) y una situación típica.
- Servicios en tríada de burbujas: "Lo que nos cuentas" (celeste), "Cómo lo abordamos" (azul), "Qué te llevas"
  (borde naranja). La misma pieza se repite en `servicios.html` con más texto.
- Señales regionales: línea bajo los botones del hero, sección "Tu primera reunión" en la oficina de Temuco,
  bloque de cierre con dirección y pie con oficina. Visibles y secundarias.
- Header y pie claros: el logo horizontal siempre sobre blanco o celeste hielo. El isotipo aparece en la ficha de
  Marcelo en Quiénes somos. Sin conflicto con la limitación del wordmark.

## Movimiento

Agregado tras la primera revisión ("muy plana"). El movimiento acompaña la idea de conversación:

- Hero: entrada escalonada del texto, el subrayado naranja se dibuja, la libreta entra de lado y sus cuatro
  preguntas aparecen una tras otra, como si se anotaran. El punto naranja de la libreta late suave.
- Servicios: al llegar a cada servicio, las tres burbujas aparecen en orden (cliente, nosotros, resultado).
- Cómo trabajamos: una línea punteada une los tres pasos cuando la sección entra en pantalla.
- Secciones y tarjetas entran al hacer scroll (`IntersectionObserver` en `app.js`, clase `visible`).
- Microinteracciones: tarjetas de sector que se levantan con el ícono en naranja, flecha que avanza en los botones,
  subrayado naranja en los títulos de servicio, sombra del encabezado al hacer scroll, anillo del cierre que gira lento.
- Sin JavaScript todo se ve completo (las animaciones viven bajo `html.js`). Con `prefers-reduced-motion` se anulan
  animaciones y transiciones.
- Fase 2: las clases `aparece`, `visible` y `con-sombra` las pone JavaScript; deben quedar literales en `js/main.js`
  para que Tailwind no las descarte, o vivir como CSS propio en `src/css/tailwind.css`.

## Secciones y por qué

| Página | Secciones |
|---|---|
| Inicio | Hero con libreta, sectores ("¿Te reconoces...?"), servicios en tríada, cómo trabajamos (ancla `#como-trabajamos`), tu primera reunión, preguntas frecuentes, cierre |
| Servicios | Cabecera con índice de anclas, cinco servicios con "Te sirve si" y tríada, bloque "Te ayudamos a decidir y también a construir" |
| Quiénes somos | Presentación del Diagnóstico, ficha de contacto de Marcelo con isotipo, tres ideas que guían el trabajo, cierre |
| Contacto | Formulario mailto (como hoy) y tres canales: WhatsApp, oficina, correo |

**Método:** esta propuesta no tiene página de método. "Cómo trabajamos" es una sección del inicio con tres pasos
y el menú enlaza a `index.html#como-trabajamos`.

## Decisión sobre placeholders

**Se omiten** testimonios, logos de clientes, cifras y casos. En su lugar van contenidos que se pueden sostener sin
datos: los seis sectores del Diagnóstico, qué esperar de la primera reunión y preguntas frecuentes. Motivo: esta
propuesta vende cercanía y confianza, y un bloque "[Pendiente]" visible le quita justamente eso. Cuando Marcelo
tenga testimonios autorizados, el lugar natural es entre "Tu primera reunión" y las preguntas frecuentes.

## Paso a `tailwind.config.cjs` (Fase 2)

```js
colors: {
  azul: '#0448A3', cielo: '#0295D6', naranja: '#FE8119', celeste: '#B8E2F8',
  hielo: '#F1FAFE', gris: '#9D9EA0', grafito: { DEFAULT: '#3A3A3C', suave: '#58595C' },
},
fontFamily: { sans: ['Inter', ...], display: ['Lexend', ...] },
borderRadius: { '4xl': '2rem' },
```

- Escala: el hero usa `clamp(2.5rem, 6.2vw, 4.5rem)`; en Tailwind, `text-4xl sm:text-6xl lg:text-7xl` con
  `leading-[1.04] tracking-[-0.035em]`.
- Utilidades nuevas: `rounded-[1.25rem]` en burbujas con una esquina reducida (`rounded-bl-md` / `rounded-br-md`),
  `border-dashed` en la libreta, `details/summary` con marcador propio (regla en `src/css/tailwind.css`).
- Clases alternadas por JavaScript: ninguna. El menú móvil usa el atributo `hidden` con una regla CSS explícita
  (`.menu-movil[hidden] { display: none }`); en Fase 2 conviene mantener la clase `hidden` de Tailwind como hoy.

## Limitaciones y notas

- Sin fotografías: no existen fotos propias de la oficina ni de Marcelo. Una foto de Marcelo en Quiénes somos
  reforzaría mucho esta propuesta ([Pendiente: foto de Marcelo]).
- `servicios.html` no usa las maquetas `img/captura-*.png`: con esta voz se ven como producto SaaS. La imagen real de
  "Desarrollo de sistemas a medida" (pendiente de Camilo) podría entrar en ese servicio cuando exista.
- Páginas con `noindex`: son prototipos.
