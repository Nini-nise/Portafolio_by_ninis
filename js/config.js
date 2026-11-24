/* ==========================================================
   BY NINIS · CONFIGURACIÓN
   ----------------------------------------------------------
   1) Agrega aquí tus enlaces de contacto (entre las comillas).
      - instagram : "https://instagram.com/tuusuario"  (o solo "tuusuario")
      - whatsapp  : "573001234567"  (código de país + número, solo dígitos)
      - email     : "hola@tudominio.com"
      - tiktok    : "https://tiktok.com/@tuusuario"  (o solo "tuusuario")
      - linkedin  : "https://linkedin.com/in/tuusuario"
      - behance   : "https://behance.net/tuusuario"
   Si dejas un campo vacío, su botón se muestra deshabilitado.
   ========================================================== */
const CONTACTO = {
  instagram: "https://www.instagram.com/nini._nise/",
  whatsapp: "https://wa.me/+573174130265",
  email: "carreno12paola@gmail.com",
  tiktok: "https://www.tiktok.com/@nini_nise?_r=1&_t=ZS-9BfpB5CUx",
  linkedin: "",
  behance: "https://www.behance.net/deniselopezl/projects"
};

/* ==========================================================
   2) Parámetros de animación (opcional). Ajusta a tu gusto.
   ========================================================== */
const AJUSTES = {
  zoomFoto: 0.12,          // zoom de la foto dentro de la estrella (0.12 = 12 %)
  escalaEstrella: 0.05,    // crecimiento de la estrella completa (0.05 = 5 %)
  radioProximidad: 210,    // px alrededor de la estrella donde reacciona el cursor
  movimientoImán: 7,       // px que se desplaza la estrella hacia el cursor
  destellosPorRáfaga: 3,   // miniestrellas por cada ráfaga
  destellosMáximos: 14,    // máximo de destellos simultáneos por estrella
  intervaloDestellos: 260, // ms entre ráfagas mientras el cursor está cerca
  duraciónDestello: 1100,  // ms que dura cada destello
  rastroActivo: true,      // rastro de estrellas con el mouse (portafolio)
  rastroMáximo: 18,        // partículas simultáneas del rastro
  rastroIntervalo: 55,     // ms mínimos entre partículas del rastro
  intensidadParallax: 1,   // 0 = sin parallax, 2 = el doble
  duraciónTransición: 650  // ms de la apertura de carpetas antes de ir a la sección
};

/* No modificar: expone la configuración al resto de los scripts. */
window.CONTACTO = CONTACTO;
window.AJUSTES = AJUSTES;
