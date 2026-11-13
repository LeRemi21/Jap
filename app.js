"use strict";
/* ==========================================================================
   Japon 2026 — logique de l'appli (aucune dépendance).
   Toutes les données viennent de data.js (objet TRIP).
   Astuce de test : ajouter ?now=2026-12-06T09:00 à l'adresse pour simuler
   une date et une heure (heure du Japon).
   ========================================================================== */

const JST = "Asia/Tokyo";
const CATEGORIES = ["Repas", "Transport", "Visites", "Achats", "Hébergement", "Autre"];
const $ = (s, el = document) => el.querySelector(s);
// Tout texte inséré dans la page passe par esc() (notes de dépenses, fichier importé…)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Sauvegarde locale : localStorage peut être indisponible ou plein ---------- */
const stock = {
  lire(cle, defaut) {
    try { const v = localStorage.getItem("japon." + cle); return v === null ? defaut : JSON.parse(v); } catch { return defaut; }
  },
  ecrire(cle, valeur) {
    try { localStorage.setItem("japon." + cle, JSON.stringify(valeur)); return true; } catch { return false; }
  },
};

/* ---------- Validation de ce qui vient du stockage ou d'un fichier importé ---------- */
const nombrePositif = (n) => (Number.isFinite(n) && n > 0 ? n : null);
const nouvelId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const depensesValides = (liste) =>
  (Array.isArray(liste) ? liste : [])
    .filter((d) => d && nombrePositif(d.yen) && typeof d.date === "string" && typeof d.cat === "string")
    .map((d) => ({ id: String(d.id ?? nouvelId()), yen: Math.round(d.yen), cat: d.cat.slice(0, 30), date: d.date.slice(0, 10), note: String(d.note ?? "").slice(0, 80) }));
const cochesValides = (c) => (c && typeof c === "object" && !Array.isArray(c) ? c : {});

/* ---------- État de l'appli ---------- */
const etat = {
  vue: "aujourdhui",
  jour: null, // jour affiché dans « Aujourd'hui » ; null = le jour courant
  taux: nombrePositif(stock.lire("taux")) ?? TRIP.taux,
  depenses: depensesValides(stock.lire("depenses")),
  budget: nombrePositif(stock.lire("budget")), // en euros, facultatif
  coches: cochesValides(stock.lire("coches")),
  conv: { sens: "yen", saisie: "" },
  dep: { cat: CATEGORIES[0], date: null },
  cle: "", // sert à ne redessiner « Aujourd'hui » que lorsque la prochaine étape change
};

let alerteStockMontree = false;
function sauver(cle) {
  if (stock.ecrire(cle, etat[cle]) || alerteStockMontree) return;
  alerteStockMontree = true;
  alert("Sauvegarde impossible sur cet appareil (stockage plein ou navigation privée). Exportez vos dépenses pour ne rien perdre.");
}

/* ---------- Date et heure ---------- */
const FAUX = new URLSearchParams(location.search).get("now");
function maintenant() {
  const d = FAUX ? new Date(FAUX + ":00+09:00") : new Date();
  return isNaN(d) ? new Date() : d;
}
// Date (AAAA-MM-JJ) et minutes écoulées depuis minuit dans un fuseau donné
function horloge(fuseau) {
  const p = {};
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: fuseau, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (const x of f.formatToParts(maintenant())) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, min: +p.hour * 60 + +p.minute };
}
// Jour du voyage en cours : heure du Japon, sauf les jours passés en Europe (champ « fuseau » de data.js)
const indexAujourdhui = () => TRIP.jours.findIndex((j) => j.date === horloge(j.fuseau || JST).date);
const utc = (date) => Date.parse(date + "T00:00:00Z");
const minutes = (hhmm) => +hhmm.slice(0, 2) * 60 + +hhmm.slice(3);

/* ---------- Mise en forme ---------- */
const fmtDate = (date, opt = { weekday: "long", day: "numeric", month: "long" }) =>
  new Date(date + "T12:00:00Z").toLocaleDateString("fr-FR", { ...opt, timeZone: "UTC" });
