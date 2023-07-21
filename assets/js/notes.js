"use strict";

// develop.tokyophotographicresearch.jp   --  tpr || 0000
// tks.studio1014.jp   --  tks || 0000
// kalonwhite.com 


// add event on multiple element

const addEventOnElements = function (elements, eventType, callback) {
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener(eventType, callback);
    }
  }
};

/* ------------------------------ toggler text ------------------------------ */

const [indexTogglers, index] = [
  document.querySelectorAll("[data-index-toggler]"),
  document.querySelector("[data-index]"),
];

const toggleIndex = function () {
  index.classList.toggle("toggle");
  document.body.classList.toggle("active");
};

addEventOnElements(indexTogglers, "click", toggleIndex);

/* ------------------------- mobile nav menu toggle ------------------------- */

const [navTogglers, navLinks, navbar, navIcon] = [
  document.querySelectorAll("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-icon]"),
];

const toggleNav = () => {
  navbar.classList.toggle("active");
  navIcon.classList.toggle("active");
  document.body.classList.toggle("active");
};

addEventOnElements(navTogglers, "click", toggleNav);

const closeNav = () => {
  navbar.classList.remove("active");
  navIcon.classList.remove("active");
  document.body.classList.remove("active");
};

addEventOnElements(navLinks, "click", closeNav);

/* ---------------------------- MENU SHOW/HIDDEN ---------------------------- */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.querySelector(".c-header__hamburger");

navToggle.addEventListener("click", function () {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});
//  catch case open menu in mobile, and resize window > desktop
window.addEventListener("resize", function () {
  if (window.innerWidth < 768) {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  }
});

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".c-header__link");
function linkAction() {
  // When we click on each menu link, we remove the show-menu class
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/* ------------------------------- tab switch ------------------------------- */
$(document).on("click", ".tab-link", function () {
  let tabID = $(this).attr("data-tab");

  $(this).addClass("active").siblings().removeClass("active");
  $("#tab-" + tabID)
    .addClass("active")
    .siblings()
    .removeClass("active");
});

/* ---------------------------- locomotive scroll --------------------------- */

// setup locomotive scroll
const scrollEl = ".smooth-scroll";
let scroll = new LocomotiveScroll({
  el: document.querySelector(scrollEl),
  smooth: true,
  lerp: 0.07,
  multiplier: 0.7,
  touchMultiplier: 6,
  smartphone: {
    smooth: true,
  },
  tablet: {
    smooth: true,
  },
});

new ResizeObserver(() => scroll.update()).observe(
  document.querySelector(scrollEl)
);

document.addEventListener("DOMContentLoaded", function () {
  function ScrollUpdateDelay() {
    setTimeout(function () {
      scroll.update();
    }, 500);
  }
  ScrollUpdateDelay();
});

// connect scrollTrigger to Locomotive
gsap.registerPlugin(ScrollTrigger);
scroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy(scrollEl, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

ScrollTrigger.addEventListener("refresh", () => scroll.update());
ScrollTrigger.refresh();

/* ------------------------------ refresh page ------------------------------ */

["pageshow", "load"].forEach(function (evt) {
  window.addEventListener(evt, function () {
    document.body.classList.remove("fadeout");
  });
});

// click fadeout

$(document).on("click", 'a[href^="#"]', function (e) {
  e.preventDefault();
});

$(document).on(
  "click",
  'a:not([href^="#"]):not([target]):not([href^="mailto"])',
  function (e) {
    e.preventDefault();
    const url = $(this).attr("href");

    if (url !== "") {
      const idx = url.indexOf("#");
      const hash = idx != -1 ? url.substring(idx) : "";

      if ($(hash).length > 0) {
        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top,
          },
          300
        );
        return false;
      }

      $("body").addClass("fadeout");
      setTimeout(function () {
        window.location = url;
      }, 600);
    }
    return false;
  }
);

/* --------------------------------- loading -------------------------------- */

let load = gsap.timeline({
  paused: "true",
  defaults: { ease: Linear.easeNone, duration: 0.4 },
});

let mm = gsap.matchMedia(),
  breakPoint = 1024;

