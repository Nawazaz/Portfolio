/* ============================================================
   Nawaz Azim Pawaskar — portfolio interactions
   Parallax, scroll reveals, counters, starfield.
   All motion disables itself under prefers-reduced-motion.
   ============================================================ */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------------------------------------- year */
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
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    // stagger siblings a touch so groups cascade
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
      const e = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = fmt(Math.round(from + (to - from) * e)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counters = $$(".count");
  if ("IntersectionObserver" in window && !reduced) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        runCount(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  /* ---------------------------------------------- nav state + progress + parallax */
  const bar = $("#bar");
  const tlFill = $("#tlFill");
  const tl = $(".tl");
  const parallax = $$("[data-par]").map(el => ({ el, k: parseFloat(el.dataset.par) || 0 }));
  const sections = $$("main section[id]");
  const navLinks = new Map($$(".links a").map(a => [a.getAttribute("href").slice(1), a]));

  let ticking = false, vh = window.innerHeight;
  let wide = window.innerWidth >= 760;   // parallax only on larger screens

  function frame() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;

    // sticky nav
    if (nav) nav.classList.toggle("stuck", y > 20);

    // progress bar
    if (bar) {
      const max = document.documentElement.scrollHeight - vh;
      bar.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0) + "%";
    }

    if (!reduced && wide) {
      // parallax — only for elements near the viewport
      for (const { el, k } of parallax) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-mid * k).toFixed(2)}px, 0)`;
      }

    }

    if (!reduced) {
      // timeline fill
      if (tl && tlFill) {
        const r = tl.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / r.height));
        tlFill.style.height = (p * 100) + "%";
      }
    }

    // active nav link
    let current = "";
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= vh * 0.35 && r.bottom >= vh * 0.35) { current = s.id; break; }
    }
    navLinks.forEach((a, id) => a.classList.toggle("active", id === current));
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    vh = window.innerHeight;
    const w = window.innerWidth >= 760;
    if (w !== wide) {                       // leaving/entering parallax range: clear stale offsets
      wide = w;
      if (!wide) parallax.forEach(({ el }) => { el.style.transform = ""; });
    }
    onScroll();
  }, { passive: true });

  /* ---------------------------------------------- hero pointer parallax */
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    const core = $(".core"), hero = $(".hero");
    if (core && hero) {
      let raf = 0, tx = 0, ty = 0;
      hero.addEventListener("mousemove", (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 26;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 26;
        if (!raf) raf = requestAnimationFrame(() => {
          raf = 0;
          core.style.setProperty("--mx", tx.toFixed(1) + "px");
          core.style.setProperty("--my", ty.toFixed(1) + "px");
          core.style.marginLeft = tx.toFixed(1) + "px";
          core.style.marginTop = ty.toFixed(1) + "px";
        });
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
      const count = Math.round(Math.min(150, (w * h) / 11000));
      const palette = ["#ffffff", "#22e8ff", "#8b5cff", "#9fb3c8"];
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.35,
        d: Math.random() * 0.75 + 0.25,            // depth → parallax factor
        a: Math.random() * 0.5 + 0.2,
        s: Math.random() * 0.9 + 0.25,             // twinkle speed
        c: palette[(Math.random() * palette.length) | 0],
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const y = window.scrollY || 0;
      for (const st of stars) {
        // wrap vertically as the page scrolls — layered depth
        let py = (st.y - y * st.d * 0.22) % h;
        if (py < 0) py += h;
        const tw = st.a + Math.sin(t * 0.001 * st.s + st.x) * 0.25;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, tw));
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

  onScroll();
})();