const fmtHeure = (hhmm) => hhmm.replace(/^0/, "").replace(":", "h");
const yen = (n) => Math.round(n).toLocaleString("fr-FR") + " ¥";
const eur = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const enEur = (y) => y / etat.taux;
const duree = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`);
const lienExterne = (url, texte, classe = "lien-maps") => `<a class="${classe}" href="${esc(url)}" target="_blank" rel="noopener">${esc(texte)} ↗</a>`;
const mapsRecherche = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
const mapsVers = (q) => "https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=" + encodeURIComponent(q);

/* ==========================================================================
   Frise d'une journée (utilisée par « Aujourd'hui » et « Itinéraire »)
   ========================================================================== */
const DEBUT = { "Matin": 360, "Journée": 360, "Après-midi": 720, "Soir": 1080 };
// Heure de début de chaque étape : celle du carnet, sinon le début du moment
// (matin 6h, après-midi 12h, soir 18h), et jamais avant l'étape précédente.
function debuts(jour) {
  let prec = 0;
  return jour.etapes.map((e) => (prec = Math.max(prec, e.heure ? minutes(e.heure) : DEBUT[e.moment] ?? prec)));
}
const indexProchain = (jour, min) => debuts(jour).findIndex((d) => d > min); // -1 : tout est entamé

function htmlPrix(p) {
  if (!p) return "";
  if (p.yen == null) return esc(p.texte);
  let s = `${p.texte ? esc(p.texte) + " " : ""}${yen(p.yen)} ≈ ${eur(enEur(p.yen))}`;
  if (p.pour) s += " " + esc(p.pour);
  if (p.reserve) s += ` · réservé${p.eurCarnet ? ` (${eur(p.eurCarnet)} dans le carnet)` : ""}`;
  return s;
}

const GENRE = { trajet: "Trajet", lieu: "Lieu", info: "Info" };
function htmlEtape(e, estProchain) {
  const quand = e.heure
    ? `${fmtHeure(e.heure)}${e.arrivee ? `<small>→ ${fmtHeure(e.arrivee)}</small>` : ""}`
    : `<span class="moment">${esc(e.moment || "")}</span>`;
  const meta = [e.total && esc(e.total), htmlPrix(e.prix)].filter(Boolean).join(" · ");
  const second = [e.horaires && `Horaires : ${esc(e.horaires)}`, e.duree && `Sur place : ${esc(e.duree)}`].filter(Boolean).join("<br>");
  let detail = "";
  if (e.pas) {
    detail = `<details class="plus-info"><summary>Détail du trajet</summary><ol>${e.pas.map((p) => `<li>${esc(p)}</li>`).join("")}</ol></details>`;
  } else if (e.description || e.aFaire || e.conseil) {
    detail = `<details class="plus-info"><summary>En savoir plus</summary>
      ${e.description ? `<p>${esc(e.description)}</p>` : ""}
      ${e.aFaire ? `<p><b>À faire sur place :</b> ${esc(e.aFaire)}</p>` : ""}
      ${e.conseil ? `<p><b>Conseil :</b> ${esc(e.conseil)}</p>` : ""}</details>`;
  }
  const lien = e.maps ? lienExterne(e.maps, "Itinéraire Google Maps") : e.q ? lienExterne(mapsRecherche(e.q), "Voir sur Google Maps") : "";
  return `<li class="etape ${esc(e.type)}${estProchain ? " prochain" : ""}">
    <div class="quand">${quand}</div>
    <div class="fiche">
      ${e.photo ? `<img class="photo" src="${esc(e.photo)}" alt="" width="640" height="427" loading="lazy">` : ""}
      <div class="genre">${GENRE[e.type] || ""}${estProchain ? " · à venir" : ""}</div>
      <h3>${esc(e.titre)} ${e.indicatif ? '<span class="puce">horaire indicatif</span>' : ""}</h3>
      ${meta ? `<p class="meta">${meta}</p>` : ""}
      ${second ? `<p class="meta second">${second}</p>` : ""}
      ${e.notes ? `<ul class="notes">${e.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
      ${(e.aVerifier || []).map((t) => `<span class="badge"><b>À vérifier :</b> ${esc(t)}</span>`).join("")}
      ${(e.manque || []).map((t) => `<span class="badge gris"><b>Non renseigné :</b> ${esc(t)}</span>`).join("")}
      ${detail}${lien}
    </div></li>`;
}

function htmlJour(jour, iProchain = -1) {
  const h = TRIP.hotels[jour.hotel];
  return `<ol class="frise">${jour.etapes.map((e, i) => htmlEtape(e, i === iProchain)).join("")}</ol>
    ${h ? lienExterne(mapsVers(h.q), `Retour à l'hôtel · ${h.nom}`, "btn clair") : ""}`;
}