mm.add(
  {
    // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
    isDesktop: `(min-width: ${breakPoint}px)`,
    isMobile: `(max-width: ${breakPoint - 1}px)`,
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
    let { isDesktop, isMobile, reduceMotion } = context.conditions;

    load
      .to(".c-loading", {
        delay: 0.7,
        opacity: 0,
        zIndex: -10,
      })
      .fromTo(
        ".c-header__language",
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      )
      .from(
        ".top__logo svg",
        {
          y: 60,
          opacity: 0,
          stagger: {
            amount: 0.4,
          },
        },
        "-=0.2"
      )
      .fromTo(
        ".top__scrolldown p",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
        }
      )
      .fromTo(
        ".top__scrolldown .circle",
        {
          scale: 0,
        },
        {
          scale: 1,
          delay: 0.1,
        }
      )
      .fromTo(
        ".top__scrolldown .line",
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
        }
      )
      .to(".top__scrolldown .circle", {
        keyframes: {
          "0%": { y: 10 },
          "100%": { y: 10 },
          "50%": { y: isDesktop ? 98 : 70 },
        },
        ease: "none",
        duration: 2.2,
        repeat: -1,
        delay: 0.2,
      });

    return () => {
      // optionally return a cleanup function that will be called when none of the conditions match anymore (after having matched)
      // it'll automatically call context.revert() - do NOT do that here . Only put custom cleanup code here.
    };
  }
);

let id,
  width = 1;

const loading = () => {
  id = setInterval(frame, 25);
};

const frame = () => {
  switch (width) {
    case 25:
      document.getElementById("25percent").style.fill = "#D60084";
      break;
    case 50:
      document.getElementById("50percent").style.fill = "#B10023";
      break;
    case 75:
      document.getElementById("75percent").style.fill = "#F3BF95";
      break;
  }

  if (width >= 100) {
    document.getElementById("100percent").style.fill = "#8EB9EA";

    clearInterval(id);
    load.play();
    document.body.classList.remove("no-scroll");
  } else {
    width++;
    // document.getElementById("percent").innerHTML = width + '%';
  }
};

window.onload = () => {
  loading();
};

/* --------------------------- resize mobile 100vh -------------------------- */

const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty(
    "--app-height",
    `${document.documentElement.clientHeight}px`
  );

  // height menu
  var windowHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  document.querySelector(".c-header__menu").style.height = windowHeight + "px";
};
window.addEventListener("resize", appHeight);
appHeight();

/* ------------------------ scroll fadeout main photo ----------------------- */

const mainphoto = document.getElementById("mainphoto");
const statement = document.querySelector(".homepage .statement");

["scroll", "resize", "pageshow", "load"].forEach((evt) => {
  window.addEventListener(evt, () => {
    let cal = statement.offsetHeight + 900;
    let value = 1 + window.scrollY / -cal;
    mainphoto.style.opacity = value;
  });
});

scroll.on("scroll", (instance) => {
  let cal = statement.offsetHeight + 900;
  let value = 1 + instance.scroll.y / -cal;
  mainphoto.style.opacity = value;
});

/* ------------------------------ scroll to top ----------------------------- */

const scrollTop = document.querySelector(".c-footer__backtotop");

if (scrollTop) {
  scrollTop.addEventListener("click", () => {
    scroll.scrollTo("top", {
      offset: 0,
      callback: () => {
        // do something...
      },
      duration: 700,
      easing: [0.25, 0.0, 0.35, 1.0],
      disableLerp: true,
    });
  });
}

if (scrollTop) {
  scrollTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (scrollTop) {
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 10);
    }
  };

  scrollTop.onclick = function (e) {
    e.preventDefault();
    scrollToTop();
  };
}

/* ------------------------ horizontal scroll gallery ----------------------- */

const photo = gsap.utils.toArray(".photo__item");
let maxWidth = 0;

const getMaxWidth = () => {
  maxWidth = 0;
  photo.forEach((item) => {
    maxWidth += item.offsetWidth;
    maxWidth += gsap.getProperty(item, "marginLeft");
  });

  if (window.innerWidth <= 1023) {
    maxWidth += window.innerWidth / 2.4;
  } else {
    maxWidth += window.innerWidth - photo[0].offsetWidth * 2.3;
    maxWidth -= photo[0].offsetWidth;
  }

  return maxWidth;
};

getMaxWidth();
["resize", "pageshow", "load"].forEach(function (evt) {
  window.addEventListener(evt, function () {
    getMaxWidth();
  });
});

ScrollTrigger.addEventListener("refreshInit", getMaxWidth);

gsap.to(photo, {
  x: () => `-${maxWidth - window.innerWidth}`,
  ease: "none",
  scrollTrigger: {
    trigger: ".photo__container",
    scroller: scrollEl,
    pin: ".photo",
    scrub: 0.5,
    // markers: true,
    end: () => `+=${maxWidth}`,
    invalidateOnRefresh: true,
  },
});

