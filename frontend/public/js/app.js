import { apiRequest as requestApi } from "./api.js";

const contactEmail = ["contacto", "betelreus.com"].join("@");
const contactFormMinimumMs = 3000;

const defaultLanguage = "ro";
const supportedLanguages = new Set(["ro", "es"]);
const i18nAssetVersion = "i18n-20260605b";
const translations = {};
const seoTranslations = {
  ro: {
    title: "Betel Reus | Biserica Betel Reus",
    description: "Biserica Betel Reus este o comunitate penticostală în Reus, cu program, predici, evenimente și resurse pentru familii, tineri și vizitatori.",
    ogTitle: "Biserica Betel Reus | Biserică penticostală în Reus",
    ogDescription: "Comunitate penticostală în Reus, cu program, predici, evenimente și resurse pentru familii, tineri și vizitatori.",
    twitterTitle: "Biserica Betel Reus",
    twitterDescription: "Comunitate penticostală în Reus, cu program, predici, evenimente și resurse pentru familii, tineri și vizitatori.",
    schemaName: "Biserica Betel Reus",
    schemaDescription: "Biserica Betel Reus este o comunitate penticostală în Reus, cu program, predici, evenimente și resurse pentru familii, tineri și vizitatori.",
    schemaLanguage: "ro-RO"
  },
  es: {
    title: "Betel Reus | Iglesia Betel Reus",
    description: "Iglesia Betel Reus es una comunidad pentecostal en Reus con horarios, predicaciones, eventos y recursos para familias, jóvenes y visitantes.",
    ogTitle: "Iglesia Betel Reus | Iglesia pentecostal en Reus",
    ogDescription: "Comunidad pentecostal en Reus con horarios, predicaciones, eventos y recursos para familias, jóvenes y visitantes.",
    twitterTitle: "Iglesia Betel Reus",
    twitterDescription: "Comunidad pentecostal en Reus con horarios, predicaciones, eventos y recursos para familias, jóvenes y visitantes.",
    schemaName: "Iglesia Betel Reus",
    schemaDescription: "Iglesia Betel Reus es una comunidad pentecostal en Reus con horarios, predicaciones, eventos y recursos para familias, jóvenes y visitantes.",
    schemaLanguage: "es-ES"
  }
};

const seedBooks = [
  { id: crypto.randomUUID(), title: "Viața condusă de scopuri", author: "Rick Warren", category: "Familie", stock: 4, price: 12.5, reserved: 1 },
  { id: crypto.randomUUID(), title: "Creștinul autentic", author: "John Stott", category: "Teologie", stock: 2, price: 9.99, reserved: 0 },
  { id: crypto.randomUUID(), title: "Rugăciunea", author: "Timothy Keller", category: "Teologie", stock: 1, price: 14, reserved: 0 },
  { id: crypto.randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", category: "Copii", stock: 6, price: 18, reserved: 2 }
];

let lang = supportedLanguages.has(localStorage.getItem("betel-lang")) ? localStorage.getItem("betel-lang") : defaultLanguage;
let books = seedBooks;
let cart = JSON.parse(localStorage.getItem("betel-cart") || "[]");
let usingServerData = false;
let currentMemberName = localStorage.getItem("betel-member-name") || "";
let currentAdminCode = sessionStorage.getItem("betel-admin-code") || "";
let pendingStockChanges = new Map();
let processingReservationIds = new Set();
let auditPage = 0;
const auditPageSize = 5;
let videoRotationFrame;
let videoResumeTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const accessCode = "BETEL-REUS";
const defaultAdminCode = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ? "ADMIN-BETEL" : "";
const adminSessionMs = 10 * 60 * 1000;
const heroImages = [
  "https://i.ytimg.com/vi/5ANLpkgxZGE/maxresdefault.jpg",
  "https://i.ytimg.com/vi/V-w7Xf8OvDg/maxresdefault.jpg",
  "https://i.ytimg.com/vi/R5RH-wUQHd0/maxresdefault.jpg",
  "https://i.ytimg.com/vi/J3lrKcTgpmU/maxresdefault.jpg"
];

let reservations = [];
let auditLogs = [];
let volleyRegistrations = [];
let churchEvents = [];
let activeEventId = null;
let editingEventId = null;
let currentEventPosters = { ro: "", es: "" };
let activeVolleyRegistrationId = null;
let volleyDrawerSectionSnapshots = {};
let pendingVolleyDeleteId = null;

const statusLabelKeys = {
  pending: "adminStatusPending",
  approved: "adminStatusApproved",
  collected: "adminStatusCollected",
  cancelled: "adminStatusCancelled"
};

let volleyShirtColors = [
  { id: "white", ro: "Alb", es: "Blanco", hex: "#f7f3e8" },
  { id: "black", ro: "Negru", es: "Negro", hex: "#242124" },
  { id: "red", ro: "Roșu", es: "Rojo", hex: "#e8313a" },
  { id: "blue", ro: "Albastru", es: "Azul", hex: "#2f6feb" },
  { id: "green", ro: "Verde", es: "Verde", hex: "#596b36" },
  { id: "yellow", ro: "Galben", es: "Amarillo", hex: "#ffd21d" },
  { id: "pink", ro: "Roz", es: "Rosa", hex: "#e94aa9" },
  { id: "purple", ro: "Mov", es: "Morado", hex: "#7c3aed" },
  { id: "orange", ro: "Portocaliu", es: "Naranja", hex: "#f97316" },
  { id: "turquoise", ro: "Turcoaz", es: "Turquesa", hex: "#14b8a6" },
  { id: "navy", ro: "Bleumarin", es: "Azul marino", hex: "#1e3a8a" },
  { id: "gray", ro: "Gri", es: "Gris", hex: "#8a8f98" },
  { id: "burgundy", ro: "Vișiniu", es: "Granate", hex: "#7f1d1d" },
  { id: "coral", ro: "Coral", es: "Coral", hex: "#fb7185" },
  { id: "sky", ro: "Albastru deschis", es: "Azul claro", hex: "#38bdf8" },
  { id: "mint", ro: "Mentă", es: "Menta", hex: "#86efac" },
  { id: "lime", ro: "Verde lime", es: "Verde lima", hex: "#a3e635" },
  { id: "beige", ro: "Bej", es: "Beige", hex: "#d6c3a5" },
  { id: "brown", ro: "Maro", es: "Marrón", hex: "#7c2d12" },
  { id: "silver", ro: "Argintiu", es: "Plateado", hex: "#cbd5e1" },
  { id: "gold", ro: "Auriu", es: "Dorado", hex: "#fbbf24" },
  { id: "lavender", ro: "Lavandă", es: "Lavanda", hex: "#c084fc" }
];

const adminEntityKeys = {
  book: "adminEntityBook",
  order: "adminEntityOrder",
  reservation: "adminEntityReservation",
  event: "adminEntityEvent"
};

const libraryCategories = ["Teologie", "Familie", "Tineri", "Copii", "Biografii", "Biblii", "Devoționale"];
const categoryLabelKeys = {
  Teologie: "categoryTheology",
  Familie: "categoryFamily",
  Tineri: "categoryYouth",
  Copii: "categoryChildren",
  Biografii: "categoryBiographies",
  Biblii: "categoryBibles",
  "Devoționale": "categoryDevotionals",
  General: "categoryGeneral",
  "Serviciu divin": "categoryDivineService",
  "Eveniment tineret": "categoryYouthEvent",
  "Sărbătoare": "categoryCelebration",
  "Serviciu special": "categorySpecialService"
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

function tx(key) {
  return translations[lang]?.[key] || translations[defaultLanguage]?.[key] || key;
}

async function loadLanguageFile(language) {
  if (translations[language]) return translations[language];
  try {
    const response = await fetch(`/i18n/${language}.json?v=${i18nAssetVersion}`);
    if (!response.ok) throw new Error(`Could not load ${language} translations`);
    translations[language] = await response.json();
  } catch (error) {
    translations[language] = {};
  }
  return translations[language];
}

async function loadTranslations(language = lang) {
  await loadLanguageFile(defaultLanguage);
  if (language !== defaultLanguage) await loadLanguageFile(language);
}

function getStatusLabel(status) {
  return tx(statusLabelKeys[status]) || status;
}

function getAdminEntityLabel(entity) {
  return tx(adminEntityKeys[entity]) || entity;
}

function getAdminActionLabel(action = "") {
  const exactActions = {
    "Cerere trimisă de membru": "adminActionMemberRequest",
    "Carte creată": "adminActionBookCreated",
    "Carte actualizată": "adminActionBookUpdated",
    "Cărți importate": "adminActionBooksImported",
    "Carte ștearsă": "adminActionBookDeleted",
    "Inventar: plus": "adminActionInventoryPlus",
    "Inventar: minus": "adminActionInventoryMinus"
  };
  if (exactActions[action]) return tx(exactActions[action]);
  const markedMatch = action.match(/^Cerere marcată ca (.+)$/);
  if (markedMatch) return `${tx("adminActionRequestMarked")} ${getStatusLabel(markedMatch[1])}`;
  return action;
}

function getCategoryLabel(category = "General") {
  const normalized = category || "General";
  const key = categoryLabelKeys[normalized];
  return key ? tx(key) : normalized;
}

function saveBooks() {
  sessionStorage.setItem("betel-books", JSON.stringify(books));
}

function saveReservations() {
  sessionStorage.setItem("betel-reservations", JSON.stringify(reservations));
}

function saveCart() {
  localStorage.setItem("betel-cart", JSON.stringify(cart));
}

function saveAuditLogs() {
  sessionStorage.setItem("betel-audit-logs", JSON.stringify(auditLogs));
}

async function apiRequest(path, options = {}) {
  return requestApi(path, { ...options, adminCode: currentAdminCode || defaultAdminCode });
}

async function loadBooksFromApi() {
  try {
    const data = await apiRequest("/api/books");
    books = data.books;
    usingServerData = data.source !== "memory";
    cart = cart.filter((item) => books.some((book) => book.id === item.id));
    saveCart();
    saveBooks();
  } catch (error) {
    usingServerData = false;
  }
}

async function loadAdminDataFromApi(throwOnError = false) {
  try {
    const requests = [
      apiRequest("/api/admin/orders?active=true"),
      apiRequest("/api/admin/audit"),
      apiRequest("/api/admin/volley/registrations"),
      apiRequest("/api/volley/colors")
    ];
    const shouldLoadEvents = Boolean($("#adminEventsList") || $("#adminEventForm"));
    if (shouldLoadEvents) requests.push(apiRequest("/api/admin/events"));
    const [ordersData, auditData, volleyData, volleyColorsData, eventsData] = await Promise.all(requests);
    reservations = ordersData.orders;
    auditLogs = auditData.auditLogs;
    volleyRegistrations = volleyData.registrations || [];
    volleyShirtColors = volleyColorsData.colors || volleyShirtColors;
    if (eventsData) churchEvents = eventsData.events || [];
    saveReservations();
    saveAuditLogs();
  } catch (error) {
    usingServerData = false;
    if (throwOnError) throw error;
  }
}

function logAudit(action, entity, before = null, after = null) {
  auditLogs.unshift({
    id: crypto.randomUUID(),
    actor: "admin",
    action,
    entity,
    before,
    after,
    createdAt: new Date().toISOString()
  });
  auditLogs = auditLogs.slice(0, 80);
  saveAuditLogs();
}

function setMetaContent(selector, content) {
  const meta = document.querySelector(selector);
  if (meta && content) meta.setAttribute("content", content);
}

function updateStructuredData(seo) {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script) return;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: seo.schemaName,
    description: seo.schemaDescription,
    url: "https://betelreus.com/",
    email: contactEmail,
    telephone: "+34605430573",
    inLanguage: seo.schemaLanguage,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrer de Terrassa, 33",
      addressLocality: "Reus",
      postalCode: "43204",
      addressRegion: "Tarragona",
      addressCountry: "ES"
    },
    sameAs: [
      "https://www.instagram.com/bisericabetelreus/",
      "https://www.instagram.com/tineriibetelreus/",
      "https://www.youtube.com/@BisericaBetelReus",
      "https://www.tiktok.com/@bisericabetelreus",
      "https://www.facebook.com/BBetelReus"
    ]
  };

  script.textContent = JSON.stringify(structuredData, null, 2);
}

