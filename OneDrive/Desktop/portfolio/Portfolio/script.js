/* ========================================
   PORTFOLIO — PLAIN JAVASCRIPT
   ======================================== */

// ──────────────── DATA ────────────────

const projects = [
  {
    id: 'crypto', title: 'Cryptocurrency Price Prediction Decision Support System',
    category: 'Predictive Modeling · NLP · Finance',
    tagline: 'Multi-modal pipeline combining price features with sentiment signals',
    accentColor: 'hsl(217 91% 60%)', highlight: '~62% Test Accuracy · Volatile Markets',
    problem: 'Cryptocurrency markets are characterized by high volatility and low signal-to-noise ratios, which makes conventional financial modeling unreliable. The objective was to evaluate whether combining quantitative price features with NLP-derived sentiment signals could produce a more informative Intelligent Decision Support System (IDSS) for short-term Bitcoin price movement prediction.',
    approach: `Built as part of the DV2643 course at Blekinge Institute of Technology, this IDSS targets next-minute Bitcoin price direction prediction by integrating two data streams: high-frequency market data (OHLCV at 1-minute intervals from Binance/Coinbase) and real-time sentiment scores derived from 49,000+ Bitcoin-related tweets processed through the VADER sentiment analyzer.

Feature engineering produced 23 custom variables — including lagged returns up to 5 minutes, rolling means and volatility windows (5/10/15 min), volume change rates, and time-aligned sentiment aggregates. A strict chronological train/validation/test split (65%/7%/28%) was enforced to eliminate look-ahead bias. Five classification models were evaluated: Logistic Regression, Linear SVM, RBF SVM, Random Forest, and Gradient Boosting. A configurable probability threshold system (default τ = 0.58) converts raw model probabilities into BUY/HOLD, SELL/AVOID, or DEFER/WAIT signals with confidence levels (Low / Moderate / High).`,
    results: `The best-performing model (Logistic Regression) reached ~62% test accuracy under highly volatile minute-level market conditions — a meaningful result given that financial markets at the 1-minute horizon approach random-walk behaviour. Random Forest achieved the highest validation accuracy at 64%, while Gradient Boosting showed the strongest recall, making it better suited for capturing upward price movements.

The sentiment layer provided measurable lift on high-volatility days. A comparison against a separate LSTM-based tweet sentiment system (95.78% accuracy on daily aggregated data, ~50,000 samples) confirmed that the performance gap is driven by task complexity and prediction horizon — not model quality. The DSS outputs directional predictions alongside confidence scores, model metrics, and current sentiment context, supporting transparent human-in-the-loop decision making.`,
    stack: ['Python', 'Scikit-learn', 'VADER', 'Logistic Regression', 'SVM', 'Random Forest', 'Gradient Boosting', 'Pandas', 'NumPy', 'Google Colab'],
    reportLink: 'assets/Crypto_DSS_Report.pdf',
  },
  {
    id: 'plant', title: 'AI-Based Plant Monitoring System',
    category: 'Computer Vision · IoT · Edge AI',
    tagline: 'Smart IoT system combining CNN disease detection with automated multi-plant irrigation',
    accentColor: 'hsl(265 80% 65%)', highlight: '14% → 92% Field Accuracy · 95% Validation Accuracy',
    problem: 'Keeping plants healthy is harder than it looks — 66% of households own at least one houseplant, yet the average owner has accidentally killed seven. The core challenges are inconsistent watering, missed disease symptoms, and the lack of affordable integrated monitoring tools. Existing IoT solutions typically address only a single factor (e.g. soil moisture alone) and do not scale to multiple plants or provide disease-level insights.',
    approach: 'This Bachelor\'s thesis (Kristianstad University, Spring 2025) built a fully integrated smart plant monitoring system on a Raspberry Pi 5, combining four sensor streams — soil moisture, temperature & humidity (DHT22), and light intensity (LDR) — with a USB camera feeding a CNN disease-detection model. Two CNN models were compared: Model 1 trained solely on 18,000 Kaggle tomato leaf images across 10 disease classes; Model 2 (Mixed Dataset) added 500 real system-captured images under variable indoor lighting. The CNN used five convolutional layers (32→64→128→256→512 filters), 3×3 kernels, ReLU activation, and 0.3 dropout, built with Keras/TensorFlow. On the irrigation side, each plant\'s moisture was monitored independently — when any sensor dropped below 60%, the system automatically triggered the water pump within 60 seconds. All data was streamed to Azure cloud and visualised via a Flask + Chart.js dashboard.',
    results: 'Model 1 (Kaggle only) achieved 95.57% validation accuracy but collapsed to 14% on 50 real-world test images — the uniform grey Kaggle backgrounds prevented generalisation. Model 2 (Mixed Dataset) maintained 94.96% validation accuracy (F1: 95.02%) while jumping to 92% on the real test set — 46/50 images correctly classified. This 78-percentage-point improvement confirmed that domain-specific training data matters more than dataset size. The automated irrigation system responded within 60 seconds to every dry-soil event during a week-long 3-plant experiment, restoring moisture from 49% to 73% per cycle. Sensor cross-validation (two sensors, same pot) showed only 2% variance, confirming measurement reliability.',
    stack: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Raspberry Pi 5', 'Flask', 'Azure IoT', 'Chart.js', 'DHT22', 'OpenCV', 'MQTT', 'Kaggle Dataset'],
    thesisLink: 'assets/FinalThesis-Charlton-Pawaskar.pdf',
    media: [
      { type: 'image', src: 'assets/plant-setup.jpg', caption: 'Experimental setup — Plant 1 with camera, Raspberry Pi & sensors' },
      { type: 'image', src: 'assets/plant-dashboard.jpg', caption: 'Web dashboard showing live soil moisture alert & sensor readings' },
      { type: 'image', src: 'assets/plant-leaves.jpg', caption: 'Healthy vs. diseased tomato leaves used for CNN testing' },
      { type: 'image', src: 'assets/plant-results.jpg', caption: 'CNN training accuracy curves — Kaggle only vs. Mixed Dataset model' },
    ],
  },
  {
    id: 'wellness', title: 'Wellness Bridge — Mental Health Application',
    category: 'Full-Stack · Hardware Integration · Agile Development',
    tagline: 'A cross-platform mental wellness app bridging digital software with physical Arduino hardware',
    accentColor: 'hsl(190 90% 55%)', highlight: 'Software + Hardware Integration · Agile / Scrum',
    problem: 'In today\'s fast-paced world, mental health challenges like stress and anxiety are increasingly common, yet most wellness apps remain entirely screen-bound. They offer generic content without personalisation, no physical presence cues, and no way to blend digital reminders with the real environment. Existing tools also rarely combine mood tracking, curated content, and configurable hardware notifications in a single integrated platform.',
    approach: 'Built as a 4-week Agile (Scrum) project at Kristianstad University (Autumn 2024) by a team of five. The application was developed in Python using the Kivy framework with an SQLite database for user accounts and mood tracking data. Six core modules were designed and implemented: a Sign-In / Registration page connected to SQLite, a Home Page with mood input and graph display, a Motivational Quotes screen pulling quotes from a REST API, a Podcast player connected to a speaker, a scrollable Book Library, and a Reminder system with user-configurable alarms.\n\nThe standout engineering element was the Arduino Uno (ATMega 328p) hardware integration: motivational quotes fetched by the app are simultaneously pushed to a physical LCD display, refreshing every 20–30 seconds — bridging the digital app with a tangible in-room presence. The project followed a full Agile workflow with daily stand-ups, Jira sprint tracking, GitHub version control, and weekly progress reviews with the course supervisor.',
    results: 'All core requirements passed automated and manual testing across main.py, home.py, signin.py, library.py, and database.py test suites — including page navigation, valid/invalid login handling, correct widget rendering, book URL retrieval, logout, and database integrity. The reminder alarm system, motivational quote rotation, podcast playback, and LCD hardware sync were all demonstrated live in the final week review. The primary engineering challenge was the Kivy framework itself — its limited platform features, sparse error messages, and the Figma-to-code translation required significant workarounds, but these obstacles became valuable learning experiences in adapting to constrained development environments and delivering under a fixed sprint timeline.',
    stack: ['Python', 'Kivy', 'SQLite', 'Arduino Uno', 'ATMega 328p', 'LCD Display', 'REST APIs', 'Figma', 'Jira', 'GitHub', 'Scrum'],
    reportLink: 'assets/Wellnessbridge.pdf',
    media: [
      { type: 'image', src: 'assets/wellness-signin.jpg', caption: 'Sign-in & account creation screen' },
      { type: 'image', src: 'assets/wellness-home.jpg', caption: 'Home page with mood tracker and feature navigation' },
      { type: 'image', src: 'assets/wellness-lcd.jpg', caption: 'Arduino LCD display showing live motivational quote from the app' },
      { type: 'image', src: 'assets/wellness-library.jpg', caption: 'Library screen — scrollable books for mental wellness' },
    ],
  },
  {
    id: 'maps', title: 'Android Maps Application',
    category: 'Mobile Development · Performance Engineering',
    tagline: 'Lifecycle-aware map rendering optimized for Android stability',
    accentColor: 'hsl(217 91% 60%)', highlight: 'Stability & Performance Optimized',
    problem: 'The application exhibited recurring stability failures under memory pressure and inconsistent map tile rendering, particularly during active navigation.',
    approach: 'Performance profiling identified two root causes: aggressive map layer instantiation without lifecycle awareness, and tile caching strategies mismatched to typical usage patterns.',
    results: 'Application stability improved measurably with reduced crash rate and faster cold-start tile rendering. The codebase handles network degradation and orientation changes without state loss.',
    stack: ['Kotlin', 'Android SDK', 'Google Maps API', 'Jetpack Compose', 'Coroutines', 'Room DB'],
  },
];