photo.forEach((sct, i) => {
  ScrollTrigger.create({
    trigger: sct,
    scroller: scrollEl,
    start: () =>
      "top top-=" +
      (sct.offsetLeft - window.innerWidth / 2) *
      (maxWidth / (maxWidth - window.innerWidth)),
    end: () =>
      "+=" + sct.offsetWidth * (maxWidth / (maxWidth - window.innerWidth)),
    toggleClass: { targets: sct, className: "active" },
  });
});

/* ----------------------------- scroll animate ----------------------------- */

let fadeArray = document.querySelectorAll(".is-fade");
let lineArray = document.querySelectorAll(".line-animate");
let hr = document.querySelector("hr");

scroll.on("scroll", (instance) => {
  if (hr.getBoundingClientRect().top - window.innerHeight + 100 < 0) {
    hr.classList.add("active");
  }
});

// const img = document.querySelectorAll(".thumbnail");
const gsapLine = gsap.utils.toArray(lineArray);
const gsapFade = gsap.utils.toArray(fadeArray);

const animateFunc = (key, element) => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      scroller: scrollEl,
      start: "top+=18% bottom",
      end: "top top+=52%",
      scrub: 0.7,
      ease: Elastic.easeOut.config(3, 0.3),
    },
  });

  switch (key) {
    case "line":
      timeline.fromTo(
        element,
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
        }
      );

      break;
    case "fade":
      timeline.fromTo(
        element,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      );

      break;
  }
};

gsapLine.forEach((element) => animateFunc("line", element));
gsapFade.forEach((element) => animateFunc("fade", element));

/* ----------------------------- scroll logo scale ----------------------------- */

const logoScale = document.querySelector(".c-header__logo.js-scale");

window.onscroll = function () {
  if (logoScale) {
    scrollFunction();
  }
};

const scrollFunction = () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    logoScale.classList.add("is-scale");
  } else {
    logoScale.classList.remove("is-scale");
  }
};

/* --------------------------------- swiper --------------------------------- */
const deactiveButton = () => {
  if ($(".button-swiper").hasClass("swiper-button-disabled")) {
    $(".button-swiper").removeClass("swiper-button-disabled");
    $(".button-swiper").attr("aria-disabled", "false");
    $(".button-swiper").removeAttr("disabled");
  }
};

const swiperFunction = () => {
  if (document.querySelector(".swiperDetail")) {
    const swiper = new Swiper(".swiperDetail", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      speed: 600,
      slidesPerView: 1.2,
      breakpoints: {
        0: {
          spaceBetween: 10,
          draggable: true,
        },
        1024: {
          spaceBetween: 20,
          draggable: false,
        },
      },
      on: {
        beforeInit: function () {
          let numOfSlides =
            this.wrapperEl.querySelectorAll(".swiper-slide").length;
          document.querySelector(".slider-total").innerHTML = "/" + numOfSlides;
        },
      },
    });

    // deactive button control
    deactiveButton();
    swiper.on("slideNextTransitionStart", function () {
      deactiveButton();
    });
    swiper.on("slidePrevTransitionStart", function () {
      deactiveButton();
    });
  }
};

swiperFunction();

/* ------------------------------ custom cursor ----------------------------- */

const cursorPrev = document.querySelector(".cursor-prev");
const cursorNext = document.querySelector(".cursor-next");

function mousemoveHandler(e) {
  const target = e.target;
  const tl = gsap.timeline({
    defaults: {
      x: e.clientX,
      y: e.clientY,
      ease: "power2.out",
    },
  });

  if (
    document.querySelector(".swiper-button-next") &&
    document.querySelector(".swiper-button-prev")
  ) {
    // hover section slider
    if (
      target.tagName.toLowerCase() === "button" &&
      target.closest(".swiper-button-next")
    ) {
      tl.to(cursorPrev, {
        opacity: 0,
      }).to(
        cursorNext,
        {
          opacity: 1,
        },
        "-=0.5"
      );
    } else if (
      target.tagName.toLowerCase() === "button" &&
      target.closest(".swiper-button-prev")
    ) {
      tl.to(cursorPrev, {
        opacity: 1,
      }).to(
        cursorNext,
        {
          opacity: 0,
        },
        "-=0.5"
      );
    } else {
      tl.to(".cursor", {
        opacity: 0,
      });
    }
  }
}

function mouseleaveHandler() {
  if (document.querySelector(".cursor")) {
    gsap.to(".cursor", {
      opacity: 0,
    });
  }
}

