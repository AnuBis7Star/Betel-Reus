import fs from "node:fs";

const localeFiles = {
  ro: "frontend/public/i18n/ro.json",
  es: "frontend/public/i18n/es.json"
};

function readLocale(language) {
  return JSON.parse(fs.readFileSync(localeFiles[language], "utf8"));
}

const roKeys = new Set(Object.keys(readLocale("ro")));
const esKeys = new Set(Object.keys(readLocale("es")));

const missingInRo = [...esKeys].filter((key) => !roKeys.has(key)).sort();
const missingInEs = [...roKeys].filter((key) => !esKeys.has(key)).sort();

if (missingInRo.length || missingInEs.length) {
  if (missingInRo.length) console.error(`Missing Romanian i18n keys: ${missingInRo.join(", ")}`);
  if (missingInEs.length) console.error(`Missing Spanish i18n keys: ${missingInEs.join(", ")}`);
  process.exit(1);
}

console.log(`i18n keys match (${roKeys.size} keys)`);