/* ==========================================================================
   Écrans
   ========================================================================== */

/* ---------- 1. Aujourd'hui ---------- */
function vueAujourdhui() {
  const iAuj = indexAujourdhui();
  const i = etat.jour ?? (iAuj >= 0 ? iAuj : 0);
  const jour = TRIP.jours[i];
  let h = "";

  if (iAuj < 0 && etat.jour === null) {
    const reste = Math.round((utc(TRIP.jours[0].date) - utc(horloge("Europe/Paris").date)) / 864e5);
    h += reste > 0
      ? `<div class="bloc rebours"><p class="discret">Départ dans</p><p class="gros">${reste}</p>
           <p>${reste > 1 ? "jours" : "jour"} — ${fmtDate(TRIP.jours[0].date)}</p><p class="ja" lang="ja">いってきます</p></div>
         <h2 class="titre-section">Aperçu du jour 1</h2>`
      : `<div class="bloc rebours"><p class="gros" lang="ja">おかえり</p><p>Le voyage est terminé. L'itinéraire reste consultable.</p></div>`;
  }

  h += `<div class="nav-jour">
      <button type="button" data-a="jour" data-v="-1" aria-label="Jour précédent" ${i === 0 ? "disabled" : ""}>‹</button>
      <div class="centre"><div class="num">Jour ${jour.n} / ${TRIP.jours.length} · ${esc(jour.ville)}</div><div class="date">${fmtDate(jour.date)}</div></div>
      <button type="button" data-a="jour" data-v="1" aria-label="Jour suivant" ${i === TRIP.jours.length - 1 ? "disabled" : ""}>›</button>
    </div>
    <div class="jour-titre${jour.photo ? " avec-photo" : ""}">
      ${jour.photo ? `<img src="${esc(jour.photo)}" alt="" width="800" height="400">` : ""}<h2>${esc(jour.titre)}</h2></div>`;

  let ip = -1;
  if (i === iAuj) {
    const min = horloge(jour.fuseau || JST).min;
    ip = indexProchain(jour, min);
    const e = jour.etapes[ip];
    h += e
      ? `<div class="bloc prochain-carte"><div class="label">Prochaine étape${e.heure ? ` · dans ${duree(minutes(e.heure) - min)}` : ""}</div>
           <div class="quoi">${e.heure ? fmtHeure(e.heure) + " — " : ""}${esc(e.titre)}</div></div>`
      : `<div class="bloc prochain-carte"><div class="label">Fin de journée</div><div class="quoi">Toutes les étapes du jour sont entamées.</div></div>`;
  }
  h += htmlJour(jour, ip);
  if (etat.jour !== null) h += `<button class="btn" type="button" data-a="auj" style="margin-top:10px">Revenir à aujourd'hui</button>`;
  return h;
}
// Change quand la date ou la prochaine étape change (voir l'horloge en bas du fichier)
function cleAujourdhui() {
  const i = indexAujourdhui();
  if (i < 0) return horloge("Europe/Paris").date;
  const jour = TRIP.jours[i], t = horloge(jour.fuseau || JST);
  const ip = indexProchain(jour, t.min), e = jour.etapes[ip];
  return `${i}:${ip}:${e && e.heure ? minutes(e.heure) - t.min : ""}`;
}

/* ---------- 2. Itinéraire ---------- */
function vueItineraire() {
  const iAuj = indexAujourdhui();
  const jours = TRIP.jours.map((j, i) => `<details class="jour" ${i === iAuj ? "open" : ""}>
      <summary><span class="j-num"><small>Jour</small>${j.n}</span>
        <span class="j-txt"><b>${esc(j.titre)}</b><span>${fmtDate(j.date, { weekday: "short", day: "numeric", month: "short" })} · ${esc(j.resume)}</span></span></summary>
      <div class="corps">${htmlJour(j)}</div></details>`).join("");
  const hotels = Object.values(TRIP.hotels).map((h) => `<div class="bloc hotel-ligne">
      ${h.photo ? `<img class="photo" src="${esc(h.photo)}" alt="" width="800" height="400" loading="lazy">` : ""}
      <b>${esc(h.nom)}</b><div>${esc(h.ville)} · ${esc(h.nuits)}</div>
      ${h.adresse ? `<div class="discret">${esc(h.adresse)}</div>` : ""}
      ${h.prix ? `<div class="discret">Prix noté dans le carnet : ${esc(h.prix)}</div>` : ""}
      ${(h.manque || []).map((t) => `<span class="badge gris"><b>Non renseigné :</b> ${esc(t)}</span>`).join("")}
      ${lienExterne(mapsRecherche(h.q), "Voir sur Google Maps")}</div>`).join("");
  return `${jours}<h2 class="titre-section">Hébergements</h2>${hotels}`;
}