document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("mouseleave", mouseleaveHandler);

/* -------------------------------- lightbox -------------------------------- */

const lightBox = document.querySelector(".p-detail__lightbox");
const imgLightbox = document.querySelectorAll(".p-detail__items img");
const iconClose = document.querySelector(".lightbox-icon");
const totalLightBox = document.querySelector(".lightbox-counter .total");
const swiperLightBox = document.getElementById("swiper-lightbox");
let currentLightBox = document.querySelector(".lightbox-counter .current");
// let index = 0;
let swiperLb;

function swiperImages() {
  swiperLb = new Swiper(".lightbox-swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    speed: 600,
    centeredSlides: true,
    slidesPerView: 1,
    loop: true,
    // initialSlide: index,
    on: {
      slideChange: function () {
        let currentSlide = this.realIndex + 1;
        document.querySelector(".current").innerHTML = currentSlide;
      },
      beforeInit: function () {
        totalLightBox.innerHTML = imgLightbox.length;

        let swiper = this;
        setTimeout(function () {
          let currentCaption = $(swiper.slides[swiper.activeIndex]).attr(
            "data-caption"
          );
          let currentTitle = $(swiper.slides[swiper.activeIndex]).attr(
            "data-title"
          );
          let currentContent = $(swiper.slides[swiper.activeIndex]).attr(
            "data-content"
          );

          $(".lightbox-caption").html(function () {
            return "<h3>" + currentCaption + "</h3>";
          });
          $(".text-content h3").html(function () {
            return currentTitle;
          });
          $(".text-content .text-desc").html(function () {
            return currentContent;
          });
        }, 500);
      },
      slideChangeTransitionStart: function () {
        // Slide captions
        let swiper = this;
        setTimeout(function () {
          let currentCaption = $(swiper.slides[swiper.activeIndex]).attr(
            "data-caption"
          );
          let currentTitle = $(swiper.slides[swiper.activeIndex]).attr(
            "data-title"
          );
          let currentContent = $(swiper.slides[swiper.activeIndex]).attr(
            "data-content"
          );
        }, 500);
      },
      slideChangeTransitionEnd: function () {
        // Slide captions
        let swiper = this;
        let currentCaption = $(swiper.slides[swiper.activeIndex]).attr(
          "data-caption"
        );
        let currentTitle = $(swiper.slides[swiper.activeIndex]).attr(
          "data-title"
        );
        let currentContent = $(swiper.slides[swiper.activeIndex]).attr(
          "data-content"
        );

        $(".lightbox-caption").html(function () {
          return "<h3>" + currentCaption + "</h3>";
        });
        $(".text-content h3").html(function () {
          return currentTitle;
        });
        $(".text-content .text-desc").html(function () {
          return currentContent;
        });
      },
    },
  });

  // deactive button control
  deactiveButton();
  swiperLb.on("slideNextTransitionStart", function () {
    deactiveButton();
  });
  swiperLb.on("slidePrevTransitionStart", function () {
    deactiveButton();
  });
}

swiperImages();
imgLightbox.forEach((item) => item.addEventListener("click", handleZoomImage));

function handleZoomImage(event) {
  document.body.classList.add("active");

  let image = event.target.getAttribute("key-items");
  index = [...imgLightbox].findIndex(
    (item) => item.getAttribute("key-items") === image
  );

  // console.log('index', index);
  swiperLb.slideTo(index + 1, 0);

  lightBox.classList.add("active");
}

// close lightbox
if (iconClose) {
  iconClose.addEventListener("click", function () {
    lightBox.classList.remove("active");
    document.body.classList.remove("active");
  });
}

const [textTogglers, text, close, hide] = [
  document.querySelectorAll("[data-text-toggler]"),
  document.querySelector("[data-text]"),
  document.querySelector("[data-text-close]"),
  document.querySelector("[hide]"),
];

const toggleText = function () {
  text.classList.toggle("active");
  hide.classList.toggle("hide");

  if (close.innerHTML == "info") {
    close.innerHTML = "close";
  } else {
    close.innerHTML = "info";
  }
};

addEventOnElements(textTogglers, "click", toggleText);

/* ---------------------- catch select href not working --------------------- */

$(function () {
  let isIOS =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;
  if (isIOS) {
    $("a").on("click touchend", function () {
      let link = $(this).attr("href");
      let target = $(this).attr("target");
      if (target === "_blank") {
        window.open(link, "blank"); // opens in new window as requested
        return false; // prevent anchor click
      }
    });
  }
});