function applySeoLanguage() {
  const seo = seoTranslations[lang] || seoTranslations[defaultLanguage];
  document.title = seo.title;
  setMetaContent('meta[name="description"]', seo.description);
  setMetaContent('meta[property="og:title"]', seo.ogTitle);
  setMetaContent('meta[property="og:description"]', seo.ogDescription);
  setMetaContent('meta[property="og:locale"]', lang === "es" ? "es_ES" : "ro_RO");
  setMetaContent('meta[name="twitter:title"]', seo.twitterTitle);
  setMetaContent('meta[name="twitter:description"]', seo.twitterDescription);
  updateStructuredData(seo);
}

function applyLanguage() {
  document.documentElement.lang = lang;
  $("#langToggle").textContent = lang === "ro" ? "ES" : "RO";
  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = tx(key);
    if (value !== key) node.textContent = value;
  });
  $$("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const value = tx(key);
    if (value !== key) node.placeholder = value;
  });
  $$("[data-i18n-aria-label]").forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    const value = tx(key);
    if (value !== key) node.setAttribute("aria-label", value);
  });
  $$("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    const value = tx(key);
    if (value !== key) node.title = value;
  });
  if ($("#bookSearch")) $("#bookSearch").placeholder = tx("bookSearchPlaceholder");
  if ($("#books")) renderBooks();
  if ($("#cartItems")) renderCart();
  if ($("#adminShell") && !$("#adminShell").classList.contains("is-hidden")) {
    renderAdmin();
    if (activeVolleyRegistrationId) renderVolleyManageDrawer();
  }
  if ($("#landingEventsList")) renderLandingEvents();
  if (activeEventId) renderEventModal();
  applySeoLanguage();
  setupContactEmailLinks();
  updateMobileMenuLabel();
  updateLiveCountdown();
}

function setupContactEmailLinks() {
  $$("[data-email-link]").forEach((link) => {
    link.href = `mailto:${contactEmail}`;
  });
}

let revealObserver = null;
const publicRevealSelectors = [
  ".section-heading",
  ".split > div",
  ".schedule-grid article",
  ".event-card",
  ".faq-grid article",
  ".social-band > div",
  ".social-links a",
  ".about-block",
  ".contact-form",
  ".contact-box",
  ".map-panel",
  ".video-card",
  ".library-gate",
  ".library-shell .section-heading",
  ".library-results .toolbar",
  ".book-card"
];

function prepareRevealElements(root = document) {
  if (!revealObserver) return;

  root.querySelectorAll(publicRevealSelectors.join(",")).forEach((element, index) => {
    if (element.classList.contains("reveal-on-scroll")) return;
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
    revealObserver.observe(element);
  });
}

function setupLandingEffects() {
  if (document.querySelector(".admin-page")) return;
  if (!document.querySelector(".hero, .library-page")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".hero-copy > *, .hero-panel").forEach((element) => {
      element.style.animation = "none";
    });
    document.querySelectorAll(publicRevealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(publicRevealSelectors.join(",")).forEach((element) => {
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

function renderBooks() {
  if (!$("#books")) return;
  const query = $("#bookSearch").value.toLowerCase();
  const filter = $("#bookFilter").value;
  const categoryFilter = $("#bookCategoryFilter")?.value || "all";
  const categories = [...new Set([...libraryCategories, ...books.map((book) => book.category).filter(Boolean)])].sort();
  if ($("#bookCategoryFilter")) {
    $("#bookCategoryFilter").innerHTML = `<option value="all">${tx("filterAllCategories")}</option>${categories.map((item) => `<option value="${escapeAttribute(item)}">${escapeHtml(getCategoryLabel(item))}</option>`).join("")}`;
    $("#bookCategoryFilter").value = categoryFilter && [...categories, "all"].includes(categoryFilter) ? categoryFilter : "all";
  }
  const visibleBooks = books.filter((book) => {
    const matchesQuery = `${book.title} ${book.author} ${book.category || ""}`.toLowerCase().includes(query);
    const available = book.stock - book.reserved > 0;
    const matchesFilter = filter === "all" || (filter === "available" && available);
    const matchesCategory = ($("#bookCategoryFilter")?.value || "all") === "all" || book.category === $("#bookCategoryFilter").value;
    return matchesQuery && matchesFilter && matchesCategory;
  });

  $("#books").innerHTML = visibleBooks.map((book) => {
    const available = Math.max(book.stock - book.reserved, 0);
    return `
      <article class="book-card">
        <div>
          <h3>${escapeHtml(book.title)}</h3>
          <p>${escapeHtml(book.author)}</p>
          <span class="book-category">${escapeHtml(getCategoryLabel(book.category))}</span>
        </div>
        <div class="book-meta">
          <span>${available > 0 ? `${available} ${tx("available")}` : tx("unavailable")}</span>
          <strong>${book.price.toFixed(2)} €</strong>
        </div>
        <div class="book-actions">
          <button type="button" data-action="add-cart" data-id="${book.id}" ${available === 0 ? "disabled" : ""}>${tx("addToCart")}</button>
        </div>
      </article>
    `;
  }).join("");
  prepareRevealElements($("#books"));
}

async function loadVerse() {
  if (!$("#dailyVerse")) return;
  const versePanel = document.querySelector(".verse-reveal");
  versePanel?.classList.remove("is-revealed");
  try {
    const data = await fetch("/api/verse").then((res) => res.json());
    $("#dailyVerse").textContent = data.verse[lang] || data.verse.ro;
    $("#dailyVerseRef").textContent = data.verse.reference;
  } catch {
    $("#dailyVerse").textContent = lang === "ro" ? "Domnul este Păstorul meu." : "El Señor es mi pastor.";
    $("#dailyVerseRef").textContent = "Psalmul 23:1";
  }
  window.setTimeout(() => {
    versePanel?.classList.remove("is-loading");
    versePanel?.classList.add("is-revealed");
  }, 120);
}

async function loadVideos() {
  if (!$("#videoRail")) return;
  const fallback = ["V-w7Xf8OvDg", "5ANLpkgxZGE", "R5RH-wUQHd0", "J3lrKcTgpmU"];
  try {
    const data = await fetch("/api/youtube").then((res) => res.json());
    renderVideos(data.videos);
  } catch {
    renderVideos(fallback.map((id) => ({
      id,
      title: "Biserica Betel Reus",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
      published: ""
    })));
  }
}

async function loadEvents() {
  if (!$("#landingEventsList")) return;
  try {
    const data = await fetch("/api/events").then((res) => res.json());
    churchEvents = data.events || [];
    renderLandingEvents();
  } catch {
    churchEvents = [];
    renderLandingEvents();
  }
}

function eventField(event, base) {
  const suffix = lang === "es" ? "Es" : "Ro";
  return event[`${base}${suffix}`] || event[`${base}Ro`] || event[`${base}Es`] || "";
}

function eventPoster(event) {
  return eventField(event, "poster") || "";
}

function formatEventDate(event) {
  if (!event?.date) return "";
  const date = new Date(`${event.date}T00:00:00`);
  return date.toLocaleDateString(lang === "ro" ? "ro-RO" : "es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

function renderLandingEvents() {
  const list = $("#landingEventsList");
  if (!list) return;
  list.innerHTML = churchEvents.map((event) => {
    const poster = eventPoster(event);
    const title = eventField(event, "title");
    const shortDescription = eventField(event, "shortDescription");
    return `
      <button class="event-card managed-event-card" type="button" data-event-id="${escapeAttribute(event.id)}" style="--event-accent: ${escapeAttribute(event.accentColor || "#7f090b")}">
        <div>
          <p class="eyebrow">${escapeHtml(getCategoryLabel(event.category || tx("eventsColumnTitle")))}</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(shortDescription)}</p>
          <strong>${escapeHtml(formatEventDate(event))}${event.time ? ` · ${escapeHtml(event.time)}` : ""}</strong>
          <div class="event-tags">
            ${event.location ? `<span>${escapeHtml(event.location)}</span>` : ""}
            ${event.category ? `<span>${escapeHtml(getCategoryLabel(event.category))}</span>` : ""}
          </div>
        </div>
        ${poster ? `<img src="${escapeAttribute(poster)}" width="220" height="300" alt="${escapeAttribute(title)}" loading="lazy" />` : `<span class="event-poster-placeholder">${tx("eventNoPoster")}</span>`}
      </button>
    `;
  }).join("");
  prepareRevealElements(list);
}

function renderEventModal() {
  const event = churchEvents.find((item) => item.id === activeEventId);
  const modal = $("#eventModal");
  if (!event || !modal) return;
  const title = eventField(event, "title");
  const poster = eventPoster(event);
  $("#eventModalCategory").textContent = getCategoryLabel(event.category || tx("eventsColumnTitle"));
  $("#eventModalTitle").textContent = title;
  $("#eventModalDescription").textContent = eventField(event, "shortDescription");
  $("#eventModalDate").textContent = formatEventDate(event);
  $("#eventModalTime").textContent = event.time || "-";
  $("#eventModalLocation").textContent = event.location || "-";
  $("#eventModalFull").textContent = eventField(event, "fullDescription");
  $("#eventModalPoster").src = poster || "";
  $("#eventModalPoster").alt = poster ? title : tx("eventNoPoster");
  modal.style.setProperty("--event-accent", event.accentColor || "#7f090b");
}

function openEventModal(id) {
  activeEventId = id;
  renderEventModal();
  $("#eventModal")?.classList.add("is-open");
  $("#eventModal")?.setAttribute("aria-hidden", "false");
  document.body.classList.add("event-modal-open");
}

function closeEventModal() {
  activeEventId = null;
  $("#eventModal")?.classList.remove("is-open");
  $("#eventModal")?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("event-modal-open");
}

function setupEvents() {
  $("#landingEventsList")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-event-id]");
    if (!card) return;
    openEventModal(card.dataset.eventId);
  });
  $$("[data-event-modal-close]").forEach((button) => button.addEventListener("click", closeEventModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeEventId) closeEventModal();
  });
}

function renderVideos(videos) {
  const selectedVideos = videos.slice(0, 30);
  const videoCards = selectedVideos.map((video) => `
    <a class="video-card" href="${escapeAttribute(video.url)}" target="_blank" rel="noreferrer" draggable="false">
      <img src="${escapeAttribute(video.thumbnail)}" width="480" height="360" alt="${escapeAttribute(video.title)}" loading="lazy" draggable="false" />
      <span>${video.published ? new Date(video.published).toLocaleDateString(lang === "ro" ? "ro-RO" : "es-ES") : "YouTube"}</span>
      <h3>${escapeHtml(video.title)}</h3>
    </a>
  `).join("");
  $("#videoRail").innerHTML = `
    <div class="video-track">
      ${videoCards}
      ${videoCards}
    </div>
  `;
  startVideoRotation();
  prepareRevealElements($("#videoRail"));
}

function startHeroRotation() {
  const hero = $(".hero");
  if (!hero) return;
  let index = 0;
  hero.style.setProperty("--hero-image", `url("${heroImages[index]}")`);
  setInterval(() => {
    index = (index + 1) % heroImages.length;
    hero.style.setProperty("--hero-image", `url("${heroImages[index]}")`);
  }, 16000);
}

function startVideoRotation() {
  const rail = $("#videoRail");
  if (!rail) return;
  cancelAnimationFrame(videoRotationFrame);
  clearTimeout(videoResumeTimer);
  const track = rail.querySelector(".video-track");
  if (!track) return;

  let paused = false;
  let dragging = false;
  let dragged = false;
  let startX = 0;
  let startOffset = 0;
  let offset = 0;
  let lastTime = 0;
  let halfWidth = 0;

  const updateWidth = () => {
    halfWidth = track.scrollWidth / 2;
  };

  const normalizeOffset = () => {
    if (halfWidth <= 0) updateWidth();
    if (halfWidth <= 0) return;
    while (offset <= -halfWidth) offset += halfWidth;
    while (offset > 0) offset -= halfWidth;
  };

  const paint = () => {
    normalizeOffset();
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const pause = () => {
    paused = true;
    clearTimeout(videoResumeTimer);
  };

  const resumeSoon = () => {
    clearTimeout(videoResumeTimer);
    videoResumeTimer = setTimeout(() => {
      paused = false;
      lastTime = 0;
    }, 2500);
  };

  const tick = (time) => {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;
    if (!paused && !dragging) {
      offset -= delta * 0.035;
      paint();
    }
    videoRotationFrame = requestAnimationFrame(tick);
  };

  rail.addEventListener("pointerenter", pause);
  rail.addEventListener("pointerleave", () => {
    if (!dragging) resumeSoon();
  });

  rail.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragging = true;
    dragged = false;
    startX = event.clientX;
    startOffset = offset;
    pause();
  });

  rail.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 10) {
      dragged = true;
      rail.classList.add("is-dragging");
      rail.setPointerCapture?.(event.pointerId);
    }
    if (!dragged) return;
    offset = startOffset + distance;
    paint();
  });

  rail.addEventListener("wheel", (event) => {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!movement) return;
    event.preventDefault();
    pause();
    offset -= movement;
    paint();
    resumeSoon();
  }, { passive: false });

  const finishDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove("is-dragging");
    if (dragged) rail.releasePointerCapture?.(event.pointerId);
    resumeSoon();
    setTimeout(() => {
      dragged = false;
    }, 120);
  };

  rail.addEventListener("pointerup", finishDrag);
  rail.addEventListener("pointercancel", finishDrag);
  rail.addEventListener("click", (event) => {
    const link = event.target.closest(".video-card");
    if (!link) return;
    event.preventDefault();
    event.stopPropagation();
    if (dragged) return;
    window.open(link.href, "_blank", "noopener,noreferrer");
  }, true);

  updateWidth();
  window.addEventListener("resize", updateWidth, { passive: true });
  paint();
  videoRotationFrame = requestAnimationFrame(tick);
}