const techStack = [
  { category: 'Programming Languages', items: [{name:'Python',icon:'🐍'},{name:'Java',icon:'☕'},{name:'C++',icon:'⚙️'},{name:'C',icon:'🔩'},{name:'Kotlin',icon:'📱'},{name:'JavaScript',icon:'⚡'}] },
  { category: 'ML & Data', items: [{name:'NumPy',icon:'🔢'},{name:'Pandas',icon:'🐼'},{name:'Scikit-learn',icon:'📊'},{name:'TensorFlow',icon:'🧠'},{name:'Keras',icon:'🔬'}] },
  { category: 'Frameworks & APIs', items: [{name:'Android',icon:'📲'},{name:'Jetpack Compose',icon:'🎨'},{name:'Flask',icon:'🌐'},{name:'REST APIs',icon:'🔗'}] },
  { category: 'Cloud & Data Infra', items: [{name:'Azure',icon:'☁️'},{name:'SQL',icon:'🗄️'},{name:'NoSQL',icon:'📦'},{name:'MySQL',icon:'🐬'},{name:'Power BI',icon:'📈'}] },
  { category: 'IoT & Hardware', items: [{name:'Arduino',icon:'🔌'},{name:'Raspberry Pi',icon:'🍓'},{name:'Azure IoT Services',icon:'📡'}] },
];

