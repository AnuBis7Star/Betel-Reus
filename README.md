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
├── db/
│   └── schema.sql
├── public/
│   ├── index.html
│   ├── library.html
│   ├── admin.html
│   ├── app.js
│   ├── styles.css
│   └── assets/
├── server.mjs
├── package.json
├── DATABASE_SETUP.md
├── TODO.txt
└── TODO_HECHOS.txt