async function unlockLibrary() {
  const authPage = $("#libraryAuthPage");
  $("#libraryGate")?.classList.add("is-hidden");
  $("#libraryShell")?.classList.remove("is-hidden");
  if ($("#activeMember")) $("#activeMember").textContent = currentMemberName;
  await loadBooksFromApi();
  prepareRevealElements($("#libraryShell"));
  renderBooks();
  renderCart();
  authPage?.classList.remove("is-auth-checking");
}

function setupLibrary() {
  if (!$("#libraryGate")) return;
  const authPage = $("#libraryAuthPage");

  if (currentMemberName) {
    unlockLibrary().catch(() => {
      currentMemberName = "";
      localStorage.removeItem("betel-member-name");
      $("#libraryShell")?.classList.add("is-hidden");
      $("#libraryGate")?.classList.remove("is-hidden");
      authPage?.classList.remove("is-auth-checking");
    });
  } else {
    authPage?.classList.remove("is-auth-checking");
  }

  const openMobileCart = () => {
    document.body.classList.add("cart-open");
    $("#mobileCartToggle")?.setAttribute("aria-expanded", "true");
  };

  const closeMobileCart = () => {
    document.body.classList.remove("cart-open");
    $("#mobileCartToggle")?.setAttribute("aria-expanded", "false");
  };

  $("#accessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    const code = data.get("code").trim().toUpperCase();
    if (code === accessCode) {
      currentMemberName = name;
      localStorage.setItem("betel-member-name", currentMemberName);
      await unlockLibrary();
      return;
    }
    $("#accessMessage").textContent = tx("accessDenied");
  });

  $("#exitLibrary")?.addEventListener("click", () => {
    currentMemberName = "";
    localStorage.removeItem("betel-member-name");
    cart = [];
    saveCart();
    renderCart();
    closeMobileCart();
    $("#libraryShell")?.classList.add("is-hidden");
    $("#libraryGate")?.classList.remove("is-hidden");
    $("#accessForm").reset();
  });

  $("#books").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const book = books.find((item) => item.id === button.dataset.id);
    if (!book) return;
    if (button.dataset.action === "add-cart") addToCart(book);
  });

  $("#cartItems").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.action === "remove-cart") {
      cart = cart.filter((item) => item.id !== button.dataset.id);
      saveCart();
      renderCart();
    }
  });

  $("#confirmCart").addEventListener("click", confirmCart);
  $("#mobileCartToggle")?.addEventListener("click", openMobileCart);
  $("#mobileCartClose")?.addEventListener("click", closeMobileCart);
  $("#mobileCartBackdrop")?.addEventListener("click", closeMobileCart);
  $("#bookSearch").addEventListener("input", renderBooks);
  $("#bookFilter").addEventListener("change", renderBooks);
  $("#bookCategoryFilter")?.addEventListener("change", renderBooks);
}

function addToCart(book) {
  const existing = cart.find((item) => item.id === book.id);
  const inCart = existing?.quantity || 0;
  const available = Math.max(Number(book.stock || 0) - Number(book.reserved || 0), 0);
  if (inCart >= available) return;

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: book.id, title: book.title, author: book.author, price: Number(book.price || 0), quantity: 1 });
  }
  saveCart();
  renderCart();
}

