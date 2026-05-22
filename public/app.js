const translations = {
  ro: {
    navSchedule: "Program",
    navLibrary: "Bibliotecă",
    navVideos: "Predici",
    navContact: "Contact",
    eyebrow: "Biserică penticostală în Reus",
    heroText: "Betel Reus, o casă de închinare. O familie în care ne rugăm, ascultăm Cuvântul și creștem împreună în Hristos.",
    heroYoutube: "Vezi predici",
    heroSchedule: "Vezi programul",
    verseLabel: "Versetul zilei",
    scheduleEyebrow: "Ne întâlnim împreună",
    scheduleTitle: "Program și evenimente",
    scheduleText: "Programul principal al bisericii pentru membri, familii și vizitatori.",
    saturdayOther: "Alte activități după program",
    libraryEyebrow: "Pentru membri",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "Accesul este pentru membrii comunității. Introdu numele tău și codul primit de la responsabilul bibliotecii.",
    memberName: "Nume",
    memberActive: "Membru",
    accessCode: "Cod acces",
    enterLibrary: "Intră în bibliotecă",
    accessDenied: "Codul nu este corect. Verifică-l și încearcă din nou. Dacă nu ai cod, contactează responsabilul bibliotecii.",
    resetLibrary: "Resetează",
    bookTitle: "Titlu",
    bookAuthor: "Autor",
    bookStock: "Stoc",
    bookPrice: "Preț",
    addBook: "Adaugă carte",
    filterAll: "Toate",
    filterAvailable: "Disponibile",
    filterReserved: "Rezervate",
    videosTitle: "Ultimele predici și cântări",
    socialEyebrow: "Rețele sociale",
    socialTitle: "Rămâi aproape de comunitate",
    aboutEyebrow: "Despre noi",
    aboutTitle: "O familie în credință, în inima orașului Reus",
    aboutText: "Biserica Betel este un loc al prezenței lui Dumnezeu, unde viețile sunt transformate prin Duhul Sfânt. Aici trăim o viață nouă, în Hristos și cu Hristos.",
    contactAddress: "Carrer de Terrassa, 33, 43204 Reus, Tarragona",
    contactEmail: "bbetelreus@gmail.com · +34 605 43 05 73",
    reserve: "Rezervă",
    request: "Cere",
    addToCart: "Adaugă",
    cartEyebrow: "Coș",
    cartTitle: "Cererea ta",
    cartEmpty: "Coșul este gol.",
    cartTotal: "Total",
    confirmCart: "Trimite cererea",
    cartSent: "Cererea a fost trimisă.",
    returnBook: "Returnează",
    available: "disponibile",
    unavailable: "indisponibil",
    reserved: "rezervate"
  },
  es: {
    navSchedule: "Horario",
    navLibrary: "Biblioteca",
    navVideos: "Predicaciones",
    navContact: "Contacto",
    eyebrow: "Iglesia pentecostal en Reus",
    heroText: "Betel Reus, una casa de adoración. Una familia donde oramos, escuchamos la Palabra y crecemos juntos en Cristo.",
    heroYoutube: "Ver predicaciones",
    heroSchedule: "Ver horario",
    verseLabel: "Versículo del día",
    scheduleEyebrow: "Nos reunimos juntos",
    scheduleTitle: "Horario y eventos",
    scheduleText: "El programa principal de la iglesia para miembros, familias y visitantes.",
    saturdayOther: "Otras actividades según programación",
    libraryEyebrow: "Para miembros",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "El acceso es para miembros de la comunidad. Introduce tu nombre y el código recibido del responsable de la biblioteca.",
    memberName: "Nombre",
    memberActive: "Miembro",
    accessCode: "Código de acceso",
    enterLibrary: "Entrar en biblioteca",
    accessDenied: "El código no es correcto. Revísalo e inténtalo otra vez. Si no tienes código, contacta con el responsable de la biblioteca.",
    resetLibrary: "Reiniciar",
    bookTitle: "Título",
    bookAuthor: "Autor",
    bookStock: "Stock",
    bookPrice: "Precio",
    addBook: "Añadir libro",
    filterAll: "Todos",
    filterAvailable: "Disponibles",
    filterReserved: "Reservados",
    videosTitle: "Últimas predicaciones y cantos",
    socialEyebrow: "Redes sociales",
    socialTitle: "Permanece cerca de la comunidad",
    aboutEyebrow: "Sobre nosotros",
    aboutTitle: "Una familia en la fe, en el corazón de Reus",
    aboutText: "La Iglesia Betel es un lugar de la presencia de Dios, donde las vidas son transformadas por el Espíritu Santo. Aquí vivimos una vida nueva, en Cristo y con Cristo.",
    contactAddress: "Carrer de Terrassa, 33, 43204 Reus, Tarragona",
    contactEmail: "bbetelreus@gmail.com · +34 605 43 05 73",
    reserve: "Reservar",
    request: "Pedir",
    addToCart: "Añadir",
    cartEyebrow: "Carrito",
    cartTitle: "Tu pedido",
    cartEmpty: "El carrito está vacío.",
    cartTotal: "Total",
    confirmCart: "Confirmar pedido",
    cartSent: "Pedido enviado al panel.",
    returnBook: "Devolver",
    available: "disponibles",
    unavailable: "no disponible",
    reserved: "reservados"
  }
};

