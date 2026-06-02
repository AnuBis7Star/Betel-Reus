import { apiRequest as requestApi } from "./api.js";

const contactEmail = ["contacto", "betelreus.com"].join("@");
const contactFormMinimumMs = 3000;

const translations = {
  ro: {
    navHome: "Acasă",
    navSchedule: "Program",
    navFirstVisit: "Prima vizită",
    navResources: "Resurse",
    navLibrary: "Bibliotecă",
    navVideos: "Predici",
    navYoutube: "YouTube",
    navLive: "Live",
    navAdmin: "Panou",
    navContact: "Contact",
    eyebrow: "Biserică penticostală în Reus",
    heroText: "Betel Reus, o casă de închinare. O familie în care ne rugăm, ascultăm Cuvântul și creștem împreună în Hristos.",
    heroYoutube: "Vezi predici",
    heroSchedule: "Vezi programul",
    heroVisit: "Vino duminică la biserică",
    heroMaps: "Deschide locația în Maps",
    verseLabel: "Versetul zilei",
    verseLoading: "Se încarcă...",
    authChecking: "Se încarcă...",
    liveLabel: "Următorul live",
    liveLoading: "Se calculează...",
    liveYoutube: "Urmărește live pe YouTube",
    liveNow: "Live acum",
    liveUntil: "până la",
    liveIn: "peste",
    scheduleEyebrow: "Ne întâlnim împreună",
    scheduleTitle: "Program și evenimente",
    scheduleText: "Programul principal al bisericii pentru membri, familii și vizitatori.",
    scheduleColumnTitle: "Program",
    eventsColumnTitle: "Evenimente",
    saturdayOther: "Alte activități după program",
    sunday: "Duminică",
    monday: "Luni",
    wednesday: "Miercuri",
    friday: "Vineri",
    saturday: "Sâmbătă",
    divineService: "Serviciu divin",
    prayer: "Rugăciune",
    youth: "Tineret",
    volleyEventEyebrow: "Eveniment tineret",
    volleyEventTitle: "Volleyball Tournament",
    volleyEventText: "A 4-a ediție: o zi sportivă pentru echipe, prieteni și tineri în Reus.",
    volleyEventDate: "13 Iunie 2026 · 10:00",
    volleyEventCta: "Vezi pagina evenimentului",
    firstVisitEyebrow: "Prima dată cu noi?",
    firstVisitTitle: "Informații pentru vizitatori",
    firstVisitContact: "Contactează-ne",
    faqParkingTitle: "Unde pot parca?",
    faqParkingText: "Există parcare pe stradă, în fața bisericii și în zona din apropiere.",
    faqLanguageTitle: "În ce limbă este serviciul?",
    faqLanguageText: "Serviciul este în limba română, dar avem sistem de traducere în limba spaniolă.",
    faqWelcomeTitle: "Pot veni dacă nu sunt român?",
    faqWelcomeText: "Da. Toată lumea este binevenită la Betel Reus.",
    faqChildrenTitle: "Există program pentru copii?",
    faqChildrenText: "Da. Duminica dimineața, între 10:00 și 12:00, avem școală duminicală pentru copii.",
    faqSundayTitle: "Ce pot aștepta într-o duminică?",
    faqSundayText: "Programul se împarte, de obicei, în trei părți: un timp de rugăciune, cântări și mesaje scurte; apoi un timp de laudă, unde persoanele pot trimite un mesaj pastorului pentru a participa cu cântări, poezii sau mesaje; iar la final aproximativ o oră de predicare din Cuvântul lui Dumnezeu.",
    libraryEyebrow: "Pentru membri",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "Accesul este pentru membrii comunității. Introdu numele tău și codul primit de la responsabilul bibliotecii.",
    libraryHelperText: "Biblioteca este disponibilă doar membrilor bisericii. Nu ai cod? Trimite un mesaj sau contactează-l pe Alin Enrique Nascutiu.",
    memberName: "Nume",
    memberActive: "Membru",
    accessCode: "Cod acces",
    memberNamePlaceholder: "Numele tău",
    libraryCodePlaceholder: "Cod bibliotecă",
    bookSearchPlaceholder: "Caută după titlu sau autor",
    bookCategoryFilterLabel: "Filtru categorie",
    bookAvailabilityFilterLabel: "Filtru bibliotecă",
    filterAllCategories: "Toate categoriile",
    enterLibrary: "Intră în bibliotecă",
    exitLibrary: "Ieșire",
    accessDenied: "Codul nu este corect. Verifică-l și încearcă din nou. Dacă nu ai cod, trimite un mesaj sau contactează-l pe Alin Enrique Nascutiu.",
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
    contactEmail: "contacto@betelreus.com · +34 605 43 05 73",
    contactPastor: "Telefon pastor: Dorel Abutnăriți",
    contactTransport: "Parcare: locuri pe stradă, în fața bisericii. Transport public: verifică ruta locală către Carrer de Terrassa 33.",
    contactCall: "Sună-ne",
    contactSendEmail: "Trimite email",
    contactMapTitle: "Hartă Betel Reus",
    contactLoadMap: "Încarcă harta",
    contactFormTitle: "Trimite-ne un mesaj",
    contactFormHint: "Mesajul se va trimite către contacto@betelreus.com.",
    contactFormName: "Nume",
    contactFormNamePlaceholder: "Numele tău",
    contactFormContact: "Email sau telefon",
    contactFormContactPlaceholder: "Cum te putem contacta?",
    contactFormMessage: "Mesaj",
    contactFormMessagePlaceholder: "Scrie mesajul tău",
    contactFormSent: "Se deschide aplicația de email.",
    reserve: "Rezervă",
    request: "Cere",
    addToCart: "Adaugă",
    cartEyebrow: "Coș",
    cartTitle: "Cererea ta",
    cartEmpty: "Coșul este gol.",
    cartTotal: "Total",
    confirmCart: "Trimite cererea",
    cartSent: "Cererea a fost trimisă.",
    cartOpen: "Deschide coșul",
    cartClose: "Închide coșul",
    returnBook: "Returnează",
    available: "disponibile",
    unavailable: "indisponibil",
    reserved: "rezervate",
    adminPrivatePanel: "Panou privat",
    adminHomeTitle: "Administrare",
    adminHomeText: "Introdu codul privat pentru a alege ce secțiune vrei să gestionezi.",
    adminChooseSection: "Alege secțiunea",
    adminAllSections: "Toate secțiunile",
    adminModuleLibraryTitle: "Bibliotecă",
    adminModuleLibrarySummary: "Cărți, stoc, cereri și istoric",
    adminModuleLibraryText: "Gestionează inventarul bibliotecii și comenzile membrilor.",
    adminModuleVolleyTitle: "Turneu volley",
    adminModuleVolleySummary: "Înscrieri, echipe și aprobare",
    adminModuleVolleyText: "Editează echipele înscrise și aprobă ce apare public.",
    adminModuleEventsTitle: "Evenimente",
    adminModuleEventsSummary: "Program, afișe și publicare",
    adminModuleEventsText: "Creează evenimente care apar automat pe pagina principală.",
    adminModuleFutureTitle: "Viitor",
    adminModuleFutureSummary: "Alt modul",
    adminModuleFutureText: "Spațiu pregătit pentru următoarea secțiune.",
    adminGateTitle: "Control bibliotecă",
    adminGateText: "Introdu codul privat de administrare pentru a gestiona cărți, cereri și istoric.",
    adminCodeLabel: "Cod administrare",
    adminCodePlaceholder: "Cod privat",
    adminEnter: "Intră în panou",
    adminLibraryEyebrow: "Biblioteca Betel",
    adminControlTitle: "Panou de control",
    adminViewLibrary: "Vezi biblioteca",
    adminVolleyPageTitle: "Turneu volley",
    adminVolleyGateText: "Introdu codul privat pentru a gestiona echipele înscrise.",
    adminViewVolley: "Vezi pagina volley",
    adminVolleyRegistrationsTitle: "Înscrieri echipe",
    adminVolleyTableTitle: "Echipe și înscrieri",
    adminVolleyTeam: "Echipă",
    adminVolleyRepresentative: "Reprezentant",
    adminVolleyChurch: "Biserică",
    adminVolleyColor: "Culoare",
    adminVolleyPlayers: "Jucători",
    adminVolleyStatus: "Stare",
    adminVolleyNotes: "Note",
    adminVolleySave: "Salvează",
    adminVolleyApprove: "Acceptă",
    adminVolleyReject: "Respinge",
    adminVolleyPending: "În așteptare",
    adminVolleyApproved: "Acceptat",
    adminVolleyRejected: "Respins",
    adminVolleyEmpty: "Încă nu există înscrieri la volley.",
    adminVolleyDeleted: "Înscriere ștearsă.",
    adminVolleySavedMessage: "Înscriere salvată.",
    adminVolleyStatusUpdated: "Stare actualizată.",
    adminVolleySaveError: "Nu s-a putut salva înscrierea.",
    eventModalDate: "Data",
    eventModalTime: "Ora",
    eventModalLocation: "Locație",
    eventNoPoster: "Afișul va apărea aici",
    adminEventsPageTitle: "Evenimente",
    adminEventsGateText: "Introdu codul privat pentru a gestiona evenimentele de pe pagina principală.",
    adminEventsViewLanding: "Vezi pagina principală",
    adminEventsAdd: "+ Adaugă eveniment",
    adminEventsSummaryEyebrow: "Rezumat",
    adminEventsSummaryTitle: "Evenimente publicate",
    adminEventsSummaryText: "Evenimentele publicate apar automat pe pagina principală.",
    adminEventsListEyebrow: "Listă",
    adminEventsListTitle: "Evenimente create",
    adminEventsEmptyEyebrow: "Fără evenimente",
    adminEventsEmptyTitle: "Încă nu există evenimente create",
    adminEventsEmptyText: "Adaugă primul eveniment pentru ca acesta să poată apărea pe pagina principală.",
    adminEventsEditorEyebrow: "Editor",
    adminEventsNewTitle: "Adaugă eveniment",
    adminEventsEditTitle: "Editează eveniment",
    adminEventsClose: "Închide",
    adminEventsGeneral: "Informații generale",
    adminEventsDate: "Data",
    adminEventsTime: "Ora",
    adminEventsLocation: "Locație",
    adminEventsCategory: "Categorie",
    adminEventsPublished: "Publicat",
    adminEventsFeatured: "Recomandat",
    adminEventsAccent: "Culoare card",
    adminEventsColorDetected: "Culoarea cardului a fost detectată din afiș.",
    adminEventsColorDetectError: "Nu s-a putut detecta culoarea. Alege manual culoarea cardului.",
    adminEventsTitleLabel: "Titlu",
    adminEventsShortLabel: "Descriere scurtă",
    adminEventsFullLabel: "Descriere completă",
    adminEventsPosterRo: "Afiș română",
    adminEventsTitleLabelEs: "Título",
    adminEventsShortLabelEs: "Descripción corta",
    adminEventsFullLabelEs: "Descripción completa",
    adminEventsPosterEs: "Cartel español",
    adminEventsPreview: "Previzualizare card",
    adminEventsDelete: "Șterge eveniment",
    adminEventsSaveDraft: "Salvează ca schiță",
    adminEventsSave: "Salvează eveniment",
    adminEventsPublishedStatus: "Publicat",
    adminEventsHiddenStatus: "Ascuns",
    adminEventsNoPoster: "Fără afiș",
    adminEventsIncompleteRo: "RO incomplet",
    adminEventsIncompleteEs: "ES incomplet",
    adminEventsTotal: "Total",
    adminEventsPublishedCount: "Publicate",
    adminEventsHiddenCount: "Ascunse",
    adminEventsFeaturedCount: "Recomandate",
    adminEventsPublish: "Publică",
    adminEventsHide: "Ascunde",
    adminEventsSaved: "Eveniment salvat.",
    adminEventsDeleted: "Eveniment șters.",
    adminEventsSaveError: "Nu s-a putut salva evenimentul.",
    adminEventsDeleteError: "Nu s-a putut șterge evenimentul.",
    adminEventsConfirmDelete: "Sigur vrei să ștergi acest eveniment?",
    adminBookFormTitle: "Carte",
    adminTitlePlaceholder: "Titlul cărții",
    adminCategoryLabel: "Categorie",
    adminCategoryPlaceholder: "Biblii, Familie, Tineri...",
    adminLanguageLabel: "Limbă",
    adminRomanian: "Română",
    adminSpanish: "Spaniolă",
    adminEnglish: "Engleză",
    adminSaveBook: "Salvează cartea",
    adminUpdateBook: "Actualizează cartea",
    adminBulkTitle: "Importă mai multe",
    adminBulkHelp: "O linie pentru fiecare carte: titlu; autor; categorie; limbă; stoc; preț",
    adminBulkPlaceholder: "Biblia de studiu; Autor; Biblii; ro; 3; 25.00",
    adminImportBooks: "Importă cărți",
    adminSearchPlaceholder: "Caută după titlu, autor sau categorie",
    adminSaveStockChanges: "Salvează modificările de stoc",
    adminSaveStockChangesCount: "Salvează modificările de stoc",
    adminTableBook: "Carte",
    adminReservedShort: "Rezerv.",
    adminAvailableShort: "Disp.",
    adminActions: "Acțiuni",
    adminRequestsEyebrow: "Cereri",
    adminRequestsTitle: "În așteptare și stare",
    adminHistoryEyebrow: "Istoric",
    adminHistoryTitle: "Ultimele modificări",
    adminPrev: "Înapoi",
    adminNext: "Înainte",
    adminPage: "Pagina",
    adminPageOf: "din",
    adminReenterCode: "Introdu din nou codul de administrare.",
    adminChecking: "Se verifică...",
    adminWrongCode: "Cod incorect sau conexiune indisponibilă.",
    adminSaving: "Se salvează...",
    adminUpdating: "Se actualizează...",
    adminAuthError: "Cod de administrare incorect.",
    adminDbUpdateError: "Nu s-a putut actualiza în baza de date.",
    adminDbSaveError: "Nu s-a putut salva în baza de date.",
    adminDbImportError: "Nu s-a putut importa în baza de date.",
    adminStockSaveError: "Nu s-a putut salva stocul.",
    adminBookAddedSaving: "Carte adăugată. Se salvează în baza de date...",
    adminSaved: "Salvat.",
    adminStockSaving: "Se salvează stocul...",
    adminStockSaved: "Stoc salvat.",
    adminAddBulkLine: "Adaugă cel puțin o linie cu titlu și autor.",
    adminBulkInvalidLine: "Linie incompletă",
    adminImporting: "Se importă...",
    adminBooksAddedSaving: "cărți adăugate. Se salvează în baza de date...",
    adminBooksImported: "cărți importate.",
    adminBooksImportedLocal: "cărți importate local.",
    adminTotalStock: "Stoc total",
    adminLowStock: "Stoc redus",
    adminPendingRequests: "Cereri în așteptare",
    adminEdit: "Editează",
    adminDelete: "Șterge",
    adminReady: "În lucru",
    adminComplete: "Completată",
    adminDelivered: "Completată",
    adminCancel: "Anulează",
    adminNoRequests: "Nu există cereri active.",
    adminNoHistory: "Încă nu există modificări înregistrate.",
    adminStatusPending: "În așteptare",
    adminStatusApproved: "În lucru",
    adminStatusCollected: "Completată",
    adminStatusCancelled: "Anulată",
    adminEntityBook: "carte",
    adminEntityOrder: "cerere",
    adminEntityReservation: "cerere",
    adminEntityEvent: "eveniment",
    adminActionMemberRequest: "Cerere trimisă de membru",
    adminActionBookCreated: "Carte creată",
    adminActionBookUpdated: "Carte actualizată",
    adminActionBooksImported: "Cărți importate",
    adminActionBookDeleted: "Carte ștearsă",
    adminActionInventoryPlus: "Inventar: plus",
    adminActionInventoryMinus: "Inventar: minus",
    adminActionRequestMarked: "Cerere marcată ca"
  },
  es: {
    navHome: "Inicio",
    navSchedule: "Horario",
    navFirstVisit: "Primera visita",
    navResources: "Recursos",
    navLibrary: "Biblioteca",
    navVideos: "Predicaciones",
    navYoutube: "YouTube",
    navLive: "Directo",
    navAdmin: "Panel",
    navContact: "Contacto",
    eyebrow: "Iglesia pentecostal en Reus",
    heroText: "Betel Reus, una casa de adoración. Una familia donde oramos, escuchamos la Palabra y crecemos juntos en Cristo.",
    heroYoutube: "Ver predicaciones",
    heroSchedule: "Ver horario",
    heroVisit: "Ven el domingo a la iglesia",
    heroMaps: "Abrir ubicación en Maps",
    verseLabel: "Versículo del día",
    verseLoading: "Cargando...",
    authChecking: "Cargando...",
    liveLabel: "Próximo directo",
    liveLoading: "Calculando...",
    liveYoutube: "Ver directo en YouTube",
    liveNow: "En directo ahora",
    liveUntil: "hasta las",
    liveIn: "en",
    scheduleEyebrow: "Nos reunimos juntos",
    scheduleTitle: "Horario y eventos",
    scheduleText: "El programa principal de la iglesia para miembros, familias y visitantes.",
    scheduleColumnTitle: "Horarios",
    eventsColumnTitle: "Eventos",
    saturdayOther: "Otras actividades según programación",
    sunday: "Domingo",
    monday: "Lunes",
    wednesday: "Miércoles",
    friday: "Viernes",
    saturday: "Sábado",
    divineService: "Servicio divino",
    prayer: "Oración",
    youth: "Jóvenes",
    volleyEventEyebrow: "Evento de jóvenes",
    volleyEventTitle: "Volleyball Tournament",
    volleyEventText: "4ª edición: un día deportivo para equipos, amigos y jóvenes en Reus.",
    volleyEventDate: "13 Junio 2026 · 10:00",
    volleyEventCta: "Ver página del evento",
    firstVisitEyebrow: "¿Primera vez con nosotros?",
    firstVisitTitle: "Información para visitantes",
    firstVisitContact: "Contacta con nosotros",
    faqParkingTitle: "¿Dónde puedo aparcar?",
    faqParkingText: "Hay aparcamiento en la calle, delante de la iglesia y en la zona cercana.",
    faqLanguageTitle: "¿En qué idioma es el servicio?",
    faqLanguageText: "El servicio es en rumano, pero disponemos de sistema de traducción al español.",
    faqWelcomeTitle: "¿Puedo venir si no soy rumano?",
    faqWelcomeText: "Sí. Todo el mundo es bienvenido en Betel Reus.",
    faqChildrenTitle: "¿Hay programa para niños?",
    faqChildrenText: "Sí. Los domingos por la mañana, de 10:00 a 12:00, hay escuela dominical para niños.",
    faqSundayTitle: "¿Qué puedo esperar un domingo?",
    faqSundayText: "El programa generalmente se divide en tres partes: primero hay un tiempo de oración, canciones y pequeños mensajes; después hay un momento de alabanza, donde las personas pueden enviar un mensaje al pastor para participar alabando a Dios con canciones, poesías o mensajes; finalmente, hay aproximadamente una hora de predicación de la Palabra de Dios.",
    libraryEyebrow: "Para miembros",
    libraryTitle: "Biblioteca Betel",
    libraryAccessTitle: "Biblioteca Betel",
    libraryAccessText: "El acceso es para miembros de la comunidad. Introduce tu nombre y el código recibido del responsable de la biblioteca.",
    libraryHelperText: "La biblioteca está disponible solo para miembros de la iglesia. ¿No tienes código? Envía un mensaje o contacta con Alin Enrique Nascutiu.",
    memberName: "Nombre",
    memberActive: "Miembro",
    accessCode: "Código de acceso",
    memberNamePlaceholder: "Tu nombre",
    libraryCodePlaceholder: "Código de biblioteca",
    bookSearchPlaceholder: "Busca por título o autor",
    bookCategoryFilterLabel: "Filtro de categoría",
    bookAvailabilityFilterLabel: "Filtro de biblioteca",
    filterAllCategories: "Todas las categorías",
    enterLibrary: "Entrar en biblioteca",
    exitLibrary: "Salir",
    accessDenied: "El código no es correcto. Revísalo e inténtalo otra vez. Si no tienes código, envía un mensaje o contacta con Alin Enrique Nascutiu.",
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
    contactEmail: "contacto@betelreus.com · +34 605 43 05 73",
    contactPastor: "Teléfono del pastor: Dorel Abutnăriți",
    contactTransport: "Parking: plazas en la calle, delante de la iglesia. Transporte público: revisa la ruta local hacia Carrer de Terrassa 33.",
    contactCall: "Llámanos",
    contactSendEmail: "Enviar email",
    contactMapTitle: "Mapa Betel Reus",
    contactLoadMap: "Cargar mapa",
    contactFormTitle: "Envíanos un mensaje",
    contactFormHint: "El mensaje se enviará a contacto@betelreus.com.",
    contactFormName: "Nombre",
    contactFormNamePlaceholder: "Tu nombre",
    contactFormContact: "Email o teléfono",
    contactFormContactPlaceholder: "¿Cómo podemos contactarte?",
    contactFormMessage: "Mensaje",
    contactFormMessagePlaceholder: "Escribe tu mensaje",
    contactFormSent: "Se abre la aplicación de email.",
    reserve: "Reservar",
    request: "Pedir",
    addToCart: "Añadir",
    cartEyebrow: "Carrito",
    cartTitle: "Tu pedido",
    cartEmpty: "El carrito está vacío.",
    cartTotal: "Total",
    confirmCart: "Confirmar pedido",
    cartSent: "Pedido enviado al panel.",
    cartOpen: "Abrir carrito",
    cartClose: "Cerrar carrito",
    returnBook: "Devolver",
    available: "disponibles",
    unavailable: "no disponible",
    reserved: "reservados",
    adminPrivatePanel: "Panel privado",
    adminHomeTitle: "Administración",
    adminHomeText: "Introduce el código privado para elegir qué sección quieres gestionar.",
    adminChooseSection: "Elige la sección",
    adminAllSections: "Todas las secciones",
    adminModuleLibraryTitle: "Biblioteca",
    adminModuleLibrarySummary: "Libros, stock, pedidos e historial",
    adminModuleLibraryText: "Gestiona el inventario de la biblioteca y los pedidos de los miembros.",
    adminModuleVolleyTitle: "Torneo volley",
    adminModuleVolleySummary: "Inscripciones, equipos y aprobación",
    adminModuleVolleyText: "Edita los equipos inscritos y aprueba lo que aparece públicamente.",
    adminModuleEventsTitle: "Eventos",
    adminModuleEventsSummary: "Horario, carteles y publicación",
    adminModuleEventsText: "Crea eventos que aparecen automáticamente en la página principal.",
    adminModuleFutureTitle: "Futuro",
    adminModuleFutureSummary: "Otro módulo",
    adminModuleFutureText: "Espacio preparado para la próxima sección.",
    adminGateTitle: "Control de biblioteca",
    adminGateText: "Introduce el código privado de administración para gestionar libros, pedidos e historial.",
    adminCodeLabel: "Código de administración",
    adminCodePlaceholder: "Código privado",
    adminEnter: "Entrar al panel",
    adminLibraryEyebrow: "Biblioteca Betel",
    adminControlTitle: "Panel de control",
    adminViewLibrary: "Ver biblioteca",
    adminVolleyPageTitle: "Torneo volley",
    adminVolleyGateText: "Introduce el código privado para gestionar los equipos inscritos.",
    adminViewVolley: "Ver página volley",
    adminVolleyRegistrationsTitle: "Inscripciones de equipos",
    adminVolleyTableTitle: "Equipos e inscripciones",
    adminVolleyTeam: "Equipo",
    adminVolleyRepresentative: "Representante",
    adminVolleyChurch: "Iglesia",
    adminVolleyColor: "Color",
    adminVolleyPlayers: "Jugadores",
    adminVolleyStatus: "Estado",
    adminVolleyNotes: "Notas",
    adminVolleySave: "Guardar",
    adminVolleyApprove: "Aceptar",
    adminVolleyReject: "Rechazar",
    adminVolleyPending: "Pendiente",
    adminVolleyApproved: "Aceptado",
    adminVolleyRejected: "Rechazado",
    adminVolleyEmpty: "Todavía no hay inscripciones de volley.",
    adminVolleyDeleted: "Inscripción eliminada.",
    adminVolleySavedMessage: "Inscripción guardada.",
    adminVolleyStatusUpdated: "Estado actualizado.",
    adminVolleySaveError: "No se pudo guardar la inscripción.",
    eventModalDate: "Fecha",
    eventModalTime: "Hora",
    eventModalLocation: "Ubicación",
    eventNoPoster: "El cartel aparecerá aquí",
    adminEventsPageTitle: "Eventos",
    adminEventsGateText: "Introduce el código privado para gestionar los eventos de la página principal.",
    adminEventsViewLanding: "Ver página principal",
    adminEventsAdd: "+ Añadir evento",
    adminEventsSummaryEyebrow: "Resumen",
    adminEventsSummaryTitle: "Eventos publicados",
    adminEventsSummaryText: "Los eventos publicados aparecen automáticamente en la página principal.",
    adminEventsListEyebrow: "Lista",
    adminEventsListTitle: "Eventos creados",
    adminEventsEmptyEyebrow: "Sin eventos",
    adminEventsEmptyTitle: "Todavía no hay eventos creados",
    adminEventsEmptyText: "Añade el primer evento para que pueda aparecer en la página principal.",
    adminEventsEditorEyebrow: "Editor",
    adminEventsNewTitle: "Añadir evento",
    adminEventsEditTitle: "Editar evento",
    adminEventsClose: "Cerrar",
    adminEventsGeneral: "Información general",
    adminEventsDate: "Fecha",
    adminEventsTime: "Hora",
    adminEventsLocation: "Ubicación",
    adminEventsCategory: "Categoría",
    adminEventsPublished: "Publicado",
    adminEventsFeatured: "Destacado",
    adminEventsAccent: "Color de la tarjeta",
    adminEventsColorDetected: "Color de la tarjeta detectado desde el cartel.",
    adminEventsColorDetectError: "No se pudo detectar el color. Elige manualmente el color de la tarjeta.",
    adminEventsTitleLabel: "Título",
    adminEventsShortLabel: "Descripción corta",
    adminEventsFullLabel: "Descripción completa",
    adminEventsPosterRo: "Cartel rumano",
    adminEventsTitleLabelEs: "Título",
    adminEventsShortLabelEs: "Descripción corta",
    adminEventsFullLabelEs: "Descripción completa",
    adminEventsPosterEs: "Cartel español",
    adminEventsPreview: "Vista previa de la tarjeta",
    adminEventsDelete: "Eliminar evento",
    adminEventsSaveDraft: "Guardar como borrador",
    adminEventsSave: "Guardar evento",
    adminEventsPublishedStatus: "Publicado",
    adminEventsHiddenStatus: "Oculto",
    adminEventsNoPoster: "Sin cartel",
    adminEventsIncompleteRo: "RO incompleto",
    adminEventsIncompleteEs: "ES incompleto",
    adminEventsTotal: "Total",
    adminEventsPublishedCount: "Publicados",
    adminEventsHiddenCount: "Ocultos",
    adminEventsFeaturedCount: "Destacados",
    adminEventsPublish: "Publicar",
    adminEventsHide: "Ocultar",
    adminEventsSaved: "Evento guardado.",
    adminEventsDeleted: "Evento eliminado.",
    adminEventsSaveError: "No se pudo guardar el evento.",
    adminEventsDeleteError: "No se pudo eliminar el evento.",
    adminEventsConfirmDelete: "¿Seguro que quieres eliminar este evento?",
    adminBookFormTitle: "Libro",
    adminTitlePlaceholder: "Título del libro",
    adminCategoryLabel: "Categoría",
    adminCategoryPlaceholder: "Biblias, Familia, Jóvenes...",
    adminLanguageLabel: "Idioma",
    adminRomanian: "Rumano",
    adminSpanish: "Español",
    adminEnglish: "Inglés",
    adminSaveBook: "Guardar libro",
    adminUpdateBook: "Actualizar libro",
    adminBulkTitle: "Importar varios",
    adminBulkHelp: "Una línea por cada libro: título; autor; categoría; idioma; stock; precio",
    adminBulkPlaceholder: "Biblia de estudio; Autor; Biblias; ro; 3; 25.00",
    adminImportBooks: "Importar libros",
    adminSearchPlaceholder: "Buscar por título, autor o categoría",
    adminSaveStockChanges: "Guardar cambios de stock",
    adminSaveStockChangesCount: "Guardar cambios de stock",
    adminTableBook: "Libro",
    adminReservedShort: "Reserv.",
    adminAvailableShort: "Disp.",
    adminActions: "Acciones",
    adminRequestsEyebrow: "Pedidos",
    adminRequestsTitle: "Pendientes y estado",
    adminHistoryEyebrow: "Historial",
    adminHistoryTitle: "Últimos cambios",
    adminPrev: "Atrás",
    adminNext: "Siguiente",
    adminPage: "Página",
    adminPageOf: "de",
    adminReenterCode: "Introduce de nuevo el código de administración.",
    adminChecking: "Comprobando...",
    adminWrongCode: "Código incorrecto o conexión no disponible.",
    adminSaving: "Guardando...",
    adminUpdating: "Actualizando...",
    adminAuthError: "Código de administración incorrecto.",
    adminDbUpdateError: "No se ha podido actualizar en la base de datos.",
    adminDbSaveError: "No se ha podido guardar en la base de datos.",
    adminDbImportError: "No se ha podido importar en la base de datos.",
    adminStockSaveError: "No se ha podido guardar el stock.",
    adminBookAddedSaving: "Libro añadido. Guardando en la base de datos...",
    adminSaved: "Guardado.",
    adminStockSaving: "Guardando stock...",
    adminStockSaved: "Stock guardado.",
    adminAddBulkLine: "Añade al menos una línea con título y autor.",
    adminBulkInvalidLine: "Línea incompleta",
    adminImporting: "Importando...",
    adminBooksAddedSaving: "libros añadidos. Guardando en la base de datos...",
    adminBooksImported: "libros importados.",
    adminBooksImportedLocal: "libros importados localmente.",
    adminTotalStock: "Stock total",
    adminLowStock: "Stock bajo",
    adminPendingRequests: "Pedidos pendientes",
    adminEdit: "Editar",
    adminDelete: "Eliminar",
    adminReady: "En proceso",
    adminComplete: "Completado",
    adminDelivered: "Completado",
    adminCancel: "Cancelar",
    adminNoRequests: "No hay pedidos activos.",
    adminNoHistory: "Todavía no hay cambios registrados.",
    adminStatusPending: "Pendiente",
    adminStatusApproved: "En proceso",
    adminStatusCollected: "Completado",
    adminStatusCancelled: "Cancelado",
    adminEntityBook: "libro",
    adminEntityOrder: "pedido",
    adminEntityReservation: "pedido",
    adminEntityEvent: "evento",
    adminActionMemberRequest: "Pedido enviado por miembro",
    adminActionBookCreated: "Libro creado",
    adminActionBookUpdated: "Libro actualizado",
    adminActionBooksImported: "Libros importados",
    adminActionBookDeleted: "Libro eliminado",
    adminActionInventoryPlus: "Inventario: suma",
    adminActionInventoryMinus: "Inventario: resta",
    adminActionRequestMarked: "Pedido marcado como"
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

const statusLabelKeys = {
  pending: "adminStatusPending",
  approved: "adminStatusApproved",
  collected: "adminStatusCollected",
  cancelled: "adminStatusCancelled"
};

const volleyShirtColors = [
  { id: "white", ro: "Alb", es: "Blanco" },
  { id: "black", ro: "Negru", es: "Negro" },
  { id: "red", ro: "Roșu", es: "Rojo" },
  { id: "blue", ro: "Albastru", es: "Azul" },
  { id: "green", ro: "Verde", es: "Verde" },
  { id: "yellow", ro: "Galben", es: "Amarillo" },
  { id: "pink", ro: "Roz", es: "Rosa" },
  { id: "purple", ro: "Mov", es: "Morado" },
  { id: "orange", ro: "Portocaliu", es: "Naranja" },
  { id: "turquoise", ro: "Turcoaz", es: "Turquesa" },
  { id: "navy", ro: "Bleumarin", es: "Azul marino" },
  { id: "gray", ro: "Gri", es: "Gris" }
];

const adminEntityKeys = {
  book: "adminEntityBook",
  order: "adminEntityOrder",
  reservation: "adminEntityReservation",
  event: "adminEntityEvent"
};

const libraryCategories = ["Teologie", "Familie", "Tineri", "Copii", "Biografii", "Biblii", "Devoționale"];

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
  return translations[lang]?.[key] || translations.ro[key] || key;
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
      apiRequest("/api/admin/volley/registrations")
    ];
    const shouldLoadEvents = Boolean($("#adminEventsList") || $("#adminEventForm"));
    if (shouldLoadEvents) requests.push(apiRequest("/api/admin/events"));
    const [ordersData, auditData, volleyData, eventsData] = await Promise.all(requests);
    reservations = ordersData.orders;
    auditLogs = auditData.auditLogs;
    volleyRegistrations = volleyData.registrations || [];
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

function applyLanguage() {
  document.documentElement.lang = lang;
  $("#langToggle").textContent = lang === "ro" ? "ES" : "RO";
  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[lang][key]) node.textContent = translations[lang][key];
  });
  $$("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (translations[lang][key]) node.placeholder = translations[lang][key];
  });
  $$("[data-i18n-aria-label]").forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    if (translations[lang][key]) node.setAttribute("aria-label", translations[lang][key]);
  });
  $$("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (translations[lang][key]) node.title = translations[lang][key];
  });
  if ($("#bookSearch")) $("#bookSearch").placeholder = translations[lang].bookSearchPlaceholder;
  if ($("#books")) renderBooks();
  if ($("#cartItems")) renderCart();
  if ($("#adminShell") && !$("#adminShell").classList.contains("is-hidden")) renderAdmin();
  if ($("#landingEventsList")) renderLandingEvents();
  if (activeEventId) renderEventModal();
  setupContactEmailLinks();
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
  const t = translations[lang];
  const categories = [...new Set([...libraryCategories, ...books.map((book) => book.category).filter(Boolean)])].sort();
  if ($("#bookCategoryFilter")) {
    $("#bookCategoryFilter").innerHTML = `<option value="all">${translations[lang].filterAllCategories}</option>${categories.map((item) => `<option value="${escapeAttribute(item)}">${escapeHtml(item)}</option>`).join("")}`;
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
          <span class="book-category">${escapeHtml(book.category || "General")}</span>
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
          <p class="eyebrow">${escapeHtml(event.category || tx("eventsColumnTitle"))}</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(shortDescription)}</p>
          <strong>${escapeHtml(formatEventDate(event))}${event.time ? ` · ${escapeHtml(event.time)}` : ""}</strong>
          <div class="event-tags">
            ${event.location ? `<span>${escapeHtml(event.location)}</span>` : ""}
            ${event.category ? `<span>${escapeHtml(event.category)}</span>` : ""}
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
  $("#eventModalCategory").textContent = event.category || tx("eventsColumnTitle");
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
    $("#accessMessage").textContent = translations[lang].accessDenied;
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
  const t = translations[lang];
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
  $("#cartMessage").textContent = translations[lang].cartSent;
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
    const row = button.closest("tr");
    const registration = volleyRegistrations.find((item) => item.id === button.dataset.id);
    if (!row || !registration) return;
    const message = $("#volleyAdminMessage");
    const action = button.dataset.action;

    try {
      if (action === "delete") {
        await apiRequest(`/api/admin/volley/registrations/${registration.id}`, { method: "DELETE" });
        volleyRegistrations = volleyRegistrations.filter((item) => item.id !== registration.id);
        message.textContent = tx("adminVolleyDeleted");
      } else {
        const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : row.querySelector("[data-field='status']").value;
        const payload = {
          teamName: row.querySelector("[data-field='teamName']").value.trim(),
          representativeName: row.querySelector("[data-field='representativeName']").value.trim(),
          churchName: row.querySelector("[data-field='churchName']").value.trim(),
          shirtColor: row.querySelector("[data-field='shirtColor']").value,
          players: row.querySelector("[data-field='players']").value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean),
          notes: row.querySelector("[data-field='notes']").value.trim(),
          status
        };
        const data = await apiRequest(`/api/admin/volley/registrations/${registration.id}`, { method: "PATCH", body: payload });
        Object.assign(registration, data.registration);
        message.textContent = action === "save" ? tx("adminVolleySavedMessage") : tx("adminVolleyStatusUpdated");
      }
      renderAdminVolleyRegistrations();
      renderAuditLog();
    } catch (error) {
      message.textContent = error.status === 401 ? tx("adminAuthError") : tx("adminVolleySaveError");
    }
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
  $("#adminCategoryFilter").innerHTML = `<option value="all">${tx("filterAllCategories")}</option>${categories.map((item) => `<option value="${escapeAttribute(item)}">${escapeHtml(item)}</option>`).join("")}`;
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
        <td>${escapeHtml(book.category || "General")}</td>
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