function renderCart() {
  if (!$("#cartItems")) return;
  const t = translations[lang] || translations[defaultLanguage] || {};
  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if ($("#mobileCartCount")) $("#mobileCartCount").textContent = String(itemCount);
  $("#mobileCartToggle")?.classList.toggle("has-items", itemCount > 0);
  if (cart.length === 0) {
    $("#cartItems").innerHTML = `<p>${t.cartEmpty}</p>`;
    $("#cartTotal").textContent = "0.00 €";
    $("#confirmCart").disabled = true;
    return;
  }

  $("#confirmCart").disabled = false;
  $("#cartItems").innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${item.quantity} x ${Number(item.price || 0).toFixed(2)} €</span>
      </div>
      <button type="button" data-action="remove-cart" data-id="${item.id}">×</button>
    </article>
  `).join("");
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  $("#cartTotal").textContent = `${total.toFixed(2)} €`;
}

async function confirmCart() {
  if (cart.length === 0) return;
  const member = currentMemberName || "Membru";
  const request = {
    member,
    contact: "biblioteca",
    items: cart.map((item) => ({ title: item.title, quantity: item.quantity, price: item.price })),
    createdAt: new Date().toISOString()
  };
  try {
    const data = await apiRequest("/api/orders", {
      method: "POST",
      body: {
        member,
        contact: "biblioteca",
        items: cart.map((item) => ({ id: item.id, quantity: item.quantity }))
      }
    });
    reservations.unshift(data.order);
  } catch (error) {
    const fallbackRequest = { ...request, id: crypto.randomUUID(), status: "pending" };
    reservations.unshift(fallbackRequest);
    logAudit("Cerere trimisă de membru", "reservation", null, fallbackRequest);
    saveReservations();
  }
  cart = [];
  saveCart();
  renderCart();
  document.body.classList.remove("cart-open");
  $("#mobileCartToggle")?.setAttribute("aria-expanded", "false");
  $("#cartMessage").textContent = tx("cartSent");
}

async function unlockAdmin(code = currentAdminCode || defaultAdminCode) {
  const authPage = $("#adminAuthPage");
  currentAdminCode = code;
  await loadBooksFromApi();
  await loadAdminDataFromApi(true);
  sessionStorage.setItem("betel-admin-code", currentAdminCode);
  sessionStorage.setItem("betel-admin-expires-at", String(Date.now() + adminSessionMs));
  $("#adminGate")?.classList.add("is-hidden");
  $("#adminShell")?.classList.remove("is-hidden");
  renderAdmin();
  authPage?.classList.remove("is-auth-checking");
}

function setupAdmin() {
  if (!$("#adminGate")) return;
  const authPage = $("#adminAuthPage");
  const sessionOnly = authPage?.dataset.adminSessionOnly === "true";

  const expiresAt = Number(sessionStorage.getItem("betel-admin-expires-at") || 0);
  if (currentAdminCode && expiresAt > Date.now()) {
    unlockAdmin().catch(() => {
      currentAdminCode = "";
      sessionStorage.removeItem("betel-admin-code");
      sessionStorage.removeItem("betel-admin-expires-at");
      $("#adminAccessMessage").textContent = tx("adminReenterCode");
      authPage?.classList.remove("is-auth-checking");
    });
  } else {
    sessionStorage.removeItem("betel-admin-code");
    sessionStorage.removeItem("betel-admin-expires-at");
    currentAdminCode = "";
    if (sessionOnly) {
      window.location.href = "/admin.html";
      return;
    }
    authPage?.classList.remove("is-auth-checking");
  }

  $("#adminAccessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code").trim();
    $("#adminAccessMessage").textContent = tx("adminChecking");
    try {
      await unlockAdmin(code);
      $("#adminAccessMessage").textContent = "";
    } catch (error) {
      currentAdminCode = "";
      $("#adminAccessMessage").textContent = tx("adminWrongCode");
    }
  });

  $("#exitAdmin")?.addEventListener("click", () => {
    currentAdminCode = "";
    sessionStorage.removeItem("betel-admin-code");
    sessionStorage.removeItem("betel-admin-expires-at");
    $("#adminShell")?.classList.add("is-hidden");
    $("#adminGate")?.classList.remove("is-hidden");
    $("#adminAccessForm").reset();
  });

  $("#adminBookForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const editingId = data.get("id");
    const submitButton = form.querySelector("button[type='submit']");
    const message = $("#adminFormMessage");
    submitButton.disabled = true;
    submitButton.textContent = editingId ? tx("adminUpdating") : tx("adminSaving");
    message.textContent = "";
    const payload = {
      title: data.get("title").trim(),
      author: data.get("author").trim(),
      category: data.get("category").trim() || "General",
      language: data.get("language"),
      stock: Number(data.get("stock")),
      reserved: Number(data.get("reserved")),
      price: Number(data.get("price"))
    };

    if (editingId) {
      try {
        const data = await apiRequest(`/api/admin/books/${editingId}`, { method: "PATCH", body: payload });
        const index = books.findIndex((item) => item.id === editingId);
        if (index >= 0) books[index] = data.book;
      } catch (error) {
        if (usingServerData || error.status === 401) {
          message.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminDbUpdateError");
          submitButton.disabled = false;
          submitButton.textContent = tx("adminUpdateBook");
          return;
        }
        const book = books.find((item) => item.id === editingId);
        if (book) {
          const before = { ...book };
          Object.assign(book, payload);
          logAudit("Carte actualizată", "book", before, { ...book });
        }
      }
    } else {
      const temporaryId = `tmp-${crypto.randomUUID()}`;
      const optimisticBook = { id: temporaryId, ...payload };
      books.unshift(optimisticBook);
      form.reset();
      form.elements.id.value = "";
      $("#adminSubmitLabel").textContent = tx("adminSaveBook");
      submitButton.disabled = false;
      submitButton.textContent = tx("adminSaveBook");
      message.textContent = tx("adminBookAddedSaving");
      saveBooks();
      renderAdmin();

      try {
        const response = await apiRequest("/api/admin/books", { method: "POST", body: payload });
        const index = books.findIndex((item) => item.id === temporaryId);
        if (index >= 0) books[index] = response.book;
        message.textContent = tx("adminSaved");
      } catch (error) {
        if (usingServerData || error.status === 401) {
          books = books.filter((item) => item.id !== temporaryId);
          message.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminDbSaveError");
          saveBooks();
          renderAdmin();
          return;
        }
        logAudit("Carte creată", "book", null, optimisticBook);
      }
      saveBooks();
      renderAdmin();
      return;
    }

    form.reset();
    form.elements.id.value = "";
    $("#adminSubmitLabel").textContent = tx("adminSaveBook");
    submitButton.disabled = false;
    message.textContent = tx("adminSaved");
    saveBooks();
    renderAdmin();
  });
  setupEventPosterColorDetection();
  $("#adminSearch")?.addEventListener("input", renderAdminBooks);
  $("#adminCategoryFilter")?.addEventListener("change", renderAdminBooks);
  $("#saveStockChanges")?.addEventListener("click", savePendingStockChanges);
  $("#importBooks")?.addEventListener("click", importBulkBooks);
  $("#auditPrev")?.addEventListener("click", () => {
    auditPage = Math.max(0, auditPage - 1);
    renderAuditLog();
  });
  $("#auditNext")?.addEventListener("click", () => {
    const maxPage = Math.max(0, Math.ceil(auditLogs.length / auditPageSize) - 1);
    auditPage = Math.min(maxPage, auditPage + 1);
    renderAuditLog();
  });

  $("#adminBooks")?.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const book = books.find((item) => item.id === button.dataset.id);
    if (!book) return;
    const before = { ...book };

    if (button.dataset.action === "edit") {
      const form = $("#adminBookForm");
      form.elements.id.value = book.id;
      form.elements.title.value = book.title;
      form.elements.author.value = book.author;
      form.elements.category.value = book.category || "";
      form.elements.language.value = book.language || "ro";
      form.elements.stock.value = book.stock;
      form.elements.reserved.value = book.reserved || 0;
      form.elements.price.value = book.price;
      $("#adminSubmitLabel").textContent = tx("adminUpdateBook");
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      if (button.dataset.action === "plus" || button.dataset.action === "minus") {
        if (!pendingStockChanges.has(book.id)) pendingStockChanges.set(book.id, Number(book.stock || 0));
        if (button.dataset.action === "plus") book.stock += 1;
        if (button.dataset.action === "minus") book.stock = Math.max(book.reserved || 0, book.stock - 1);
      }
      if (button.dataset.action === "delete") {
        await apiRequest(`/api/admin/books/${book.id}`, { method: "DELETE" });
        books = books.filter((item) => item.id !== book.id);
        pendingStockChanges.delete(book.id);
      }
    } catch (error) {
      if (button.dataset.action === "delete") books = books.filter((item) => item.id !== book.id);
      logAudit(`Inventar: ${button.dataset.action}`, "book", before, button.dataset.action === "delete" ? null : { ...book });
    }
    saveBooks();
    renderAdmin();
  });

  $("#volleyRegistrationsList")?.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const registration = volleyRegistrations.find((item) => item.id === button.dataset.id);
    if (!registration || button.dataset.action !== "manage") return;
    openVolleyManageDrawer(registration.id);
  });

  $("#volleyManageDrawer")?.addEventListener("click", handleVolleyDrawerClick);
  $("#volleyManageDrawer")?.addEventListener("input", updateVolleyDrawerDirtyState);
  $("#volleyManageDrawer")?.addEventListener("change", updateVolleyDrawerDirtyState);
  $("#volleyDeleteConfirmModal")?.addEventListener("click", handleVolleyDeleteConfirmClick);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (pendingVolleyDeleteId) {
      closeVolleyDeleteConfirm();
      return;
    }
    if (activeVolleyRegistrationId) closeVolleyManageDrawer();
  });

  $("#addEventButton")?.addEventListener("click", () => openEventEditor());
  $("#addEventButtonInline")?.addEventListener("click", () => openEventEditor());
  $("#addEventButtonEmpty")?.addEventListener("click", () => openEventEditor());
  $("#closeEventEditor")?.addEventListener("click", closeEventEditor);
  $("#saveEventDraft")?.addEventListener("click", () => saveEventFromForm({ forceDraft: true }));
  $("#deleteEventButton")?.addEventListener("click", deleteCurrentEvent);
  $("#adminEventForm")?.addEventListener("input", renderAdminEventPreview);
  $("#adminEventForm")?.addEventListener("change", renderAdminEventPreview);
  $("#adminEventForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEventFromForm();
  });

  $("#adminEventsList")?.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const selectedEvent = churchEvents.find((item) => item.id === button.dataset.id);
    if (!selectedEvent) return;

    if (button.dataset.action === "edit") {
      openEventEditor(selectedEvent);
      return;
    }

    if (button.dataset.action === "toggle") {
      try {
        const data = await apiRequest(`/api/admin/events/${selectedEvent.id}`, {
          method: "PATCH",
          body: { ...selectedEvent, published: !selectedEvent.published }
        });
        Object.assign(selectedEvent, data.event);
        renderAdmin();
      } catch {
        $("#adminEventMessage").textContent = tx("adminEventsSaveError");
      }
      return;
    }

    if (button.dataset.action === "delete") {
      editingEventId = selectedEvent.id;
      await deleteCurrentEvent();
    }
  });

  $("#reservationsList")?.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const reservation = reservations.find((item) => item.id === button.dataset.id);
    if (!reservation) return;
    if (processingReservationIds.has(reservation.id)) return;
    const before = { ...reservation };
    processingReservationIds.add(reservation.id);
    renderAdminReservations();
    try {
      const data = await apiRequest(`/api/admin/orders/${reservation.id}`, {
        method: "PATCH",
        body: { status: button.dataset.status }
      });
      Object.assign(reservation, data.order);
      if (button.dataset.status === "collected") await loadBooksFromApi();
    } catch (error) {
      reservation.status = button.dataset.status;
      if (button.dataset.status === "collected" && !reservation.fulfilled) {
        getReservationItems(reservation).forEach((item) => {
          const book = books.find((entry) => entry.title === item.title);
          if (book) book.stock = Math.max(0, Number(book.stock || 0) - Number(item.quantity || 1));
        });
        reservation.fulfilled = true;
        saveBooks();
      }
      logAudit(`Cerere marcată ca ${button.dataset.status}`, "reservation", before, { ...reservation });
    } finally {
      processingReservationIds.delete(reservation.id);
    }
    saveReservations();
    renderAdminReservations();
    renderAdminStats();
    renderAdminBooks();
    renderAuditLog();
  });
}

function renderAdmin() {
  renderAdminStats();
  renderAdminBooks();
  renderAdminVolleyRegistrations();
  renderAdminEvents();
  renderAdminReservations();
  renderAuditLog();
  updateStockSaveButton();
}

function updateStockSaveButton() {
  if (!$("#saveStockChanges")) return;
  const count = pendingStockChanges.size;
  $("#saveStockChanges").disabled = count === 0;
  $("#saveStockChanges").textContent = count === 0 ? tx("adminSaveStockChanges") : `${tx("adminSaveStockChangesCount")} (${count})`;
}

async function savePendingStockChanges() {
  if (pendingStockChanges.size === 0) return;
  const button = $("#saveStockChanges");
  const message = $("#stockChangesMessage");
  button.disabled = true;
  button.textContent = tx("adminStockSaving");
  message.textContent = "";

  try {
    for (const [bookId, originalStock] of pendingStockChanges.entries()) {
      const book = books.find((item) => item.id === bookId);
      if (!book) continue;
      const delta = Number(book.stock || 0) - Number(originalStock || 0);
      if (delta !== 0) {
        const data = await apiRequest(`/api/admin/books/${bookId}/stock`, {
          method: "PATCH",
          body: { delta }
        });
        Object.assign(book, data.book);
      }
    }
    pendingStockChanges.clear();
    await loadAdminDataFromApi();
    message.textContent = tx("adminStockSaved");
  } catch (error) {
    message.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminStockSaveError");
  }

  saveBooks();
  renderAdmin();
}

function normalizeBulkLanguage(value) {
  const normalized = String(value || "ro").trim().toLowerCase();
  const compact = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (["ro", "romana", "romanian", "rumano", "rumana", "română"].includes(normalized) || ["ro", "romana", "romanian", "rumano", "rumana"].includes(compact)) return "ro";
  if (["es", "spaniola", "spanish", "espanol", "español", "castellano", "sp"].includes(normalized) || ["es", "spaniola", "spanish", "espanol", "castellano", "sp"].includes(compact)) return "es";
  if (["en", "engleza", "english", "ingles", "inglés"].includes(normalized) || ["en", "engleza", "english", "ingles"].includes(compact)) return "en";
  return normalized || "ro";
}

function parseBulkBooksInput(value) {
  const invalidLines = [];
  const books = value
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
    .filter((item) => item.line)
    .map((item) => {
      const parts = item.line.split(";").map((part) => part.trim());
      const [title, author, category = "General", language = "ro", stock = "1", price = "0"] = parts;
      if (!title || !author) {
        invalidLines.push(item.number);
        return null;
      }
      return {
        title,
        author,
        category: category || "General",
        language: normalizeBulkLanguage(language),
        stock: Math.max(0, Number(stock) || 0),
        reserved: 0,
        price: Math.max(0, Number(String(price).replace(",", ".")) || 0)
      };
    })
    .filter(Boolean);

  return { books, invalidLines };
}

async function importBulkBooks() {
  const input = $("#bulkBooksInput");
  const message = $("#bulkImportMessage");
  const button = $("#importBooks");
  const { books: parsedBooks, invalidLines } = parseBulkBooksInput(input.value);

  if (invalidLines.length > 0) {
    message.textContent = `${tx("adminBulkInvalidLine")}: ${invalidLines.join(", ")}. ${tx("adminBulkHelp")}`;
    return;
  }

  if (parsedBooks.length === 0) {
    message.textContent = tx("adminAddBulkLine");
    return;
  }

  button.disabled = true;
  button.textContent = tx("adminImporting");
  message.textContent = `${parsedBooks.length} ${tx("adminBooksAddedSaving")}`;

  try {
    const response = await apiRequest("/api/admin/books/bulk", {
      method: "POST",
      body: { books: parsedBooks }
    });
    books.unshift(...response.books);
    input.value = "";
    message.textContent = `${response.books.length} ${tx("adminBooksImported")}`;
    await loadAdminDataFromApi();
  } catch (error) {
    if (usingServerData || error.status === 401) {
      message.textContent = error.status === 401 ? tx("adminAuthError") : `${tx("adminDbImportError")} ${error.message || ""}`.trim();
    } else {
      const temporaryBooks = parsedBooks.map((book) => ({ id: `tmp-${crypto.randomUUID()}`, ...book }));
      books.unshift(...temporaryBooks);
      logAudit("Cărți importate", "book", null, temporaryBooks);
      message.textContent = `${temporaryBooks.length} ${tx("adminBooksImportedLocal")}`;
    }
  }

  button.disabled = false;
  button.textContent = tx("adminImportBooks");
  saveBooks();
  renderAdmin();
}

function renderAdminStats() {
  if (!$("#adminStats")) return;
  const totalStock = books.reduce((sum, book) => sum + Number(book.stock || 0), 0);
  const totalReserved = books.reduce((sum, book) => sum + Number(book.reserved || 0), 0);
  const lowStock = books.filter((book) => Number(book.stock || 0) - Number(book.reserved || 0) <= 1).length;
  const pending = reservations.filter((item) => item.status === "pending").length;
  $("#adminStats").innerHTML = `
    <article><span>${tx("adminTableBook")}</span><strong>${books.length}</strong></article>
    <article><span>${tx("adminTotalStock")}</span><strong>${totalStock}</strong></article>
    <article><span>${tx("filterReserved")}</span><strong>${totalReserved}</strong></article>
    <article><span>${tx("adminLowStock")}</span><strong>${lowStock}</strong></article>
    <article><span>${tx("adminPendingRequests")}</span><strong>${pending}</strong></article>
  `;
}

function renderAdminBooks() {
  if (!$("#adminBooks")) return;
  const query = $("#adminSearch").value.toLowerCase();
  const category = $("#adminCategoryFilter").value;
  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
  $("#adminCategoryFilter").innerHTML = `<option value="all">${tx("filterAllCategories")}</option>${categories.map((item) => `<option value="${escapeAttribute(item)}">${escapeHtml(getCategoryLabel(item))}</option>`).join("")}`;
  $("#adminCategoryFilter").value = category && [...categories, "all"].includes(category) ? category : "all";

  const visibleBooks = books.filter((book) => {
    const text = `${book.title} ${book.author} ${book.category || ""}`.toLowerCase();
    return text.includes(query) && ($("#adminCategoryFilter").value === "all" || book.category === $("#adminCategoryFilter").value);
  });

  $("#adminBooks").innerHTML = visibleBooks.map((book) => {
    const available = Math.max(Number(book.stock || 0) - Number(book.reserved || 0), 0);
    const originalStock = pendingStockChanges.get(book.id);
    const stockClass = originalStock === undefined ? "" : " class=\"stock-pending\"";
    const stockLabel = originalStock === undefined ? book.stock : `${book.stock}*`;
    return `
      <tr>
        <td><strong>${escapeHtml(book.title)}</strong><span>${escapeHtml(book.author)}</span></td>
        <td>${escapeHtml(getCategoryLabel(book.category))}</td>
        <td>${escapeHtml(book.language || "ro")}</td>
        <td${stockClass}>${stockLabel}</td>
        <td>${book.reserved || 0}</td>
        <td>${available}</td>
        <td>${Number(book.price || 0).toFixed(2)} €</td>
        <td class="table-actions">
          <button type="button" data-action="minus" data-id="${book.id}">-</button>
          <button type="button" data-action="plus" data-id="${book.id}">+</button>
          <button type="button" data-action="edit" data-id="${book.id}">${tx("adminEdit")}</button>
          <button type="button" data-action="delete" data-id="${book.id}">${tx("adminDelete")}</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderAdminReservations() {
  if (!$("#reservationsList")) return;
  const activeReservations = reservations.filter((reservation) => !["collected", "cancelled"].includes(reservation.status));
  $("#reservationsList").innerHTML = activeReservations.map((reservation) => {
    const items = getReservationItems(reservation);
    const title = items.map((item) => `${item.quantity || 1} x ${item.title}`).join(", ");
    const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    const processing = processingReservationIds.has(reservation.id);
    const disabled = processing ? "disabled" : "";
    return `
    <article class="reservation-card">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(reservation.member)} · ${escapeHtml(reservation.contact)}</span>
        <span>${total.toFixed(2)} €</span>
        <small>${new Date(reservation.createdAt).toLocaleString(lang === "ro" ? "ro-RO" : "es-ES")}</small>
      </div>
      <mark>${getStatusLabel(reservation.status)}</mark>
      <div class="table-actions">
        <button type="button" data-id="${reservation.id}" data-status="collected" ${disabled}>${tx("adminComplete")}</button>
        <button type="button" data-id="${reservation.id}" data-status="cancelled" ${disabled}>${tx("adminCancel")}</button>
      </div>
    </article>
  `;
  }).join("") || `<p>${tx("adminNoRequests")}</p>`;
}

function getVolleyStatusLabel(status) {
  return {
    pending: tx("adminVolleyPending"),
    approved: tx("adminVolleyApproved"),
    rejected: tx("adminVolleyRejected")
  }[status] || status;
}

function getVolleyColorLabel(colorId) {
  const color = volleyShirtColors.find((item) => item.id === colorId);
  return color ? color[lang] || color.ro : colorId || "-";
}

function getVolleyColorHex(colorId) {
  return volleyShirtColors.find((item) => item.id === colorId)?.hex || "#d8d0c2";
}

function volleyColorOptions(selectedColor) {
  const knownColor = volleyShirtColors.some((color) => color.id === selectedColor);
  const unknownSelectedColor = selectedColor && !knownColor
    ? `<option value="${escapeAttribute(selectedColor)}" selected>${escapeHtml(selectedColor)}</option>`
    : "";
  return `<option value="">-</option>${unknownSelectedColor}${volleyShirtColors.map((color) =>
    `<option value="${escapeAttribute(color.id)}" ${color.id === selectedColor ? "selected" : ""}>${escapeHtml(color[lang] || color.ro)}${color.full && color.id !== selectedColor ? ` · ${tx("volleyColorComplete")}` : ""}</option>`
  ).join("")}`;
}

function volleyStatusClass(status) {
  return ["pending", "approved", "rejected"].includes(status) ? status : "pending";
}

function volleyPlayersPreview(players = []) {
  const list = Array.isArray(players) ? players : [];
  const preview = list.slice(0, 3).join(", ");
  if (!preview) return tx("adminVolleyNoPlayers");
  return list.length > 3 ? `${preview} +${list.length - 3}` : preview;
}

function volleyPayloadFromRegistration(registration, overrides = {}) {
  return {
    teamName: registration.teamName || "",
    representativeName: registration.representativeName || "",
    churchName: registration.churchName || "",
    shirtColor: registration.shirtColor || "",
    players: Array.isArray(registration.players) ? registration.players : [],
    notes: registration.notes || "",
    status: registration.status || "pending",
    ...overrides
  };
}

function getActiveVolleyRegistration() {
  return volleyRegistrations.find((item) => item.id === activeVolleyRegistrationId);
}

function volleyDrawerSectionValues(section) {
  const drawer = $("#volleyManageDrawer");
  if (!drawer) return null;
  if (section === "team") {
    return {
      teamName: drawer.querySelector("[data-volley-field='teamName']")?.value.trim() || "",
      representativeName: drawer.querySelector("[data-volley-field='representativeName']")?.value.trim() || "",
      churchName: drawer.querySelector("[data-volley-field='churchName']")?.value.trim() || "",
      shirtColor: drawer.querySelector("[data-volley-field='shirtColor']")?.value || ""
    };
  }
  if (section === "players") {
    return {
      players: (drawer.querySelector("[data-volley-field='players']")?.value || "")
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean)
    };
  }
  if (section === "notes") {
    return { notes: drawer.querySelector("[data-volley-field='notes']")?.value.trim() || "" };
  }
  return null;
}

