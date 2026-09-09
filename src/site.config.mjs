/**
 * Fuente única de la configuración del sitio de Isaminga Digital.
 *
 * Variante de un solo dominio del flujo documentado en
 * C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md (basado en el
 * generador de incba-web). Isaminga tiene un solo mercado y un solo dominio,
 * así que SITES tiene una única entrada y no hay hreflang ni variantes CL/dev.
 *
 * ESTADO (09-09-2026): estructura y presentación siguen el modelo de landing
 * de kizivat/saas-kit (hero en dos columnas, nube de logos, features en
 * zigzag, testimonios, tarjetas, bloque de cierre, contacto en tarjeta). El
 * inicio se compone de varias secciones; las páginas internas reutilizan los
 * mismos patrones. El texto de prosa es placeholder (Lorem Ipsum) donde falta
 * el contenido real; los datos verificados (servicios, oficina, contacto,
 * bajada) son los del Diagnóstico.
 */

export const HOST = 'https://isamingadigital.cl'

export const SITES = {
  cl: {
    id: 'cl',
    host: HOST,
    lang: 'es-CL',
    locale: 'es_CL',
    addressCountry: 'CL',
    robots: 'index, follow',
    sitemap: true,
    cname: 'isamingadigital.cl',
  },
}

/**
 * Piso de palabras de contenido por página. Bajo mientras el contenido es
 * borrador; subir a 300-450 (como hace INCBA) cuando el Manual esté cerrado
 * y las secciones tengan texto final.
 */
export const MINIMO_PALABRAS_DEFAULT = 8

/**
 * Topes de SEO: los puntos donde Google trunca título y descripción.
 */
export const LIMITES = { title: 60, description: 158 }

/**
 * Páginas del sitio. Alcance según el documento base del proyecto
 * (Desarrollo-Marca-Isaminga.md, sección 5). Cada página lista las secciones
 * de src/sections/ que la componen, en orden. Exactamente una sección por
 * página lleva el <h1>; las demás usan <h2>.
 */
export const PAGES = [
  {
    slug: '',
    title: 'Isaminga Digital — Consultoría de transformación digital',
    description:
      'Consultora de transformación digital en el sur de Chile: análisis de procesos y análisis presupuestario en tecnología.',
    nav: null,
    breadcrumb: null,
    sections: ['hero', 'sectores', 'servicios-resumen', 'testimonios', 'metodo-resumen', 'cta'],
  },
  {
    slug: 'quienes-somos',
    title: 'Quiénes somos | Isaminga Digital',
    description: 'Isaminga Digital: análisis de procesos y análisis presupuestario en tecnología, con una alianza de ingeniería para la implementación.',
    nav: 'Quiénes somos',
    breadcrumb: 'Quiénes somos',
    sections: ['quienes-somos', 'cta'],
  },
  {
    slug: 'servicios',
    title: 'Servicios | Isaminga Digital',
    description: 'Diagnóstico y transformación digital, análisis de procesos y análisis presupuestario en TI.',
    nav: 'Servicios',
    breadcrumb: 'Servicios',
    sections: ['servicios', 'cta'],
  },
  {
    slug: 'metodo',
    title: 'Método | Isaminga Digital',
    description: 'Cómo trabaja Isaminga Digital: las fases del proceso, de diagnóstico a implementación.',
    nav: 'Método',
    breadcrumb: 'Método',
    sections: ['metodo', 'cta'],
  },
  {
    slug: 'contacto',
    title: 'Contacto | Isaminga Digital',
    description: 'Hablemos de tu empresa. Oficina en Temuco, atención con cita previa.',
    nav: 'Contacto',
    breadcrumb: 'Contacto',
    sections: ['contacto'],
  },
]
