(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cop = n => '$' + Math.round(n).toLocaleString('es-CO');
  const slides = [...document.querySelectorAll('.slide')];
  document.getElementById('tot').textContent = slides.length;

  /* ---- animación por slide + contador ---- */
  slides.forEach(s => s.querySelectorAll('[data-a]').forEach((el, i) => el.style.setProperty('--d', (i * 70) + 'ms')));
  const counted = new WeakSet();
  const count = el => {
    if (counted.has(el) || reduce) return; counted.add(el);
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0); const t0 = performance.now(), dur = 1300;
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); const v = to * e; el.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('es-CO'); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const bnav = [...document.querySelectorAll('.bnav a')];
  let cur = 0;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); e.target.querySelectorAll('[data-count]').forEach(count); cur = slides.indexOf(e.target); document.getElementById('cur').textContent = cur + 1;
      let best = 0; bnav.forEach(a => { if (+a.dataset.i <= cur) best = +a.dataset.i; }); bnav.forEach(a => a.classList.toggle('on', +a.dataset.i === best)); }
  }), { threshold: .08 });
  slides.forEach(s => io.observe(s));
  setTimeout(() => slides.forEach(s => s.classList.add('vis')), 2500);
  const bar = document.querySelector('.progress span');
  addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }, { passive: true });

  /* ---- navegación ---- */
  const go = i => { const s = slides[Math.max(0, Math.min(slides.length - 1, i))]; s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,select,textarea')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(cur + 1); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
    if (e.key === 'Home') go(0); if (e.key === 'End') go(slides.length - 1);
  });

  /* ---- visores ---- */
  const V = {
    tec: [['r1', 'Programación por rutas'], ['r2', 'Sedes y centros de costo'], ['r3', 'Flota en tiempo real'], ['r4', 'Calendario de servicios'], ['r5', 'Cumplimiento de la operación']],
    seg: [['seg-liquidado', 'Servicio por servicio liquidado'], ['seg-vehiculo', 'Hoja de vida del vehículo'], ['s3', 'Hitos e itinerario'], ['s4', 'Notificación por parada'], ['s5', 'Ruta en tiempo real y 3D']],
    hseq: [['h1', 'Reporte documental total'], ['h2', 'Revisión del vehículo'], ['h3', 'Consulta RUNT y SIMIT'], ['h4', 'Horas de trabajo'], ['h5', 'Auditoría'], ['h6', 'Conductores'], ['h7', 'Calificación del servicio']],
    tab: [['abai-1', 'Vista 1'], ['abai-2', 'Vista 2'], ['abai-3', 'Vista 3']],
    tik: [['p1', 'Control de novedades'], ['p2', 'Ticket ligado al servicio'], ['p3', 'Respuesta y apelación']],
    lin: [['l1', 'Optimización de rutas'], ['l2', 'Paradas'], ['l3', 'Seguimiento']],
    app: [['u1', 'Viaje en tiempo real'], ['u2', 'Rutas disponibles'], ['u3', 'Recorrido de la ruta'], ['u4', 'Paraderos disponibles']]
  };
  document.querySelectorAll('[data-viewer]').forEach(box => {
    const items = V[box.dataset.viewer]; let i0 = 0; const phone = box.classList.contains('viewer--phone');
    box.innerHTML = `<ol class="vlist">${items.map((it, i) => `<li><button type="button" class="vitem${i ? '' : ' is-active'}" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${it[1]}</button></li>`).join('')}</ol>
      <div class="vstage"><img src="img/${items[0][0]}.jpg" alt="${items[0][1]}" loading="lazy" decoding="async"><div class="vcap"><b></b></div></div>`;
    const img = box.querySelector('img'), cap = box.querySelector('.vcap b');
    const show = i => { i0 = (i + items.length) % items.length; const it = items[i0]; box.querySelectorAll('.vitem').forEach(b => b.classList.toggle('is-active', +b.dataset.i === i0));
      img.style.opacity = 0; setTimeout(() => { img.src = `img/${it[0]}.jpg`; img.alt = it[1]; img.style.transition = 'opacity .4s'; img.style.opacity = 1; }, reduce ? 0 : 150);
      cap.textContent = `${String(i0 + 1).padStart(2, '0')} · ${it[1]}`; };
    if (!box.hasAttribute('data-static')) box.addEventListener('click', e => { const b = e.target.closest('.vitem'); if (b) return show(+b.dataset.i); });
    show(0); items.forEach(it => { const p = new Image(); p.src = `img/${it[0]}.jpg`; });
  });

  document.querySelectorAll('[data-dl]').forEach(b => b.addEventListener('click', () => { const a = document.createElement('a');  }));
})();