/* ---------- 3. Taxi / Adresses ---------- */
function vueTaxi() {
  return `<p class="discret">Touchez le bouton 見 pour afficher l'adresse en très grand et la montrer au chauffeur.</p>` +
    TRIP.adresses.map((g, gi) => `<h2 class="titre-section">${esc(g.ville)}</h2>` + g.lieux.map((l, li) => `<div class="bloc lieu-taxi">
        <div><div class="fr">${esc(l.fr)} ${l.aVerifier ? '<span class="puce">à vérifier</span>' : ""}</div>
          <div class="ja" lang="ja">${esc(l.ja)}${l.adresse ? `<small>${esc(l.adresse)}</small>` : ""}</div>
          <div class="romaji">${esc(l.romaji)}</div></div>
        <button type="button" data-a="grandTaxi" data-v="${gi}.${li}" aria-label="Afficher en grand : ${esc(l.fr)}">見</button>
      </div>`).join("")).join("");
}

/* ---------- Affichage plein écran (taxi et phrases) ---------- */
function ouvrirGrand({ intro, ja, sous, romaji, fr }) {
  const p = $("#plein");
  p.innerHTML = `${intro ? `<p class="intro" lang="ja">${esc(intro.ja)}<small>${esc(intro.fr)}</small></p>` : ""}
    <p class="tres-gros" lang="ja">${esc(ja)}${sous ? `<small>${esc(sous)}</small>` : ""}</p>
    <p class="romaji">${esc(romaji)}</p><p class="fr">${esc(fr)}</p>
    <button class="btn" type="button" data-a="fermer">Fermer</button>`;
  p.hidden = false;
  $("button", p).focus();
}
function fermerGrand() {
  $("#plein").hidden = true;
}

/* ---------- 4. Yen ⇄ € ---------- */
function vueYen() {
  const c = etat.conv, deYen = c.sens === "yen";
  const v = parseFloat(c.saisie.replace(",", ".")) || 0;
  const [ent, dec] = c.saisie.split(",");
  const saisie = Number(ent || 0).toLocaleString("fr-FR") + (dec !== undefined ? "," + dec : "");
  const touches = ["7", "8", "9", "4", "5", "6", "1", "2", "3", deYen ? "00" : ",", "0", "<"];
  return `<div class="bloc ecran-conv" aria-live="polite">
      <div class="saisie">${saisie}<span class="devise">${deYen ? "¥" : "€"}</span></div>
      <div class="resultat">= ${deYen ? eur(v / etat.taux) : yen(v * etat.taux)}</div>
    </div>
    <div class="rangee" style="margin-top:10px">
      <button class="btn clair" type="button" data-a="sens">⇄ ${deYen ? "€ → ¥" : "¥ → €"}</button>
      <button class="btn clair" type="button" data-a="touche" data-v="C">Effacer</button>
    </div>
    <div class="pave">${touches.map((t) => `<button type="button" data-a="touche" data-v="${t}" ${t === "<" ? 'class="fonction" aria-label="Effacer le dernier chiffre"' : ""}>${t === "<" ? "⌫" : t}</button>`).join("")}</div>
    <h2 class="titre-section">Taux de change</h2>
    <div class="bloc taux-ligne">
      <label for="taux">1 € =</label>
      <input id="taux" type="number" inputmode="decimal" step="0.1" min="1" value="${etat.taux}"> ¥
      <button class="btn clair petit" type="button" data-a="razTaux">Remettre ${String(TRIP.taux).replace(".", ",")}</button>
    </div>
    <h2 class="titre-section">Repères</h2>
    <div class="bloc"><table class="reperes">${[100, 500, 1000, 3000, 5000, 10000].map((y) => `<tr><td>${yen(y)}</td><td>${eur(enEur(y))}</td></tr>`).join("")}</table></div>`;
}

