# Impulso Digital · Landing

Landing premium de Impulso Digital (agencia de marketing con IA).
Stack: Vite + HTML/CSS/JS vanilla + GSAP ScrollTrigger.

## Comandos

```bash
npm run dev      # desarrollo (puerto 5180)
npm run build    # produccion (genera dist/)
npm run preview  # probar el build
```

## Donde editar cada cosa

| Que | Donde |
|---|---|
| Textos de todas las secciones | `index.html` (bloques marcados "CAMBIAR AQUI") |
| Link de WhatsApp | `index.html` (3 botones) y `src/main.js` (CONFIG) |
| Colores e identidad | `src/styles.css` seccion `01. VARIABLES` |
| Logo | reemplazar `public/logo/impulso-digital-logo.png` |
| Velocidad del despegue | `src/main.js` → `CONFIG.despegueScroll` |
| Conversacion del chat IA | `src/main.js` → `GUION_CHAT` (seccion 10) |
| Densidad de la red neuronal | `src/main.js` → `CONFIG.nodosRedDesktop/Mobile` |
| Tamano del cohete del despegue | `src/styles.css` → `.despegue__rocket` (height) |
| Tamano del video del hero | `src/styles.css` → `.hero__frame` (width) |

## Videos

- `public/videos/Cinematic_video_second.mp4`: video fuente actual (Gemini,
  sin texto incrustado). NO se usa directo en la web, es la materia prima.
- `public/videos/cohete-impulso-hero.mp4`: loop del hero (optimizado, sin audio).
- `public/videos/cohete-impulso-scrub.mp4`: fallback del despegue para
  Safari/iOS, recortado a la franja del cohete, todos los frames keyframes.
- `public/videos/cohete-alpha.webm`: cohete CON TRANSPARENCIA REAL (canal
  alfa, generado con IA rembg). Lo usan Chrome/Edge/Firefox en el despegue.
- `public/videos/cohete-impulso-hero-original.mp4`: primer video (backup).

### Pipeline de transparencia (cohete sin fondo)

1. Extraer frames recortados: `ffmpeg -i FUENTE.mp4 -vf "crop=320:1280:0:0" %TEMP%/cohete_in/f_%04d.png`
2. Quitar el fondo con IA: `python scripts/quitar-fondo.py` (usa rembg/u2net)
3. Armar el webm con alfa (todos keyframes para el scrubbing):

```bash
ffmpeg -framerate 24 -i %TEMP%/cohete_out/f_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -g 1 -crf 45 -b:v 0 -movflags +faststart public/videos/cohete-alpha.webm
```

### Si cambias el video del cohete

1. Reemplaza `cohete-impulso-hero.mp4` (idealmente ya optimizado):

```bash
ffmpeg -i NUEVO.mp4 -an -c:v libx264 -crf 26 -preset slow -movflags +faststart public/videos/cohete-impulso-hero.mp4
```

2. Regenera la version scrub (fallback Safari):

```bash
ffmpeg -i NUEVO.mp4 -an -vf "crop=320:1280:0:0" -c:v libx264 -g 1 -bf 0 -crf 27 -preset slow -movflags +faststart -pix_fmt yuv420p public/videos/cohete-impulso-scrub.mp4
```

   (`-g 1 -bf 0` = todos los frames clave, necesario para el scrubbing.
   El crop toma la franja izquierda de 320px donde vive el cohete.)
   Y repeti el pipeline de transparencia de arriba para cohete-alpha.webm.

3. Regenera los posters:

```bash
ffmpeg -ss 0.5 -i public/videos/cohete-impulso-hero.mp4 -frames:v 1 -update 1 -q:v 3 public/images/hero-poster.jpg
ffmpeg -ss 0.5 -i public/videos/cohete-impulso-scrub.mp4 -frames:v 1 -update 1 -q:v 4 public/images/despegue-poster.jpg
```

4. Si cambia el encuadre, ajusta `aspect-ratio` de `.despegue__rocket`
   en `src/styles.css` a la proporcion del nuevo video.
