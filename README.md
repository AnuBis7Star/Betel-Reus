# Betel Reus

Web oficial de **Biserica Betel Reus**, una iglesia cristiana pentecostal en Reus. El proyecto incluye una landing page pública, integración con vídeos de YouTube, un versículo diario, una sección de contacto y una biblioteca interna con panel de administración.

## Estado del proyecto

El proyecto está en desarrollo. La web ya tiene una primera estructura funcional, pero todavía hay decisiones pendientes antes de publicarla definitivamente, especialmente en las áreas de autenticación, base de datos, privacidad, contenido final e imágenes reales.

## Funcionalidades principales

### Web pública

- Landing page principal en rumano y español.
- Header con navegación principal.
- Hero con frase principal de la iglesia.
- Versículo diario local como fallback.
- Sección de últimas predicaciones y vídeos desde YouTube.
- Programa semanal de cultos y reuniones.
- Información para primera visita.
- Enlaces a redes sociales.
- Sección de contacto con dirección, teléfono, email, WhatsApp y mapa.

### Biblioteca

- Página separada para la biblioteca de la iglesia.
- Acceso mediante nombre y código de biblioteca.
- Catálogo de libros.
- Búsqueda por título o autor.
- Filtros por categoría y disponibilidad.
- Carrito para preparar una solicitud de libros.
- Envío de pedidos a la API.

### Panel de administración

- Página privada de administración en `/admin.html`.
- Acceso mediante código privado de administración.
- Gestión de libros.
- Creación y edición de libros.
- Importación de varios libros.
- Gestión de stock.
- Consulta de pedidos.
- Cambio de estado de pedidos.
- Historial/auditoría de acciones.

### API y servidor

El proyecto usa un servidor Node.js propio con rutas API para:

- Obtener vídeos de YouTube mediante RSS.
- Obtener el versículo diario.
- Leer libros.
- Crear pedidos.
- Gestionar libros desde el panel admin.
- Gestionar pedidos desde el panel admin.
- Consultar historial de auditoría.

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- PostgreSQL opcional mediante `pg`
- YouTube RSS Feed

## Estructura general

```text
Betel-Reus/
├── backend/
│   ├── src/
│   │   ├── app.mjs
│   │   ├── server.mjs
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── library.html
│   │   ├── admin.html
│   │   ├── js/
│   │   ├── css/
│   │   └── assets/
│   └── package.json
├── server.mjs
├── package.json
├── DATABASE_SETUP.md
├── PRODUCTION.md
├── TODO.txt
└── TODO_HECHOS.txt
```

La raíz mantiene `npm run dev` y `npm start` para desarrollo y Render. Internamente, `server.mjs` delega en `backend/src/server.mjs`, y el backend sirve los archivos estáticos desde `frontend/public`.

- `backend/src/routes/`: define las rutas API existentes.
- `backend/src/controllers/`: traduce cada petición HTTP a llamadas de servicio.
- `backend/src/services/`: contiene la lógica de libros, pedidos, auditoría, YouTube y versículo diario.
- `backend/src/middleware/`: contiene protección admin, headers de seguridad, CORS y rate limiting.
- `backend/src/config/`: centraliza PostgreSQL y el almacenamiento en memoria.
- `backend/src/utils/`: respuestas HTTP, estáticos y helpers compartidos.
- `frontend/public/`: contiene las vistas HTML, estilos, JS del navegador y assets.

## Imágenes De Eventos En Producción

Los carteles subidos desde el panel de eventos no se guardan en la base de datos. La base de datos guarda solo la ruta pública de la imagen.

En producción, configura una carpeta persistente fuera del despliegue de Git:

```env
UPLOADS_DIR=/home/u505086669/domains/betelreus.com/event-uploads
UPLOADS_PUBLIC_PATH=/uploads/events
```

Si `UPLOADS_DIR` no existe, el proyecto usa el fallback local `frontend/public/uploads/events`.

## Flujo Seguro De Cambios

`main` se considera producción/live. Los cambios normales deben hacerse en una rama corta y revisarse mediante pull request antes de mezclar.

La guía está en [WEBSITE_WORKFLOW.md](WEBSITE_WORKFLOW.md).
