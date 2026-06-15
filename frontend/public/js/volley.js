const defaultLanguage = "ro";
const supportedLanguages = new Set(["ro", "es"]);
const i18nAssetVersion = "i18n-20260615-volley-winners";
const translations = {};

let lang = supportedLanguages.has(localStorage.getItem("betel-lang"))
  ? localStorage.getItem("betel-lang")
  : defaultLanguage;
let revealObserver = null;

const revealSelectors = [
  ".volley-hero-copy > *",
  ".volley-poster",
  ".volley-section > div",
  ".volley-facts article",
  ".volley-winner-card",
  ".volley-winner-roster li"
];

function tx(key) {
  return translations[lang]?.[key] || translations[defaultLanguage]?.[key] || key;
}

async function loadLanguageFile(language) {
  if (translations[language]) return translations[language];
  try {
    const response = await fetch(`/i18n/${language}.json?v=${i18nAssetVersion}`);
    if (!response.ok) throw new Error(`Could not load ${language} translations`);
    translations[language] = await response.json();
  } catch {
    translations[language] = {};
  }
  return translations[language];
}

async function loadTranslations(language = lang) {
  await loadLanguageFile(defaultLanguage);
  if (language !== defaultLanguage) await loadLanguageFile(language);
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = tx("volleyPageTitle");
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) metaDescription.content = tx("volleyPageDescription");
  const toggle = document.querySelector("#langToggle");
  if (toggle) toggle.textContent = lang === "ro" ? "ES" : "RO";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = tx(key);
    if (value !== key) node.textContent = value;
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.dataset.i18nAlt;
    const value = tx(key);
    if (value !== key) node.alt = value;
  });
}

function prepareRevealElements(root = document) {
  if (!revealObserver) return;
  root.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
    if (element.classList.contains("reveal-on-scroll")) return;
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
    revealObserver.observe(element);
  });
}

function setupVolleyEffects() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });

  prepareRevealElements();
}

function setupVolleyHeaderScroll() {
  const header = document.querySelector(".volley-header");
  if (!header) return;
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const currentY = Math.max(0, window.scrollY);
    if (!desktopQuery.matches || currentY < 96) {
      header.classList.remove("is-hidden-on-scroll");
    } else if (currentY > lastY + 8) {
      header.classList.add("is-hidden-on-scroll");
    } else if (currentY < lastY - 8) {
      header.classList.remove("is-hidden-on-scroll");
    }
    lastY = currentY;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  desktopQuery.addEventListener?.("change", () => {
    header.classList.remove("is-hidden-on-scroll");
    lastY = window.scrollY;
  });
}

async function initializeVolleyPage() {
  await loadTranslations(lang);
  applyLanguage();
  setupVolleyEffects();
  setupVolleyHeaderScroll();

  document.querySelector("#langToggle")?.addEventListener("click", async () => {
    lang = lang === "ro" ? "es" : "ro";
    localStorage.setItem("betel-lang", lang);
    await loadTranslations(lang);
    applyLanguage();
  });
}

initializeVolleyPage();
