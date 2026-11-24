/* ============================================================
   Nawaz Azim Pawaskar — portfolio interactions

   Motion system:
     · damped (lerped) scroll parallax, so layers lag and settle
       instead of snapping 1:1 with the scrollbar
     · scroll-velocity skew on media, decaying back to flat
     · 3D pointer tilt on media frames
     · hero depth-exit (content lifts and fades as you leave)
     · depth-layered canvas starfield
   The rAF loop sleeps once everything has settled and wakes on input.
   Everything disables itself under prefers-reduced-motion.
   ============================================================ */
(() => {
  "use strict";

  // Only hide fx start-states once this script is known to be running. If it fails
  // to load, the page renders fully visible instead of blank.
  document.documentElement.classList.add("js");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer:fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------- mobile menu */
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$(".links a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------------------------------------- scroll reveals */
  const revealables = $$(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealables.forEach((el) => {
      const sibs = [...(el.parentElement?.children || [])].filter(c => c.classList.contains("reveal"));
      const i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
      io.observe(el);
    });
  } else {
    revealables.forEach(el => el.classList.add("in"));
  }

  /* ---------------------------------------------- counters */
  const fmt = (n) => n.toLocaleString("en-US");
  function runCount(el) {
    const to = parseFloat(el.dataset.to);
    const from = parseFloat(el.dataset.from ?? "0");
    const suffix = el.dataset.suffix || "";
    if (!Number.isFinite(to)) return;
    const dur = 1500, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && !reduced) {
    const co = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$(".count").forEach(c => co.observe(c));
  }

  /* ============================================================
     MOTION ENGINE
     ============================================================ */
  const bar = $("#bar");
  const tl = $(".tl"), tlFill = $("#tlFill");
  const heroInner = $(".hero-inner");
  const hero = $(".hero");
  const sections = $$("main section[id]");
  const navLinks = new Map($$(".links a").map(a => [a.getAttribute("href").slice(1), a]));

  // parallax items: data-par = speed, data-par-scale = extra zoom at extremes
  const items = $$("[data-par]").map(el => ({
    el,
    k: parseFloat(el.dataset.par) || 0,
    sc: parseFloat(el.dataset.parScale || "0"),
    skews: el.hasAttribute("data-skew"),
    cur: 0, tgt: 0,
  }));

  // pointer-tilt frames
  const tilts = $$(".tilt").map(el => ({ el, rx: 0, ry: 0, trx: 0, try_: 0, hover: false }));

  /* scroll-progress effects:
       data-fx="assemble"  pieces fly in from data-from="x,y,rot" and lock into place
       data-fx="focus"     blurred + dim, sharpening as it rises into view
       data-fx="spin"      rotates continuously with page scroll
     Progress runs 0 → 1 as the element crosses the lower half of the viewport. */
  const fx = $$("[data-fx]").map(el => {
    const f = (el.dataset.from || "0,0,0").split(",").map(Number);
    return {
      el, type: el.dataset.fx,
      fx: f[0] || 0, fy: f[1] || 0, fr: f[2] || 0,
      blur: parseFloat(el.dataset.blur || "12"),
      spin: parseFloat(el.dataset.spin || "0.06"),
      cur: 0,
    };
  });

  let vh = window.innerHeight;
  let wide = window.innerWidth >= 760;
  let lastY = window.scrollY || 0;
  let vel = 0;              // damped scroll velocity
  let running = false;
  let idleFrames = 0;

  function wake() {
    idleFrames = 0;
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  function loop() {
    const y = window.scrollY || window.pageYOffset;

    const dy = clamp(y - lastY, -90, 90);
    lastY = y;
    vel += (dy - vel) * 0.18;
    if (Math.abs(vel) < 0.02) vel = 0;
    const skew = reduced ? 0 : clamp(vel * 0.03, -2.2, 2.2);

    let moving = Math.abs(vel) > 0.05;

    /* ============ READ PHASE ============
       Every layout read happens here, before any style write. Mixing the two
       forces a synchronous reflow per element and collapses the frame rate. */
    const docH = document.documentElement.scrollHeight;
    const atBottom = (docH - vh - y) <= 2;

    let heroP = 0;
    if (!reduced && heroInner && hero) {
      const hb = hero.getBoundingClientRect();
      heroP = clamp(-hb.top / Math.max(1, hb.height * 0.85), 0, 1);
    }

    if (!reduced && wide) {
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        it._top = r.top - it.cur;               // strip the transform we applied
        it._h = r.height;
        it._skip = (r.bottom < -320 || it._top > vh + 320);
      }
    }

    if (!reduced) {
      for (const f of fx) {
        const r = f.el.getBoundingClientRect();
        f._top = r.top;
        f._past = r.bottom < -400;
        f._skip = r.top > vh + 400;
      }
    }

    let tlP = -1;
    if (!reduced && tl && tlFill) {
      const r = tl.getBoundingClientRect();
      tlP = clamp((vh * 0.72 - r.top) / r.height, 0, 1);
    }

    let current = "";
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= vh * 0.35 && r.bottom >= vh * 0.35) { current = s.id; break; }
    }

    /* ============ WRITE PHASE ============ */
    if (nav) nav.classList.toggle("stuck", y > 20);
    if (bar) {
      const max = docH - vh;
      bar.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0) + "%";
    }

    if (!reduced) {
      if (heroInner) {
        heroInner.style.transform = `translate3d(0, ${(heroP * -90).toFixed(1)}px, 0)`;
        heroInner.style.opacity = String(1 - heroP * 0.9);
      }

      if (wide) {
        for (const it of items) {
          if (it._skip) continue;
          const mid = it._top + it._h / 2 - vh / 2;
          it.tgt = -mid * it.k;
          const d = it.tgt - it.cur;
          it.cur += d * 0.11;
          if (Math.abs(d) > 0.08) moving = true;

          let tf = `translate3d(0, ${it.cur.toFixed(2)}px, 0)`;
          if (it.sc) {
            const prog = clamp(Math.abs(mid) / (vh * 0.9), 0, 1);
            tf += ` scale(${(1 + it.sc * (1 - prog)).toFixed(4)})`;
          }
          if (it.skews && skew) tf += ` skewY(${skew.toFixed(2)}deg)`;
          it.el.style.transform = tf;
        }
      }

      for (const f of fx) {
        if (f.type === "spin") {
          if (!f._skip && !f._past) f.el.style.transform = `rotate(${(y * f.spin).toFixed(2)}deg)`;
          continue;
        }
        if (f._past) {                           // scrolled past → force settled
          if (f.cur < 0.999) {
            f.cur = 1;
            f.el.style.transform = "none";
            f.el.style.filter = "none";
            f.el.style.opacity = "1";
          }
          continue;
        }
        if (f._skip) continue;

        // finishes while the element is still low in the viewport, so items near the
        // end of the page (which can never scroll higher) still complete
        const prog = (atBottom && f._top < vh)
          ? 1
          : clamp((vh * 0.98 - f._top) / (vh * 0.36), 0, 1);
        const e = 1 - Math.pow(1 - prog, 3);
        const d = e - f.cur;
        f.cur += d * 0.14;
        if (Math.abs(d) > 0.002) moving = true;
        if (e > 0.999 && f.cur > 0.97) f.cur = 1;         // snap shut
        const k = 1 - f.cur;

        if (f.type === "assemble") {
          f.el.style.transform =
            `translate3d(${(f.fx * k).toFixed(1)}px, ${(f.fy * k).toFixed(1)}px, 0) ` +
            `rotate(${(f.fr * k).toFixed(2)}deg) scale(${(1 - k * 0.06).toFixed(4)})`;
          f.el.style.opacity = String(clamp(0.1 + f.cur * 1.2, 0, 1));
        } else {
          const bl = k * f.blur;
          f.el.style.filter = bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : "none";
          f.el.style.opacity = String(clamp(0.25 + f.cur * 0.85, 0, 1));
          f.el.style.transform = k > 0.002 ? `translate3d(0, ${(k * 26).toFixed(1)}px, 0)` : "none";
        }
      }

      if (tlP >= 0) tlFill.style.height = (tlP * 100) + "%";

      if (wide && fine) {
        for (const t of tilts) {
          const dx = t.trx - t.rx, dy2 = t.try_ - t.ry;
          t.rx += dx * 0.12; t.ry += dy2 * 0.12;
          if (Math.abs(dx) > 0.02 || Math.abs(dy2) > 0.02) moving = true;
          t.el.style.transform =
            `perspective(1100px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg)`;
        }
      }
    }

    navLinks.forEach((a, id) => a.classList.toggle("active", id === current));

    idleFrames = moving ? 0 : idleFrames + 1;
    if (idleFrames > 45) { running = false; return; }
    requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", () => {
    vh = window.innerHeight;
    const w = window.innerWidth >= 760;
    if (w !== wide) {
      wide = w;
      if (!wide) {
        items.forEach(it => { it.el.style.transform = ""; it.cur = 0; it.tgt = 0; });
        tilts.forEach(t => { t.el.style.transform = ""; t.rx = t.ry = t.trx = t.try_ = 0; });
        fx.forEach(f => { f.el.style.transform = ""; f.el.style.filter = ""; f.el.style.opacity = ""; f.cur = 1; });
      }
    }
    wake();
  }, { passive: true });

  /* ---------------------------------------------- pointer tilt input */
  if (!reduced && fine) {
    // one document-level listener: avoids pointerleave edge cases around
    // absolutely-positioned children that overflow their frame
    document.addEventListener("pointermove", (e) => {
      if (!wide) return;
      for (const t of tilts) {
        const r = t.el.getBoundingClientRect();
        if (r.bottom < -40 || r.top > vh + 40) { t.trx = 0; t.try_ = 0; continue; }
        const inside = e.clientX >= r.left && e.clientX <= r.right &&
                       e.clientY >= r.top && e.clientY <= r.bottom;
        if (inside) {
          t.try_ = ((e.clientX - r.left) / r.width - 0.5) * 9;    // rotateY
          t.trx = -((e.clientY - r.top) / r.height - 0.5) * 7;    // rotateX
        } else { t.trx = 0; t.try_ = 0; }
      }
      wake();
    }, { passive: true });

    // hero core follows the cursor, gently
    const core = $(".core");
    if (core && hero) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        core.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 30).toFixed(1) + "px");
        core.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 30).toFixed(1) + "px");
      }, { passive: true });
    }
  }

  /* ---------------------------------------------- starfield */
  const cv = $("#stars");
  if (cv && !reduced) {
    const ctx = cv.getContext("2d", { alpha: true });
    let stars = [], dpr = 1, w = 0, h = 0;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(170, (w * h) / 9500));
      const palette = ["#ffffff", "#22e8ff", "#8b5cff", "#9fb3c8"];
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.35 + 0.35,
        d: Math.random() * 0.8 + 0.2,
        a: Math.random() * 0.5 + 0.2,
        s: Math.random() * 0.9 + 0.25,
        c: palette[(Math.random() * palette.length) | 0],
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const y = window.scrollY || 0;
      for (const st of stars) {
        let py = (st.y - y * st.d * 0.25) % h;
        if (py < 0) py += h;
        const tw = st.a + Math.sin(t * 0.001 * st.s + st.x) * 0.25;
        ctx.globalAlpha = clamp(tw, 0.05, 1);
        ctx.fillStyle = st.c;
        ctx.beginPath();
        ctx.arc(st.x, py, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    build();
    requestAnimationFrame(draw);
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 180); }, { passive: true });
  }

  // belt and braces: if the engine is disabled, make sure nothing stays hidden
  if (reduced) fx.forEach(f => {
    f.el.style.transform = "none"; f.el.style.filter = "none"; f.el.style.opacity = "1"; f.cur = 1;
  });

  wake();
})();
