/**
 * Fuente única de la configuración del sitio de Isaminga Digital.
 *
 * Variante de un solo dominio del flujo documentado en
 * C:\Proyectos\INCBA\docs\Flujo-Sitios-Web-GitHub-Pages.md (basado en el
 * generador de incba-web). Isaminga tiene un solo mercado y un solo dominio,
 * así que SITES tiene una única entrada y no hay hreflang ni variantes CL/dev.
 *
 * ESTADO (03-09-2026): andamiaje técnico. El contenido real de PAGES espera
 * las definiciones del Manual de marca (paleta y tono ya definidos, faltan
 * los textos finales de cada sección). No inventar copy de marketing acá:
 * cada sección placeholder está marcada como borrador.
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
 * Páginas del sitio. Alcance inicial según el documento base del proyecto
 * (Desarrollo-Marca-Isaminga.md, sección 5): quiénes somos, servicios, método,
 * casos o sectores atendidos, contacto. Los títulos y descripciones de acá son
 * BORRADOR, se revisan y cierran junto con el Manual de marca.
 */
export const PAGES = [
  {
    slug: '',
    title: 'Isaminga Digital — Consultoría de transformación digital',
    description:
      'Consultora de transformación digital en el sur de Chile: análisis de procesos y análisis presupuestario en tecnología.',
    nav: null,
    breadcrumb: null,
    sections: ['inicio'],
  },
  {
    slug: 'quienes-somos',
    title: 'Quiénes somos | Isaminga Digital',
    description: 'Isaminga Digital: análisis de procesos y análisis presupuestario en tecnología, con una alianza de ingeniería para la implementación.',
    nav: 'Quiénes somos',
    breadcrumb: 'Quiénes somos',
    sections: ['quienes-somos'],
  },
  {
    slug: 'servicios',
    title: 'Servicios | Isaminga Digital',
    description: 'Diagnóstico y transformación digital, análisis de procesos y análisis presupuestario en TI.',
    nav: 'Servicios',
    breadcrumb: 'Servicios',
    sections: ['servicios'],
  },
  {
    slug: 'metodo',
    title: 'Método | Isaminga Digital',
    description: 'Cómo trabaja Isaminga Digital: las fases del proceso, de diagnóstico a implementación.',
    nav: 'Método',
    breadcrumb: 'Método',
    sections: ['metodo'],
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
