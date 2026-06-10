# Betel Reus

Official website of **Biserica Betel Reus**, a Pentecostal Christian church in Reus. The project includes a public landing page, YouTube video integration, a daily verse, a contact section, and an internal library with an admin panel.

## Project status

The project is deployed and functional, with a live public experience and working internal admin surfaces. It is still evolving, and further improvements and decisions are pending in areas such as authentication, database setup, privacy, final content, and real imagery.

## Main features

### Public website

- Main landing page in Romanian and Spanish.
- Header with primary navigation.
- Hero section with the church’s main message.
- Local daily verse fallback.
- Latest sermons and YouTube video section.
- Weekly worship and meeting schedule.
- First-visit information.
- Social media links.
- Contact section with address, phone, email, WhatsApp, and map.

### Library

- Separate page for the church library.
- Access via member name and library code.
- Book catalog.
- Search by title or author.
- Filters by category and availability.
- Cart flow to prepare a book request.
- Order submission through the API.

### Admin panel

- Private admin page at `/admin.html`.
- Access protected by a private admin code.
- Book management.
- Book creation and editing.
- Bulk book import.
- Stock management.
- Order review.
- Order status updates.
- Action history and audit log.

### API and server

The project uses a custom Node.js server with API routes for:

- Fetching YouTube videos through RSS.
- Fetching the daily verse.
- Reading books.
- Creating orders.
- Managing books from the admin panel.
- Managing orders from the admin panel.
- Reading the audit history.

## Technologies used

- HTML
- CSS
- JavaScript
- Node.js
- Optional PostgreSQL via `pg`
- YouTube RSS Feed

## General structure

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
└── PRODUCTION.md
```

The root keeps `npm run dev` and `npm start` for local development and direct Node execution. Internally, `server.mjs` delegates to `backend/src/server.mjs`, and the backend serves the static frontend from `frontend/public`.

For local development, the project can run without PostgreSQL by using its built-in in-memory fallback. Production should always use explicit environment configuration, including a real `DATABASE_URL` and `ADMIN_CODE`.

- `backend/src/routes/`: defines the existing API routes.
- `backend/src/controllers/`: translates each HTTP request into service calls.
- `backend/src/services/`: contains the logic for books, orders, audit logging, YouTube, and the daily verse.
- `backend/src/middleware/`: contains admin protection, security headers, CORS, and rate limiting.
- `backend/src/config/`: centralizes PostgreSQL and in-memory storage.
- `backend/src/utils/`: shared HTTP responses, static serving, and helpers.
- `frontend/public/`: contains HTML views, styles, browser JS, and assets.

## Event images in production

Event posters uploaded from the events admin panel are not stored directly in the database. The database stores only the public image path.

In production, configure a persistent folder outside the Git deployment:

```env
UPLOADS_DIR=/home/u505086669/domains/betelreus.com/event-uploads
UPLOADS_PUBLIC_PATH=/uploads/events
```

If `UPLOADS_DIR` does not exist, the project uses the local fallback `frontend/public/uploads/events`.

## Safe change workflow

`main` is treated as the live production branch. Normal changes should be made in a short-lived branch and reviewed through a pull request before merging.

The workflow guide lives in [WEBSITE_WORKFLOW.md](WEBSITE_WORKFLOW.md).
