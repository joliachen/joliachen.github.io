/* ============================================================
   PUBLICATION IMAGE FALLBACK
   Defined at global scope so inline onerror attrs can call it.
   ============================================================ */
function handlePubImgError(img, initials) {
  img.style.display = 'none';
  var fallback = img.nextElementSibling;
  if (fallback && fallback.classList.contains('pub-cover-fallback')) {
    fallback.style.display = 'flex';
  }
}

/* ============================================================
   THEME (dark / light) — applied before DOMContentLoaded
   to prevent flash of wrong theme
   ============================================================ */
(function initTheme() {
  var saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function () {

  var html         = document.documentElement;
  var themeToggle  = document.getElementById('theme-toggle');
  var navbar       = document.getElementById('navbar');
  var hamburger    = document.getElementById('hamburger');
  var navLinksList = document.getElementById('nav-links');
  var navLinks     = document.querySelectorAll('.nav-link[data-tab]');
  var sections     = document.querySelectorAll('.tab-section');
  var navLogo      = document.querySelector('.nav-logo');

  /* ------ Theme toggle ------ */
  themeToggle.addEventListener('click', function () {
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ============================================================
     TAB SWITCHING
     ============================================================ */
  var validTabs = ['about', 'publications', 'experience', 'awards', 'projects', 'misc'];

  function activateTab(tabId) {
    if (!validTabs.includes(tabId)) tabId = 'about';

    sections.forEach(function (s) {
      s.classList.remove('active');
    });

    var target = document.getElementById(tabId);
    if (target) {
      void target.offsetWidth; /* force reflow to re-trigger CSS animation */
      target.classList.add('active');
    }

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.tab === tabId);
    });

    history.replaceState(null, '', tabId === 'about' ? window.location.pathname : '#' + tabId);
  }

  /* Nav link clicks */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab(link.dataset.tab);
      closeMobileMenu();
    });
  });

  /* Logo -> About */
  if (navLogo) {
    navLogo.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab('about');
      closeMobileMenu();
    });
  }

  /* Restore tab from URL hash on load */
  (function () {
    var hash = window.location.hash.replace('#', '');
    /* #publications is an anchor within About */
    if (hash === 'publications') {
      activateTab('about');
      var el = document.getElementById('publications');
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
      activateTab(validTabs.includes(hash) ? hash : 'about');
    }
  })();

  /* Browser back/forward */
  window.addEventListener('hashchange', function () {
    var hash = window.location.hash.replace('#', '');
    if (validTabs.includes(hash)) activateTab(hash);
  });

  /* ============================================================
     HAMBURGER / MOBILE MENU
     ============================================================ */
  function closeMobileMenu() {
    navLinksList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (
      navLinksList.classList.contains('open') &&
      !navLinksList.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  /* ============================================================
     NAVBAR SCROLL BLUR
     ============================================================ */
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ============================================================
     ABSTRACT TOGGLES
     ============================================================ */
  document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      var abstract = document.getElementById(targetId);
      if (!abstract) return;

      var isOpen = abstract.classList.toggle('open');
      btn.classList.toggle('open', isOpen);

      var arrow = btn.querySelector('.toggle-arrow');
      if (arrow) arrow.innerHTML = isOpen ? '&#9652;' : '&#9662;';
    });
  });

  /* ============================================================
     VIDEO COVER FALLBACK
     <video> errors don't bubble like <img> onerror, so we bind
     the error event on each video element manually.
     ============================================================ */
  document.querySelectorAll('.pub-cover-video').forEach(function (video) {
    video.addEventListener('error', function () {
      video.style.display = 'none';
      var fallback = video.nextElementSibling;
      if (fallback && fallback.classList.contains('pub-cover-fallback')) {
        fallback.style.display = 'flex';
      }
    });
  });

});
