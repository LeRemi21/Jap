/* Service worker : rend l'appli 100 % utilisable hors ligne.
   Les fichiers se rafraîchissent tout seuls en arrière-plan quand il y a du réseau.
   Pour forcer un nouveau téléchargement complet, augmenter le numéro (v2, v3…). */
const CACHE = "japon-v3";

// La liste des photos est lue dans data.js : rien à recopier ici quand on en ajoute
importScripts("data.js");
const PHOTOS = [...TRIP.jours, ...TRIP.jours.flatMap((j) => j.etapes), ...Object.values(TRIP.hotels)].map((x) => x.photo).filter(Boolean);

const FICHIERS = [
  "./",
  "index.html",
  "style.css",
  "data.js",
  "app.js",
  "manifest.webmanifest",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  ...new Set(PHOTOS),
];

// Installation : tout est mis en cache d'un coup
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

// Activation : on supprime les caches des anciennes versions
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

// Requêtes : réponse immédiate depuis le cache, rafraîchi en arrière-plan quand il y a du réseau
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Google Maps, etc. : réseau normal
  const cle = url.origin + url.pathname; // on ignore ?now=… et autres paramètres
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const enCache = await cache.match(cle);
      const reseau = fetch(e.request)
        .then((rep) => {
          if (rep.ok) cache.put(cle, rep.clone());
          return rep;
        })
        .catch(() => enCache || Response.error());
      if (enCache) e.waitUntil(reseau);
      return enCache || reseau;
    })
  );
});
