// Vérifie la cohérence de data.js après une modification :  node test.js
const assert = require("node:assert");
const fs = require("node:fs");
const TRIP = require("./data.js");

const JOURS_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

// 16 jours consécutifs, du lundi 30 novembre au mardi 15 décembre 2026
assert.equal(TRIP.jours.length, 16);
assert.equal(TRIP.jours[0].date, "2026-11-30");
assert.equal(JOURS_FR[new Date("2026-11-30T12:00:00Z").getUTCDay()], "lundi");
TRIP.jours.forEach((j, i) => {
  assert.equal(j.n, i + 1, `numéro du jour ${j.date}`);
  if (i) assert.equal(Date.parse(j.date) - Date.parse(TRIP.jours[i - 1].date), 864e5, `jours non consécutifs : ${j.date}`);
  if (j.hotel) assert.ok(TRIP.hotels[j.hotel], `hôtel inconnu « ${j.hotel} » (${j.date})`);
  assert.ok(j.titre && j.resume && j.ville && j.etapes.length, `jour incomplet : ${j.date}`);
  for (const e of j.etapes) {
    const ou = `${j.date} « ${e.titre} »`;
    assert.ok(["trajet", "lieu", "info"].includes(e.type), `type invalide : ${ou}`);
    assert.ok(e.titre, `titre manquant : ${j.date}`);
    assert.ok(e.heure || e.moment, `ni heure ni moment : ${ou}`);
    for (const h of [e.heure, e.arrivee]) if (h) assert.match(h, HEURE, `heure invalide : ${ou}`);
    if (e.maps) assert.ok(e.maps.startsWith("https://www.google.com/maps/"), `lien Maps invalide : ${ou}`);
    if (e.prix) assert.ok(e.prix.yen > 0 || e.prix.texte, `prix invalide : ${ou}`);
  }
});

// Les 39 liens Google Maps du carnet sont tous présents
assert.equal(TRIP.jours.flatMap((j) => j.etapes).filter((e) => e.maps).length, 39);

// Identifiants de checklist uniques (sinon deux cases se cochent ensemble)
const ids = TRIP.checklist.flatMap((s) => s.liste.map((p) => p.id));
assert.equal(new Set(ids).size, ids.length, "identifiant de checklist en double");

// Phrases et adresses complètes
for (const c of TRIP.phrases) for (const p of c.liste) assert.ok(p.fr && p.ja && p.romaji, `phrase incomplète : ${p.fr}`);
for (const g of TRIP.adresses) for (const l of g.lieux) assert.ok(l.fr && l.ja && l.romaji, `adresse incomplète : ${l.fr}`);
assert.ok(TRIP.taux > 0);

// Chaque photo citée existe : une seule photo manquante empêcherait l'installation hors ligne
const photos = [...TRIP.jours, ...TRIP.jours.flatMap((j) => j.etapes), ...Object.values(TRIP.hotels)].map((x) => x.photo).filter(Boolean);
for (const p of photos) assert.ok(fs.existsSync(p), `photo absente : ${p}`);
for (const f of fs.readdirSync("photos")) assert.ok(photos.includes("photos/" + f), `photo inutilisée (champ « photo » écrasé ?) : ${f}`);

console.log(`data.js OK — ${TRIP.jours.length} jours, ${TRIP.jours.flatMap((j) => j.etapes).length} étapes, ${ids.length} points de checklist`);