/* ---------- 5. Dépenses ---------- */
function libelleJour(date) {
  if (date === "avant") return "Avant le départ";
  const j = TRIP.jours.find((x) => x.date === date);
  return j ? `Jour ${j.n} · ${fmtDate(date, { weekday: "short", day: "numeric", month: "short" })}` : date;
}
function vueDepenses() {
  const iAuj = indexAujourdhui();
  const dateChoisie = etat.dep.date ?? (iAuj >= 0 ? TRIP.jours[iAuj].date : "avant");
  const total = etat.depenses.reduce((s, d) => s + d.yen, 0);

  let budget = "";
  if (etat.budget) {
    const reste = etat.budget - enEur(total);
    budget = `<div class="jauge"><i style="width:${Math.min(100, (enEur(total) / etat.budget) * 100).toFixed(1)}%"></i></div>
      <p class="discret">${reste >= 0 ? `Reste ${eur(reste)} (${yen(reste * etat.taux)})` : `Budget dépassé de ${eur(-reste)}`} sur ${eur(etat.budget)}</p>`;
  }

  const parJour = {};
  for (const d of etat.depenses) (parJour[d.date] ??= []).push(d);
  const ordre = (d) => (d === "avant" ? "0" : d);
  const liste = Object.keys(parJour).sort((a, b) => ordre(b).localeCompare(ordre(a))).map((date) => {
    const sous = parJour[date].reduce((s, d) => s + d.yen, 0);
    return `<div class="bloc"><div class="dep-jour"><span>${esc(libelleJour(date))}</span><span>${yen(sous)} · ${eur(enEur(sous))}</span></div>
      ${parJour[date].map((d) => `<div class="dep"><div>${esc(d.cat)}${d.note ? `<small>${esc(d.note)}</small>` : ""}</div>
        <div class="m">${yen(d.yen)}</div>
        <button type="button" data-a="suppr" data-v="${esc(d.id)}" aria-label="Supprimer la dépense ${esc(d.cat)} de ${yen(d.yen)}">×</button></div>`).join("")}</div>`;
  }).join("");

  return `<div class="bloc">
      <div class="total"><span class="yen">${yen(total)}</span><span class="eur">${eur(enEur(total))}</span></div>
      <p class="discret">Total du voyage · ${etat.depenses.length} dépense${etat.depenses.length > 1 ? "s" : ""}</p>${budget}
    </div>
    <h2 class="titre-section">Ajouter</h2>
    <form id="f-depense" class="bloc" novalidate>
      <label class="champ" style="margin-top:0"><span>Montant en ¥</span>
        <input class="montant" name="yen" type="number" inputmode="numeric" min="1" step="1" placeholder="0" aria-describedby="err-dep"></label>
      <p id="err-dep" class="badge" role="alert" hidden>Indiquez un montant en yens supérieur à 0.</p>
      <fieldset class="champ"><legend>Catégorie</legend><div class="choix">
        ${CATEGORIES.map((c) => `<label><input type="radio" name="cat" value="${esc(c)}" ${c === etat.dep.cat ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}</div></fieldset>
      <label class="champ"><span>Jour</span><select name="date">
        ${["avant", ...TRIP.jours.map((j) => j.date)].map((d) => `<option value="${d}" ${d === dateChoisie ? "selected" : ""}>${esc(libelleJour(d))}</option>`).join("")}</select></label>
      <label class="champ"><span>Note (facultatif)</span><input name="note" type="text" maxlength="80" autocomplete="off"></label>
      <button class="btn" type="submit" style="margin-top:14px">Ajouter la dépense</button>
    </form>
    ${liste ? `<h2 class="titre-section">Par jour</h2>${liste}` : ""}
    <h2 class="titre-section">Budget et sauvegarde</h2>
    <div class="bloc taux-ligne">
      <label for="budget">Budget (facultatif)</label>
      <input id="budget" type="number" inputmode="decimal" min="0" step="1" placeholder="—" value="${etat.budget ?? ""}"> €
    </div>
    <div class="bloc">
      <p class="discret" style="margin-bottom:10px">Les dépenses sont enregistrées sur ce téléphone uniquement. Exportez-les de temps en temps pour ne rien perdre.</p>
      <div class="rangee">
        <button class="btn clair" type="button" data-a="exporter">Exporter (JSON)</button>
        <button class="btn clair" type="button" data-a="choisirImport">Importer</button>
      </div>
      <input id="import" type="file" accept=".json,application/json" hidden>
    </div>`;
}

function ajouterDepense(form) {
  const montant = Math.round(Number(form.yen.value));
  if (!(montant > 0)) {
    $("#err-dep").hidden = false;
    form.yen.focus();
    return;
  }
  etat.dep = { cat: form.cat.value, date: form.date.value };
  etat.depenses.push({ id: nouvelId(), yen: montant, cat: form.cat.value, date: form.date.value, note: form.note.value.trim().slice(0, 80) });
  sauver("depenses");
  rendre();
}

function exporter() {
  const donnees = { appli: "japon-2026", version: 1, exporteLe: new Date().toISOString(), taux: etat.taux, budget: etat.budget, depenses: etat.depenses, coches: etat.coches };
  const nom = `japon-depenses-${horloge(JST).date}.json`;
  const fichier = new File([JSON.stringify(donnees, null, 2)], nom, { type: "application/json" });
  // Sur iPhone : feuille de partage (« Enregistrer dans Fichiers ») ; ailleurs : téléchargement
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [fichier] })) {
    navigator.share({ files: [fichier], title: nom }).catch(() => {});
    return;
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(fichier);
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function importer(fichier) {
  let d;
  try { d = JSON.parse(await fichier.text()); } catch { return alert("Fichier illisible : ce n'est pas un export JSON valide."); }
  if (!d || !Array.isArray(d.depenses)) return alert("Ce fichier ne contient pas de dépenses.");
  const liste = depensesValides(d.depenses);
  if (!confirm(`Remplacer les ${etat.depenses.length} dépense(s) de ce téléphone par les ${liste.length} du fichier ?`)) return;
  etat.depenses = liste;
  etat.budget = nombrePositif(d.budget);
  etat.taux = nombrePositif(d.taux) ?? etat.taux;
  etat.coches = { ...etat.coches, ...cochesValides(d.coches) };
  ["depenses", "budget", "taux", "coches"].forEach(sauver);
  rendre();
}

/* ---------- 6. Plus : phrases, checklist, météo, urgences ---------- */
const RETOUR = `<button class="retour" type="button" data-a="vue" data-v="plus">‹ Plus</button>`;
const tousLesPoints = () => TRIP.checklist.flatMap((s) => s.liste);

function vuePlus() {
  const faits = tousLesPoints().filter((p) => etat.coches[p.id]).length;
  const nbPhrases = TRIP.phrases.reduce((s, c) => s + c.liste.length, 0);
  const tuile = (vue, kanji, titre, sous) => `<button class="tuile" type="button" data-a="vue" data-v="${vue}">
      <b aria-hidden="true" lang="ja">${kanji}</b><span>${titre}<small>${sous}</small></span></button>`;
  return `<div class="tuiles">
      ${tuile("traduire", "訳", "Traduire", "Menu, conversation")}
      ${tuile("phrases", "話", "Phrases", `${nbPhrases} phrases utiles`)}
      ${tuile("checklist", "済", "Checklist", `${faits} / ${tousLesPoints().length} cochés`)}
      ${tuile("meteo", "天", "Météo", "Décembre, par ville")}
      ${tuile("urgences", "急", "Urgences", "110 · 119 · ambassade")}
    </div>
    <p class="discret" style="margin-top:18px">Appli hors ligne : une fois installée sur l'écran d'accueil, tout fonctionne sans réseau (sauf les liens Google Maps).</p>`;
}

function vueTraduire() {
  const t = TRIP.traduire;
  return RETOUR + t.liens.map((l) => `<a class="btn lien-trad${l.secours ? " clair" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.titre)} ↗<small>${esc(l.sous)}</small></span></a>`).join("") +
    `<p class="badge">${esc(t.note)}</p>` +
    t.modes.map((m) => `<h2 class="titre-section">${esc(m.titre)}</h2><div class="bloc"><ol class="liste-simple">${m.etapes.map((e) => `<li>${esc(e)}</li>`).join("")}</ol></div>`).join("") +
    `<button class="btn clair" type="button" data-a="vue" data-v="phrases" style="margin-top:14px">Phrases toutes prêtes (sans réseau)</button>`;
}

