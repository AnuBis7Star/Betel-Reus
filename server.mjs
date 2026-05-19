import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const channelId = "UC6dl7mk7XE_VMqBNZqWOjig";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const dailyVerses = [
  {
    reference: "Psalmul 23:1",
    ro: "Domnul este Păstorul meu: nu voi duce lipsă de nimic.",
    es: "El Señor es mi pastor; nada me faltará."
  },
  {
    reference: "Ioan 3:16",
    ro: "Fiindcă atât de mult a iubit Dumnezeu lumea, că a dat pe singurul Lui Fiu.",
    es: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito."
  },
  {
    reference: "Isaia 41:10",
    ro: "Nu te teme, căci Eu sunt cu tine; nu te uita cu îngrijorare, căci Eu sunt Dumnezeul tău.",
    es: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios."
  },
  {
    reference: "Filipeni 4:13",
    ro: "Pot totul în Hristos, care mă întărește.",
    es: "Todo lo puedo en Cristo que me fortalece."
  },
  {
    reference: "Romani 8:28",
    ro: "Toate lucrurile lucrează împreună spre binele celor ce iubesc pe Dumnezeu.",
    es: "Todas las cosas ayudan a bien a los que aman a Dios."
  },
  {
    reference: "Matei 11:28",
    ro: "Veniți la Mine, toți cei trudiți și împovărați, și Eu vă voi da odihnă.",
    es: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar."
  },
  {
    reference: "Psalmul 46:1",
    ro: "Dumnezeu este adăpostul și sprijinul nostru, un ajutor care nu lipsește niciodată în nevoi.",
    es: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones."
  }
];

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.replaceAll("<![CDATA[", "").replaceAll("]]>", "").trim() ?? "";
}

function parseVideos(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.slice(0, 30).map((entry) => {
    const id = tagValue(entry, "yt:videoId");
    const title = tagValue(entry, "title");
    const published = tagValue(entry, "published");
    const description = tagValue(entry, "media:description");
    const thumbnail = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return {
      id,
      title,
      published,
      description,
      thumbnail,
      url: `https://www.youtube.com/watch?v=${id}`
    };
  });
}

async function youtubeResponse() {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!response.ok) throw new Error(`YouTube RSS failed: ${response.status}`);
  const xml = await response.text();
  return JSON.stringify({ source: "youtube-rss", videos: parseVideos(xml) });
}

function verseResponse() {
  const start = Date.UTC(new Date().getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.now() - start) / 86400000);
  const verse = dailyVerses[day % dailyVerses.length];
  return JSON.stringify({ source: "local-fallback", verse });
}

async function serveStatic(pathname, res) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[extname(filePath)] ?? "application/octet-stream" });
    res.end(file);
  } catch {
    const index = await readFile(join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": mime[".html"] });
    res.end(index);
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");

  try {
    if (url.pathname === "/api/youtube") {
      res.writeHead(200, { "Content-Type": mime[".json"], "Cache-Control": "public, max-age=900" });
      res.end(await youtubeResponse());
      return;
    }

    if (url.pathname === "/api/verse") {
      res.writeHead(200, { "Content-Type": mime[".json"], "Cache-Control": "public, max-age=3600" });
      res.end(verseResponse());
      return;
    }

    await serveStatic(escapeHtml(url.pathname), res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": mime[".json"] });
    res.end(JSON.stringify({ error: error.message }));
  }
}).listen(process.env.PORT || 3000, () => {
  console.log(`Biserica Betel Reus running on http://localhost:${process.env.PORT || 3000}`);
});
