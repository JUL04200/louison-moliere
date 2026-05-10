// ===== LOADER =====
window.addEventListener('load', () => {
  const loader     = document.getElementById('loader');
  const louison    = document.getElementById('charLouison');
  const moliere    = document.getElementById('charMoliere');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const welcomeTxt = document.getElementById('welcomeText');

  const bienvenue = "Bienvenue à vous, Mme Assouline…";

  // 1. Personnages apparaissent (CSS à 1.2s)

  // 2. Ils tirent
  setTimeout(() => {
    louison.classList.add('pulling');
    moliere.classList.add('pulling');
  }, 2200);

  // 3. Rideaux s'ouvrent
  setTimeout(() => {
    loader.classList.add('open');
  }, 2800);

  // 4. Message de bienvenue avec effet machine à écrire
  setTimeout(() => {
    welcomeMsg.classList.add('visible');
    let i = 0;
    welcomeTxt.innerHTML = '<span class="welcome-cursor"></span>';
    const cursor = welcomeTxt.querySelector('.welcome-cursor');
    const iv = setInterval(() => {
      welcomeTxt.textContent = bienvenue.substring(0, i + 1);
      welcomeTxt.appendChild(cursor);
      i++;
      if (i >= bienvenue.length) clearInterval(iv);
    }, 60);
  }, 4000);

  // 5. Fade out
  setTimeout(() => {
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
  }, 6200);

  // 6. Révèle le site
  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 7000);
});


// ===== NAVBAR SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger effect for grid items
      const delay = entry.target.closest('.perso-grid, .themes-grid, .timeline')
        ? Array.from(entry.target.parentElement?.children || []).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// ===== CARD FLIP =====
document.querySelectorAll('.perso-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 120;
const particles = [];

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.fadeSpeed = Math.random() * 0.003 + 0.001;
    this.growing = true;
    this.maxOpacity = this.opacity;
    // Randomly gold or white
    this.gold = Math.random() < 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.growing) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= this.maxOpacity) this.growing = false;
    } else {
      this.opacity -= this.fadeSpeed * 0.5;
    }
    if (this.y < -10 || this.opacity <= 0) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.gold ? '#c9a84c' : '#ffffff';
    ctx.shadowBlur = this.gold ? 6 : 3;
    ctx.shadowColor = this.gold ? '#c9a84c' : '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

let mouseInfluenceX = 0, mouseInfluenceY = 0;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseInfluenceX = (e.clientX - rect.left - canvas.width / 2) / canvas.width;
  mouseInfluenceY = (e.clientY - rect.top - canvas.height / 2) / canvas.height;
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    // Subtle mouse influence
    p.x += mouseInfluenceX * 0.3;
    p.y += mouseInfluenceY * 0.1;
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== HERO PARALLAX =====
const heroBgText = document.querySelector('.hero-bg-text');
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroBgText) heroBgText.style.transform = `translateY(${scrolled * 0.4}px)`;
  if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
});

// ===== SMOOTH NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== BOOK 3D MOUSE TILT =====
const book = document.querySelector('.book-3d');
if (book) {
  book.addEventListener('mousemove', e => {
    const rect = book.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = (e.clientY - cy) / 15;
    const ry = (cx - e.clientX) / 15;
    book.style.transform = `rotateX(${rx}deg) rotateY(${ry - 10}deg) scale(1.05)`;
  });
  book.addEventListener('mouseleave', () => {
    book.style.transform = 'rotateY(-20deg) rotateX(5deg)';
  });
}

// ===== TYPING EFFECT on hero subtitle =====
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const text = heroSub.textContent;
  heroSub.textContent = '';
  heroSub.style.opacity = '1';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroSub.innerHTML = text.substring(0, i + 1).replace('\n', '<br>');
      i++;
      setTimeout(type, 25);
    }
  };
  // Start typing after loader
  setTimeout(type, 2200);
}

// ===== COUNTER ANIMATION (timeline dots) =====
const timelineDots = document.querySelectorAll('.timeline-dot');
const dotObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'none';
      entry.target.style.boxShadow = '0 0 30px rgba(201,168,76,0.6)';
      setTimeout(() => {
        entry.target.style.boxShadow = '0 0 20px rgba(201,168,76,0.3)';
      }, 600);
    }
  });
}, { threshold: 0.5 });
timelineDots.forEach(dot => dotObserver.observe(dot));

console.log('%c🎭 Louison & Monsieur Molière', 'font-size:20px; color:#c9a84c; font-family:Georgia,serif;');
console.log('%cGroupe Duras · Mme Assouline · 6e', 'font-size:12px; color:#888;');
