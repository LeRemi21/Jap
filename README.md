# Japon 2026 — appli de voyage (PWA hors ligne)

Carnet de voyage du 30 novembre au 15 décembre 2026 : itinéraire, adresses taxi en japonais,
convertisseur yen/euro, dépenses, phrases, checklist. Sans framework ni dépendance.

## À REPRENDRE SUR LE PC DE LA MAISON

Le projet a été commencé sur un autre PC. Pour continuer à la maison :

```bash
git clone https://github.com/LeRemi21/Jap.git
```

```bash
cd Jap
```

- Le dépôt est privé : Git demandera de se connecter à GitHub (fenêtre du navigateur) au premier clone.
- **Le carnet `Japon.pdf` n'est pas dans le dépôt** (exclu par `.gitignore`, il ne doit pas être publié).
  Le copier à la main dans le dossier si besoin (clé USB, cloud…). L'appli fonctionne sans lui.

### Reste à faire

- [ ] Activer GitHub Pages : Settings → Pages → Source « Deploy from a branch » → `main` / `(root)` → Save.
      Sur un compte gratuit, il faut d'abord rendre le dépôt public (Settings → General → Danger Zone).
      Adresse attendue : https://leremi21.github.io/Jap/
- [ ] Décider si on retire les numéros de places et les prix d'hôtels avant de rendre le site public.
- [ ] Installer sur l'iPhone : ouvrir l'adresse dans Safari → Partager → « Sur l'écran d'accueil ».
- [ ] Vérifier les points marqués « à vérifier » dans l'appli (adresses japonaises des hôtels,
      prix des billets réservés par personne ou pour 2, numéros d'urgence).
- [ ] Compléter le vol retour dans `data.js` (jour 16).

## Travailler dessus

Lancer l'appli en local (puis ouvrir http://localhost:8123) :

```bash
python -m http.server 8123
```

Vérifier les données après une modification de `data.js` :

```bash
node test.js
```

Envoyer les modifications sur GitHub :

```bash
git add -A && git commit -m "Mise à jour" && git push
```

Simuler une date du voyage : ajouter `?now=2026-12-06T09:00` à l'adresse (heure du Japon).

## Fichiers

| Fichier | Rôle |
|---|---|
| `data.js` | **Toutes les données** : itinéraire, hôtels, adresses, phrases, checklist. Seul fichier à corriger. |
| `app.js` | Logique des écrans |
| `style.css` | Apparence (mode sombre automatique) |
| `sw.js` | Fonctionnement hors ligne |
| `photos/` | Images tirées du carnet |
| `test.js` | Contrôle de cohérence de `data.js` |