function setVolleyDrawerSectionValues(section, values = {}) {
  const drawer = $("#volleyManageDrawer");
  if (!drawer) return;
  if (section === "team") {
    const fields = ["teamName", "representativeName", "churchName", "shirtColor"];
    fields.forEach((field) => {
      const input = drawer.querySelector(`[data-volley-field='${field}']`);
      if (input && field in values) input.value = values[field];
    });
  }
  if (section === "players") {
    const textarea = drawer.querySelector("[data-volley-field='players']");
    if (textarea) textarea.value = (values.players || []).join("\n");
  }
  if (section === "notes") {
    const textarea = drawer.querySelector("[data-volley-field='notes']");
    if (textarea) textarea.value = values.notes || "";
  }
}

function setVolleyDrawerSnapshots(registration) {
  volleyDrawerSectionSnapshots = {
    team: JSON.stringify({
      teamName: registration.teamName || "",
      representativeName: registration.representativeName || "",
      churchName: registration.churchName || "",
      shirtColor: registration.shirtColor || ""
    }),
    players: JSON.stringify({ players: Array.isArray(registration.players) ? registration.players : [] }),
    notes: JSON.stringify({ notes: registration.notes || "" })
  };
}

function volleyDrawerHasUnsavedChanges() {
  return ["team", "players", "notes"].some((section) => {
    const values = volleyDrawerSectionValues(section);
    return values && JSON.stringify(values) !== volleyDrawerSectionSnapshots[section];
  });
}

