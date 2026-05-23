const dailyVerses = [
  { reference: "Psalmul 23:1", ro: "Domnul este Păstorul meu: nu voi duce lipsă de nimic.", es: "El Señor es mi pastor; nada me faltará." },
  { reference: "Ioan 3:16", ro: "Fiindcă atât de mult a iubit Dumnezeu lumea, că a dat pe singurul Lui Fiu.", es: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito." },
  { reference: "Isaia 41:10", ro: "Nu te teme, căci Eu sunt cu tine; nu te uita cu îngrijorare, căci Eu sunt Dumnezeul tău.", es: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios." },
  { reference: "Filipeni 4:13", ro: "Pot totul în Hristos, care mă întărește.", es: "Todo lo puedo en Cristo que me fortalece." },
  { reference: "Romani 8:28", ro: "Toate lucrurile lucrează împreună spre binele celor ce iubesc pe Dumnezeu.", es: "Todas las cosas ayudan a bien a los que aman a Dios." },
  { reference: "Matei 11:28", ro: "Veniți la Mine, toți cei trudiți și împovărați, și Eu vă voi da odihnă.", es: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
  { reference: "Psalmul 46:1", ro: "Dumnezeu este adăpostul și sprijinul nostru, un ajutor care nu lipsește niciodată în nevoi.", es: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones." }
];

function getDailyVerse() {
  const start = Date.UTC(new Date().getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.now() - start) / 86400000);
  return { source: "local-fallback", verse: dailyVerses[day % dailyVerses.length] };
}

export { dailyVerses, getDailyVerse };