const seedBooks = [
  { id: crypto.randomUUID(), title: "Viața condusă de scopuri", author: "Rick Warren", category: "Familie", stock: 4, price: 12.5, reserved: 1 },
  { id: crypto.randomUUID(), title: "Creștinul autentic", author: "John Stott", category: "Teologie", stock: 2, price: 9.99, reserved: 0 },
  { id: crypto.randomUUID(), title: "Rugăciunea", author: "Timothy Keller", category: "Teologie", stock: 1, price: 14, reserved: 0 },
  { id: crypto.randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", category: "Copii", stock: 6, price: 18, reserved: 2 }
];

let lang = localStorage.getItem("betel-lang") || "ro";
let books = seedBooks;
let cart = JSON.parse(localStorage.getItem("betel-cart") || "[]");
let usingServerData = false;
let currentMemberName = localStorage.getItem("betel-member-name") || "";
let currentAdminCode = sessionStorage.getItem("betel-admin-code") || "";
let pendingStockChanges = new Map();
let auditPage = 0;
const auditPageSize = 5;
let videoRotationFrame;
let videoResumeTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const accessCode = "BETEL-REUS";
const defaultAdminCode = "ADMIN-BETEL";
const adminSessionMs = 10 * 60 * 1000;
const heroImages = [
  "https://i.ytimg.com/vi/5ANLpkgxZGE/maxresdefault.jpg",
  "https://i.ytimg.com/vi/V-w7Xf8OvDg/maxresdefault.jpg",
  "https://i.ytimg.com/vi/R5RH-wUQHd0/maxresdefault.jpg",
  "https://i.ytimg.com/vi/J3lrKcTgpmU/maxresdefault.jpg"
];

let reservations = [];
let auditLogs = [];

const statusLabels = {
  pending: "În așteptare",
  approved: "Pregătită",
  collected: "Predată",
  cancelled: "Anulată"
};

const libraryCategories = ["Teologie", "Familie", "Tineri", "Copii", "Biografii", "Biblii", "Devoționale"];

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
  const headers = { ...(options.headers || {}) };
  if (options.body && typeof options.body !== "string") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  if (path.startsWith("/api/admin/")) headers["x-admin-code"] = currentAdminCode || defaultAdminCode;

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "API request failed");
    error.status = response.status;
    throw error;
  }
  return data;
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
    const [ordersData, auditData] = await Promise.all([
      apiRequest("/api/admin/orders?active=true"),
      apiRequest("/api/admin/audit")
    ]);
    reservations = ordersData.orders;
    auditLogs = auditData.auditLogs;
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

function applyLanguage() {
  document.documentElement.lang = lang;
  $("#langToggle").textContent = lang === "ro" ? "ES" : "RO";
  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[lang][key]) node.textContent = translations[lang][key];
  });
  if ($("#bookSearch")) $("#bookSearch").placeholder = lang === "ro" ? "Caută după titlu sau autor" : "Busca por título o autor";
  if ($("#books")) renderBooks();
  if ($("#cartItems")) renderCart();
}

