/* ================================================================
   IMPULSO DIGITAL · INTERACCIÓN Y ANIMACIONES (GSAP + ScrollTrigger)
   ----------------------------------------------------------------
   ÍNDICE
   00. CONFIG (CAMBIAR AQUÍ: WhatsApp, velocidad del scroll, partículas)
   01. Setup y accesibilidad (prefers-reduced-motion)
   02. Header: estado al scrollear + menú mobile
   03. Hero: animación de entrada + partículas + parallax
   04. Despegue digital: sección pineada con scroll
   05. Revelado genérico de secciones (data-reveal)
   06. Servicios: hover 3D de las cards
   07. Proceso: línea luminosa de la timeline
   08. Gestión de los videos (play/pausa según visibilidad)
   ================================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/* ================================================================
   00. CONFIG · CAMBIAR AQUÍ
   ================================================================ */
const CONFIG = {
  // CAMBIAR WHATSAPP AQUÍ (los botones del HTML tienen su propio link,
  // este se usa por si querés generar links dinámicos en el futuro)
  whatsappURL:
    'https://wa.me/5492494601118?text=Hola,%20quiero%20impulsar%20mi%20negocio%20con%20Impulso%20Digital',

  // AJUSTAR VELOCIDAD DEL SCROLL DEL DESPEGUE AQUÍ:
  // 3 = la sección dura 3 pantallas de scroll (300vh), 4 = más lenta (400vh)
  despegueScroll: 3,

  // Cantidad de partículas (menos = más rendimiento)
  // SIMPLIFICAR MOBILE AQUÍ: bajá estos números si hace falta
  particulasDespegue: 16,
  lineasVelocidadDesktop: 12,
  lineasVelocidadMobile: 5,

  // Red neuronal de fondo (nodos del canvas)
  nodosRedDesktop: 60,
  nodosRedMobile: 24,
};


/* ================================================================
   01. SETUP Y ACCESIBILIDAD
   Si el usuario pide menos movimiento, no se crean animaciones:
   la página queda estática pero 100% legible.
   ================================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esMobile = () => window.matchMedia('(max-width: 860px)').matches;
const punteroFino = window.matchMedia('(pointer: fine)').matches;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));


/* ================================================================
   02. HEADER · vidrio al scrollear + menú mobile
   ================================================================ */
const header = $('#header');
const nav = $('#nav');
const navToggle = $('#navToggle');

// El header se vuelve "vidrio" apenas se scrollea
ScrollTrigger.create({
  start: 30,
  onUpdate: (self) => header.classList.toggle('is-scrolled', self.scroll() > 30),
});
header.classList.toggle('is-scrolled', window.scrollY > 30);

// Menú hamburguesa (mobile)
navToggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(abierto));
});

// Cierra el menú al tocar un link
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);


/* ================================================================
   03. HERO · entrada suave + partículas + parallax
   ================================================================ */

// --- Partículas flotantes (puntos cyan que suben) ---
function crearParticulas(contenedor, cantidad) {
  if (!contenedor || reduceMotion) return;
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.setProperty('--x', `${Math.random() * 100}%`);
    p.style.setProperty('--s', `${1 + Math.random() * 2.5}px`);
    p.style.setProperty('--d', `${9 + Math.random() * 14}s`);
    p.style.setProperty('--delay', `${Math.random() * -20}s`);
    p.style.setProperty('--o', `${0.25 + Math.random() * 0.45}`);
    contenedor.appendChild(p);
  }
}