const educationItems = [
  { degree: 'MSc Artificial Intelligence & Machine Learning', institution: 'Blekinge Institute of Technology (BTH)', location: 'Karlskrona, Sweden', period: 'Expected 2027', tag: 'AI Specialization', description: 'Focused on deepening theoretical foundations in machine learning, statistical modeling, and system evaluation.', accentColor: 'hsl(217 91% 60%)', status: 'ongoing' },
  { degree: 'BSc Computer Science Engineering — IoT', institution: 'Kristianstad University', location: 'Kristianstad, Sweden', period: 'Graduated 2025', tag: 'IoT & Systems', description: "Bachelor's degree with focus on embedded systems, Internet of Things, and software engineering.", accentColor: 'hsl(217 70% 60%)', status: 'completed' },
  { degree: 'H.S.C Grade XII — Major in Computer Science', institution: 'S.S.H.J.C Junior College', location: 'Navi Mumbai, India', period: 'May 2020 – Aug 2021', tag: 'Secondary Education', description: 'Higher Secondary Certificate with a major in Computer Science.', accentColor: 'hsl(245 80% 65%)', status: 'completed' },
];

// ──────────────── THEME ────────────────

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  document.documentElement.classList.toggle('light');
});

// ──────────────── NAVIGATION ────────────────

const nav = document.getElementById('main-nav');
const navProgress = document.getElementById('nav-progress');
const backToTop = document.getElementById('back-to-top');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  navProgress.style.width = h > 0 ? (y / h * 100) + '%' : '0%';
  nav.classList.toggle('scrolled', y > 24);
  backToTop.classList.toggle('visible', y > 500);

  // Active section
  const sections = ['about','projects','experience','stack','education','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) { const r = el.getBoundingClientRect(); if (r.top <= 110 && r.bottom >= 110) current = id; }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    // Close mobile drawer
    document.getElementById('mobile-drawer').classList.remove('open');
    document.getElementById('mobile-overlay').classList.remove('open');
  });
});

// Mobile drawer
const menuBtn = document.getElementById('mobile-menu-btn');
const drawer = document.getElementById('mobile-drawer');
const overlay = document.getElementById('mobile-overlay');
const drawerClose = document.getElementById('drawer-close');
menuBtn.addEventListener('click', () => { drawer.classList.add('open'); overlay.classList.add('open'); });
drawerClose.addEventListener('click', () => { drawer.classList.remove('open'); overlay.classList.remove('open'); });
overlay.addEventListener('click', () => { drawer.classList.remove('open'); overlay.classList.remove('open'); });