/* ------------------------------ INSTAGRAM API ----------------------------- */
const instagram = document.querySelector("#instagram");
const idBusinessAccount = "17841455986994937";
const token =
  "EAASrkJ9GqDwBADr6SPxw7HG9fZBWeHZARDhGumAGuvwDb5RUgq4s41MaVaZBawuspevFqZCoUFiRlSIbjLxYuxfsNJZAr9hNjcvwNJsMpFiLCf4ZBc8tiBHJzwSu6AxoUKeVQfGuFL5nQl0Cj7WCNwbplFwzZBqxombXQyTcsI5cwyGMeS23el7e8MbuAmq0fIZD";
const fields =
  "id,media_type,media_url,thumbnail_url,timestamp,permalink,caption";
const limit = 5;

const fetchData = async () => {
  try {
    const res = await fetch(
      "https://graph.facebook.com/v15.0/" +
      idBusinessAccount +
      "/media?fields=" +
      fields +
      "&access_token=" +
      token +
      "&limit=" +
      limit
    );

    if (res.status === 200) {
      const jsonResult = await res.json();
      // console.log("jsonResult", jsonResult);
      jsonResult.data.forEach((e) => {
        let render = `
          <div class="swiper-slide">
            <a class="p-news__items" href="${e.permalink}" target="_blank">
              <img src="${e.media_type == "VIDEO" ? e.thumbnail_url : e.media_url
          }" alt="">
              <p>
                ${e.caption.substring(0, 100)}
              </p>
            </a>
          </div>
        `;
        instagram.insertAdjacentHTML("beforeend", render);
      });
    } else {
      let render = `
        <div class="p-news__404">
          <p>User Not Found</p>
        </div>
      `;
      instagram.insertAdjacentHTML("beforeend", render);
    }
  } catch (error) {
    console.warn("error", error);
  }
};

$(document).ready(function () {
  /* ----------------------------- REMOVE ANCHOR URL ---------------------------- */
  $('a[href^="#"]').click(function () {
    const speed = 100;
    let href = $(this).attr("href");
    let target = $(href == "#" || href == "" ? "html" : href);
    $("html, body").animate(
      {
        scrollTop: target.offset().top,
      },
      speed,
      "swing"
    );
    return false;
  });

  /* ------------------------------- SCROLL FADE ------------------------------ */
  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    var bottom = scrollTop + $(window).height();
    $(".in-view").each(function () {
      if (bottom > $(this).offset().top + 100) {
        $(this).addClass("is-active");
      } else {
        $(this).removeClass("is-active");
      }
    });
  });
});

for (var i = 0; i < fadeArray.length; i++) {
  let elemFade = fadeArray[i];
  let fadeInView =
    elemFade.getBoundingClientRect().top - window.innerHeight + 100;
  if (fadeInView < 0) {
    elemFade.classList.add("active");
  }
}

/* ----------------------------- render feature ----------------------------- */

const featureList = document.querySelector("#feature-list");
const swiperWrapper = document.querySelector(".swiper-wrapper");

const featureFunc = (data, query) => {
  const checkRadius = data.borderRadius ? "radius-300" : "";

  let feature = `
        <div class="swiper-slide">
            <div class="p-feature__item">
                <div class="p-feature__figure">
                    <img src="${data.image}" alt="${data.name}"
                        class="p-feature__img ${checkRadius}" loading="lazy">
                    <p>${data.title}</p>
                </div>
                <div class="p-feature__content">
                <h3 class="p-feauture__name">${data.name}</h3>
                    <p class="p-feature__desc">
                    ${data.description}
                    </p>
                </div>
            </div>
        </div>
      `;
  query.insertAdjacentHTML("beforeend", feature);
};

const renderFeaturePC = (data) => {
  data.forEach((item) => {
    featureFunc(item, featureList);
  });
};

const renderFeatureSP = (data) => {
  const sortData = data.sort((a, b) => (a.order > b.order ? 1 : -1));
  sortData.forEach((item) => {
    featureFunc(item, swiperWrapper);
  });
};

renderFeaturePC(featureData);
renderFeatureSP(featureData);

/* ----- replace the regular action with a scrolling to target on click ----- */
const links = document.querySelectorAll(".c-header__link");

Array.prototype.forEach.call(links, function (elem, index) {
  const elemAttr = elem.getAttribute("href");
  if (elemAttr && elemAttr.includes("#")) {
    elem.addEventListener("click", function (ev) {
      ev.preventDefault();
      document.getElementById(elemAttr.replace(/#/g, "")).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  }
});
