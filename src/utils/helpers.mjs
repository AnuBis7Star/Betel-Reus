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
  return {
    title: String(payload.title || "").trim(),
    author: String(payload.author || "").trim(),
    category: String(payload.category || "General").trim() || "General",
    language: String(payload.language || "ro"),
    stock: Math.max(0, Number(payload.stock || 0)),
    reserved: Math.max(0, Number(payload.reserved || 0)),
    price: Math.max(0, Number(payload.price || 0))
  };
}

export {
  bookFromRow,
  escapeHtml,
  normalizeBookPayload,
  orderFromRow,
  romanianTitleCorrections,
  tagValue
};
