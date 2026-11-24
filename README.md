# By ninis · Portafolio web

Sitio estático (HTML + CSS + JavaScript puro). Sin backend, sin compilación, sin base de datos.
Funciona con Visual Studio Code (Live Server), GitHub Pages, Netlify y Vercel.

## Estructura
```
by-ninis/
├── index.html
├── css/        styles.css · animations.css · responsive.css
├── js/         config.js ← (aquí pones tus enlaces) · main.js · animations.js
│               gallery.js · sparkles.js · proximity.js
├── assets/     images · logos · icons · projects/{bebidas,mermelada} · textures · fonts
├── README.md
└── .gitignore
```

## 1. Agregar tus enlaces de contacto (lo único que debes editar)
Abre `js/config.js` y escribe tus datos entre las comillas:

```js
const CONTACTO = {
  instagram: "tuusuario",            // o la URL completa
  whatsapp:  "573001234567",         // código de país + número, solo dígitos
  email:     "hola@tudominio.com",
  tiktok:    "",                     // opcional
  linkedin:  "",                     // opcional
  behance:   ""                      // opcional
};
```
- Los campos vacíos dejan su botón **deshabilitado** (conserva el diseño, no abre direcciones falsas).
- «Escríbeme Ahora» y los botones «Solicitar información» usan el primer medio configurado
  (orden: WhatsApp → Instagram → correo → TikTok → LinkedIn → Behance).
- Los enlaces externos se abren con `rel="noopener noreferrer"`.

En el mismo archivo, `AJUSTES` centraliza zoom de las estrellas (`zoomFoto`), cantidad de destellos,
radio de proximidad, rastro de estrellas, velocidad y duración de transiciones.

## 2. Ver la página en tu computador
1. Descomprime el ZIP.
2. Abre Visual Studio Code → **Archivo → Abrir carpeta…** → elige `by-ninis`.
3. Instala la extensión **Live Server** (Ritwick Dey) si no la tienes.
4. Clic derecho sobre `index.html` → **Open with Live Server**.
(También funciona abriendo `index.html` con doble clic.)

## 3. Publicar en GitHub Pages
1. Crea una cuenta en https://github.com.
2. **New repository** → nombre `by-ninis` → *Public* → **Create repository**.
3. En la página del repositorio: **uploading an existing file** → arrastra **el contenido** de la carpeta
   `by-ninis` (index.html, css, js, assets…) → **Commit changes**.
4. **Settings → Pages** → *Source*: **Deploy from a branch** → Branch: `main` / carpeta `/ (root)` → **Save**.
5. Espera 1–2 minutos y refresca: arriba aparecerá tu enlace, normalmente
   `https://TU-USUARIO.github.io/by-ninis/`.
6. Compártelo por WhatsApp, Instagram, tu CV, etc.

**Actualizarla después:** edita el archivo (por ejemplo `js/config.js`) → en GitHub abre el archivo → lápiz ✏️ →
pega los cambios → **Commit changes**. En 1–2 minutos se actualiza. Para reemplazar imágenes: **Add file → Upload files**.

## 4. Alternativa: Netlify (la más rápida)
1. Entra a https://app.netlify.com/drop (crea cuenta gratuita).
2. Arrastra la carpeta `by-ninis` completa a la página.
3. Obtienes un enlace público al instante; puedes cambiar el nombre en **Site configuration → Change site name**.

## 5. Cómo agregar más fotos a la galería
- Corazones fotográficos: copia el bloque `<div class="abs star-group">…</div>` en `index.html`, cambia `data-full`, `data-alt`
  y la imagen interior; guarda las fotos en `assets/projects/<proyecto>/`.
- Usa WebP (`.webp`) de ~1600 px de lado largo para la foto completa y ~700 px para la miniatura.

## Notas de accesibilidad y rendimiento
Navegación con teclado (Tab, Enter/Espacio en las estrellas, flechas y Escape en la galería), foco visible,
`prefers-reduced-motion` respetado, textos alternativos, animaciones con `transform`/`opacity`, `IntersectionObserver`,
lazy loading, tipografías locales (Lobster e Inknut Antiqua) y límite de partículas simultáneas.
En pantallas táctiles el efecto de proximidad se reemplaza por destellos al entrar en pantalla y al tocar.