function volleyColorOptions(selectedColor) {
  return `<option value="">-</option>${volleyShirtColors.map((color) =>
    `<option value="${escapeAttribute(color.id)}" ${color.id === selectedColor ? "selected" : ""}>${escapeHtml(color[lang] || color.ro)}</option>`
  ).join("")}`;
}

function renderAdminVolleyRegistrations() {
  if (!$("#volleyRegistrationsList")) return;
  $("#volleyRegistrationsList").innerHTML = volleyRegistrations.map((registration) => `
    <tr>
      <td><input data-field="teamName" value="${escapeAttribute(registration.teamName)}" /></td>
      <td><input data-field="representativeName" value="${escapeAttribute(registration.representativeName)}" /></td>
      <td><input data-field="churchName" value="${escapeAttribute(registration.churchName || "")}" /></td>
      <td>
        <select data-field="shirtColor" title="${escapeAttribute(getVolleyColorLabel(registration.shirtColor))}">
          ${volleyColorOptions(registration.shirtColor)}
        </select>
      </td>
      <td><textarea data-field="players">${escapeHtml((registration.players || []).join("\n"))}</textarea></td>
      <td>
        <span class="volley-status ${escapeAttribute(registration.status)}">${escapeHtml(getVolleyStatusLabel(registration.status))}</span>
        <select data-field="status">
          <option value="pending" ${registration.status === "pending" ? "selected" : ""}>${tx("adminVolleyPending")}</option>
          <option value="approved" ${registration.status === "approved" ? "selected" : ""}>${tx("adminVolleyApproved")}</option>
          <option value="rejected" ${registration.status === "rejected" ? "selected" : ""}>${tx("adminVolleyRejected")}</option>
        </select>
      </td>
      <td><textarea data-field="notes">${escapeHtml(registration.notes || "")}</textarea></td>
      <td class="table-actions">
        <button type="button" data-action="save" data-id="${registration.id}">${tx("adminVolleySave")}</button>
        <button type="button" data-action="approve" data-id="${registration.id}">${tx("adminVolleyApprove")}</button>
        <button type="button" data-action="reject" data-id="${registration.id}">${tx("adminVolleyReject")}</button>
        <button type="button" data-action="delete" data-id="${registration.id}">${tx("adminDelete")}</button>
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
        <p class="eyebrow">${escapeHtml(event.category || tx("eventsColumnTitle"))}</p>
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
    const title = event.titleRo || event.titleEs || tx("adminEventsNewTitle");
    const poster = event.posterRo || event.posterEs || "";
    const roComplete = eventLanguageComplete(event, "Ro");
    const esComplete = eventLanguageComplete(event, "Es");
    return `
      <article class="admin-event-row">
        <div class="admin-event-thumb">${poster ? `<img src="${escapeAttribute(poster)}" alt="" loading="lazy" />` : `<span>${tx("adminEventsNoPoster")}</span>`}</div>
        <div class="admin-event-row-copy">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(event.shortDescriptionRo || event.shortDescriptionEs || "")}</p>
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
  const t = translations[lang];
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
      $("#contactFormMessage").textContent = translations[lang].contactFormSent;
      return;
    }
    const subject = encodeURIComponent(`${lang === "ro" ? "Mesaj de pe site" : "Mensaje desde la web"} - ${name}`);
    const body = encodeURIComponent(`${translations[lang].contactFormName}: ${name}\n${translations[lang].contactFormContact}: ${contact}\n\n${translations[lang].contactFormMessage}:\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    $("#contactFormMessage").textContent = translations[lang].contactFormSent;
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

$("#langToggle")?.addEventListener("click", () => {
  lang = lang === "ro" ? "es" : "ro";
  localStorage.setItem("betel-lang", lang);
  applyLanguage();
  loadVerse();
});

$("#year").textContent = new Date().getFullYear();

startHeroRotation();
setupNavigationMenu();
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
