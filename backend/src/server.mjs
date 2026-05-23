import { createServer } from "node:http";

import { app } from "./app.mjs";
import { hasDatabase } from "./config/db.mjs";

const port = process.env.PORT || 3000;

createServer(app).listen(port, () => {
  console.log(`Biserica Betel Reus running on http://localhost:${port}`);
  console.log(hasDatabase() ? "PostgreSQL connected via DATABASE_URL" : "DATABASE_URL missing; using in-memory demo data");
});