function vuePhrases() {
  return RETOUR + `<p class="discret">Touchez une phrase pour l'afficher en grand.</p>` +
    TRIP.phrases.map((c, ci) => `<h2 class="titre-section">${esc(c.categorie)}</h2>` + c.liste.map((p, pi) => `<button class="phrase" type="button" data-a="grandPhrase" data-v="${ci}.${pi}">
        <span class="fr">${esc(p.fr)}</span><span class="ja" lang="ja">${esc(p.ja)}</span><span class="romaji">${esc(p.romaji)}</span>
        <span class="loupe" aria-hidden="true">見</span></button>`).join("")).join("");
}

function vueChecklist() {
  return RETOUR + TRIP.checklist.map((s) => `<h2 class="titre-section">${esc(s.titre)} <small>${s.liste.filter((p) => etat.coches[p.id]).length} / ${s.liste.length}</small></h2>
    <div class="bloc">${s.liste.map((p) => `<label class="coche"><input type="checkbox" data-coche="${esc(p.id)}" ${etat.coches[p.id] ? "checked" : ""}><span>${esc(p.texte)}</span></label>`).join("")}</div>`).join("");
}

function vueMeteo() {
  const m = TRIP.meteo;
  return RETOUR + `<p>${esc(m.intro)}</p><h2 class="titre-section">Par ville <small>moyennes indicatives</small></h2>` +
    m.villes.map((v) => `<div class="bloc meteo"><span class="ville">${esc(v.ville)}</span>
      <span class="temp">${v.max}° <small>/ ${String(v.min).replace("-", "−")}°</small></span><span class="note">${esc(v.note)}</span></div>`).join("") +
    `<h2 class="titre-section">Vêtements à prévoir</h2><div class="bloc"><ul class="liste-simple">${m.vetements.map((v) => `<li>${esc(v)}</li>`).join("")}</ul></div>`;
}

