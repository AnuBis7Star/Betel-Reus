import { createServer } from "node:http";

import { app } from "./app.mjs";
import { hasDatabase } from "./config/db.mjs";

const port = process.env.PORT || 3000;
const host = process.env.HOST || undefined;

createServer(app).listen(port, host, () => {
  console.log(`Biserica Betel Reus running on http://${host || "localhost"}:${port}`);
  console.log(hasDatabase() ? "PostgreSQL connected via DATABASE_URL" : "DATABASE_URL missing; using in-memory demo data");
});
