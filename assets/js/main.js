"use strict";

// ===== CONFIGURATION =====
const mw = 1024;
const CONFIG = {
  isMobile: window.matchMedia(`(max-width: ${mw}px)`),
};

// ===== INIT LENIS =====
let lenis;
const initLenis = () => {
  if (lenis) {
    lenis.destroy();
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
    smoothTouch: true,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

// ===== UTILITIES =====
const ll = new LazyLoad({
  threshold: 100,
  elements_selector: ".lazy",
});

const stopScroll = () => {
  if (lenis) {
    lenis.stop();
    document.body.style.overflow = "hidden";
  }
};

const startScroll = () => {
  if (lenis) {
    lenis.start();
    document.body.style.overflow = "";
  }
};

// ===== INIT APP HEIGHT =====
const initAppHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);

  if (CONFIG.isMobile.matches) {
    doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
    doc.style.setProperty("--menu-height", `${menuH}px`);
  } else {
    doc.style.removeProperty("--app-height");
    doc.style.removeProperty("--menu-height");
  }
};

// ===== INIT PAGE NAVIGATION =====
const initPageNavigation = () => {
  document.addEventListener("click", (evt) => {
    const link = evt.target.closest(
      'a:not([href^="#"]):not([target]):not([href^="mailto"]):not([href^="tel"])',
    );
    if (!link) return;

    evt.preventDefault();
    const url = link.getAttribute("href");
    if (!url) return;

    const hashIndex = url.indexOf("#");
    const hash = hashIndex !== -1 ? url.substring(hashIndex) : "";

    if (hash && hash !== "#") {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      } catch (err) {
        console.error("Invalid hash selector:", hash, err);
      }
    }

    document.body.classList.add("fadeout");
    setTimeout(() => (window.location = url), CONFIG.fadeoutDelay);
  });
};

// ===== INIT ALL COMPONENTS =====
const initScript = () => {
  initLenis();
  initAppHeight();
  initPageNavigation();
};

// ===== INITIALIZATION =====
window.addEventListener("resize", initAppHeight);
window.addEventListener("DOMContentLoaded", initScript);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) document.body.classList.remove("fadeout");
});