// --- Entrada del hero (stagger en eyebrow, título, texto, botones, video) ---
if (!reduceMotion) {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('[data-hero]', {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
    })
    .from(
      '.hero__frame',
      { scale: 0.94, duration: 1.1, ease: 'power2.out' },
      '<0.2'
    );

  // --- Parallax suave de los glows del fondo ---
  gsap.to('.hero__glow--cyan', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  gsap.to('.hero__glow--blue', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
}


/* ================================================================
   04. DESPEGUE DIGITAL · sección pineada
   El usuario scrollea CONFIG.despegueScroll pantallas mientras el
   cohete sube, crece la estela y aparecen los 6 textos.
   AJUSTAR VELOCIDAD: CONFIG.despegueScroll (arriba de todo)
   ================================================================ */
const despegue = $('.despegue');
const stage = $('#despegueStage');

// Líneas de velocidad (rayitas verticales que caen = sensación de subida)
function crearLineas(contenedor, cantidad) {
  if (!contenedor || reduceMotion) return;
  for (let i = 0; i < cantidad; i++) {
    const l = document.createElement('span');
    l.className = 'line';
    l.style.setProperty('--x', `${Math.random() * 100}%`);
    l.style.setProperty('--h', `${30 + Math.random() * 90}px`);
    l.style.setProperty('--d', `${1.4 + Math.random() * 2.2}s`);
    l.style.setProperty('--delay', `${Math.random() * -4}s`);
    contenedor.appendChild(l);
  }
}

if (!reduceMotion && despegue) {
  // Activa el layout "pineado" (textos a los costados, ver styles.css)
  despegue.classList.add('despegue--pin');

  crearLineas(
    $('#despegueLines'),
    esMobile() ? CONFIG.lineasVelocidadMobile : CONFIG.lineasVelocidadDesktop
  );
  crearParticulas($('#despegueParticles'), CONFIG.particulasDespegue);

  const pasos = $$('.despegue__step');

  // gsap.matchMedia permite animaciones distintas en desktop y mobile
  const mm = gsap.matchMedia();

  mm.add(
    {
      escritorio: '(min-width: 861px)',
      celular: '(max-width: 860px)',
    },
    (ctx) => {
      const { celular } = ctx.conditions;

      // SIMPLIFICAR MOBILE AQUÍ: en celular el cohete se mueve menos
      const subidaCohete = celular ? '-9vh' : '-15vh';
      const escalaCohete = celular ? 1.03 : 1.07;

      // Qué paso corresponde a cada momento del scroll:
      // el primer 10% es para leer el encabezado, el resto se reparte
      // entre los 6 textos. El último queda visible al salir.
      let pasoActivo = -1;
      function actualizarPaso(progreso) {
        const idx =
          progreso < 0.1
            ? -1
            : Math.min(pasos.length - 1, Math.floor(((progreso - 0.1) / 0.9) * pasos.length));
        if (idx === pasoActivo) return;

        if (pasoActivo >= 0) {
          gsap.to(pasos[pasoActivo], { autoAlpha: 0, y: -30, duration: 0.3, overwrite: 'auto' });
        }
        if (idx >= 0) {
          gsap.fromTo(
            pasos[idx],
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.45, overwrite: 'auto' }
          );
          // El título se "decodifica" al aparecer (efecto IA)
          decodificar(pasos[idx].querySelector('h3'), 500);
        }
        pasoActivo = idx;
      }

      /* --- VIDEO SCRUBBING: el scroll controla el tiempo del video ---
         El cohete despega exactamente al ritmo del usuario: si frena el
         scroll, el cohete se congela; si vuelve atrás, retrocede. */
      const video = $('#despegueVideo');

      /* Cohete SIN FONDO (transparencia real): si el navegador soporta
         WebM VP9 con canal alfa (Chrome, Edge, Firefox), usamos la
         versión recortada con IA. Safari/iOS ignora el alfa, así que
         se queda con el mp4 + máscara difuminada (fallback). */
      const esSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const rocket = $('#despegueRocket');
      // El webm transparente ya es el src por defecto (ver index.html).
      // Solo cambiamos a la versión con fondo (mp4 + máscara) si:
      //  - es Safari (no soporta el canal alfa del webm), o
      //  - el webm falla al cargar por cualquier motivo.
      function usarFallbackConFondo() {
        if (video.currentSrc.includes('cohete-impulso-scrub')) return;
        rocket.classList.remove('sin-fondo');
        video.src = '/videos/cohete-impulso-scrub.mp4';
        video.load();
      }
      if (video) {
        if (esSafari) {
          usarFallbackConFondo();
        } else {
          video.addEventListener('error', usarFallbackConFondo, { once: true });
        }
      }
      let tiempoObjetivo = 0;
      let tiempoSuave = 0;

      // Lerp en cada frame para que el movimiento sea fluido y no "a saltos"
      function scrubVideo() {
        if (!video || !video.duration) return;
        tiempoSuave += (tiempoObjetivo - tiempoSuave) * 0.14;
        // Solo escribe currentTime si el cambio supera ~1 frame (rendimiento)
        if (Math.abs(video.currentTime - tiempoSuave) > 0.034) {
          video.currentTime = tiempoSuave;
        }
      }
      gsap.ticker.add(scrubVideo);

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: despegue,
          start: 'top top',
          // Largo del pin: 3 => 300vh de scroll. CAMBIAR EN CONFIG.
          end: `+=${CONFIG.despegueScroll * 100}%`,
          scrub: 0.6,
          pin: stage,
          anticipatePin: 1,
          onUpdate: (self) => {
            actualizarPaso(self.progress);
            // El progreso del scroll (0 a 1) se mapea al tiempo del video
            if (video && video.duration) {
              tiempoObjetivo = self.progress * (video.duration - 0.05);
            }
          },
          // Activa las líneas de velocidad solo cuando la sección se ve
          onToggle: (self) => {
            despegue.classList.toggle('despegue--active', self.isActive);
          },
        },
      });

      const total = pasos.length * 1.6 + 1; // duración interna del timeline

      // El cohete sube y crece levemente durante TODO el scroll
      tl.fromTo(
        '#despegueRocket',
        { y: '7vh', scale: 0.94 },
        { y: subidaCohete, scale: escalaCohete, ease: 'none', duration: total },
        0
      );

      // La estela luminosa crece durante la primera mitad
      tl.fromTo(
        '#despegueTrail',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, ease: 'none', duration: total * 0.45 },
        0.4
      );

      // El encabezado se desvanece cuando arranca la secuencia
      tl.to('.despegue__head', { autoAlpha: 0, y: -24, duration: 0.8 }, 0.6);

      // (Los 6 textos progresivos los maneja actualizarPaso(), arriba)

      return () => {
        gsap.ticker.remove(scrubVideo);
        despegue.classList.remove('despegue--active');
      };
    }
  );
}


