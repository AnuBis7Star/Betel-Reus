const translations = {
  ro: {
    navSchedule: "Program",
    navLibrary: "Biblioteca",
    navVideos: "Predici",
    navContact: "Contact",
    eyebrow: "Biserica penticostala in Reus",
    heroText: "O comunitate calda, centrata in inchinare, Cuvant si slujire. Urmareste programul, predicile si resursele pentru familie.",
    heroYoutube: "Vezi predici",
    heroSchedule: "Vezi programul",
    verseLabel: "Versetul zilei",
    scheduleEyebrow: "Ne intalnim impreuna",
    scheduleTitle: "Program si evenimente",
    scheduleText: "Pastreaza aici programul principal al bisericii si evenimentele care trebuie vazute rapid de membrii si vizitatori.",
    saturdayOther: "Alte activitati dupa program",
    libraryEyebrow: "MVP pentru membri",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "Accesul este pentru membrii comunitatii. Introdu numele tau si codul primit de la responsabilul bibliotecii.",
    memberName: "Nume",
    memberActive: "Membru",
    accessCode: "Cod acces",
    enterLibrary: "Intra in biblioteca",
    accessDenied: "Codul nu este corect.",
    resetLibrary: "Reseteaza demo",
    bookTitle: "Titlu",
    bookAuthor: "Autor",
    bookStock: "Stoc",
    bookPrice: "Pret",
    addBook: "Adauga carte",
    filterAll: "Toate",
    filterAvailable: "Disponibile",
    filterReserved: "Rezervate",
    videosTitle: "Ultimele predici si cantari",
    socialEyebrow: "Retele sociale",
    socialTitle: "Ramai aproape de comunitate",
    aboutEyebrow: "Despre noi",
    aboutTitle: "O familie in credinta, in inima orasului Reus",
    aboutText: "Text provizoriu: Biserica Betel Reus exista pentru a-L glorifica pe Dumnezeu, a creste in Cuvant si a sluji oamenilor cu dragoste.",
    contactAddress: "Adresa exacta de completat",
    contactEmail: "Email / telefon de completat",
    reserve: "Rezerva",
    request: "Cere",
    addToCart: "Adauga",
    cartEyebrow: "Cos",
    cartTitle: "Cererea ta",
    cartEmpty: "Cosul este gol.",
    cartTotal: "Total",
    confirmCart: "Trimite cererea",
    cartSent: "Cererea a fost trimisa.",
    returnBook: "Returneaza",
    available: "disponibile",
    reserved: "rezervate"
  },
  es: {
    navSchedule: "Horario",
    navLibrary: "Biblioteca",
    navVideos: "Predicaciones",
    navContact: "Contacto",
    eyebrow: "Iglesia pentecostal en Reus",
    heroText: "Una comunidad cercana, centrada en la adoracion, la Palabra y el servicio. Sigue el horario, las predicaciones y recursos para la familia.",
    heroYoutube: "Ver predicaciones",
    heroSchedule: "Ver horario",
    verseLabel: "Versiculo del dia",
    scheduleEyebrow: "Nos reunimos juntos",
    scheduleTitle: "Horario y eventos",
    scheduleText: "Aqui vive el programa principal de la iglesia y los eventos que miembros y visitantes necesitan encontrar rapido.",
    saturdayOther: "Otras actividades segun programacion",
    libraryEyebrow: "MVP para miembros",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "El acceso es para miembros de la comunidad. Introduce tu nombre y el codigo recibido del responsable de la biblioteca.",
    memberName: "Nombre",
    memberActive: "Miembro",
    accessCode: "Codigo de acceso",
    enterLibrary: "Entrar en biblioteca",
    accessDenied: "El codigo no es correcto.",
    resetLibrary: "Reiniciar demo",
    bookTitle: "Titulo",
    bookAuthor: "Autor",
    bookStock: "Stock",
    bookPrice: "Precio",
    addBook: "Anadir libro",
    filterAll: "Todos",
    filterAvailable: "Disponibles",
    filterReserved: "Reservados",
    videosTitle: "Ultimas predicaciones y cantos",
    socialEyebrow: "Redes sociales",
    socialTitle: "Permanece cerca de la comunidad",
    aboutEyebrow: "Sobre nosotros",
    aboutTitle: "Una familia en la fe, en el corazon de Reus",
    aboutText: "Texto provisional: Biserica Betel Reus existe para glorificar a Dios, crecer en la Palabra y servir a las personas con amor.",
    contactAddress: "Direccion exacta pendiente",
    contactEmail: "Email / telefono pendiente",
    reserve: "Reservar",
    request: "Pedir",
    addToCart: "Anadir",
    cartEyebrow: "Carrito",
    cartTitle: "Tu pedido",
    cartEmpty: "El carrito esta vacio.",
    cartTotal: "Total",
    confirmCart: "Confirmar pedido",
    cartSent: "Pedido enviado al panel.",
    returnBook: "Devolver",
    available: "disponibles",
    reserved: "reservados"
  }
};