function vueUrgences() {
  return RETOUR + TRIP.urgences.map((u) => `<div class="bloc urgence"><span class="nom">${esc(u.nom)}</span>
      <a href="tel:${esc(u.tel)}" aria-label="Appeler ${esc(u.nom)} : ${esc(u.numero)}">${esc(u.numero)}</a><span class="note">${esc(u.note)}</span></div>`).join("") +
    `<button class="btn clair" type="button" data-a="vue" data-v="phrases" style="margin-top:14px">Phrases d'urgence en japonais</button>`;
}

/* ==========================================================================
   Navigation et événements
   ========================================================================== */
const VUES = {
  aujourdhui: ["Aujourd'hui", vueAujourdhui],
  itineraire: ["Itinéraire", vueItineraire],
  taxi: ["Taxi · Adresses", vueTaxi],
  yen: ["Yen ⇄ €", vueYen],
  depenses: ["Dépenses", vueDepenses],
  plus: ["Plus", vuePlus],
  traduire: ["Traduire", vueTraduire],
  phrases: ["Phrases", vuePhrases],
  checklist: ["Checklist", vueChecklist],
  meteo: ["Météo de décembre", vueMeteo],
  urgences: ["Urgences", vueUrgences],
};

function rendre(remonter) {
  const [titre, vue] = VUES[etat.vue];
  $("#titre").textContent = titre;
  $("#vue").innerHTML = vue();
  const onglet = etat.vue in { traduire: 1, phrases: 1, checklist: 1, meteo: 1, urgences: 1 } ? "plus" : etat.vue;
  for (const b of document.querySelectorAll(".onglets button")) {
    if (b.dataset.v === onglet) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  }
  if (etat.vue === "aujourdhui") etat.cle = cleAujourdhui();
  if (remonter) $("#vue").scrollTop = 0;
}

