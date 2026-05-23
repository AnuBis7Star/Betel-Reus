const romanianTitleCorrections = {
  "Viata condusa de scopuri": "Viața condusă de scopuri",
  "Crestinul autentic": "Creștinul autentic",
  Rugaciunea: "Rugăciunea"
};

function escapeHtml(value = "") {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function tagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.replaceAll("<![CDATA[", "").replaceAll("]]>", "").trim() ?? "";
}

function bookFromRow(row) {
  return {
    id: row.id,
    title: romanianTitleCorrections[row.title] || row.title,
    author: row.author,
    category: row.category,
    language: row.language,
    stock: Number(row.stock || 0),
    reserved: Number(row.reserved || 0),
    price: Number(row.price || 0)
  };
}

function orderFromRow(row) {
  const items = Array.isArray(row.items)
    ? row.items.map((item) => ({ ...item, title: romanianTitleCorrections[item.title] || item.title }))
    : [];
  return {
    id: row.id,
    member: row.member_name,
    contact: row.contact,
    status: row.status,
    total: Number(row.total || 0),
    fulfilled: Boolean(row.fulfilled),
    createdAt: row.created_at,
    items
  };
}

function normalizeBookPayload(payload) {
  const title = String(payload.title || "").trim();
  const author = String(payload.author || "").trim();
  const category = String(payload.category || "General").trim() || "General";
  const language = String(payload.language || "ro").trim().slice(0, 12) || "ro";

  return {
    title: title.slice(0, 180),
    author: author.slice(0, 180),
    category: category.slice(0, 80),
    language,
    stock: Math.max(0, Number(payload.stock || 0)),
    reserved: Math.max(0, Number(payload.reserved || 0)),
    price: Math.max(0, Number(payload.price || 0))
  };
}

function normalizeText(value, maxLength = 180) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

export {
  bookFromRow,
  escapeHtml,
  isValidUuid,
  normalizeBookPayload,
  normalizeText,
  orderFromRow,
  romanianTitleCorrections,
  tagValue
};