const seedBooks = [
  { id: crypto.randomUUID(), title: "Viata condusa de scopuri", author: "Rick Warren", stock: 4, price: 12.5, reserved: 1 },
  { id: crypto.randomUUID(), title: "Crestinul autentic", author: "John Stott", stock: 2, price: 9.99, reserved: 0 },
  { id: crypto.randomUUID(), title: "Rugaciunea", author: "Timothy Keller", stock: 1, price: 14, reserved: 0 },
  { id: crypto.randomUUID(), title: "Biblia pentru copii", author: "Resurse familie", stock: 6, price: 18, reserved: 2 }
];

let lang = localStorage.getItem("betel-lang") || "ro";
let books = JSON.parse(localStorage.getItem("betel-books") || "null") || seedBooks;
let cart = JSON.parse(localStorage.getItem("betel-cart") || "[]");
let usingServerData = false;
let videoRotationFrame;
let videoResumeTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const accessCode = "BETEL-REUS";
const defaultAdminCode = "ADMIN-BETEL";
const heroImages = [
  "https://i.ytimg.com/vi/5ANLpkgxZGE/maxresdefault.jpg",
  "https://i.ytimg.com/vi/V-w7Xf8OvDg/maxresdefault.jpg",
  "https://i.ytimg.com/vi/R5RH-wUQHd0/maxresdefault.jpg",
  "https://i.ytimg.com/vi/J3lrKcTgpmU/maxresdefault.jpg"
];

