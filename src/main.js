document.addEventListener('DOMContentLoaded', () => {
  // ====== Mobile menu ======
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menu = document.querySelector('[data-menu]');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  let pauseSpyUntil = 0;
  let lockedId = null;

  function startScrollLock() {
    document.documentElement.classList.add('is-scrolling');

    clearTimeout(window.__scrollSpyTimer);
    window.__scrollSpyTimer = setTimeout(() => {
      document.documentElement.classList.remove('is-scrolling');
    }, 400);
  }

  function openMenu() {
    if (!menu) return;
    menu.classList.add('is-open');
    document.body.classList.add('no-scroll');
    openBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    openBtn?.setAttribute('aria-expanded', 'false');
  }

  if (openBtn && closeBtn && menu) {
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const id = href.slice(1);

      lockedId = id;
      setActive(id);

      startScrollLock();
      pauseSpyUntil = Date.now() + 1200;
    });
  });

  // ====== Scroll Spy ======
  if (!navLinks.length) {
    console.warn('ScrollSpy: .nav-link not found');
    return;
  }

  // Build list of section ids from nav links
  const ids = [...navLinks]
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.startsWith('#'))
    .map(href => href.slice(1));

  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  console.log('ScrollSpy ids:', ids);
  console.log(
    'ScrollSpy sections found:',
    sections.map(s => s.id)
  );

  if (!sections.length) {
    console.warn(
      "ScrollSpy: No sections found. Add matching id's in your partials (about, lessons, teachers, reviews, contact)."
    );
    return;
  }

  function setActive(id) {
    navLinks.forEach(l => {
      if (l.getAttribute('href') === `#${id}`) {
        l.classList.add('current');
      } else {
        l.classList.remove('current');
      }
    });
  }

  // Pick active section based on scroll position
  const header = document.querySelector('.header');
  const headerOffset = header ? header.offsetHeight : 0;
  
  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function onScroll() {
    if (lockedId) {
      const el = document.getElementById(lockedId);
      if (el) {
        const y = window.scrollY + headerOffset + 2;

        if (y >= el.offsetTop) {
          lockedId = null;
        } else {
          return; 
        }
      } else {
        lockedId = null;
      }
    }

    if (Date.now() < pauseSpyUntil) return;
    const scrollY = window.scrollY + window.innerHeight / 2;

    const pageBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;

    // If we are at the bottom → activate last section (Contact)
    if (pageBottom) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    let currentId = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    }
    setActive(currentId);
  }

  window.addEventListener('scroll', () => {
    onScroll();
    handleHeaderScroll();
  }, { passive: true });
  
  });
