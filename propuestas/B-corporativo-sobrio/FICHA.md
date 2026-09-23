# Propuesta B: "Corporativo sobrio"

## Idea

Un sitio que se lee como un informe bien diagramado. El método es el argumento: cuatro etapas con un resultado
para la gerencia en cada una. Los servicios se presentan como líneas de práctica, con la pregunta que cada una
responde. Le habla mejor a gerentes generales, gerentes de administración y finanzas y directorios de empresas
medianas que necesitan justificar una decisión de inversión ante otros.

## Voz

- Trato de usted, formal, sin adjetivos de venta. Primera persona plural ("acompañamos", "evaluamos").
- El titular es el texto verificado del Diagnóstico: "Transformación digital con método."
- Cada bloque responde una pregunta de gerencia ("¿Nuestra inversión en tecnología está bien asignada?").
- Secciones numeradas con "§", como un documento.

## Paleta (Enfoque 2)

| Rol | Valor | Uso | Contraste |
|---|---|---|---|
| Marino | #1E3A5F | Títulos, barra superior, banda de contacto, filete de rótulos | 11,5:1 sobre blanco |
| Azul | #2563EB | Enlaces y botón principal | 5,2:1 sobre blanco; 4,7:1 sobre #F1F5F9 |
| Ámbar | #F59E0B | Filetes, viñetas, subrayado del titular, marca de pendiente | 2,2:1: nunca como texto |
| Azul claro | #DBEAFE | Hover del botón claro | |
| Niebla | #F1F5F9 | Fondo de secciones alternas | |
| Pizarra | #64748B | Texto secundario solo sobre blanco | 4,8:1 sobre blanco; 4,3:1 sobre niebla (no se usa ahí) |
| Grafito | #334155 | Texto secundario sobre niebla, rótulos | 9,5:1 sobre niebla |
| Tinta | #0F172A | Texto principal y pie | 17,9:1 sobre blanco |
| Línea | #CBD5E1 | Bordes finos (derivado de la escala pizarra, fuera de la paleta original) | |

**Convivencia con el logo:** hay fricción. El azul del wordmark (cercano a #0448A3) es más profundo y menos saturado
que #2563EB, y el "digital" rojo anaranjado del logo compite con el ámbar #F59E0B: son dos cálidos distintos a pocos
centímetros en el encabezado. Para suavizarlo, el ámbar se usa solo en filetes finos y nunca junto al logo, y el azul
#2563EB queda para enlaces y botones, lejos del wordmark. Si Marcelo elige este enfoque, conviene evaluar un ámbar más
cercano al naranja del logo.

**Logo sobre fondo oscuro:** el pie es oscuro (#0F172A). El logo horizontal va sobre una placa blanca rectangular,
coherente con el lenguaje de bordes rectos de esta propuesta. La barra superior marina lleva solo texto.

## Tipografía

- Texto: Inter 3.19 desde `/fonts`.
- Títulos: **Source Serif 4** (Adobe, licencia OFL 1.1), versión variable de Fontsource 5.3.0, autoalojada en
  `B-corporativo-sobrio/fonts/` (latin y latin-ext, 93 KB en total) con su licencia. Peso 600.
  **Decisión pendiente de Camilo.** Una serif da el tono institucional que Lexend y Roboto no dan.

## Layout

- Retícula de 12 columnas (`.reticula` con `.c-4`, `.c-8`, etc.). Títulos de sección en 4 columnas y contenido en 8.
- Barra superior institucional con oficina y correo. Encabezado blanco con subrayado ámbar en la página actual.
- Portada: titular a 8 columnas, síntesis de líneas de práctica a 4, y la franja de las cuatro etapas del método.
- Líneas de práctica en tabla (se convierte en fichas bajo 760 px). Método en filas de tres columnas: etapa,
  objetivo, qué recibe la empresa. Sectores en grilla de celdas con borde fino.
- Movimiento contenido: entrada por desvanecido, subrayado ámbar que se dibuja bajo "con método", filetes de la
  franja que se extienden en secuencia, filas de tabla que se marcan al pasar el puntero, índice lateral en Servicios.
  Se anula con `prefers-reduced-motion`.

## Secciones y por qué

| Página | Secciones |
|---|---|
| Inicio | Portada con síntesis y franja del método, § 1 líneas de práctica (tabla), § 2 método (ancla `#metodo`), § 3 sectores, referencias [Pendiente], § 4 banda de contacto |
| Líneas de práctica | Índice lateral fijo y cinco fichas: objetivo, alcance habitual, pregunta que responde, para quién |
| La firma | Presentación del Diagnóstico con ficha de datos, principios de trabajo, dirección [Pendiente] |
| Contacto | "Solicitud de reunión" con cargo y línea de interés (el correo se arma con esos campos) y ficha de datos |

**Método:** no hay página propia. El método ocupa el centro del inicio (`index.html#metodo`) y la franja de la portada
lo resume. Las cuatro etapas (Diagnóstico, Plan, Ejecución, Seguimiento) salen del encargo de esta fase y están
marcadas como pendientes de Marcelo en `CONTENIDO-PARA-VALIDAR.md`.

## Decisión sobre placeholders

**Placeholder visible y marcado** en dos lugares: "Referencias" en el inicio y "Dirección" en La firma. Una gerencia
espera ver referencias y a la persona que dirige la firma; si esas secciones faltan, se nota más que un espacio
declarado como pendiente. El bloque rayado con la etiqueta "[Pendiente: ...]" deja claro que es provisional y reserva
el lugar en la diagramación. Antes de publicar, o se completan o se retiran.

## Paso a `tailwind.config.cjs` (Fase 2)

```js
colors: {
  marino: '#1E3A5F', azul: '#2563EB', ambar: '#F59E0B', 'azul-claro': '#DBEAFE',
  niebla: '#F1F5F9', pizarra: '#64748B', grafito: '#334155', tinta: '#0F172A', linea: '#CBD5E1',
},
fontFamily: { sans: ['Inter', ...], display: ['"Source Serif 4"', 'Georgia', 'serif'] },
borderRadius: { DEFAULT: '2px' },
```

- `@font-face` de Source Serif 4 en `src/css/tailwind.css` y los woff2 en `/fonts`.
- Retícula: `grid grid-cols-12 gap-x-6` con `lg:col-span-4`, `lg:col-span-8`, `lg:col-start-9`.
- Tabla responsiva: requiere una regla propia (los `td[data-rotulo]::before` en móvil).
- Clases alternadas por JavaScript: `visible` (aparición) y `con-sombra` (encabezado). Deben aparecer literales en
  `js/main.js`.

## Limitaciones y notas

- Esta propuesta es la más larga de leer; funciona para quien compara consultoras, menos para quien llega desde
  un anuncio o una recomendación rápida.
- Los "Qué recibe la empresa" del método y los "Alcance habitual" de cada línea describen entregables: todos quedan
  pendientes de validación con Marcelo.