const seedReservations = [
  {
    id: crypto.randomUUID(),
    member: "Membru demo",
    contact: "biblioteca",
    status: "pending",
    items: [{ title: "Viata condusa de scopuri", quantity: 1, price: 12.5 }],
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    member: "Familie demo",
    contact: "dupa program",
    status: "approved",
    items: [{ title: "Biblia pentru copii", quantity: 1, price: 18 }],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let reservations = JSON.parse(localStorage.getItem("betel-reservations") || "null") || seedReservations;
let auditLogs = JSON.parse(localStorage.getItem("betel-audit-logs") || "[]");

function saveBooks() {
  localStorage.setItem("betel-books", JSON.stringify(books));
}

function saveReservations() {
  localStorage.setItem("betel-reservations", JSON.stringify(reservations));
}

function saveCart() {
  localStorage.setItem("betel-cart", JSON.stringify(cart));
}

function saveAuditLogs() {
  localStorage.setItem("betel-audit-logs", JSON.stringify(auditLogs));
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && typeof options.body !== "string") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  if (path.startsWith("/api/admin/")) headers["x-admin-code"] = localStorage.getItem("betel-admin-code") || defaultAdminCode;

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
    localStorage.setItem("betel-books", JSON.stringify(books));
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
    actor: "admin-demo",
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
  if ($("#bookSearch")) $("#bookSearch").placeholder = lang === "ro" ? "Cauta dupa titlu sau autor" : "Busca por titulo o autor";
  if ($("#books")) renderBooks();
  if ($("#cartItems")) renderCart();
}

function renderBooks() {
  if (!$("#books")) return;
  const query = $("#bookSearch").value.toLowerCase();
  const filter = $("#bookFilter").value;
  const t = translations[lang];
  const visibleBooks = books.filter((book) => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query);
    const available = book.stock - book.reserved > 0;
    const matchesFilter = filter === "all" || (filter === "available" && available);
    return matchesQuery && matchesFilter;
  });

  $("#books").innerHTML = visibleBooks.map((book) => {
    const available = Math.max(book.stock - book.reserved, 0);
    return `
      <article class="book-card">
        <div>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
        </div>
        <div class="book-meta">
          <span>${available} ${t.available}</span>
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
    rail.classList.add("is-dragging");
    pause();
    rail.setPointerCapture?.(event.pointerId);
  });

  rail.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 6) dragged = true;
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
    rail.releasePointerCapture?.(event.pointerId);
    resumeSoon();
    setTimeout(() => {
      dragged = false;
    }, 120);
  };

  rail.addEventListener("pointerup", finishDrag);
  rail.addEventListener("pointercancel", finishDrag);
  rail.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  paint();
  videoRotationFrame = requestAnimationFrame(tick);
}

async function unlockLibrary() {
  localStorage.setItem("betel-library-access", "true");
  $("#libraryGate")?.classList.add("is-hidden");
  $("#libraryShell")?.classList.remove("is-hidden");
  if ($("#activeMember")) $("#activeMember").textContent = localStorage.getItem("betel-member-name") || "";
  await loadBooksFromApi();
  renderBooks();
  renderCart();
}

function setupLibrary() {
  if (!$("#libraryGate")) return;

  if (localStorage.getItem("betel-library-access") === "true" && localStorage.getItem("betel-member-name")) unlockLibrary();

  $("#accessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    const code = data.get("code").trim().toUpperCase();
    if (code === accessCode) {
      localStorage.setItem("betel-member-name", name);
      await unlockLibrary();
      return;
    }
    $("#accessMessage").textContent = translations[lang].accessDenied;
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
  const member = localStorage.getItem("betel-member-name") || "Membru";
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
    logAudit("Solicitud enviada por miembro", "reservation", null, fallbackRequest);
    saveReservations();
  }
  cart = [];
  saveCart();
  renderCart();
  $("#cartMessage").textContent = translations[lang].cartSent;
}

async function unlockAdmin(code = localStorage.getItem("betel-admin-code") || defaultAdminCode) {
  localStorage.setItem("betel-admin-code", code);
  await loadBooksFromApi();
  await loadAdminDataFromApi(true);
  localStorage.setItem("betel-admin-access", "true");
  $("#adminGate")?.classList.add("is-hidden");
  $("#adminShell")?.classList.remove("is-hidden");
  renderAdmin();
}

function setupAdmin() {
  if (!$("#adminGate")) return;

  if (localStorage.getItem("betel-admin-access") === "true") {
    unlockAdmin().catch(() => {
      localStorage.removeItem("betel-admin-access");
      $("#adminAccessMessage").textContent = "Vuelve a introducir el codigo admin.";
    });
  }

  $("#adminAccessForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code").trim();
    $("#adminAccessMessage").textContent = "Comprobando...";
    try {
      await unlockAdmin(code);
      $("#adminAccessMessage").textContent = "";
    } catch (error) {
      localStorage.removeItem("betel-admin-access");
      localStorage.removeItem("betel-admin-code");
      $("#adminAccessMessage").textContent = "Codigo incorrecto o conexion no disponible.";
    }
  });

  $("#adminBookForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editingId = data.get("id");
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    const message = $("#adminFormMessage");
    submitButton.disabled = true;
    submitButton.textContent = editingId ? "Actualizando..." : "Guardando...";
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
          message.textContent = error.status === 401 ? "Codigo admin incorrecto." : "No se pudo actualizar en la base de datos.";
          submitButton.disabled = false;
          submitButton.textContent = "Actualizar libro";
          return;
        }
        const book = books.find((item) => item.id === editingId);
        if (book) {
          const before = { ...book };
          Object.assign(book, payload);
          logAudit("Libro actualizado", "book", before, { ...book });
        }
      }
    } else {
      try {
        const data = await apiRequest("/api/admin/books", { method: "POST", body: payload });
        books.unshift(data.book);
      } catch (error) {
        if (usingServerData || error.status === 401) {
          message.textContent = error.status === 401 ? "Codigo admin incorrecto." : "No se pudo guardar en la base de datos.";
          submitButton.disabled = false;
          submitButton.textContent = "Guardar libro";
          return;
        }
        const book = { id: crypto.randomUUID(), ...payload };
        books.unshift(book);
        logAudit("Libro creado", "book", null, book);
      }
    }

    event.currentTarget.reset();
    event.currentTarget.elements.id.value = "";
    $("#adminSubmitLabel").textContent = "Guardar libro";
    submitButton.disabled = false;
    message.textContent = "Guardado.";
    saveBooks();
    renderAdmin();
  });

  $("#adminSearch").addEventListener("input", renderAdminBooks);
  $("#adminCategoryFilter").addEventListener("change", renderAdminBooks);

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
      $("#adminSubmitLabel").textContent = "Actualizar libro";
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      if (button.dataset.action === "plus" || button.dataset.action === "minus") {
        const data = await apiRequest(`/api/admin/books/${book.id}/stock`, {
          method: "PATCH",
          body: { delta: button.dataset.action === "plus" ? 1 : -1 }
        });
        Object.assign(book, data.book);
      }
      if (button.dataset.action === "delete") {
        await apiRequest(`/api/admin/books/${book.id}`, { method: "DELETE" });
        books = books.filter((item) => item.id !== book.id);
      }
    } catch (error) {
      if (button.dataset.action === "plus") book.stock += 1;
      if (button.dataset.action === "minus") book.stock = Math.max(book.reserved || 0, book.stock - 1);
      if (button.dataset.action === "delete") books = books.filter((item) => item.id !== book.id);
      logAudit(`Inventario: ${button.dataset.action}`, "book", before, button.dataset.action === "delete" ? null : { ...book });
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
      logAudit(`Solicitud marcada como ${button.dataset.status}`, "reservation", before, { ...reservation });
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
}

function renderAdminStats() {
  if (!$("#adminStats")) return;
  const totalStock = books.reduce((sum, book) => sum + Number(book.stock || 0), 0);
  const totalReserved = books.reduce((sum, book) => sum + Number(book.reserved || 0), 0);
  const lowStock = books.filter((book) => Number(book.stock || 0) - Number(book.reserved || 0) <= 1).length;
  const pending = reservations.filter((item) => item.status === "pending").length;
  $("#adminStats").innerHTML = `
    <article><span>Libros</span><strong>${books.length}</strong></article>
    <article><span>Stock total</span><strong>${totalStock}</strong></article>
    <article><span>Apartados</span><strong>${totalReserved}</strong></article>
    <article><span>Bajo stock</span><strong>${lowStock}</strong></article>
    <article><span>Pedidos pendientes</span><strong>${pending}</strong></article>
  `;
}

function renderAdminBooks() {
  if (!$("#adminBooks")) return;
  const query = $("#adminSearch").value.toLowerCase();
  const category = $("#adminCategoryFilter").value;
  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))].sort();
  $("#adminCategoryFilter").innerHTML = `<option value="all">Todas las categorias</option>${categories.map((item) => `<option value="${item}">${item}</option>`).join("")}`;
  $("#adminCategoryFilter").value = category && [...categories, "all"].includes(category) ? category : "all";

  const visibleBooks = books.filter((book) => {
    const text = `${book.title} ${book.author} ${book.category || ""}`.toLowerCase();
    return text.includes(query) && ($("#adminCategoryFilter").value === "all" || book.category === $("#adminCategoryFilter").value);
  });

  $("#adminBooks").innerHTML = visibleBooks.map((book) => {
    const available = Math.max(Number(book.stock || 0) - Number(book.reserved || 0), 0);
    return `
      <tr>
        <td><strong>${book.title}</strong><span>${book.author}</span></td>
        <td>${book.category || "General"}</td>
        <td>${book.language || "ro"}</td>
        <td>${book.stock}</td>
        <td>${book.reserved || 0}</td>
        <td>${available}</td>
        <td>${Number(book.price || 0).toFixed(2)} €</td>
        <td class="table-actions">
          <button type="button" data-action="minus" data-id="${book.id}">-</button>
          <button type="button" data-action="plus" data-id="${book.id}">+</button>
          <button type="button" data-action="edit" data-id="${book.id}">Editar</button>
          <button type="button" data-action="delete" data-id="${book.id}">Eliminar</button>
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
        <small>${new Date(reservation.createdAt).toLocaleString("es-ES")}</small>
      </div>
      <mark>${reservation.status}</mark>
      <div class="table-actions">
        <button type="button" data-id="${reservation.id}" data-status="approved">Preparado</button>
        <button type="button" data-id="${reservation.id}" data-status="collected">Entregado</button>
        <button type="button" data-id="${reservation.id}" data-status="cancelled">Cancelar</button>
      </div>
    </article>
  `;
  }).join("") || "<p>No hay pedidos activos.</p>";
}

function getReservationItems(reservation) {
  if (Array.isArray(reservation.items)) return reservation.items;
  return [{ title: reservation.bookTitle || "Libro", quantity: 1, price: 0 }];
}

function renderAuditLog() {
  if (!$("#auditLog")) return;
  $("#auditLog").innerHTML = auditLogs.slice(0, 20).map((log) => `
    <article>
      <strong>${log.action}</strong>
      <span>${log.entity} · ${log.actor} · ${new Date(log.createdAt).toLocaleString("es-ES")}</span>
    </article>
  `).join("") || "<p>Todavia no hay cambios registrados.</p>";
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