function renderBooks() {
  if (!$("#books")) return;
  const query = $("#bookSearch").value.toLowerCase();
  const filter = $("#bookFilter").value;
  const categoryFilter = $("#bookCategoryFilter")?.value || "all";
  const t = translations[lang];
  const categories = [...new Set([...libraryCategories, ...books.map((book) => book.category).filter(Boolean)])].sort();
  if ($("#bookCategoryFilter")) {
    $("#bookCategoryFilter").innerHTML = `<option value="all">${lang === "ro" ? "Toate categoriile" : "Todas las categorías"}</option>${categories.map((item) => `<option value="${item}">${item}</option>`).join("")}`;
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
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <span class="book-category">${book.category || "General"}</span>
        </div>
        <div class="book-meta">
          <span>${available > 0 ? `${available} ${t.available}` : t.unavailable}</span>
          <strong>${book.price.toFixed(2)} €</strong>
        </div>
        <div class="book-actions">
          <button type="button" data-action="add-cart" data-id="${book.id}" ${available === 0 ? "disabled" : ""}>${t.addToCart}</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadVerse() {
  if (!$("#dailyVerse")) return;
  try {
    const data = await fetch("/api/verse").then((res) => res.json());
    $("#dailyVerse").textContent = data.verse[lang] || data.verse.ro;
    $("#dailyVerseRef").textContent = data.verse.reference;
  } catch {
    $("#dailyVerse").textContent = lang === "ro" ? "Domnul este Păstorul meu." : "El Señor es mi pastor.";
    $("#dailyVerseRef").textContent = "Psalmul 23:1";
  }
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

function renderVideos(videos) {
  const selectedVideos = videos.slice(0, 30);
  const videoCards = selectedVideos.map((video) => `
    <a class="video-card" href="${video.url}" target="_blank" rel="noreferrer" draggable="false">
      <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" draggable="false" />
      <span>${video.published ? new Date(video.published).toLocaleDateString(lang === "ro" ? "ro-RO" : "es-ES") : "YouTube"}</span>
      <h3>${video.title}</h3>
    </a>
  `).join("");
  $("#videoRail").innerHTML = `
    <div class="video-track">
      ${videoCards}
      ${videoCards}
    </div>
  `;
  startVideoRotation();
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

  const normalizeOffset = () => {
    const halfWidth = track.scrollWidth / 2;
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

  paint();
  videoRotationFrame = requestAnimationFrame(tick);
}

async function unlockLibrary() {
  $("#libraryGate")?.classList.add("is-hidden");
  $("#libraryShell")?.classList.remove("is-hidden");
  if ($("#activeMember")) $("#activeMember").textContent = currentMemberName;
  await loadBooksFromApi();
  renderBooks();
  renderCart();
}

function setupLibrary() {
  if (!$("#libraryGate")) return;

  if (currentMemberName) unlockLibrary();

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
    $("#accessMessage").textContent = translations[lang].accessDenied;
  });

  $("#exitLibrary")?.addEventListener("click", () => {
    currentMemberName = "";
    localStorage.removeItem("betel-member-name");
    cart = [];
    saveCart();
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
  const t = translations[lang];
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
        <strong>${item.title}</strong>
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
  $("#cartMessage").textContent = translations[lang].cartSent;
}

async function unlockAdmin(code = currentAdminCode || defaultAdminCode) {
  currentAdminCode = code;
  await loadBooksFromApi();
  await loadAdminDataFromApi(true);
  sessionStorage.setItem("betel-admin-code", currentAdminCode);
  sessionStorage.setItem("betel-admin-expires-at", String(Date.now() + adminSessionMs));
  $("#adminGate")?.classList.add("is-hidden");
  $("#adminShell")?.classList.remove("is-hidden");
  renderAdmin();
}

function setupAdmin() {
  if (!$("#adminGate")) return;

  const expiresAt = Number(sessionStorage.getItem("betel-admin-expires-at") || 0);
  if (currentAdminCode && expiresAt > Date.now()) {
    unlockAdmin().catch(() => {
      currentAdminCode = "";
      sessionStorage.removeItem("betel-admin-code");
      sessionStorage.removeItem("betel-admin-expires-at");
      $("#adminAccessMessage").textContent = "Introdu din nou codul de administrare.";
    });
  } else {
    sessionStorage.removeItem("betel-admin-code");
    sessionStorage.removeItem("betel-admin-expires-at");
    currentAdminCode = "";
  }

  $("#adminAccessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code").trim();
    $("#adminAccessMessage").textContent = "Se verifică...";
    try {
      await unlockAdmin(code);
      $("#adminAccessMessage").textContent = "";
    } catch (error) {
      currentAdminCode = "";
      $("#adminAccessMessage").textContent = "Cod incorect sau conexiune indisponibilă.";
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

  $("#adminBookForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const editingId = data.get("id");
    const submitButton = form.querySelector("button[type='submit']");
    const message = $("#adminFormMessage");
    submitButton.disabled = true;
    submitButton.textContent = editingId ? "Se actualizează..." : "Se salvează...";
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
          message.textContent = error.status === 401 ? "Cod de administrare incorect." : "Nu s-a putut actualiza în baza de date.";
          submitButton.disabled = false;
          submitButton.textContent = "Actualizează cartea";
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
      $("#adminSubmitLabel").textContent = "Salvează cartea";
      submitButton.disabled = false;
      submitButton.textContent = "Salvează cartea";
      message.textContent = "Carte adăugată. Se salvează în baza de date...";
      saveBooks();
      renderAdmin();

      try {
        const response = await apiRequest("/api/admin/books", { method: "POST", body: payload });
        const index = books.findIndex((item) => item.id === temporaryId);
        if (index >= 0) books[index] = response.book;
        message.textContent = "Salvat.";
      } catch (error) {
        if (usingServerData || error.status === 401) {
          books = books.filter((item) => item.id !== temporaryId);
          message.textContent = error.status === 401 ? "Cod de administrare incorect." : "Nu s-a putut salva în baza de date.";
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
    $("#adminSubmitLabel").textContent = "Salvează cartea";
    submitButton.disabled = false;
    message.textContent = "Salvat.";
    saveBooks();
    renderAdmin();
  });

  $("#adminSearch").addEventListener("input", renderAdminBooks);
  $("#adminCategoryFilter").addEventListener("change", renderAdminBooks);
  $("#saveStockChanges").addEventListener("click", savePendingStockChanges);
  $("#importBooks")?.addEventListener("click", importBulkBooks);
  $("#auditPrev").addEventListener("click", () => {
    auditPage = Math.max(0, auditPage - 1);
    renderAuditLog();
  });
  $("#auditNext").addEventListener("click", () => {
    const maxPage = Math.max(0, Math.ceil(auditLogs.length / auditPageSize) - 1);
    auditPage = Math.min(maxPage, auditPage + 1);
    renderAuditLog();
  });

  $("#adminBooks").addEventListener("click", async (event) => {
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
      $("#adminSubmitLabel").textContent = "Actualizează cartea";
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

  $("#reservationsList").addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const reservation = reservations.find((item) => item.id === button.dataset.id);
    if (!reservation) return;
    const before = { ...reservation };
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
  renderAdminReservations();
  renderAuditLog();
  updateStockSaveButton();
}

function updateStockSaveButton() {
  if (!$("#saveStockChanges")) return;
  const count = pendingStockChanges.size;
  $("#saveStockChanges").disabled = count === 0;
  $("#saveStockChanges").textContent = count === 0 ? "Salvează modificările de stoc" : `Salvează modificările de stoc (${count})`;
}

async function savePendingStockChanges() {
  if (pendingStockChanges.size === 0) return;
  const button = $("#saveStockChanges");
  const message = $("#stockChangesMessage");
  button.disabled = true;
  button.textContent = "Se salvează stocul...";
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
    message.textContent = "Stoc salvat.";
  } catch (error) {
    message.textContent = error.status === 401 ? "Cod de administrare incorect." : "Nu s-a putut salva stocul.";
  }

  saveBooks();
  renderAdmin();
}

function parseBulkBooksInput(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, author, category = "General", language = "ro", stock = "1", price = "0"] = line.split(";").map((part) => part.trim());
      return {
        title,
        author,
        category: category || "General",
        language: language || "ro",
        stock: Math.max(0, Number(stock) || 0),
        reserved: 0,
        price: Math.max(0, Number(String(price).replace(",", ".")) || 0)
      };
    })
    .filter((book) => book.title && book.author);
}

async function importBulkBooks() {
  const input = $("#bulkBooksInput");
  const message = $("#bulkImportMessage");
  const button = $("#importBooks");
  const parsedBooks = parseBulkBooksInput(input.value);

  if (parsedBooks.length === 0) {
    message.textContent = "Adaugă cel puțin o linie cu titlu și autor.";
    return;
  }

  const temporaryBooks = parsedBooks.map((book) => ({ id: `tmp-${crypto.randomUUID()}`, ...book }));
  const temporaryIds = new Set(temporaryBooks.map((book) => book.id));
  button.disabled = true;
  button.textContent = "Se importă...";
  message.textContent = `${temporaryBooks.length} cărți adăugate. Se salvează în baza de date...`;
  books.unshift(...temporaryBooks);
  saveBooks();
  renderAdmin();

  try {
    const response = await apiRequest("/api/admin/books/bulk", {
      method: "POST",
      body: { books: parsedBooks }
    });
    books = books.filter((book) => !temporaryIds.has(book.id));
    books.unshift(...response.books);
    input.value = "";
    message.textContent = `${response.books.length} cărți importate.`;
    await loadAdminDataFromApi();
  } catch (error) {
    if (usingServerData || error.status === 401) {
      books = books.filter((book) => !temporaryIds.has(book.id));
      message.textContent = error.status === 401 ? "Cod de administrare incorect." : "Nu s-a putut importa în baza de date.";
    } else {
      logAudit("Cărți importate", "book", null, temporaryBooks);
      message.textContent = `${temporaryBooks.length} cărți importate local.`;
    }
  }

  button.disabled = false;
  button.textContent = "Importă cărți";
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
    <article><span>Cărți</span><strong>${books.length}</strong></article>
    <article><span>Stock total</span><strong>${totalStock}</strong></article>
    <article><span>Rezervate</span><strong>${totalReserved}</strong></article>
    <article><span>Stoc redus</span><strong>${lowStock}</strong></article>
    <article><span>Cereri în așteptare</span><strong>${pending}</strong></article>
  `;
}

function renderAdminBooks() {
  if (!$("#adminBooks")) return;
  const query = $("#adminSearch").value.toLowerCase();
  const category = $("#adminCategoryFilter").value;
  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
  $("#adminCategoryFilter").innerHTML = `<option value="all">Toate categoriile</option>${categories.map((item) => `<option value="${item}">${item}</option>`).join("")}`;
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
        <td><strong>${book.title}</strong><span>${book.author}</span></td>
        <td>${book.category || "General"}</td>
        <td>${book.language || "ro"}</td>
        <td${stockClass}>${stockLabel}</td>
        <td>${book.reserved || 0}</td>
        <td>${available}</td>
        <td>${Number(book.price || 0).toFixed(2)} €</td>
        <td class="table-actions">
          <button type="button" data-action="minus" data-id="${book.id}">-</button>
          <button type="button" data-action="plus" data-id="${book.id}">+</button>
          <button type="button" data-action="edit" data-id="${book.id}">Editează</button>
          <button type="button" data-action="delete" data-id="${book.id}">Șterge</button>
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
    return `
    <article class="reservation-card">
      <div>
        <strong>${title}</strong>
        <span>${reservation.member} · ${reservation.contact}</span>
        <span>${total.toFixed(2)} €</span>
        <small>${new Date(reservation.createdAt).toLocaleString("ro-RO")}</small>
      </div>
      <mark>${statusLabels[reservation.status] || reservation.status}</mark>
      <div class="table-actions">
        <button type="button" data-id="${reservation.id}" data-status="approved">Pregătită</button>
        <button type="button" data-id="${reservation.id}" data-status="collected">Predată</button>
        <button type="button" data-id="${reservation.id}" data-status="cancelled">Anulează</button>
      </div>
    </article>
  `;
  }).join("") || "<p>Nu există cereri active.</p>";
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
      <strong>${log.action}</strong>
      <span>${log.entity} · ${log.actor} · ${new Date(log.createdAt).toLocaleString("ro-RO")}</span>
    </article>
  `).join("") || "<p>Încă nu există modificări înregistrate.</p>";
  if ($("#auditPageInfo")) $("#auditPageInfo").textContent = `Pagina ${auditPage + 1} de ${maxPage + 1}`;
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
  if (days) parts.push(`${days} ${days === 1 ? "zi" : "zile"}`);
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
  if (next.live) {
    node.textContent = `Live acum · până la ${next.end.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`;
    return;
  }
  const day = capitalize(next.start.toLocaleDateString("ro-RO", { weekday: "long" }));
  node.textContent = `${day}, ${next.start.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })} · peste ${formatTimeDistance(next.start - now)}`;
}

function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name").trim();
    const contact = data.get("contact").trim();
    const message = data.get("message").trim();
    const subject = encodeURIComponent(`Mesaj de pe site - ${name}`);
    const body = encodeURIComponent(`Nume: ${name}\nContact: ${contact}\n\nMesaj:\n${message}`);
    window.location.href = `mailto:bbetelreus@gmail.com?subject=${subject}&body=${body}`;
    $("#contactFormMessage").textContent = "Se deschide aplicația de email.";
  });
}

$("#langToggle")?.addEventListener("click", () => {
  lang = lang === "ro" ? "es" : "ro";
  localStorage.setItem("betel-lang", lang);
  applyLanguage();
  loadVerse();
});

$("#year").textContent = new Date().getFullYear();

startHeroRotation();
setupLibrary();
setupAdmin();
applyLanguage();
loadVerse();
loadVideos();
updateLiveCountdown();
setInterval(updateLiveCountdown, 60000);
setupContactForm();
