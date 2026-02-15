(() => {
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menu = document.querySelector('[data-menu]');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!openBtn || !closeBtn || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    document.body.classList.add('no-scroll');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    openBtn.setAttribute('aria-expanded', 'false');
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('current'));
      link.classList.add('current');
    });
  });
})();