function updateVolleyDrawerDirtyState() {
  const drawer = $("#volleyManageDrawer");
  if (!drawer?.classList.contains("is-open")) return;
  drawer.classList.toggle("has-unsaved-changes", volleyDrawerHasUnsavedChanges());
}

function setVolleyDrawerFeedback(section, text, state = "") {
  const target = $(`[data-volley-feedback='${section}']`);
  if (!target) return;
  target.textContent = text;
  target.className = `admin-drawer-feedback${state ? ` is-${state}` : ""}`;
}

function setVolleyDrawerButtons(section, disabled) {
  $$(`[data-volley-section='${section}'] button`).forEach((button) => {
    button.disabled = disabled;
  });
}

function openVolleyManageDrawer(registrationId) {
  activeVolleyRegistrationId = registrationId;
  const drawer = $("#volleyManageDrawer");
  if (!drawer) return;
  renderVolleyManageDrawer();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-drawer-open");
  window.setTimeout(() => drawer.querySelector(".admin-drawer-panel [data-volley-drawer-close]")?.focus(), 0);
}

function closeVolleyManageDrawer({ force = false } = {}) {
  if (!activeVolleyRegistrationId) return;
  if (!force && volleyDrawerHasUnsavedChanges() && !window.confirm(tx("adminVolleyUnsavedConfirm"))) return;
  const drawer = $("#volleyManageDrawer");
  drawer?.classList.remove("is-open", "has-unsaved-changes");
  drawer?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("admin-drawer-open");
  activeVolleyRegistrationId = null;
  volleyDrawerSectionSnapshots = {};
  $("#volleyDrawerContent") && ($("#volleyDrawerContent").innerHTML = "");
  $("#volleyRegistrationsList button[data-action='manage']")?.focus();
}

function volleyStatusActions(status) {
  if (status === "approved") return [
    ["rejected", "adminVolleyRejectTeam"],
    ["pending", "adminVolleyMarkPending"]
  ];
  if (status === "rejected") return [
    ["approved", "adminVolleyAcceptTeam"],
    ["pending", "adminVolleyMarkPending"]
  ];
  return [
    ["approved", "adminVolleyAcceptTeam"],
    ["rejected", "adminVolleyRejectTeam"]
  ];
}

function renderVolleyManageDrawer() {
  const registration = getActiveVolleyRegistration();
  const drawer = $("#volleyManageDrawer");
  const content = $("#volleyDrawerContent");
  if (!drawer || !content || !registration) return;
  $("#volleyDrawerTitle").textContent = registration.teamName || tx("adminVolleyTeam");
  setVolleyDrawerSnapshots(registration);
  const status = volleyStatusClass(registration.status);
  const colorLabel = getVolleyColorLabel(registration.shirtColor);
  content.innerHTML = `
    <section class="admin-drawer-section" data-volley-section="status">
      <h3>${tx("adminVolleyStatusSection")}</h3>
      <span class="volley-status ${escapeAttribute(status)}">${escapeHtml(getVolleyStatusLabel(status))}</span>
      <div class="admin-drawer-actions">
        ${volleyStatusActions(status).map(([nextStatus, labelKey]) => `
          <button class="button secondary" type="button" data-volley-action="status" data-status="${escapeAttribute(nextStatus)}">${tx(labelKey)}</button>
        `).join("")}
      </div>
      <span class="admin-drawer-feedback" data-volley-feedback="status"></span>
    </section>

    <section class="admin-drawer-section" data-volley-section="team">
      <h3>${tx("adminVolleyTeamDataSection")}</h3>
      <div class="admin-drawer-grid">
        <label>
          <span>${tx("adminVolleyTeam")}</span>
          <input data-volley-field="teamName" value="${escapeAttribute(registration.teamName)}" />
        </label>
        <label>
          <span>${tx("adminVolleyRepresentative")}</span>
          <input data-volley-field="representativeName" value="${escapeAttribute(registration.representativeName)}" />
        </label>
        <label>
          <span>${tx("adminVolleyChurch")}</span>
          <input data-volley-field="churchName" value="${escapeAttribute(registration.churchName || "")}" />
        </label>
        <label>
          <span>${tx("adminVolleyColor")}</span>
          <select data-volley-field="shirtColor" title="${escapeAttribute(colorLabel)}">
            ${volleyColorOptions(registration.shirtColor)}
          </select>
        </label>
      </div>
      <div class="admin-drawer-actions">
        <button class="button primary" type="button" data-volley-action="save-team">${tx("adminVolleySaveTeamData")}</button>
      </div>
      <span class="admin-drawer-feedback" data-volley-feedback="team"></span>
    </section>

    <section class="admin-drawer-section" data-volley-section="players">
      <h3>${tx("adminVolleyPlayersSection")}</h3>
      <label>
        <span>${tx("adminVolleyPlayersHelp")}</span>
        <textarea data-volley-field="players">${escapeHtml((registration.players || []).join("\n"))}</textarea>
      </label>
      <div class="admin-drawer-actions">
        <button class="button primary" type="button" data-volley-action="save-players">${tx("adminVolleySavePlayers")}</button>
      </div>
      <span class="admin-drawer-feedback" data-volley-feedback="players"></span>
    </section>

    <section class="admin-drawer-section" data-volley-section="notes">
      <h3>${tx("adminVolleyNotesSection")}</h3>
      <label>
        <span>${tx("adminVolleyNotes")}</span>
        <textarea data-volley-field="notes">${escapeHtml(registration.notes || "")}</textarea>
      </label>
      <div class="admin-drawer-actions">
        <button class="button primary" type="button" data-volley-action="save-notes">${tx("adminVolleySaveNotes")}</button>
      </div>
      <span class="admin-drawer-feedback" data-volley-feedback="notes"></span>
    </section>

    <section class="admin-drawer-section admin-danger-zone" data-volley-section="danger">
      <h3>${tx("adminVolleyDangerSection")}</h3>
      <p>${tx("adminVolleyDangerText")}</p>
      <div class="admin-drawer-actions">
        <button class="button secondary" type="button" data-volley-action="delete">${tx("adminVolleyDeleteRegistration")}</button>
      </div>
      <span class="admin-drawer-feedback" data-volley-feedback="danger"></span>
    </section>
  `;
  updateVolleyDrawerDirtyState();
}

async function saveVolleyRegistrationSection(section, overrides) {
  const registration = getActiveVolleyRegistration();
  if (!registration) return;
  const sections = ["team", "players", "notes"];
  const dirtySections = sections
    .map((item) => ({ section: item, values: volleyDrawerSectionValues(item), snapshot: volleyDrawerSectionSnapshots[item] }))
    .filter((item) => item.values && JSON.stringify(item.values) !== item.snapshot);
  setVolleyDrawerButtons(section, true);
  setVolleyDrawerFeedback(section, tx("adminSaving"));
  try {
    const payload = volleyPayloadFromRegistration(registration, overrides);
    const data = await apiRequest(`/api/admin/volley/registrations/${registration.id}`, { method: "PATCH", body: payload });
    Object.assign(registration, data.registration);
    setVolleyDrawerSnapshots(registration);
    renderAdminVolleyRegistrations();
    renderVolleyManageDrawer();
    dirtySections
      .filter((item) => item.section !== section)
      .forEach((item) => {
        setVolleyDrawerSectionValues(item.section, item.values);
        volleyDrawerSectionSnapshots[item.section] = item.snapshot;
      });
    updateVolleyDrawerDirtyState();
    renderAuditLog();
    setVolleyDrawerFeedback(section, tx(section === "status" ? "adminVolleyStatusUpdated" : "adminVolleySavedMessage"), "success");
  } catch (error) {
    setVolleyDrawerFeedback(section, error.status === 401 ? tx("adminAuthError") : tx("adminVolleySaveError"), "error");
  } finally {
    setVolleyDrawerButtons(section, false);
  }
}

async function handleVolleyDrawerClick(event) {
  const closeTrigger = event.target.closest("[data-volley-drawer-close]");
  if (closeTrigger) {
    closeVolleyManageDrawer();
    return;
  }
  const button = event.target.closest("[data-volley-action]");
  if (!button) return;
  const action = button.dataset.volleyAction;
  if (action === "status") {
    await saveVolleyRegistrationSection("status", { status: button.dataset.status });
    return;
  }
  if (action === "save-team") {
    await saveVolleyRegistrationSection("team", volleyDrawerSectionValues("team"));
    return;
  }
  if (action === "save-players") {
    await saveVolleyRegistrationSection("players", volleyDrawerSectionValues("players"));
    return;
  }
  if (action === "save-notes") {
    await saveVolleyRegistrationSection("notes", volleyDrawerSectionValues("notes"));
    return;
  }
  if (action === "delete") {
    openVolleyDeleteConfirm();
  }
}

function openVolleyDeleteConfirm() {
  const registration = getActiveVolleyRegistration();
  if (!registration) return;
  pendingVolleyDeleteId = registration.id;
  const teamName = registration.teamName || tx("adminVolleyTeam");
  const modal = $("#volleyDeleteConfirmModal");
  if (!modal) return;
  $("#volleyDeleteConfirmText").textContent = tx("adminVolleyDeleteConfirm").replace("{team}", teamName);
  $("#volleyDeleteConfirmFeedback").textContent = "";
  $("#volleyDeleteConfirmFeedback").className = "admin-drawer-feedback";
  $("#confirmVolleyDelete").disabled = false;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-confirm-open");
  window.setTimeout(() => $("#confirmVolleyDelete")?.focus(), 0);
}

