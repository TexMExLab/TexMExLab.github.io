// Animated starfield with slow parallax drift and occasional shooting stars.
(function () {
  const c = document.getElementById('stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, stars = [], shooters = [], mx = 0, my = 0;
  function resize() {
    const d = devicePixelRatio || 1;
    w = innerWidth; h = innerHeight;
    c.width = w * d; c.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.min(420, Math.floor(w * h / 4500));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() * 0.9 + 0.1, p: Math.random() * 6.28,
      hue: Math.random() < .15 ? 30 : Math.random() < .3 ? 220 : 0
    }));
  }
  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mx = e.clientX / w - .5; my = e.clientY / h - .5; });
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.x -= s.z * 0.06; if (s.x < 0) s.x = w;
      const tw = 0.6 + 0.4 * Math.sin(t / 900 + s.p);
      const x = s.x + mx * s.z * 24, y = s.y + my * s.z * 24;
      ctx.fillStyle = s.hue ? `hsla(${s.hue},90%,78%,${tw * s.z})` : `rgba(235,240,255,${tw * s.z})`;
      ctx.beginPath(); ctx.arc(x, y, s.z * 1.3, 0, 6.28); ctx.fill();
    }
    if (!reduce && Math.random() < 0.004) shooters.push({ x: Math.random() * w, y: Math.random() * h * .4, l: 0, v: 9 + Math.random() * 6 });
    shooters = shooters.filter(s => s.l < 140);
    for (const s of shooters) {
      const g = ctx.createLinearGradient(s.x, s.y, s.x - 90, s.y - 45);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - 90, s.y - 45); ctx.stroke();
      s.x += s.v; s.y += s.v / 2; s.l += s.v;
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  resize();
  requestAnimationFrame(frame);
})();
