/* ================================================================
   IMPULSO DIGITAL · INTERACCIÓN Y ANIMACIONES (GSAP + ScrollTrigger)
   ----------------------------------------------------------------
   ÍNDICE
   00. CONFIG (CAMBIAR AQUÍ: WhatsApp, nodos de la red neuronal)
   01. Setup y accesibilidad (prefers-reduced-motion)
   02. Header: estado al scrollear + menú mobile
   03. Hero: animación de entrada + parallax
   04. Revelado genérico de secciones (data-reveal)
   05. Servicios: hover 3D de las cards
   06. Proceso: línea luminosa de la timeline
   07. Gestión de los videos (play/pausa según visibilidad)
   08. Red neuronal de fondo (canvas)
   09. Chat IA que se escribe sola
   10. Texto "decodificado" (efecto scramble IA)
   11. Spotlight: luz que sigue al cursor
   12. Botones magnéticos
   13. Botón flotante de WhatsApp
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
   03. HERO · entrada suave + parallax
   ================================================================ */

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
   04. REVELADO GENÉRICO · todo lo que tenga data-reveal
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
   05. SERVICIOS · hover 3D de las cards
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
   06. PROCESO · la línea luminosa se "dibuja" con el scroll
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
   07. VIDEOS · reproducir solo cuando se ven (rendimiento)
   Con reduced motion quedan en pausa y se muestra el poster.
   ================================================================ */
function gestionarVideoEnViewport(video, trigger) {
  if (!video) return;
  if (reduceMotion) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }
  ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      if (self.isActive) video.play().catch(() => {});
      else video.pause();
    },
  });
}

gestionarVideoEnViewport($('#heroVideo'), '.hero');
gestionarVideoEnViewport($('#despegueBgVideo'), '.despegue');


/* ================================================================
   08. RED NEURONAL DE FONDO (canvas)
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
   09. CHAT IA · la conversación que se escribe sola
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
   10. TEXTO "DECODIFICADO" (efecto scramble IA)
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
   11. SPOTLIGHT · luz que sigue al cursor (solo desktop)
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
   12. BOTONES MAGNÉTICOS · los CTA con data-magnetic se inclinan
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


/* ================================================================
   13. BOTÓN FLOTANTE DE WHATSAPP
   Aparece cuando el usuario deja atrás el hero (así no compite con
   el CTA principal). Con reduced motion se muestra directamente.
   ================================================================ */
(function whatsappFlotante() {
  const wa = $('#waFloat');
  if (!wa) return;

  if (reduceMotion) { wa.classList.add('is-visible'); return; }

  // Se muestra al pasar ~70% del alto de la primera pantalla
  const umbral = () => window.innerHeight * 0.7;
  const actualizar = () => wa.classList.toggle('is-visible', window.scrollY > umbral());

  actualizar();
  window.addEventListener('scroll', actualizar, { passive: true });
})();