// ──────────────── TYPING ANIMATION ────────────────

const typingWords = ['IoT Engineering', 'Computer Vision', 'Applied ML', 'Embedded Systems', 'MSc AI & ML'];
const typingEl = document.getElementById('typing-text');
let wordIdx = 0, charIdx = 0, isDeleting = false, isPaused = false;

function typeLoop() {
  if (isPaused) return;
  const word = typingWords[wordIdx];
  const speed = isDeleting ? 45 : 85;

  if (!isDeleting) {
    charIdx++;
    typingEl.textContent = word.slice(0, charIdx);
    if (charIdx === word.length) {
      isPaused = true;
      setTimeout(() => { isPaused = false; isDeleting = true; typeLoop(); }, 2000);
      return;
    }
  } else {
    charIdx--;
    typingEl.textContent = word.slice(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % typingWords.length;
    }
  }
  setTimeout(typeLoop, speed);
}
typeLoop();

// ──────────────── NEURAL CANVAS ────────────────

(function() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const NODE_COUNT = 72, MAX_DIST = 160, MOUSE_RADIUS = 200, MOUSE_FORCE = 0.018;
  let mx = -9999, my = -9999, nodes = [];

  function init() {
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.42, vy: (Math.random() - 0.5) * 0.42,
      radius: Math.random() * 1.8 + 1.2, isViolet: Math.random() > 0.62,
      baseOpacity: Math.random() * 0.3 + 0.65,
    }));
  }
  init();
  new ResizeObserver(init).observe(canvas);

  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MOUSE_RADIUS && dist > 1) { const s = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE; n.vx += (dx/dist)*s; n.vy += (dy/dist)*s; }
      n.vx *= 0.974; n.vy *= 0.974; n.x += n.vx; n.y += n.vy;
      if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); } if (n.x > W) { n.x = W; n.vx = -Math.abs(n.vx); }
      if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); } if (n.y > H) { n.y = H; n.vy = -Math.abs(n.vy); }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ex = nodes[i].x - nodes[j].x, ey = nodes[i].y - nodes[j].y, d = Math.sqrt(ex*ex + ey*ey);
        if (d < MAX_DIST) {
          const baseAlpha = (1 - d/MAX_DIST) * 0.55;
          const midX = (nodes[i].x + nodes[j].x)/2, midY = (nodes[i].y + nodes[j].y)/2;
          const mDist = Math.sqrt((mx-midX)**2 + (my-midY)**2);
          const boost = mDist < MOUSE_RADIUS ? (1 - mDist/MOUSE_RADIUS) * 0.6 : 0;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = (nodes[i].isViolet || nodes[j].isViolet) ? `rgba(170,100,255,${Math.min(baseAlpha+boost,.95)})` : `rgba(80,165,255,${Math.min(baseAlpha+boost,.95)})`;
          ctx.lineWidth = 0.85; ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      const dx = mx-n.x, dy = my-n.y, dist = Math.sqrt(dx*dx+dy*dy);
      const prox = dist < MOUSE_RADIUS ? 1 - dist/MOUSE_RADIUS : 0;
      const opacity = Math.min(n.baseOpacity + prox*0.35, 1);
      const color = n.isViolet ? `rgba(185,120,255,${opacity})` : `rgba(100,180,255,${opacity})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius + prox*2.2, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ──────────────── SCROLL REVEAL ────────────────

function setupReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
}
// Run on load and after dynamic content
setTimeout(setupReveal, 100);

// ──────────────── COUNTER ANIMATION ────────────────

function animateCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      entry.target.dataset.animated = '1';
      const end = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix;
      const valEl = entry.target.querySelector('.metric-value');
      const start = Date.now(), duration = 2200;
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(end * eased);
        valEl.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else valEl.textContent = end.toLocaleString() + suffix;
      };
      tick();
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.metric-card').forEach(el => observer.observe(el));
}
animateCounters();

// ──────────────── RENDER PROJECTS ────────────────

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card reveal" style="transition-delay:${i*100}ms">
      <div class="project-accent" style="background:linear-gradient(90deg,${p.accentColor},transparent 80%)"></div>
      <div class="project-inner">
        <p class="project-cat">${p.category}</p>
        <h3 class="project-title">${p.title}</h3>
        <span class="project-highlight" style="background:${p.accentColor}18;border-color:${p.accentColor}45;color:${p.accentColor}">${p.highlight}</span>
        <p class="project-tagline">${p.tagline}</p>
        <p class="project-problem-label">Problem</p>
        <p class="project-problem">${p.problem}</p>
        <button class="project-toggle" onclick="toggleProject(this)">▼ Read Case Study</button>
      </div>
      <div class="project-detail" id="detail-${p.id}">
        <p class="project-detail-label">Technical Approach</p>
        <p class="project-detail-text">${p.approach}</p>
        <p class="project-detail-label">Results & Impact</p>
        <p class="project-detail-text">${p.results}</p>
        <p class="project-detail-label">Stack</p>
        <div class="project-stack">${p.stack.map(t => `<span>${t}</span>`).join('')}</div>
        ${p.media && p.media.length ? `
        <p class="project-detail-label" style="margin-top:1.5rem">Photos</p>
        <div class="project-media-grid">
          ${p.media.map(m => `
            <div class="project-media-item" onclick="openLightbox('${m.src}', '${m.caption.replace(/'/g, '&#39;')}')">
              <img src="${m.src}" alt="${m.caption}" class="project-media-img" loading="lazy" onerror="this.closest('.project-media-item').style.display='none'">
              <p class="project-media-caption">${m.caption}</p>
            </div>`
          ).join('')}
        </div>` : ''}
        <div class="project-action-btns">
          ${p.thesisLink ? `<a href="${p.thesisLink}" download class="project-report-btn">⬇ Download Thesis</a>` : ''}
          ${p.reportLink ? `<a href="${p.reportLink}" download class="project-report-btn">⬇ Download Full Report</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
  setupReveal();
}

