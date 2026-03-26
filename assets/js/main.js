/* ============================================================
   DAVIDALVAREZP.COM — MAIN JAVASCRIPT
   Theme · Nav · Typewriter · Scroll Animations · Skill Bars
   ============================================================ */

'use strict';

/* ============================================================
   THEME MANAGER
   ============================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'dap-theme';
  const DEFAULT    = 'dark';

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || DEFAULT;
    apply(current === 'dark' ? 'light' : 'dark');
  };

  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    apply(saved || preferred);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, apply, toggle };
})();

/* ============================================================
   NAVIGATION
   ============================================================ */

const Nav = (() => {
  const init = () => {
    const burger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile');

    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        const open = burger.classList.toggle('open');
        mobileMenu.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
      });

      document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
        }
      });

      mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }

    setActiveLink();
  };

  const setActiveLink = () => {
    const path = window.location.pathname;
    document.querySelectorAll('.navbar__link').forEach(link => {
      const href = link.getAttribute('href');
      const isActive =
        (href === '/' && (path === '/' || path === '/index.html')) ||
        (href !== '/' && path.startsWith(href));
      link.classList.toggle('active', isActive);
    });
  };

  return { init };
})();

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */

const Typewriter = (() => {
  const PHRASES = [
    'Systems Administrator',
    'Cybersecurity Specialist',
    'Developer',
    'Linux Enjoyer :)',
    'Containers · Virtualization',
    'Making things work without anyone noticing.',
  ];

  const SPEED_TYPE   = 55;
  const SPEED_DELETE = 28;
  const PAUSE_END    = 2200;
  const PAUSE_START  = 380;

  let el, phraseIdx = 0, charIdx = 0, deleting = false, timer;

  const tick = () => {
    const phrase = PHRASES[phraseIdx];

    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = phrase.substring(0, charIdx);

    let delay = deleting ? SPEED_DELETE : SPEED_TYPE;

    if (!deleting && charIdx === phrase.length) {
      delay = PAUSE_END;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      delay = PAUSE_START;
    }

    timer = setTimeout(tick, delay);
  };

  const init = (selector = '#typewriter') => {
    el = document.querySelector(selector);
    if (!el) return;
    clearTimeout(timer);
    tick();
  };

  return { init };
})();

/* ============================================================
   TERMINAL ANIMATION (hero fake terminal)
   ============================================================ */

const Terminal = (() => {
  const LINES = [
    { delay: 0,    cls: 't-prompt', text: 'david@server:~$ ' },
    { delay: 0,    cls: 't-cmd',    text: 'whoami', newline: true },
    { delay: 600,  cls: 't-output', text: 'david.alvarez — SysAdmin & CyberSec Specialist', newline: true },
    { delay: 900,  cls: 't-blank',  text: '' },
    { delay: 1000, cls: 't-prompt', text: 'david@server:~$ ' },
    { delay: 1000, cls: 't-cmd',    text: 'uname -r', newline: true },
    { delay: 1700, cls: 't-output', text: '6.6.0-1-amd64 #1 SMP x86_64', newline: true },
    { delay: 2000, cls: 't-blank',  text: '' },
    { delay: 2100, cls: 't-prompt', text: 'david@server:~$ ' },
    { delay: 2100, cls: 't-cmd',    text: 'cat skills.conf', newline: true },
    { delay: 2800, cls: 't-comment',text: '# skill proficiency matrix', newline: true },
    { delay: 3000, cls: 't-highlight', text: '[sysadmin]    ', inline: true },
    { delay: 3000, cls: 't-ok',     text: '  100%', newline: true },
    { delay: 3150, cls: 't-highlight', text: '[cybersec]    ', inline: true },
    { delay: 3150, cls: 't-info',   text: '  60%', newline: true },
    { delay: 3300, cls: 't-highlight', text: '[networking]  ', inline: true },
    { delay: 3300, cls: 't-ok',     text: '  80%', newline: true },
    { delay: 3450, cls: 't-highlight', text: '[web-dev]     ', inline: true },
    { delay: 3450, cls: 't-info',   text: '  50%', newline: true },
    { delay: 3750, cls: 't-blank',  text: '' },
    { delay: 3850, cls: 't-prompt', text: 'david@server:~$ ' },
    { delay: 3850, cls: 't-cmd',    text: './websec-audit.sh --open target', newline: true },
    { delay: 5050, cls: 't-ok',     text: '[✓] Security audit complete', newline: true },
    { delay: 5300, cls: 't-blank',  text: '' },
    { delay: 5400, cls: 't-prompt', text: 'david@server:~$ ', blink: true },
  ];

  const init = (containerId = 'terminal-body') => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentLine = null;

    LINES.forEach(({ delay, cls, text, newline, inline, blink }) => {
      setTimeout(() => {
        if (!inline && newline !== false && cls !== 't-blank') {
          if (currentLine) container.appendChild(currentLine);
          currentLine = null;
        }

        if (cls === 't-blank') {
          const br = document.createElement('span');
          br.className = 't-blank';
          container.appendChild(br);
          currentLine = null;
          return;
        }

        if (!currentLine && !inline) {
          currentLine = document.createElement('span');
          currentLine.className = 't-line';
        }

        if (inline && !currentLine) {
          currentLine = document.createElement('span');
          currentLine.className = 't-line';
        }

        const span = document.createElement('span');
        span.className = cls;
        span.textContent = text;

        if (blink) {
          const cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          currentLine.appendChild(span);
          currentLine.appendChild(cursor);
          container.appendChild(currentLine);
          currentLine = null;
          return;
        }

        currentLine.appendChild(span);

        if (newline) {
          container.appendChild(currentLine);
          currentLine = null;
        }
      }, delay);
    });
  };

  return { init };
})();

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */

const ScrollAnimations = (() => {
  const init = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in, .timeline-item').forEach(el => {
      observer.observe(el);
    });

    initSkillBars(observer);
  };

  const initSkillBars = () => {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
            const pct = fill.getAttribute('data-pct');
            if (pct) {
              requestAnimationFrame(() => {
                fill.style.width = pct + '%';
              });
            }
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-block').forEach(block => {
      barObserver.observe(block);
    });
  };

  return { init };
})();

/* ============================================================
   STATS COUNTER ANIMATION
   ============================================================ */

const CounterAnimation = (() => {
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const init = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => {
      observer.observe(el);
    });
  };

  return { init };
})();

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */

const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Nav.init();
  Typewriter.init('#typewriter');
  Terminal.init('terminal-body');
  ScrollAnimations.init();
  CounterAnimation.init();
  SmoothScroll.init();
});