/* ================================================================
   05. REVELADO GENÉRICO · todo lo que tenga data-reveal
   hace un fade-up suave al entrar en pantalla
   ================================================================ */
if (!reduceMotion) {
  // Las cards se revelan en tanda (stagger) para que se sienta fluido
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 86%',
    once: true,
    onEnter: (items) =>
      gsap.fromTo(
        items,
        { y: 32, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out' }
      ),
  });
  // Estado inicial oculto (solo si hay JS, así nunca desaparece contenido)
  gsap.set('[data-reveal]', { autoAlpha: 0 });
}


/* ================================================================
   06. SERVICIOS · hover 3D de las cards
   Solo en dispositivos con mouse (pointer: fine) y sin reduced motion.
   SIMPLIFICAR MOBILE: en celular no hay tilt, solo el glow CSS.
   ================================================================ */
if (punteroFino && !reduceMotion) {
  const INCLINACION_MAX = 6; // grados. Subí/bajá para más o menos 3D.

  $$('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0 a 1
      const py = (e.clientY - r.top) / r.height;   // 0 a 1

      card.style.setProperty('--ry', `${(px - 0.5) * 2 * INCLINACION_MAX}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * 2 * INCLINACION_MAX}deg`);
      card.style.setProperty('--ty', '-4px');
      // Posición del glow interior
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--ty', '0px');
    });
  });
}


/* ================================================================
   07. PROCESO · la línea luminosa se "dibuja" con el scroll
   ================================================================ */