function toggleProject(btn) {
  const detail = btn.closest('.project-card').querySelector('.project-detail');
  const isOpen = detail.classList.toggle('open');
  btn.innerHTML = isOpen ? '▲ Show Less' : '▼ Read Case Study';
}

// ──────────────── LIGHTBOX ────────────────

function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

renderProjects();

// ──────────────── RENDER TECH STACK ────────────────

function renderStack() {
  const container = document.getElementById('stack-categories');
  container.innerHTML = techStack.map((cat, i) => `
    <div class="stack-category reveal" style="transition-delay:${i*80}ms">
      <p class="stack-category-label">${cat.category}</p>
      <div class="stack-items">
        ${cat.items.map(t => `<div class="stack-item"><span class="emoji">${t.icon}</span><span>${t.name}</span></div>`).join('')}
      </div>
    </div>
  `).join('');
  setupReveal();
}
renderStack();

// ──────────────── RENDER EDUCATION ────────────────

function renderEducation() {
  const container = document.getElementById('edu-timeline');
  container.innerHTML = educationItems.map((item, i) => `
    <div class="edu-card reveal ${i === 0 ? 'open' : ''}" style="transition-delay:${i*100}ms" onclick="this.classList.toggle('open')">
      <div class="edu-accent" style="background:linear-gradient(90deg,${item.accentColor},${item.accentColor}30,transparent);opacity:${i===0?1:.45}"></div>
      <div class="edu-head">
        <div class="edu-icon" style="background:${item.accentColor}12;border-color:${item.accentColor}30;color:${item.accentColor}">🎓</div>
        <div class="edu-info">
          <span class="edu-tag" style="background:${item.accentColor}12;border-color:${item.accentColor}30;color:${item.accentColor}">${item.tag}</span>
          ${item.status === 'ongoing' ? '<span class="edu-ongoing"><span class="pulse-dot"></span>In Progress</span>' : ''}
          <p class="edu-degree">${item.degree}</p>
          <p class="edu-institution" style="color:${item.accentColor}">${item.institution}</p>
        </div>
        <span class="edu-chevron">▼</span>
      </div>
      <div class="edu-meta">
        <span>📅 ${item.period}</span>
        <span>📍 ${item.location}</span>
      </div>
      <div class="edu-body">
        <div class="edu-body-inner">${item.description}</div>
      </div>
    </div>
  `).join('');
  setupReveal();
}
renderEducation();

// ──────────────── EXPERIENCE TOGGLE ────────────────

function toggleExpMore() {
  const el = document.getElementById('exp-more');
  const btn = el.parentElement.querySelector('.read-more-btn');
  const isOpen = el.classList.toggle('open');
  btn.textContent = isOpen ? 'Show less ↑' : 'Read more →';
}

// ──────────────── CONTACT FORM ────────────────

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  form.style.display = 'none';
  document.getElementById('form-success').classList.add('show');
  setTimeout(() => {
    form.style.display = '';
    document.getElementById('form-success').classList.remove('show');
    form.reset();
  }, 3500);
});