"use strict";

// ===== CONFIGURATION =====
const mw = 1024;
const CONFIG = {
  mm: gsap.matchMedia(),
  isMobile: window.matchMedia(`(max-width: ${mw}px)`),
};

// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);

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
  ScrollTrigger.refresh();

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
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

// ===== BARBA PAGE TRANSITIONS =====
CustomEase.create("animation-nav", ".3, 0, .3, 1");

// page Leave (fade out)
const pageTransitionIn = () => {
  const tl = gsap.timeline();

  tl.to("[data-barba='container']", {
    opacity: 0,
    duration: 1,
    ease: "animation-nav",
  });

  tl.call(
    () => {
      if (lenis) lenis.stop();
    },
    null,
    0,
  );

  return tl;
};

// page Enter (fade in)
const pageTransitionOut = () => {
  const tl = gsap.timeline();

  tl.set("[data-barba='container']", {
    opacity: 0,
  });

  tl.to("[data-barba='container']", {
    opacity: 1,
    duration: 1,
    ease: "power2.inOut",
    delay: 0.3,
  });

  tl.call(
    () => {
      if (lenis) lenis.start();
    },
    null,
    0.3,
  );
};

// don't touch - delay helper
const delay = (n) => {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
};

// ===== INIT BARBA =====
const initPageTransitions = () => {
  history.scrollRestoration = "manual";

  barba.hooks.afterEnter(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  });

  barba.init({
    sync: true,
    debug: true,
    timeout: 7000,
    transitions: [
      {
        name: "default",

        // first load
        once(data) {
          initLenis();
          initScript();
          initLoading();
        },
        // leave current page
        async leave(data) {
          const done = new Promise((resolve) => {
            pageTransitionIn().eventCallback("onComplete", resolve);
          });
          await done;
          await delay(450);
          lenis.destroy();
          data.current.container.remove();
        },
        // enter new page
        async enter(data) {
          pageTransitionOut();
        },
        // before entering new page
        async beforeEnter(data) {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          document.body.classList.add("fadeout");
          initLenis();
          initScript();
        },
      },
    ],
  });
};

// hande link not barba
document.querySelectorAll("[data-barba-prevent]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const url = link.getAttribute("href");
    if (!url) return;
    const tl = pageTransitionIn();
    tl.eventCallback("onComplete", () => {
      window.location.href = url;
    });
  });
});

// ===== HANDLE BACK TO TOP =====
const handleBackToTop = () => {
  const backBtn = document.querySelector("[data-backtotop]");
  if (!backBtn) return;

  backBtn.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => t * t * t * (t * (t * 6 - 15) + 10),
        force: true,
        onComplete: () => {
          ScrollTrigger.update();
        },
      });
    }
  });
};

// ===== INIT MENU =====
const initMenu = () => {
  const [menu, menuTogglers] = [
    document.querySelector("[data-menu]"),
    document.querySelectorAll("[data-menu-toggler]"),
  ];
  if (!menu || !menuTogglers.length) return;

  const toggleMenu = () => {
    const isOpen = menu.classList.contains("--show");
    menu.classList.toggle("--show");
    isOpen ? startScroll() : stopScroll();
  };

  menuTogglers.forEach((btn) => btn.addEventListener("click", toggleMenu));
};

// ===== INIT LOADING =====
const initLoading = () => {
  const [loading, loadingContent] = [
    document.querySelector("[data-loading]"),
    document.querySelector("[data-loading-content]"),
  ];
  if (!loading || !loadingContent) return;

  if (sessionStorage.getItem("opening-displayed") === "true") {
    loading.remove();
    return;
  }

  stopScroll();
  gsap
    .timeline()
    .to(loadingContent, { opacity: 1, duration: 2 })
    .to(loading, {
      opacity: 0,
      duration: 2,
      delay: 1,
      onComplete: () => {
        startScroll();
        loading.remove();
        sessionStorage.setItem("opening-displayed", "true");
      },
    });
};

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const initLoading = async () => {}
// await delay(1000)

// ===== INIT POPUP =====
const initPopup = () => {
  const [popups, togglers] = [
    document.querySelectorAll("[data-popup]"),
    document.querySelectorAll("[data-popup-toggler]"),
  ];
  if (!popups.length || !togglers.length) return;

  const openPopup = (popup) => {
    popup.classList.add("--active");
    stopScroll();
    gsap.timeline().to(popup.querySelector("[data-popup-container]"), { y: 0 });
  };

  const closePopup = (popup) => {
    gsap
      .timeline({
        onComplete: () => {
          popup.classList.remove("--active");
          startScroll();
        },
      })
      .to(popup.querySelector("[data-popup-container]"), { y: "100%" });
  };

  // event handlers
  togglers.forEach((toggler) => {
    toggler.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = toggler.getAttribute("data-popup-toggler");
      const targetPopup = document.querySelector(`[data-popup="${targetId}"]`);
      if (targetPopup) openPopup(targetPopup);
    });
  });

  popups.forEach((popup) => {
    const closeBtn = popup.querySelector("[data-popup-close]");
    if (closeBtn) closeBtn.addEventListener("click", () => closePopup(popup));

    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup(popup);
    });
  });

  // ESC handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activePopup = document.querySelector("[data-popup].--active");
      if (activePopup) closePopup(activePopup);
    }
  });
};