const ACTIONS = {
  vue(v) { if (VUES[v]) { etat.vue = v; rendre(true); } },
  jour(v) {
    const iAuj = indexAujourdhui(), defaut = iAuj >= 0 ? iAuj : 0;
    const i = Math.min(TRIP.jours.length - 1, Math.max(0, (etat.jour ?? defaut) + Number(v)));
    etat.jour = i === iAuj ? null : i;
    rendre(true);
  },
  auj() { etat.jour = null; rendre(true); },
  grandTaxi(v) {
    const [g, l] = v.split("."), lieu = TRIP.adresses[g].lieux[l];
    ouvrirGrand({ intro: TRIP.phraseTaxi, ja: lieu.ja, sous: lieu.adresse, romaji: lieu.romaji, fr: lieu.fr });
  },
  grandPhrase(v) {
    const [c, p] = v.split(".");
    ouvrirGrand(TRIP.phrases[c].liste[p]);
  },
  fermer: fermerGrand,
  touche(v) {
    const c = etat.conv;
    if (v === "C") c.saisie = "";
    else if (v === "<") c.saisie = c.saisie.slice(0, -1);
    else if (v === ",") { if (!c.saisie.includes(",")) c.saisie += c.saisie ? "," : "0,"; }
    // 9 chiffres au plus, 2 décimales au plus, pas de zéros inutiles en tête
    else if (c.saisie.replace(",", "").length + v.length <= 9 && !/,\d\d$/.test(c.saisie)) c.saisie = (c.saisie + v).replace(/^0+(?=\d)/, "");
    rendre();
  },
  sens() {
    const c = etat.conv;
    c.sens = c.sens === "yen" ? "eur" : "yen";
    if (c.sens === "yen") c.saisie = c.saisie.split(",")[0]; // pas de centimes en yens
    rendre();
  },
  razTaux() { etat.taux = TRIP.taux; sauver("taux"); rendre(); },
  suppr(id) {
    const d = etat.depenses.find((x) => x.id === id);
    if (!d || !confirm(`Supprimer la dépense « ${d.cat} » de ${yen(d.yen)} ?`)) return;
    etat.depenses = etat.depenses.filter((x) => x !== d);
    sauver("depenses");
    rendre();
  },
  exporter,
  choisirImport() { $("#import").click(); },
};

document.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-a]");
  if (b && Object.hasOwn(ACTIONS, b.dataset.a)) ACTIONS[b.dataset.a](b.dataset.v);
});

document.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (ev.target.id === "f-depense") ajouterDepense(ev.target);
});

document.addEventListener("change", (ev) => {
  const t = ev.target;
  if (t.dataset.coche) {
    etat.coches[t.dataset.coche] = t.checked;
    sauver("coches");
    rendre();
    $(`[data-coche="${CSS.escape(t.dataset.coche)}"]`)?.focus(); // garde le focus clavier après le redessin
  } else if (t.id === "taux") {
    etat.taux = nombrePositif(parseFloat(t.value)) ?? etat.taux;
    sauver("taux");
    rendre();
  } else if (t.id === "budget") {
    etat.budget = nombrePositif(parseFloat(t.value));
    sauver("budget");
    rendre();
  } else if (t.id === "import" && t.files[0]) {
    importer(t.files[0]);
  } else if (t.name === "cat" || t.name === "date") {
    etat.dep[t.name] = t.value;
  }
});

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !$("#plein").hidden) fermerGrand();
});

// Horloge : met à jour « Aujourd'hui » quand la prochaine étape ou la date change,
// sans refermer les détails ouverts le reste du temps.
function battement() {
  if (etat.vue === "aujourdhui" && !document.hidden && cleAujourdhui() !== etat.cle) rendre();
}
setInterval(battement, 30000);
document.addEventListener("visibilitychange", battement);

// iPhone, appli installée : avec la barre d'état translucide, iOS annonce une hauteur de page
// plus courte que l'écran (il manque la hauteur de la barre d'état) et laisse un vide en bas.
// On impose donc la vraie hauteur de l'écran. Sans effet dans Safari ou sur un autre appareil.
function ajusterHauteur() {
  if (!navigator.standalone) return;
  const portrait = matchMedia("(orientation: portrait)").matches;
  const ecran = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
  document.documentElement.style.setProperty("--hauteur", Math.max(innerHeight, ecran) + "px");
}
ajusterHauteur();
addEventListener("resize", ajusterHauteur);
addEventListener("orientationchange", ajusterHauteur);

rendre();

// Hors ligne : le service worker met tous les fichiers en cache dès la première visite
// Quand une nouvelle version s'installe, on recharge une fois pour l'afficher tout de suite
// (pas au tout premier lancement, où il n'y avait pas encore de version précédente).
if ("serviceWorker" in navigator) {
  const versionPrecedente = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (versionPrecedente) location.reload(); });
  navigator.serviceWorker.register("sw.js").then((r) => r.update()).catch(() => {});
  // iPhone : l'appli installée est souvent reprise sans être relancée, on vérifie aussi au retour
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) navigator.serviceWorker.getRegistration().then((r) => r && r.update()).catch(() => {});
  });
}