if (!reduceMotion) {
  gsap.to('#procesoLineFill', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#procesoTimeline',
      start: 'top 72%',
      end: 'bottom 55%',
      scrub: 0.8,
    },
  });
}


/* ================================================================
   08. VIDEOS · reproducir solo cuando se ven (rendimiento)
   El video del hero se pausa al salir de pantalla; el del despegue
   se maneja en la sección 04. Con reduced motion quedan en pausa
   y se muestra el poster.
   ================================================================ */
const heroVideo = $('#heroVideo');

if (heroVideo) {
  if (reduceMotion) {
    // Respeto total: nada se mueve, queda la imagen poster
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        if (self.isActive) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      },
    });
  }
}

const despegueVideo = $('#despegueVideo');
if (despegueVideo && reduceMotion) despegueVideo.removeAttribute('autoplay');


/* ================================================================
   09. RED NEURONAL DE FONDO (canvas)
   Nodos que flotan y se conectan entre sí y con el cursor.
   Representa la capa de IA que atraviesa toda la página.
   AJUSTAR CANTIDAD: CONFIG.nodosRedDesktop / nodosRedMobile
   ================================================================ */
(function redNeuronal() {
  const canvas = $('#redNeuronal');
  if (!canvas) return;
  if (reduceMotion) { canvas.remove(); return; }

  const ctx = canvas.getContext('2d');
  const cantidad = esMobile() ? CONFIG.nodosRedMobile : CONFIG.nodosRedDesktop;
  const DIST_NODO = 150;   // distancia máx. para unir dos nodos
  const DIST_MOUSE = 190;  // distancia máx. para unir nodo y cursor

  let ancho, alto, nodos = [];
  const cursor = { x: null, y: null };

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodos = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1 + Math.random() * 1.7,
    }));
  }
  redimensionar();
  window.addEventListener('resize', redimensionar);

  if (punteroFino) {
    window.addEventListener('pointermove', (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }, { passive: true });
  }

  function cuadro() {
    requestAnimationFrame(cuadro);
    if (document.hidden) return; // pausa cuando la pestaña no se ve

    ctx.clearRect(0, 0, ancho, alto);

    // Nodos
    for (const n of nodos) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > ancho) n.vx *= -1;
      if (n.y < 0 || n.y > alto) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 217, 255, 0.32)';
      ctx.fill();
    }

    // Conexiones entre nodos cercanos
    for (let i = 0; i < nodos.length; i++) {
      for (let j = i + 1; j < nodos.length; j++) {
        const dx = nodos[i].x - nodos[j].x;
        const dy = nodos[i].y - nodos[j].y;
        const d = Math.hypot(dx, dy);
        if (d < DIST_NODO) {
          ctx.strokeStyle = `rgba(86, 140, 255, ${(1 - d / DIST_NODO) * 0.13})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodos[i].x, nodos[i].y);
          ctx.lineTo(nodos[j].x, nodos[j].y);
          ctx.stroke();
        }
      }
    }

    // Conexión con el cursor (la red "reacciona" al usuario)
    if (cursor.x !== null) {
      for (const n of nodos) {
        const d = Math.hypot(n.x - cursor.x, n.y - cursor.y);
        if (d < DIST_MOUSE) {
          ctx.strokeStyle = `rgba(56, 217, 255, ${(1 - d / DIST_MOUSE) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(cursor.x, cursor.y);
          ctx.stroke();
        }
      }
    }
  }
  cuadro();
})();


/* ================================================================
   10. CHAT IA · la conversación que se escribe sola
   CAMBIAR LA CONVERSACIÓN AQUÍ (GUION_CHAT)
   ================================================================ */
const GUION_CHAT = [
  { de: 'cliente', texto: '¡Hola! ¿Tenés turnos para mañana?', hora: '23:47' },
  { de: 'ia', texto: '¡Hola! 😊 Sí, mañana quedan 10:30 y 16:00. ¿Cuál te queda mejor?', hora: '23:47' },
  { de: 'cliente', texto: 'A las 16 me viene perfecto', hora: '23:48' },
  { de: 'ia', texto: 'Listo, turno confirmado para mañana a las 16:00 ✅ Te llega el recordatorio por acá.', hora: '23:48' },
];