// ===== INIT TABS ======
const initTabs = () => {
  const [tabs, contents] = [
    document.querySelectorAll("[data-tabs]"),
    document.querySelectorAll("[data-tabs-content]"),
  ];
  if (!tabs.length || !contents.length) return;

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // # remove all class items/content
      tabs.forEach((t) => t.classList.remove("--show"));
      contents.forEach((c) => c.classList.remove("--show"));
      // # add class item/click show/content
      tab.classList.add("--show");
      contents[index].classList.add("--show");
    });
  });
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

// ===== INIT ACCORDION ======
const initAccordions = () => {
  const [accordions, contents] = [
    document.querySelectorAll("[data-accordion]"),
    document.querySelectorAll("[data-accordion-content]"),
  ];
  if (!accordions.length || !contents.length) return;

  accordions.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("--show");
      const panel = contents[i];
      const isExpanded = panel.style.maxHeight;
      panel.style.maxHeight = isExpanded ? null : `${panel.scrollHeight}px`;
    });
  });
};

// ===== INIT CUSTOM CURSOR =====
const initCustomCursor = () => {
  const cursorPrev = document.querySelector("[data-cursor-prev]");
  const cursorNext = document.querySelector("[data-cursor-next]");

  if (!cursorPrev || !cursorNext) return;

  document.addEventListener("mousemove", (e) => {
    cursorPrev.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorNext.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

    const isNext = e.target.closest(".swiper-button-next");
    const isPrev = e.target.closest(".swiper-button-prev");

    cursorNext.classList.toggle("active", !!isNext);
    cursorPrev.classList.toggle("active", !!isPrev);
  });
};
initCustomCursor();

function initCustomCursor() {
  // Sticky Cursor with delay
  // https://greensock.com/forums/topic/21161-animated-mouse-cursor/

  var posXBtn = 0;
  var posYBtn = 0;
  var mouseX = 0;
  var mouseY = 0;

  if (document.querySelector(".custom-cursor")) {
    gsap.to({}, 0.0083333333, {
      repeat: -1,
      onRepeat: function () {
        if (document.querySelector(".custom-cursor")) {
          posXBtn += (mouseX - posXBtn) / 5;
          posYBtn += (mouseY - posYBtn) / 5;
          gsap.set($(".custom-cursor"), {
            css: {
              left: posXBtn,
              top: posYBtn,
            },
          });
        }
      },
    });
  }

  $(document).on("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Mouse Init
  $("body").on("mousemove", function () {
    if ($("[data-cursor-init]").attr("data-cursor-init") == "false") {
      $("[data-cursor-init]").attr("data-cursor-init", "true");
    }
  });

  // Normal Hover
  $("[data-cursor-bubble-text]").on("mouseenter", function () {
    let dataCursorText = $(this).data("cursor-bubble-text");
    $("[data-cursor-bubble]").attr("data-cursor-bubble", "active");
    $(".custom-cursor")
      .find(".cursor-bubble .cursor-text")
      .text(dataCursorText);
  });
  $("[data-cursor-bubble-text]").on("mouseleave", function () {
    $("[data-cursor-bubble]").attr("data-cursor-bubble", "not-active");
  });
}

// ===== INIT GSAP =====
const initGsap = () => {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  // init
  gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerBottom,
        start: "bottom top",
        end: "bottom top",
        toggleActions: "play none none reverse",
      },
    })
    .to(heading, { opacity: 1, duration: 0.3 }, 0);

  CONFIG.mm.add(
    {
      isMobile: `(max-width: ${mw}px)`,
      isDesktop: `(min-width: ${mw + 1}px)`,
    },
    (context) => {
      let { isMobile } = context.conditions;

      gsap.to("[data-selector]", {
        x: isMobile ? "-75%" : "-85%",
        duration: 0.5,
        scrollTrigger: {
          trigger: "[data-trigger]",
          start: "top center",
          end: "top center",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
          markers: false,
        },
      });

      return () => {};
    },
  );

  // force trigger
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
};

// force refresh triggers
let resizeTimeout;
const optimizedResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    requestAnimationFrame(() => {
      initGsap();
    });
  }, 200);
};

// use ResizeObserver with root margin
const resizeObserver = new ResizeObserver(optimizedResize);
resizeObserver.observe(document.documentElement, {
  box: "content-box",
});

// ===== INIT ALL COMPONENTS =====
const initScript = () => {
  console.clear();
  initAppHeight();
  initPopup();
  initMenu();
  initTabs();
  initAccordion();
  initGsap();
  handleBackToTop();
};

// ===== INITIALIZATION =====
window.addEventListener("resize", initAppHeight);
window.addEventListener("DOMContentLoaded", initPageTransitions);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) document.body.classList.remove("fadeout");
});