function closeVolleyDeleteConfirm() {
  const modal = $("#volleyDeleteConfirmModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("admin-confirm-open");
  pendingVolleyDeleteId = null;
  $("#volleyDeleteConfirmFeedback").textContent = "";
  $("#confirmVolleyDelete").disabled = false;
  $("#volleyManageDrawer [data-volley-action='delete']")?.focus();
}

async function confirmVolleyDelete() {
  const registration = volleyRegistrations.find((item) => item.id === pendingVolleyDeleteId);
  if (!registration) {
    closeVolleyDeleteConfirm();
    return;
  }
  const confirmButton = $("#confirmVolleyDelete");
  const feedback = $("#volleyDeleteConfirmFeedback");
  confirmButton.disabled = true;
  feedback.textContent = tx("adminDeleting");
  feedback.className = "admin-drawer-feedback";
  setVolleyDrawerButtons("danger", true);
  setVolleyDrawerFeedback("danger", tx("adminDeleting"));
  try {
    await apiRequest(`/api/admin/volley/registrations/${registration.id}`, { method: "DELETE" });
    volleyRegistrations = volleyRegistrations.filter((item) => item.id !== registration.id);
    $("#volleyAdminMessage").textContent = tx("adminVolleyDeleted");
    closeVolleyDeleteConfirm();
    closeVolleyManageDrawer({ force: true });
    renderAdminVolleyRegistrations();
    renderAuditLog();
  } catch (error) {
    feedback.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminVolleyDeleteError");
    feedback.className = "admin-drawer-feedback is-error";
    setVolleyDrawerFeedback("danger", error.status === 401 ? tx("adminAuthError") : tx("adminVolleyDeleteError"), "error");
  } finally {
    confirmButton.disabled = false;
    setVolleyDrawerButtons("danger", false);
  }
}

async function handleVolleyDeleteConfirmClick(event) {
  if (event.target.closest("[data-volley-delete-cancel]")) {
    closeVolleyDeleteConfirm();
    return;
  }
  if (event.target.closest("#confirmVolleyDelete")) {
    await confirmVolleyDelete();
  }
}

function renderAdminVolleyRegistrations() {
  if (!$("#volleyRegistrationsList")) return;
  $("#volleyRegistrationsList").innerHTML = volleyRegistrations.map((registration) => `
    <tr>
      <td class="volley-admin-team"><strong>${escapeHtml(registration.teamName)}</strong></td>
      <td>${escapeHtml(registration.representativeName)}</td>
      <td>${escapeHtml(registration.churchName || "-")}</td>
      <td>
        <span class="volley-admin-color">
          <span class="volley-admin-color-swatch" style="--shirt-color: ${escapeAttribute(getVolleyColorHex(registration.shirtColor))}"></span>
          <span>${escapeHtml(getVolleyColorLabel(registration.shirtColor))}</span>
        </span>
      </td>
      <td class="volley-admin-players"><strong>${(registration.players || []).length}</strong><span>${escapeHtml(volleyPlayersPreview(registration.players))}</span></td>
      <td><span class="volley-status ${escapeAttribute(volleyStatusClass(registration.status))}">${escapeHtml(getVolleyStatusLabel(registration.status))}</span></td>
      <td class="volley-admin-note">${escapeHtml(registration.notes || "-")}</td>
      <td class="table-actions">
        <button type="button" data-action="manage" data-id="${registration.id}">${tx("adminVolleyManage")}</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8">${tx("adminVolleyEmpty")}</td></tr>`;
}

function eventLanguageComplete(event, suffix) {
  return Boolean(event[`title${suffix}`] && event[`shortDescription${suffix}`] && event[`fullDescription${suffix}`] && event[`poster${suffix}`]);
}

function eventPreviewMarkup(event) {
  const poster = eventPoster(event);
  return `
    <article class="event-card managed-event-card admin-preview-event-card" style="--event-accent: ${escapeAttribute(event.accentColor || "#7f090b")}">
      <div>
        <p class="eyebrow">${escapeHtml(getCategoryLabel(event.category || tx("eventsColumnTitle")))}</p>
        <h3>${escapeHtml(eventField(event, "title") || tx("adminEventsNewTitle"))}</h3>
        <p>${escapeHtml(eventField(event, "shortDescription") || tx("adminEventsSummaryText"))}</p>
        <strong>${escapeHtml(event.date ? formatEventDate(event) : tx("adminEventsDate"))}${event.time ? ` · ${escapeHtml(event.time)}` : ""}</strong>
      </div>
      ${poster ? `<img src="${escapeAttribute(poster)}" alt="" />` : `<span class="event-poster-placeholder">${tx("eventNoPoster")}</span>`}
    </article>
  `;
}

function renderAdminEvents() {
  if (!$("#adminEventsList")) return;
  const total = churchEvents.length;
  const published = churchEvents.filter((event) => event.published).length;
  const featured = churchEvents.filter((event) => event.featured).length;
  const hidden = total - published;
  $("#adminEventsStats").innerHTML = [
    [tx("adminEventsTotal"), total],
    [tx("adminEventsPublishedCount"), published],
    [tx("adminEventsHiddenCount"), hidden],
    [tx("adminEventsFeaturedCount"), featured]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");

  $("#adminEventsEmpty")?.classList.toggle("is-hidden", total > 0);
  $("#adminEventsList").classList.toggle("is-hidden", total === 0);
  $("#adminEventsList").innerHTML = churchEvents.map((event) => {
    const title = eventField(event, "title") || tx("adminEventsNewTitle");
    const description = eventField(event, "shortDescription") || "";
    const poster = eventField(event, "poster") || "";
    const roComplete = eventLanguageComplete(event, "Ro");
    const esComplete = eventLanguageComplete(event, "Es");
    return `
      <article class="admin-event-row">
        <div class="admin-event-thumb">${poster ? `<img src="${escapeAttribute(poster)}" alt="" loading="lazy" />` : `<span>${tx("adminEventsNoPoster")}</span>`}</div>
        <div class="admin-event-row-copy">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
          <div class="admin-event-badges">
            <span class="${event.published ? "success" : "muted"}">${event.published ? tx("adminEventsPublishedStatus") : tx("adminEventsHiddenStatus")}</span>
      ${event.featured ? `<span>${tx("adminEventsFeatured")}</span>` : ""}
            <span>${escapeHtml(formatEventDate(event))}${event.time ? ` · ${escapeHtml(event.time)}` : ""}</span>
            <span>${roComplete ? "RO" : tx("adminEventsIncompleteRo")} + ${esComplete ? "ES" : tx("adminEventsIncompleteEs")}</span>
          </div>
        </div>
        <div class="table-actions">
          <button type="button" data-action="edit" data-id="${event.id}">${tx("adminEdit")}</button>
          <button type="button" data-action="toggle" data-id="${event.id}">${event.published ? tx("adminEventsHide") : tx("adminEventsPublish")}</button>
          <button type="button" data-action="delete" data-id="${event.id}">${tx("adminDelete")}</button>
        </div>
      </article>
    `;
  }).join("");
  renderAdminEventPreview();
}

function defaultEvent() {
  return {
    id: "",
    date: new Date().toISOString().slice(0, 10),
    time: "18:00",
    location: "Betel Reus",
    category: "Serviciu special",
    accentColor: "#7f090b",
    published: false,
    featured: false,
    titleRo: "",
    shortDescriptionRo: "",
    fullDescriptionRo: "",
    posterRo: "",
    titleEs: "",
    shortDescriptionEs: "",
    fullDescriptionEs: "",
    posterEs: ""
  };
}

function openEventEditor(event = null) {
  const form = $("#adminEventForm");
  if (!form) return;
  const data = event || defaultEvent();
  editingEventId = data.id || null;
  currentEventPosters = { ro: data.posterRo || "", es: data.posterEs || "" };
  form.elements.id.value = data.id || "";
  form.elements.date.value = data.date || defaultEvent().date;
  form.elements.time.value = data.time || "";
  form.elements.location.value = data.location || "";
  form.elements.category.value = data.category || "";
  form.elements.accentColor.value = data.accentColor || "#7f090b";
  form.elements.published.checked = Boolean(data.published);
  form.elements.featured.checked = Boolean(data.featured);
  form.elements.titleRo.value = data.titleRo || "";
  form.elements.shortDescriptionRo.value = data.shortDescriptionRo || "";
  form.elements.fullDescriptionRo.value = data.fullDescriptionRo || "";
  form.elements.titleEs.value = data.titleEs || "";
  form.elements.shortDescriptionEs.value = data.shortDescriptionEs || "";
  form.elements.fullDescriptionEs.value = data.fullDescriptionEs || "";
  form.elements.posterRoFile.value = "";
  form.elements.posterEsFile.value = "";
  $("[data-poster-current='ro']").textContent = data.posterRo || "";
  $("[data-poster-current='es']").textContent = data.posterEs || "";
  $("#deleteEventButton").disabled = !editingEventId;
  $("#adminEventEditorTitle").textContent = editingEventId ? tx("adminEventsEditTitle") : tx("adminEventsNewTitle");
  $("#adminEventMessage").textContent = "";
  $("#adminEventEditor").classList.remove("is-hidden");
  renderAdminEventPreview();
  $("#adminEventEditor").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEventEditor() {
  editingEventId = null;
  currentEventPosters = { ro: "", es: "" };
  $("#adminEventEditor")?.classList.add("is-hidden");
}

function eventFromForm() {
  const form = $("#adminEventForm");
  return {
    id: form.elements.id.value,
    date: form.elements.date.value,
    time: form.elements.time.value.trim(),
    location: form.elements.location.value.trim(),
    category: form.elements.category.value.trim(),
    accentColor: form.elements.accentColor.value,
    published: form.elements.published.checked,
    featured: form.elements.featured.checked,
    titleRo: form.elements.titleRo.value.trim(),
    shortDescriptionRo: form.elements.shortDescriptionRo.value.trim(),
    fullDescriptionRo: form.elements.fullDescriptionRo.value.trim(),
    posterRo: currentEventPosters.ro,
    titleEs: form.elements.titleEs.value.trim(),
    shortDescriptionEs: form.elements.shortDescriptionEs.value.trim(),
    fullDescriptionEs: form.elements.fullDescriptionEs.value.trim(),
    posterEs: currentEventPosters.es
  };
}

function renderAdminEventPreview() {
  if (!$("#adminEventPreview") || !$("#adminEventForm")) return;
  $("#adminEventPreview").innerHTML = eventPreviewMarkup(eventFromForm());
}

function fileToDataUrl(file) {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function eventPayloadFromForm({ forceDraft = false } = {}) {
  const form = $("#adminEventForm");
  const payload = eventFromForm();
  if (forceDraft) payload.published = false;
  const [posterRoUpload, posterEsUpload] = await Promise.all([
    fileToDataUrl(form.elements.posterRoFile.files[0]),
    fileToDataUrl(form.elements.posterEsFile.files[0])
  ]);
  if (posterRoUpload) payload.posterRoUpload = posterRoUpload;
  if (posterEsUpload) payload.posterEsUpload = posterEsUpload;
  return payload;
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

async function getAverageImageColor(file) {
  if (!file || !file.type.startsWith("image/")) return "#7f090b";

  const imageUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return "#7f090b";

    const size = 32;
    canvas.width = size;
    canvas.height = size;

    context.drawImage(image, 0, 0, size, size);

    const { data } = context.getImageData(0, 0, size, size);

    let redTotal = 0;
    let greenTotal = 0;
    let blueTotal = 0;
    let count = 0;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];

      if (alpha < 128) continue;

      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const brightness = (red + green + blue) / 3;
      const saturation = max - min;

      // Ignore whites, blacks and gray-ish pixels
      if (brightness > 235) continue;
      if (brightness < 25) continue;
      if (saturation < 18) continue;

      redTotal += red;
      greenTotal += green;
      blueTotal += blue;
      count++;
    }

    if (count === 0) return "#7f090b";

    return rgbToHex(
      Math.round(redTotal / count),
      Math.round(greenTotal / count),
      Math.round(blueTotal / count)
    );
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function setupEventPosterColorDetection() {
  const form = $("#adminEventForm");
  if (!form) return;

  const accentColorInput = form.elements.accentColor;
  const posterRoInput = form.elements.posterRoFile;
  const posterEsInput = form.elements.posterEsFile;
  const colorHint = $("#eventColorHint");

  async function detectColorFromPoster(file) {
    if (!file) return;

    try {
      const color = await getAverageImageColor(file);
      accentColorInput.value = color;

      if (colorHint) {
        colorHint.textContent = tx("adminEventsColorDetected");
      }

      renderAdminEventPreview();
    } catch {
      if (colorHint) {
        colorHint.textContent = tx("adminEventsColorDetectError");
      }
    }
  }

  posterRoInput?.addEventListener("change", () => {
    detectColorFromPoster(posterRoInput.files[0]);
  });

  posterEsInput?.addEventListener("change", () => {
    detectColorFromPoster(posterEsInput.files[0]);
  });
}

async function saveEventFromForm(options = {}) {
  if (!$("#adminEventForm")) return;
  const message = $("#adminEventMessage");
  message.textContent = tx("adminSaving");
  try {
    const payload = await eventPayloadFromForm(options);
    const endpoint = editingEventId ? `/api/admin/events/${editingEventId}` : "/api/admin/events";
    const response = await apiRequest(endpoint, { method: editingEventId ? "PATCH" : "POST", body: payload });
    const index = churchEvents.findIndex((event) => event.id === response.event.id);
    if (index >= 0) churchEvents[index] = response.event;
    else churchEvents.unshift(response.event);
    message.textContent = tx("adminEventsSaved");
    openEventEditor(response.event);
    renderAdmin();
  } catch (error) {
    message.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminEventsSaveError");
  }
}

async function deleteCurrentEvent() {
  if (!editingEventId) return;
  if (!window.confirm(tx("adminEventsConfirmDelete"))) return;
  const message = $("#adminEventMessage");
  if (message) message.textContent = "";
  try {
    await apiRequest(`/api/admin/events/${editingEventId}`, { method: "DELETE" });
    churchEvents = churchEvents.filter((event) => event.id !== editingEventId);
    closeEventEditor();
    renderAdmin();
  } catch {
    if (message) message.textContent = tx("adminEventsDeleteError");
  }
}

function getReservationItems(reservation) {
  if (Array.isArray(reservation.items)) return reservation.items;
  return [{ title: reservation.bookTitle || "Carte", quantity: 1, price: 0 }];
}

function renderAuditLog() {
  if (!$("#auditLog")) return;
  const maxPage = Math.max(0, Math.ceil(auditLogs.length / auditPageSize) - 1);
  auditPage = Math.min(auditPage, maxPage);
  const start = auditPage * auditPageSize;
  const pageLogs = auditLogs.slice(start, start + auditPageSize);
  $("#auditLog").innerHTML = pageLogs.map((log) => `
    <article>
      <strong>${escapeHtml(getAdminActionLabel(log.action))}</strong>
      <span>${escapeHtml(getAdminEntityLabel(log.entity))} · ${escapeHtml(log.actor)} · ${new Date(log.createdAt).toLocaleString(lang === "ro" ? "ro-RO" : "es-ES")}</span>
    </article>
  `).join("") || `<p>${tx("adminNoHistory")}</p>`;
  if ($("#auditPageInfo")) $("#auditPageInfo").textContent = `${tx("adminPage")} ${auditPage + 1} ${tx("adminPageOf")} ${maxPage + 1}`;
  if ($("#auditPrev")) $("#auditPrev").disabled = auditPage === 0;
  if ($("#auditNext")) $("#auditNext").disabled = auditPage >= maxPage;
}

function nextSundayLive(now = new Date()) {
  const sessions = [
    { hour: 10, endHour: 12, label: "duminică dimineața" },
    { hour: 18, endHour: 20, label: "duminică seara" }
  ];

  for (const session of sessions) {
    const start = new Date(now);
    start.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    start.setHours(session.hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(session.endHour, 0, 0, 0);
    if (now >= start && now < end) return { live: true, end, session };
    if (start > now) return { live: false, start, session };
  }

  const next = new Date(now);
  next.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  next.setHours(10, 0, 0, 0);
  return { live: false, start: next, session: sessions[0] };
}

function formatTimeDistance(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(lang === "ro" ? `${days} ${days === 1 ? "zi" : "zile"}` : `${days} ${days === 1 ? "día" : "días"}`);
  if (hours) parts.push(`${hours} h`);
  if (minutes || parts.length === 0) parts.push(`${minutes} min`);
  return parts.join(" ");
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function updateLiveCountdown() {
  const node = $("#liveCountdown");
  if (!node) return;
  const now = new Date();
  const next = nextSundayLive(now);
  const t = translations[lang] || translations[defaultLanguage] || {};
  const locale = lang === "ro" ? "ro-RO" : "es-ES";
  if (next.live) {
    node.textContent = `${t.liveNow} · ${t.liveUntil} ${next.end.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`;
    return;
  }
  const day = capitalize(next.start.toLocaleDateString(locale, { weekday: "long" }));
  node.textContent = `${day}, ${next.start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })} · ${t.liveIn} ${formatTimeDistance(next.start - now)}`;
}

function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  const formReadyAt = Date.now() + contactFormMinimumMs;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name").trim();
    const contact = data.get("contact").trim();
    const message = data.get("message").trim();
    const website = data.get("website").trim();
    if (website || Date.now() < formReadyAt) {
      $("#contactFormMessage").textContent = tx("contactFormSent");
      return;
    }
    const subject = encodeURIComponent(`${lang === "ro" ? "Mesaj de pe site" : "Mensaje desde la web"} - ${name}`);
    const body = encodeURIComponent(`${tx("contactFormName")}: ${name}\n${tx("contactFormContact")}: ${contact}\n\n${tx("contactFormMessage")}:\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    $("#contactFormMessage").textContent = tx("contactFormSent");
  });
}

function setupDeferredMap() {
  const panel = $("[data-map-panel]");
  const iframe = panel?.querySelector("iframe[data-map-src]");
  const button = panel?.querySelector("[data-map-load]");
  if (!panel || !iframe) return;

  const loadMap = () => {
    if (iframe.src) return;
    iframe.src = iframe.dataset.mapSrc;
    panel.classList.add("is-loaded");
  };

  button?.addEventListener("click", loadMap);

  if (!window.matchMedia("(max-width: 700px)").matches) {
    loadMap();
    return;
  }

  if (!("IntersectionObserver" in window)) return;
  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadMap();
      mapObserver.disconnect();
    });
  }, { rootMargin: "180px 0px", threshold: 0.01 });
  mapObserver.observe(panel);
}

function setupDesktopHeaderScroll() {
  const header = $(".site-header");
  if (!header) return;
  const desktopQuery = window.matchMedia("(min-width: 861px)");
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

function setupNavigationMenu() {
  const menu = $(".nav-menu");
  const button = menu?.querySelector("button");
  const submenu = menu?.querySelector(".nav-submenu");
  if (!menu || !button || !submenu) return;

  const mobilePanel = submenu.cloneNode(true);
  mobilePanel.className = "resource-popover";
  mobilePanel.id = "resourcePopover";
  mobilePanel.setAttribute("aria-hidden", "true");
  document.body.append(mobilePanel);

  button.setAttribute("aria-controls", mobilePanel.id);
  button.setAttribute("aria-expanded", "false");

  const closeMenu = (removeFocus = false) => {
    menu.classList.remove("is-open");
    mobilePanel.classList.remove("is-open");
    mobilePanel.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    if (removeFocus) button.blur();
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !menu.classList.contains("is-open");
    if (shouldOpen) {
      menu.classList.add("is-open");
      mobilePanel.classList.add("is-open");
      mobilePanel.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
    } else {
      closeMenu(true);
    }
  });

  submenu.addEventListener("click", closeMenu);
  mobilePanel.addEventListener("click", () => closeMenu(true));

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !mobilePanel.contains(event.target)) closeMenu(true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });
}

function updateMobileMenuLabel() {
  const button = $("#mobileMenuToggle");
  if (!button) return;
  const isOpen = document.body.classList.contains("mobile-menu-open");
  button.setAttribute("aria-label", tx(isOpen ? "mobileMenuClose" : "mobileMenuOpen"));
}

function setupMobileMenu() {
  const button = $("#mobileMenuToggle");
  const overlay = $("#mobileMenu");
  if (!button || !overlay) return;

  const desktopQuery = window.matchMedia("(min-width: 861px)");

  const closeMenu = ({ restoreFocus = false } = {}) => {
    document.body.classList.remove("mobile-menu-open");
    overlay.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    updateMobileMenuLabel();
    if (restoreFocus) button.focus();
  };

  const openMenu = () => {
    document.body.classList.add("mobile-menu-open");
    overlay.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    updateMobileMenuLabel();
  };

  button.addEventListener("click", () => {
    if (document.body.classList.contains("mobile-menu-open")) {
      closeMenu({ restoreFocus: true });
      return;
    }
    openMenu();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("mobile-menu-open")) {
      closeMenu({ restoreFocus: true });
    }
  });

  desktopQuery.addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });

  updateMobileMenuLabel();
}

async function initializeApp() {
  await loadTranslations(lang);

  $("#langToggle")?.addEventListener("click", async () => {
    lang = lang === "ro" ? "es" : "ro";
    localStorage.setItem("betel-lang", lang);
    await loadTranslations(lang);
    applyLanguage();
    loadVerse();
  });

  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  startHeroRotation();
  setupNavigationMenu();
  setupMobileMenu();
  setupLibrary();
  setupAdmin();
  setupEvents();
  setupLandingEffects();
  applyLanguage();
  loadVerse();
  loadVideos();
  loadEvents();
  updateLiveCountdown();
  setInterval(updateLiveCountdown, 60000);
  setupContactForm();
  setupDeferredMap();
  setupDesktopHeaderScroll();
}

initializeApp();