(function chatIA() {
  const cont = $('#chatMensajes');
  if (!cont) return;

  function crearBurbuja(m) {
    const div = document.createElement('div');
    div.className = `burbuja burbuja--${m.de}`;
    div.innerHTML = `${m.texto}<small>${m.hora}${m.de === 'ia' ? ' · IA' : ''}</small>`;
    return div;
  }

  // Con reduced motion: la conversación se muestra completa, sin animar
  if (reduceMotion) {
    GUION_CHAT.forEach((m) => cont.appendChild(crearBurbuja(m)));
    return;
  }

  let visible = false;
  let corriendo = false;

  function escribirIndicador(de) {
    const t = document.createElement('div');
    t.className = `burbuja burbuja--${de} escribiendo`;
    t.innerHTML = '<span></span><span></span><span></span>';
    cont.appendChild(t);
    return t;
  }

  const espera = (ms) => new Promise((res) => setTimeout(res, ms));

  async function reproducir() {
    if (corriendo) return;
    corriendo = true;
    while (visible) {
      cont.replaceChildren();
      for (const m of GUION_CHAT) {
        if (!visible) break;
        await espera(500);
        const ind = escribirIndicador(m.de);
        // La IA "tipea" más rápido que el cliente
        await espera(m.de === 'ia' ? 1000 : 1400);
        ind.remove();
        cont.appendChild(crearBurbuja(m));
      }
      await espera(4200); // pausa para leer antes de repetir
    }
    corriendo = false;
  }

  // Solo corre cuando la sección está en pantalla (rendimiento)
  new IntersectionObserver(
    (entradas) => {
      visible = entradas[0].isIntersecting;
      if (visible) reproducir();
    },
    { threshold: 0.35 }
  ).observe(cont);
})();


/* ================================================================
   11. TEXTO "DECODIFICADO" (efecto scramble IA)
   Los elementos con data-scramble se revelan letra por letra
   pasando por glifos aleatorios. También lo usan los títulos
   del despegue (sección 04).
   ================================================================ */
const GLIFOS = '01<>/#%&@$+=*';

function decodificar(el, duracion = 800) {
  if (!el || reduceMotion) return;
  const original = el.dataset.textoOriginal || (el.dataset.textoOriginal = el.textContent);
  const inicio = performance.now();

  (function tick(t) {
    const p = Math.min(1, (t - inicio) / duracion);
    const fijos = Math.floor(p * original.length);
    el.textContent =
      original.slice(0, fijos) +
      [...original.slice(fijos)]
        .map((c) => (c === ' ' ? ' ' : GLIFOS[(Math.random() * GLIFOS.length) | 0]))
        .join('');
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  })(inicio);
}

// Al cargar, decodifica lo marcado en el HTML (ej: eyebrow del hero)
$$('[data-scramble]').forEach((el, i) =>
  setTimeout(() => decodificar(el), 500 + i * 150)
);


/* ================================================================
   12. SPOTLIGHT · luz que sigue al cursor (solo desktop)
   ================================================================ */
(function spotlight() {
  const luz = $('#spotlight');
  if (!luz) return;
  if (!punteroFino || reduceMotion) { luz.remove(); return; }

  window.addEventListener('pointermove', (e) => {
    luz.style.setProperty('--sx', `${e.clientX}px`);
    luz.style.setProperty('--sy', `${e.clientY}px`);
  }, { passive: true });
})();


/* ================================================================
   13. BOTONES MAGNÉTICOS · los CTA con data-magnetic se inclinan
   levemente hacia el cursor (solo desktop)
   ================================================================ */
if (punteroFino && !reduceMotion) {
  $$('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.18,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('pointerleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    });
  });
}
