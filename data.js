/* ==========================================================================
   Japon 2026 — TOUTES LES DONNÉES DU VOYAGE (seul fichier à corriger)
   Source : carnet Japon.pdf. Rien n'est inventé pour l'itinéraire :
   ce qui manque est listé dans « manque », ce qui est douteux dans « aVerifier ».

   Après une modification : vérifier avec  node test.js  puis publier.
   L'iPhone récupère la nouvelle version au 2e lancement avec du réseau.
   Les photos (dossier photos/) viennent du carnet ; champ « photo » facultatif
   sur un jour, une étape ou un hôtel.

   Format d'une étape (tableau « etapes » de chaque jour, dans l'ordre) :
     type        "trajet" | "lieu" | "info"
     heure       "HH:MM" (heure locale) — facultatif
     arrivee     "HH:MM" — facultatif
     indicatif   true si le carnet dit « exemple d'horaire »
     moment      "Matin" | "Après-midi" | "Soir" | "Journée" (si pas d'heure)
     titre       texte affiché
     prix        { yen: 320, pour: "par pers." }  ou  { texte: "Gratuit" }
                 billets payés : { yen, pour, reserve: true, eurCarnet: 47.33 }
     total       durée totale du trajet (texte)
     pas         étapes détaillées du trajet (liste de textes)
     maps        lien Google Maps du carnet (trajets)
     q           recherche Google Maps (lieux)
     description, aFaire, horaires, duree, conseil   (lieux)
     notes       remarques importantes, toujours visibles
     aVerifier   points douteux du carnet (badge orange)
     manque      infos absentes du carnet (badge gris)
   ========================================================================== */

const M = "https://www.google.com/maps/dir/?api=1&";
const HOTEL_TOKYO = "origin=2-3-4+Ichigayakagacho,+Shinjuku+City,+Tokyo";
const FORZA = "Hotel+Forza+Kyoto+Shijo+Kawaramachi";
const PRIX_RESERVE = "Montant du carnet indiqué « par personne » : 2 places sont réservées, vérifier si c'est le total pour 2.";

const TRIP = {
  titre: "Japon 2026",
  taux: 178.5, // 1 € = 178,5 ¥ (taux du carnet, modifiable dans l'appli)

  /* ---------------------------- Hébergements ---------------------------- */
  hotels: {
    bcn: {
      nom: "Sercotel Sant Boi", ville: "Barcelone", nuits: "30 nov. → 1er déc. (1 nuit)",
      q: "Sercotel Sant Boi", manque: ["Adresse et prix absents du carnet"],
    },
    tokyo: {
      photo: "photos/hotel-tokyo.webp", nom: "Ichigaya Stay", ville: "Tokyo", nuits: "2 → 9 déc. (7 nuits)",
      adresse: "2-3-4 Ichigayakagachō, Shinjuku, Tokyo", prix: "471,35",
      q: "2-3-4 Ichigayakagacho, Shinjuku City, Tokyo",
    },
    fuji: {
      photo: "photos/hotel-fuji.webp", nom: "Sawa Hotel", ville: "Kawaguchiko (mont Fuji)", nuits: "9 → 10 déc. (1 nuit)",
      adresse: "Funatsu 2090, Fujikawaguchiko, Yamanashi 401-0301", prix: "57,36",
      q: "Sawa Hotel, 2090 Funatsu, Fujikawaguchiko, Yamanashi",
    },
    kyoto: {
      photo: "photos/hotel-kyoto.webp", nom: "Hotel Forza Kyoto Shijo Kawaramachi", ville: "Kyoto", nuits: "10 → 14 déc. (4 nuits)",
      adresse: "25-1 Tachiuri Higashimachi, Shimogyō-ku, Kyoto", prix: "239",
      q: "Hotel Forza Kyoto Shijo Kawaramachi",
    },
    osaka: {
      photo: "photos/hotel-osaka.webp", nom: "ibis Osaka Umeda", ville: "Osaka", nuits: "14 → 15 déc. (1 nuit)",
      adresse: "1-5 Komatsubara-chō, Kita-ku, Osaka", prix: "46,59",
      q: "Ibis Osaka Umeda",
    },
  },

  /* ------------------------------ Itinéraire ----------------------------- */
  jours: [
    {
      n: 1, photo: "photos/jour-01.webp", date: "2026-11-30", fuseau: "Europe/Paris", ville: "Barcelone", hotel: "bcn",
      titre: "Bernis → Barcelone", resume: "Train Nîmes → Barcelone",
      etapes: [
        { type: "info", heure: "16:00", indicatif: true, titre: "Transport de Bernis à Nîmes", notes: ["Départ vers 16h00"] },
        {
          type: "trajet", heure: "17:46", arrivee: "21:32", titre: "Train Nîmes → Barcelone Sants", total: "3 h 46",
          pas: ["3 h 46 de trajet, 0 correspondance", "Arrivée à 21h32 à Barcelone"],
          notes: ["Voiture 18, places 858 & 859"], manque: ["Prix du billet"],
        },
        {
          type: "trajet", heure: "21:32", titre: "Gare de Barcelone Sants → Sercotel Sant Boi", total: "38 min",
          pas: [
            "1 min à pied vers Sants Estació",
            "Métro L3 : Sants Estació → Palau Reial (4 arrêts, 6 min)",
            "2 min à pied vers Avinguda Diagonal",
            "Bus L97 : Avinguda Diagonal → Mare de Déu de Núria - Marina (3 arrêts, 24 min)",
            "5 min à pied vers le Sercotel Sant Boi",
          ],
          manque: ["Prix du trajet"],
        },
      ],
    },
    {
      n: 2, photo: "photos/jour-02.webp", date: "2026-12-01", fuseau: "Europe/Paris", ville: "En vol",
      titre: "Barcelone → Pékin → Tokyo", resume: "Vol de 11h25, escale à Pékin",
      etapes: [
        { type: "info", heure: "08:00", titre: "Sortie de l'hôtel" },
        {
          type: "trajet", heure: "08:00", titre: "Sercotel Sant Boi → Aéroport de Barcelone T1", total: "28 min",
          pas: [
            "5 min à pied vers Santa Creu de Calafell",
            "Bus L86 : Santa Creu de Calafell → Ctra. del Prat - Cantàbria (6 arrêts, 7 min)",
            "Bus L77 : Ctra. del Prat - Cantàbria → Terminal Aeroport T1 (3 arrêts, 16 min)",
          ],
          manque: ["Prix du trajet"],
        },
        {
          type: "trajet", heure: "11:25", titre: "Vol Barcelone → Pékin", total: "11 h de vol",
          pas: ["Décollage 11h25", "Arrivée à Pékin à 5h30 (heure locale, le 2 décembre)", "Correspondance de 3 h 15"],
          notes: ["Aucun repas dans l'avion", "Bagages : pas besoin de les récupérer ni de les réenregistrer à Pékin"],
          manque: ["Compagnie et numéro de vol"],
        },
      ],
    },
    {
      n: 3, photo: "photos/jour-03.webp", date: "2026-12-02", ville: "Tokyo", hotel: "tokyo",
      titre: "Arrivée à Tokyo", resume: "Haneda · installation à l'hôtel",
      etapes: [
        {
          type: "trajet", moment: "Matin", titre: "Vol Pékin → Tokyo Haneda", total: "3 h 05 de vol",
          pas: ["Décollage de Pékin à 8h45 (heure de Pékin)", "Arrivée à Haneda à 12h50"],
          notes: ["Temps total du voyage depuis Barcelone : 17 h 20"],
        },
        {
          type: "info", heure: "12:50", titre: "Arrivée à l'aéroport de Haneda",
          notes: [
            "Suivre les panneaux « Arrivals / Immigration »",
            "Immigration : présenter le QR code Visit Japan Web (formulaire rempli avant le départ)",
            "Récupérer les valises",
            "Douane : parcours « déclaration électronique » (QR code Visit Japan Web)",
          ],
        },
        {
          type: "trajet", moment: "Après-midi", titre: "Haneda → hôtel (Ichigaya)", total: "46 min", prix: { yen: 730, pour: "par pers." },
          pas: [
            "Aller à Haneda Airport Terminal 3 Station",
            "Tokyo Monorail « Airport Rapid » direction Hamamatsuchō ; descendre à Monorail Hamamatsuchō (13 min)",
            "2 min à pied vers Hamamatsuchō Station",
            "Keihin-Tōhoku Line, Rapid direction Minami-Urawa (5 arrêts, env. 10 min) ; descendre à Akihabara",
            "1 min à pied dans la gare d'Akihabara",
            "Chūō-Sōbu Line (Local) (4 arrêts, 8 min) ; descendre à Ichigaya",
            "14 min à pied vers Ichigayakagachō",
          ],
          aVerifier: ["Les étapes additionnées font 48 min, le carnet indique 46 min"],
          manque: ["Pas de lien Google Maps dans le carnet"],
          q: "2-3-4 Ichigayakagacho, Shinjuku City, Tokyo",
        },
        {
          type: "info", heure: "15:00", indicatif: true, titre: "Arrivée à l'hôtel",
          notes: ["Repérage du konbini & 7-Eleven (14 min à pied)", "Repérage du quartier"],
        },
        { type: "info", moment: "Soir", titre: "Repas dans le quartier", notes: ["Retour à l'hôtel (jet lag)"] },
      ],
    },
    {
      n: 4, photo: "photos/jour-04.webp", date: "2026-12-03", ville: "Tokyo", hotel: "tokyo",
      titre: "Asakusa, Ueno, Akihabara", resume: "Sensō-ji · Ueno / Ameyoko · Akihabara",
      etapes: [
        {
          type: "trajet", heure: "06:15", titre: "Hôtel → Asakusa", total: "35 min", prix: { yen: 320, pour: "par pers." },
          pas: [
            "12 min à pied jusqu'à Ushigome-Yanagichō",
            "Ōedo Line (E) (5 arrêts, 11 min) ; descendre à Ueno-Okachimachi",
            "2 min à pied jusqu'à Ueno-Hirokoji Station",
            "Ginza Line (G) (4 arrêts, 8 min) ; descendre à Asakusa",
            "2 min à pied jusqu'au sanctuaire d'Asakusa",
          ],
          maps: M + HOTEL_TOKYO + "&destination=Senso-ji+Temple,+Asakusa,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Sensō-ji et Nakamise", photo: "photos/senso-ji.webp", prix: { texte: "Gratuit" }, q: "Senso-ji Temple, Asakusa, Tokyo",
          horaires: "6h30 – 17h00", duree: "1 h 30 à 2 h",
          description: "L'un des plus anciens temples bouddhistes de Tokyo. La tradition situe sa fondation au VIIe siècle, autour d'une statue de Kannon découverte dans la rivière Sumida. Les bâtiments actuels ont largement été reconstruits après la Seconde Guerre mondiale.",
          aFaire: "Passer sous la porte Kaminarimon ; parcourir la rue Nakamise ; observer la grande lanterne et la pagode ; visiter le hall principal ; explorer les ruelles d'Asakusa.",
          conseil: "Venir tôt pour visiter avant l'affluence.",
        },
        {
          type: "trajet", heure: "12:00", titre: "Asakusa → Ueno", total: "13 min", prix: { yen: 180, pour: "par pers." },
          pas: [
            "3 min à pied du sanctuaire vers la station Asakusa",
            "Ginza Line (G) (4 arrêts, 7 min) ; descendre à Ueno-Hirokoji",
            "3 min à pied jusqu'à Ueno",
          ],
          maps: M + "origin=Senso-ji+Temple,+Asakusa,+Tokyo&destination=Ueno+Station,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Ueno et Ameyoko", photo: "photos/ueno.webp", prix: { texte: "Parcs et marchés gratuits" }, q: "Ameyoko, Ueno, Tokyo",
          horaires: "5h00 – 23h00", duree: "2 h à 3 h",
          description: "Ueno est un haut lieu culturel de Tokyo depuis l'ère Meiji. Le parc abrite musées, sanctuaires et espaces de promenade. Ameyoko s'est développé comme quartier marchand animé après la guerre.",
          aFaire: "Marcher dans le parc ; choisir un musée si la météo est mauvaise ; voir l'étang Shinobazu ; goûter les spécialités et parcourir les étals d'Ameyoko.",
          conseil: "Musées et repas payants, prix selon choix.",
        },
        {
          type: "trajet", moment: "Soir", titre: "Ueno → Akihabara", total: "13 min", prix: { yen: 180, pour: "par pers." },
          pas: [
            "Depuis Ueno, rejoindre la gare JR d'Ueno",
            "Ligne JR Yamanote ou Keihin-Tōhoku en direction d'Akihabara",
            "Descendre à Akihabara, puis marcher vers les boutiques du quartier",
          ],
          aVerifier: ["Prix (180 ¥) et durée (13 min) identiques au trajet précédent : copier-coller probable dans le carnet"],
          maps: M + "origin=Ueno+Station,+Tokyo&destination=Akihabara+Station,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Soir", titre: "Akihabara", photo: "photos/akihabara.webp", prix: { texte: "Quartier gratuit" }, q: "Akihabara Electric Town, Tokyo",
          duree: "1 h 30 à 3 h",
          description: "Akihabara s'est affirmé après-guerre comme quartier de l'électronique, puis des jeux vidéo, mangas, figurines et loisirs japonais.",
          aFaire: "Explorer les boutiques d'électronique et de figurines ; tester une salle d'arcade ; découvrir les enseignes lumineuses ; prévoir un dîner dans le quartier.",
          conseil: "Arcades, achats et restauration selon dépenses.",
        },
      ],
    },
    {
      n: 5, photo: "photos/jour-05.webp", date: "2026-12-04", ville: "Tokyo", hotel: "tokyo",
      titre: "Shinjuku Gyoen, Nakano, Ghibli", resume: "Shinjuku Gyoen · Nakano Broadway · musée Ghibli · Shinjuku",
      etapes: [
        {
          type: "trajet", heure: "08:10", titre: "Hôtel → Shinjuku Gyoen", total: "26 min", prix: { yen: 200, pour: "par pers." },
          pas: [
            "7 min à pied jusqu'à l'arrêt Yakujimachi",
            "Bus direction Shinjuku Sta. Nishiguchi (5 arrêts, 10 min) ; descendre à Shinjuku-Itchōme-Kita (Shinjuku 1 Kita)",
            "9 min à pied jusqu'au parc Shinjuku Gyoen",
          ],
          aVerifier: ["Le carnet convertit ces 200 ¥ en 1,18 € (ce qui correspond à 210 ¥) : montant à vérifier"],
          maps: M + HOTEL_TOKYO + "&destination=Shinjuku+Gyoen+National+Garden,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", heure: "09:00", arrivee: "10:15", titre: "Shinjuku Gyoen", photo: "photos/shinjuku-gyoen.webp", prix: { yen: 500 }, q: "Shinjuku Gyoen National Garden, Tokyo",
          horaires: "9h00 – 16h30", duree: "1 h 30 à 2 h",
          description: "Ce vaste jardin a d'abord été lié à la famille Naitō avant de devenir un jardin impérial, puis un parc public en 1949. Il mêle jardins japonais, anglais et français.",
          aFaire: "Marcher autour des étangs ; voir les jardins paysagers ; photographier les feuillages de fin d'automne ; visiter la serre si ouverte.",
        },
        {
          type: "trajet", moment: "Matin", titre: "Shinjuku → Nakano", total: "18 min", prix: { yen: 200, pour: "par pers." },
          pas: [
            "11 min à pied jusqu'à la gare de Shinjuku",
            "Chūō Special Rapid direction Takao (1 arrêt, 3 min) ; descendre à Nakano",
            "4 min à pied jusqu'à Nakano Broadway",
          ],
          aVerifier: ["Le carnet convertit ces 200 ¥ en 1,18 € (ce qui correspond à 210 ¥) : montant à vérifier"],
          maps: M + "origin=Shinjuku+Gyoen+National+Garden,+Tokyo&destination=Nakano+Broadway,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", heure: "11:00", arrivee: "12:00", titre: "Nakano Broadway", photo: "photos/nakano.webp", prix: { texte: "Accès gratuit" }, q: "Nakano Broadway, Tokyo",
          duree: "1 h 30 à 2 h",
          description: "Ouvert dans les années 1960, ce complexe est aujourd'hui connu pour ses boutiques spécialisées en mangas, jouets anciens et objets de collection.",
          aFaire: "Explorer les étages ; chercher des figurines et livres d'occasion ; flâner dans la galerie Nakano Sun Mall ; déjeuner à proximité.",
          conseil: "Les commerces ouvrent souvent plus tard que les temples.",
        },
        {
          type: "trajet", moment: "Après-midi", titre: "Nakano → musée Ghibli", total: "34 min", prix: { yen: 460, pour: "par pers." },
          pas: [
            "5-10 min à pied de Nakano Broadway jusqu'à Nakano Station",
            "JR Chūō en direction de Mitaka / Takao ; descendre à Mitaka",
            "15-20 min à pied jusqu'au musée Ghibli (ou navette)",
          ],
          notes: ["Viser une arrivée à 13h30"],
          maps: M + "origin=Nakano%20Broadway%2C%20Tokyo&destination=Ghibli%20Museum%2C%20Mitaka%2C%20Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Musée Ghibli", photo: "photos/ghibli.webp", prix: { texte: "Billets réservés" }, q: "Ghibli Museum, Mitaka, Tokyo",
          duree: "2 h à 3 h",
          description: "L'univers du Studio Ghibli, à Mitaka : les coulisses des films d'animation de Hayao Miyazaki à travers des décors, des dessins originaux et des expositions.",
          aFaire: "Explorer les expositions consacrées aux films ; découvrir les dessins et croquis originaux ; admirer le robot du Château dans le ciel ; voir le court-métrage exclusif en salle de projection ; passer à la boutique Mamma Aiuto!",
          conseil: "Arriver un peu en avance. Photos interdites dans les espaces d'exposition intérieurs.",
          manque: ["Heure exacte du créneau d'entrée (le carnet dit seulement « viser 13h30 »)", "Prix des billets"],
        },
        {
          type: "trajet", moment: "Soir", titre: "Musée Ghibli → Shinjuku", total: "34 min", prix: { yen: 510, pour: "par pers." },
          pas: [
            "15-20 min à pied du musée jusqu'à Mitaka Station (ou navette)",
            "JR Chūō en direction de Shinjuku / Tokyo ; descendre à Shinjuku",
            "Rejoindre à pied Omoide Yokochō puis Kabukichō",
          ],
          maps: M + "origin=Ghibli%20Museum%2C%20Mitaka%2C%20Tokyo&destination=Shinjuku%20Station%2C%20Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Soir", titre: "Shinjuku : néons et ruelles", photo: "photos/shinjuku.webp", prix: { texte: "Quartier gratuit" }, q: "Omoide Yokocho, Shinjuku, Tokyo",
          duree: "2 h à 3 h",
          description: "L'un des grands centres administratifs et commerciaux de Tokyo, célèbre pour sa gare très fréquentée et ses quartiers nocturnes.",
          aFaire: "Voir les enseignes de Kabukichō ; passer dans Omoide Yokochō ; découvrir Golden Gai de l'extérieur ou entrer dans un bar adapté ; dîner.",
          conseil: "Vérifier les prix affichés et éviter les rabatteurs.",
        },
      ],
    },
    {
      n: 6, photo: "photos/jour-06.webp", date: "2026-12-05", ville: "Tokyo", hotel: "tokyo",
      titre: "Meiji-jingū, Harajuku, Shibuya", resume: "Meiji-jingū · Yoyogi / Takeshita / Omotesandō · Shibuya",
      etapes: [
        {
          type: "trajet", heure: "06:30", titre: "Hôtel → Meiji-jingū", total: "30 min", prix: { yen: 200, pour: "par pers." },
          pas: [
            "15 min à pied jusqu'à Ichigaya Station",
            "Chūō-Sōbu Line (Local) (4 arrêts, 8 min) ; descendre à Yoyogi",
            "7 min à pied jusqu'à Meiji-jingū",
          ],
          maps: M + HOTEL_TOKYO + "&destination=Meiji+Jingu,+Shibuya+City,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Meiji-jingū", prix: { texte: "Enceinte principale gratuite" }, q: "Meiji Jingu, Shibuya City, Tokyo",
          horaires: "6h40 – 16h00", duree: "1 h à 1 h 30",
          description: "Sanctuaire shinto inauguré en 1920 en hommage à l'empereur Meiji et à l'impératrice Shōken. Sa vaste forêt urbaine a été constituée grâce à des arbres offerts depuis tout le Japon.",
          aFaire: "Traverser les grands torii ; marcher dans la forêt ; observer les barils de saké ; découvrir le pavillon principal ; respecter les gestes de purification.",
          conseil: "Garder une attitude discrète près des espaces de prière.",
        },
        {
          type: "trajet", moment: "Après-midi", titre: "Meiji-jingū → Yoyogi", total: "7 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["7 min à pied depuis Meiji-jingū jusqu'à Yoyogi"],
          notes: ["Variante depuis l'hôtel (300 ¥ par pers., 37 min) : 17 min à pied jusqu'à Akebonobashi, Shinjuku Line (Local) 3 arrêts / 5 min, descendre à Hatsudai, 14 min à pied jusqu'à Yoyogi"],
          maps: M + HOTEL_TOKYO + "&destination=Yoyogi+Park,+Tokyo&travelmode=transit",
          aVerifier: ["Le lien Google Maps du carnet part de l'hôtel (variante), pas de Meiji-jingū"],
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Yoyogi, Takeshita Street et Omotesandō", photo: "photos/takeshita.webp", prix: { texte: "Promenades gratuites" }, q: "Takeshita Street, Harajuku, Tokyo",
          duree: "2 h à 3 h",
          description: "Harajuku juxtapose cultures jeunes, mode alternative et architecture contemporaine. Takeshita est une rue commerçante emblématique ; Omotesandō, une avenue plus élégante.",
          aFaire: "Faire une pause dans Yoyogi ; parcourir Takeshita ; goûter une crêpe à Marion Crêpes ; observer les vitrines et bâtiments d'Omotesandō.",
          conseil: "Takeshita peut être très dense : garder ses affaires près de soi.",
        },
        {
          type: "trajet", moment: "Soir", titre: "Yoyogi → Shibuya", total: "19 min", prix: { yen: 200, pour: "par pers." },
          pas: [
            "2 min à pied jusqu'à l'arrêt Yoyogi 3",
            "Bus direction Shibuya Sta. (8 arrêts, 13 min) ; descendre à Jinnan 1",
            "4 min à pied jusqu'à Shibuya Scramble Crossing",
          ],
          maps: M + "origin=Yoyogi+Station,+Tokyo&destination=Shibuya+Scramble+Crossing,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Soir", titre: "Shibuya Crossing et Hachikō", photo: "photos/shibuya.webp", prix: { texte: "Quartier gratuit" }, q: "Shibuya Scramble Crossing, Tokyo",
          duree: "2 h à 3 h",
          description: "Shibuya est devenu un symbole de la modernité tokyoïte. La statue de Hachikō rend hommage à un chien célèbre pour avoir attendu fidèlement son maître à la gare dans les années 1920-1930.",
          aFaire: "Voir Hachikō ; traverser le carrefour ; admirer les façades lumineuses ; visiter le Disney Store.",
          conseil: "Profiter du coucher du soleil puis des lumières du soir.",
          notes: ["Repas du soir : izakaya"],
        },
      ],
    },
    {
      n: 7, photo: "photos/jour-07.webp", date: "2026-12-06", ville: "Tokyo", hotel: "tokyo",
      titre: "teamLab, Toyosu, Odaiba", resume: "teamLab Planets 8h30 · Toyosu · Odaiba / Gundam",
      etapes: [
        {
          type: "trajet", heure: "07:21", arrivee: "08:01", titre: "Hôtel → teamLab Planets", total: "40 min", prix: { yen: 400, pour: "par pers." },
          pas: [
            "14 min à pied jusqu'à Ichigaya Station",
            "Ligne Yūrakuchō direction Shin-Kiba (8 arrêts, 15 min) ; descendre à Toyosu",
            "4 min à pied jusqu'à Toyosu Sta. (Yurikamome)",
            "Yurikamome direction Shimbashi (1 arrêt, 1 min) ; descendre à Shin-Toyosu",
            "teamLab Planets est juste à côté",
          ],
          notes: ["Créneau teamLab : 8h30"],
          maps: M + HOTEL_TOKYO + "&destination=teamLab+Planets+TOKYO+DMM&travelmode=transit",
        },
        {
          type: "lieu", heure: "08:30", titre: "teamLab Planets", photo: "photos/teamlab.webp", prix: { yen: 9600, pour: "pour 2", reserve: true, eurCarnet: 53.85 }, q: "teamLab Planets TOKYO DMM",
          horaires: "Réservation à 8h30", duree: "1 h 30 à 2 h",
          description: "Exposition immersive d'art numérique où le visiteur se déplace physiquement dans des installations de lumière, d'eau et de miroirs. Les œuvres peuvent évoluer avec les saisons.",
          aFaire: "Explorer les installations pieds nus lorsque demandé ; prendre le temps des projections ; suivre les consignes concernant l'eau et les effets lumineux.",
        },
        {
          type: "trajet", heure: "11:02", arrivee: "11:04", indicatif: true, titre: "teamLab → Toyosu", total: "2 min", prix: { yen: 190, pour: "par pers." },
          pas: [
            "Rejoindre Shin-Toyosu Sta., juste à côté de teamLab Planets",
            "Yurikamome direction Toyosu (1 arrêt, 2 min) ; descendre à Toyosu",
          ],
          maps: M + "origin=teamLab+Planets+TOKYO+DMM&destination=Toyosu+Station,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Toyosu", photo: "photos/toyosu.webp", prix: { texte: "Accès gratuit" }, q: "Toyosu Market, Tokyo",
          duree: "1 h 30 à 2 h",
          description: "Quartier de front de baie réaménagé, associé notamment au marché de gros qui a succédé à Tsukiji pour certaines activités en 2018.",
          aFaire: "Déjeuner ; observer l'architecture contemporaine ; découvrir les promenades au bord de l'eau ; visiter un espace commercial selon l'envie.",
          aVerifier: ["Jours d'accès aux zones de marché"],
        },
        {
          type: "trajet", heure: "14:05", arrivee: "14:25", indicatif: true, titre: "Toyosu → Odaiba", total: "20 min", prix: { yen: 260, pour: "par pers." },
          pas: [
            "Yurikamome direction Shimbashi (6 arrêts, 10 min) ; descendre à Aomi",
            "10 min à pied jusqu'à l'Unicorn Gundam (DiverCity)",
          ],
          maps: M + "origin=Toyosu+Station,+Tokyo&destination=Unicorn+Gundam+Statue+DiverCity+Tokyo+Plaza&travelmode=transit",
        },
        {
          type: "lieu", moment: "Soir", titre: "Odaiba et Unicorn Gundam", photo: "photos/odaiba.webp", prix: { texte: "Quartier gratuit" }, q: "Unicorn Gundam Statue, DiverCity Tokyo Plaza",
          duree: "2 h à 3 h",
          description: "Île artificielle développée comme quartier de loisirs et de technologies. La statue Unicorn Gundam grandeur nature fait référence à la franchise de science-fiction japonaise.",
          aFaire: "Voir la statue ; explorer DiverCity ; marcher vers le front de mer ; photographier la baie et les ponts illuminés.",
          aVerifier: ["Horaires d'illumination"],
        },
      ],
    },
    {
      n: 8, photo: "photos/jour-08.webp", date: "2026-12-07", ville: "Tokyo", hotel: "tokyo",
      titre: "Tokyo DisneySea", resume: "Journée complète à DisneySea",
      etapes: [
        {
          type: "trajet", heure: "06:49", arrivee: "07:50", titre: "Hôtel → DisneySea", total: "61 min", prix: { yen: 710, pour: "par pers." },
          pas: [
            "14 min à pied jusqu'à Ichigaya Station",
            "Ligne Yūrakuchō (10 arrêts, 20 min) ; descendre à Shin-Kiba ; 2 min à pied",
            "Ligne Keiyō direction Soga (2 arrêts, 6 min) ; descendre à Maihama ; 4 min à pied (Resort Gateway)",
            "Disney Resort Line (3 arrêts, 9 min) ; descendre à Tokyo DisneySea Station (1 min à pied)",
          ],
          maps: M + HOTEL_TOKYO + "&destination=Tokyo+DisneySea&travelmode=transit",
        },
        {
          type: "lieu", moment: "Journée", titre: "Tokyo DisneySea", photo: "photos/disneysea.webp", prix: { yen: 21800, pour: "pour 2", reserve: true, eurCarnet: 122.28 }, q: "Tokyo DisneySea",
          duree: "Journée",
          description: "Parc à thème ouvert en 2001, conçu autour de ports imaginaires et d'aventures maritimes. Il se distingue des parcs Disney classiques par son architecture et ses univers thématiques.",
          aFaire: "Explorer les ports thématiques ; découvrir Mediterranean Harbor, Mysterious Island et Fantasy Springs selon l'accès et les disponibilités ; consulter l'application officielle pour les temps d'attente et les accès aux attractions.",
          conseil: "Télécharger l'application officielle.",
          notes: [
            "Priorité aux attractions « Voyage au centre de la Terre » et « Toy Story Mania »",
            "Faire l'attraction Sindbad",
            "Choisir un joli bucket à pop-corn (différents selon les Lands) et goûter les pop-corn de tous les goûts",
          ],
          manque: ["Horaires d'ouverture du parc"],
        },
      ],
    },
    {
      n: 9, photo: "photos/jour-09.webp", date: "2026-12-08", ville: "Tokyo", hotel: "tokyo",
      titre: "Yanaka, Nezu, Gōtokuji", resume: "Yanaka Ginza · Nezu-jinja · Gōtokuji (temple des chats)",
      etapes: [
        {
          type: "trajet", heure: "08:31", arrivee: "09:13", titre: "Hôtel → Yanaka Ginza", total: "42 min", prix: { yen: 210, pour: "par pers." },
          pas: [
            "15 min à pied jusqu'à Ichigaya Station",
            "Ligne Chūō-Sōbu (4 arrêts, 9 min) ; descendre à Akihabara ; 1 min à pied",
            "Ligne Yamanote direction Ueno (4 arrêts, 8 min) ; descendre à Nippori",
            "7 min à pied jusqu'à Yanaka Ginza",
          ],
          maps: M + HOTEL_TOKYO + "&destination=Yanaka+Ginza,+Taito+City,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Yanaka Ginza", photo: "photos/yanaka.webp", prix: { texte: "Quartier gratuit" }, q: "Yanaka Ginza, Taito City, Tokyo",
          duree: "1 h 30 à 2 h",
          description: "Yanaka est apprécié pour son ambiance de quartier ancien, ses petites rues et son patrimoine préservé en partie des grandes transformations urbaines du XXe siècle.",
          aFaire: "Descendre les escaliers Yūyake Dandan ; parcourir les boutiques ; goûter des snacks ; observer les petites maisons et temples du quartier.",
          conseil: "Certaines boutiques n'ouvrent qu'en fin de matinée.",
        },
        {
          type: "trajet", moment: "Matin", titre: "Yanaka → Nezu-jinja", total: "14 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["14 min à pied (1,0 km) depuis Yanaka Ginza, par Shinobazu-dōri (itinéraire plat)"],
          maps: M + "origin=Yanaka+Ginza,+Taito+City,+Tokyo&destination=Nezu+Shrine,+Bunkyo+City,+Tokyo&travelmode=walking",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Nezu-jinja", photo: "photos/nezu.webp", prix: { texte: "Gratuit" }, q: "Nezu Shrine, Bunkyo City, Tokyo",
          duree: "45 min à 1 h",
          description: "Sanctuaire shinto réputé pour ses bâtiments de l'époque Edo et ses allées de petits torii vermillon. Son festival des azalées est surtout célèbre au printemps.",
          aFaire: "Découvrir les pavillons ; traverser les torii ; photographier les jardins ; profiter de l'atmosphère calme.",
          conseil: "Le lieu se combine bien avec Yanaka à pied.",
        },
        {
          type: "trajet", heure: "13:00", arrivee: "13:54", indicatif: true, titre: "Nezu → Gōtokuji", total: "54 min", prix: { yen: 430, pour: "par pers." },
          pas: [
            "7 min à pied jusqu'à Nezu Station",
            "Ligne Chiyoda (13 arrêts, 25 min) ; descendre à Yoyogi-Uehara ; 1 min à pied",
            "Ligne Odakyū (5 arrêts, 7 min) ; descendre à Gōtokuji",
            "14 min à pied jusqu'à Gōtoku-ji",
          ],
          maps: M + "origin=Nezu+Shrine,+Bunkyo+City,+Tokyo&destination=Gotokuji+Temple,+Setagaya,+Tokyo&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Gōtokuji : temple des chats", photo: "photos/gotokuji.webp", prix: { texte: "Gratuit" }, q: "Gotokuji Temple, Setagaya, Tokyo",
          duree: "1 h à 1 h 30",
          description: "Temple bouddhiste lié à la famille Ii. Une tradition locale associe le lieu à l'histoire d'un chat ayant attiré un seigneur à l'abri de l'orage, l'une des origines racontées du maneki-neko.",
          aFaire: "Voir les centaines de figurines de chats offertes en ex-voto ; parcourir les bâtiments et le cimetière historique ; acheter éventuellement un maneki-neko au temple.",
          conseil: "Respecter les zones interdites aux photos et ne pas déplacer les figurines.",
          aVerifier: ["Classé « Soir » dans le carnet alors que le trajet arrive à 13h54"],
          manque: ["Horaires d'ouverture du temple"],
        },
      ],
    },
    {
      n: 10, photo: "photos/jour-10.webp", date: "2026-12-09", ville: "Kawaguchiko", hotel: "fuji",
      titre: "Tokyo → mont Fuji", resume: "Fuji Excursion · lac Kawaguchi",
      etapes: [
        {
          type: "trajet", heure: "07:30", arrivee: "10:26", titre: "Tokyo → Kawaguchiko (Fuji Excursion)", total: "3 h",
          prix: { yen: 8400, pour: "par pers.", reserve: true, eurCarnet: 47.33 },
          pas: [
            "17 min à pied jusqu'à Akebonobashi Station",
            "Ligne Shinjuku (2 arrêts, 4 min) ; descendre à Shinjuku (arrivée 7h51)",
            "Fuji Excursion : départ visé 8h30",
            "Descendre à Kawaguchiko (arrivée vers 10h26)",
          ],
          notes: ["Billets Fuji Excursion réservés, sièges réservés", "Retirer les billets à une borne JR East compatible"],
          aVerifier: [PRIX_RESERVE],
          manque: ["Numéros de sièges"],
          maps: M + HOTEL_TOKYO + "&destination=Kawaguchiko+Station&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Lac Kawaguchi et mont Fuji", photo: "photos/kawaguchi.webp", prix: { texte: "Gratuit" }, q: "Lake Kawaguchi, Fujikawaguchiko",
          duree: "2 h à 4 h",
          description: "Le mont Fuji, volcan culminant à 3 776 m, est un symbole majeur du Japon et un site inscrit au patrimoine mondial de l'UNESCO pour sa dimension culturelle. Kawaguchiko est l'un des cinq lacs du Fuji.",
          aFaire: "Marcher sur les berges ; chercher les points de vue ; visiter un café ou un musée si le temps est couvert ; photographier le Fuji lorsque le ciel se dégage.",
          conseil: "En décembre, prévoir un vrai manteau et une marge météo.",
          notes: ["Après-midi et soirée sur place"],
        },
      ],
    },
    {
      n: 11, photo: "photos/jour-11.webp", date: "2026-12-10", ville: "Fuji → Kyoto", hotel: "kyoto",
      titre: "Chūreitō → Mishima → Kyoto", resume: "Pagode Chūreitō · bus 12h20 · Shinkansen 15h46",
      etapes: [
        {
          type: "trajet", heure: "06:46", arrivee: "07:34", indicatif: true, titre: "Hôtel Fuji → Chūreitō", total: "48 min", prix: { yen: 310, pour: "par pers." },
          pas: [
            "14 min à pied jusqu'à Kawaguchiko Station",
            "Ligne Fujikyūkō (4 arrêts, 13 min) ; descendre à Shimoyoshida",
            "21 min à pied (1,2 km) jusqu'à Chūreitō",
          ],
          notes: ["Montée d'escaliers"],
          aVerifier: ["Météo à vérifier le matin même"],
          maps: M + "origin=2090+Funatsu,+Fujikawaguchiko,+Yamanashi&destination=Chureito+Pagoda&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Pagode Chūreitō", photo: "photos/chureito.webp", prix: { texte: "Gratuit" }, q: "Chureito Pagoda",
          duree: "1 h 30 à 2 h",
          description: "La pagode à cinq étages de Chūreitō, dans le parc Arakurayama Sengen, est un monument commémoratif construit au XXe siècle. Sa vue avec le Fuji est devenue une image emblématique du Japon.",
          aFaire: "Monter les nombreux escaliers ; admirer la pagode ; chercher le point de vue sur le Fuji ; visiter le sanctuaire en contrebas.",
          conseil: "Très sensible à la météo ; ne pas sacrifier le bus de 12h20.",
        },
        {
          type: "trajet", heure: "09:42", arrivee: "10:12", titre: "Chūreitō → Kawaguchiko", total: "30 min", prix: { yen: 310, pour: "par pers." },
          pas: [
            "17 min à pied jusqu'à Shimoyoshida Station",
            "Ligne Fujikyūkō (4 arrêts, 13 min) ; descendre à Kawaguchiko",
          ],
          notes: ["Bagages à récupérer à l'hôtel (14 min à pied) avant 12h20"],
          maps: M + "origin=Chureito+Pagoda&destination=Kawaguchiko+Station&travelmode=transit",
        },
        { type: "info", heure: "11:50", titre: "Être à la gare routière de Kawaguchiko", notes: ["Bus à 12h20, avec les bagages"] },
        {
          type: "trajet", heure: "12:20", arrivee: "13:50", titre: "Kawaguchiko → Mishima (bus)", total: "91 min",
          prix: { yen: 5000, pour: "par pers.", reserve: true, eurCarnet: 28.02 },
          pas: [
            "Bus Express « Mishima Kawaguchiko Liner »",
            "Descendre à Mishima Station, sortie nord (13h50)",
          ],
          notes: ["Billets de bus réservés — places 04A & 04B"],
          aVerifier: [PRIX_RESERVE],
          maps: M + "origin=Kawaguchiko+Station&destination=Mishima+Station&travelmode=transit",
        },
        {
          type: "trajet", heure: "15:46", arrivee: "17:37", titre: "Mishima → Kyoto (Shinkansen Hikari 717)", total: "111 min",
          prix: { yen: 21820, pour: "par pers.", reserve: true, eurCarnet: 122.93 },
          pas: [
            "Environ 1 h 56 d'attente à Mishima après le bus",
            "Rejoindre le quai Shinkansen à Mishima Station",
            "Shinkansen Hikari 717 (4 arrêts, 1 h 51)",
            "Descendre à Kyoto Station (arrivée 17h37)",
          ],
          notes: ["Billets réservés — voiture 6, places 20D et 20E, espace bagages volumineux"],
          aVerifier: [PRIX_RESERVE],
          maps: M + "origin=Mishima+Station&destination=Kyoto+Station&travelmode=transit",
        },
        {
          type: "trajet", heure: "17:37", titre: "Gare de Kyoto → hôtel Forza", total: "12 min", prix: { yen: 220, pour: "par pers." },
          pas: [
            "Métro Karasuma direction Kokusai Kaikan (2 arrêts, env. 3 min) ; descendre à Shijō",
            "Suivre le passage souterrain Shijō jusqu'à la sortie 11",
            "Rejoindre l'Hotel Forza (env. 7 min à pied)",
          ],
          maps: M + "origin=Kyoto+Station&destination=" + FORZA + "&travelmode=transit",
        },
        { type: "info", moment: "Soir", titre: "Soirée à Kyoto" },
      ],
    },
    {
      n: 12, photo: "photos/jour-12.webp", date: "2026-12-11", ville: "Kyoto", hotel: "kyoto",
      titre: "Higashiyama et Gion", resume: "Kiyomizu-dera · Sannenzaka · Kōdai-ji illuminé · Gion",
      etapes: [
        {
          type: "trajet", moment: "Matin", titre: "Hôtel → Kiyomizu-dera", total: "22 min", prix: { yen: 230, pour: "par pers." },
          pas: [
            "4 min à pied jusqu'à l'arrêt Shijō Kawaramachi",
            "Bus 83A (4 arrêts, 7 min) ; descendre à Kiyomizumichi",
            "11 min à pied (650 m) jusqu'à Kiyomizu-dera",
          ],
          manque: ["Heure de départ (aucun horaire ce jour-là dans le carnet)"],
          maps: M + "origin=" + FORZA + "&destination=Kiyomizu-dera&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Kiyomizu-dera", photo: "photos/kiyomizu.webp", prix: { yen: 500 }, q: "Kiyomizu-dera, Kyoto",
          horaires: "6h00 – 18h00", duree: "1 h 30 à 2 h",
          description: "Temple bouddhiste fondé à la fin du VIIIe siècle, célèbre pour sa grande terrasse en bois dominant Kyoto. Il fait partie des monuments historiques de l'ancienne Kyoto inscrits à l'UNESCO.",
          aFaire: "Voir la terrasse ; observer la ville ; découvrir les bâtiments et la cascade Otowa ; admirer les couleurs de saison.",
          conseil: "Venir très tôt, avant les groupes et la foule des ruelles.",
        },
        {
          type: "trajet", moment: "Matin", titre: "Kiyomizu-dera → Sannenzaka", total: "3 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["3 min à pied (240 m), par Matsubara-dōri et Kiyomizu-zaka, en descente"],
          notes: ["Ninenzaka prolonge Sannenzaka juste après, sur le même parcours"],
          maps: M + "origin=Kiyomizu-dera&destination=Sannenzaka,+Kyoto&travelmode=walking",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Sannenzaka et Ninenzaka", photo: "photos/sannenzaka.webp", prix: { texte: "Gratuit" }, q: "Sannenzaka, Kyoto",
          horaires: "Ruelles en accès libre", duree: "1 h 30 à 2 h",
          description: "Ces ruelles en pente du quartier de Higashiyama conservent une atmosphère traditionnelle avec maisons de bois, échoppes et salons de thé. Selon une croyance populaire, trébucher sur la Sannenzaka porte malheur pendant trois ans.",
          aFaire: "Se promener dans Sannenzaka et Ninenzaka ; photographier les rues ; goûter des douceurs au matcha ; acheter un petit souvenir artisanal.",
          conseil: "Éviter de bloquer les passages pour les photos.",
        },
        {
          type: "trajet", moment: "Après-midi", titre: "Sannenzaka → Kōdai-ji", total: "7 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["7 min à pied (450 m), par Sannenzaka puis Ninenzaka, ruelles en pente"],
          notes: ["Déjeuner à Higashiyama ; Kōdai-ji illuminé après 17h"],
          maps: M + "origin=Sannenzaka,+Kyoto&destination=Kodaiji+Temple,+Kyoto&travelmode=walking",
        },
        {
          type: "lieu", heure: "17:00", titre: "Kōdai-ji (illuminations)", prix: { yen: 800 }, q: "Kodaiji Temple, Kyoto",
          horaires: "Illuminations du 23/10 au 13/12 : dès 17h, jusqu'à 22h (entrée avant 21h30)", duree: "45 min à 1 h 15",
          description: "Fondé au début du XVIIe siècle par Nene en mémoire de Toyotomi Hideyoshi, Kōdai-ji associe jardins zen, bâtiments historiques et bambouseraie. Nene y vécut ensuite comme nonne bouddhiste.",
          aFaire: "Découvrir les jardins illuminés, les reflets de l'étang et les projections lumineuses ; voir la bambouseraie ; poursuivre vers Gion.",
          conseil: "Visite de nuit le 11 décembre, puis Gion.",
          aVerifier: ["Long creux entre Sannenzaka (fin de matinée) et l'ouverture des illuminations à 17h : aucun horaire prévu dans le carnet"],
        },
        {
          type: "trajet", moment: "Soir", titre: "Kōdai-ji → Yasaka-jinja", total: "6 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["6 min à pied (500 m), par Shimogawara-dōri (8 min par Nene-no-michi)", "Arrivée à Yasaka-jinja, entrée du quartier de Gion"],
          notes: ["Dîner : choisir un restaurant avant l'heure du repas"],
          maps: M + "origin=Kodaiji+Temple,+Kyoto&destination=Yasaka+Shrine,+Kyoto&travelmode=walking",
        },
        {
          type: "lieu", moment: "Soir", titre: "Yasaka-jinja, Gion et Ponto-chō", photo: "photos/gion.webp", prix: { texte: "Gratuit" }, q: "Yasaka Shrine, Kyoto",
          horaires: "Enceinte ouverte 24 h/24", duree: "2 h à 3 h",
          description: "Yasaka est un sanctuaire majeur de Kyoto associé au festival Gion Matsuri. Gion est le quartier traditionnel des arts du spectacle, tandis que Ponto-chō est connu pour ses ruelles et ses restaurants.",
          aFaire: "Voir Yasaka illuminé ; marcher dans Hanamikoji avec discrétion ; traverser la rivière Kamo ; dîner dans Ponto-chō.",
          conseil: "Respecter geiko et maiko, sans les suivre pour une photo.",
        },
      ],
    },
    {
      n: 13, photo: "photos/jour-13.webp", date: "2026-12-12", ville: "Kyoto", hotel: "kyoto",
      titre: "Fushimi Inari et Pavillon d'or", resume: "Fushimi Inari · Kinkaku-ji · Nishiki Market",
      etapes: [
        {
          type: "trajet", heure: "07:30", arrivee: "07:53", indicatif: true, titre: "Hôtel → Fushimi Inari", total: "23 min", prix: { yen: 240, pour: "par pers." },
          pas: [
            "11 min à pied (650 m) jusqu'à Gion-Shijō Station",
            "Ligne Keihan direction Yodoyabashi (5 arrêts, 8 min) ; descendre à Fushimi-Inari",
            "4 min à pied (350 m) jusqu'à Fushimi Inari-taisha",
          ],
          notes: ["Départ tôt pour éviter la foule"],
          maps: M + "origin=" + FORZA + "&destination=Fushimi+Inari+Taisha&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Fushimi Inari Taisha", photo: "photos/fushimi-inari.webp", prix: { texte: "Gratuit" }, q: "Fushimi Inari Taisha, Kyoto",
          horaires: "Enceinte ouverte 24 h/24", duree: "1 h 30 à 2 h 30 (montée partielle)",
          description: "Sanctuaire principal du culte d'Inari, associé au riz, à la prospérité et aux activités économiques. Ses milliers de torii ont été offerts par des particuliers et des entreprises.",
          aFaire: "Traverser les allées de torii ; voir les statues de renards messagers ; monter jusqu'à un belvédère ; découvrir les petits sanctuaires.",
          conseil: "Partir très tôt ; garder des forces pour Kinkaku-ji.",
        },
        {
          type: "trajet", heure: "11:06", arrivee: "11:55", titre: "Fushimi Inari → Kinkaku-ji", total: "49 min", prix: { yen: 640, pour: "par pers." },
          pas: [
            "2 min à pied jusqu'à Inari Station",
            "Ligne JR Nara (2 arrêts, 5 min) ; descendre à Kyoto Station ; 3 min à pied",
            "Ligne Karasuma (7 arrêts, 13 min) ; descendre à Kitaōji",
            "Bus 25, 204 ou 205 (env. 11-15 min) ; descendre à Kinkakuji-michi ; 3 min à pied",
          ],
          notes: ["Trajet transversal : prévoir un déjeuner avant ou après"],
          maps: M + "origin=Fushimi+Inari+Taisha&destination=Kinkaku-ji&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Kinkaku-ji, le Pavillon d'or", photo: "photos/kinkaku-ji.webp", prix: { yen: 500 }, q: "Kinkaku-ji, Kyoto",
          horaires: "9h00 – 17h00 (tous les jours)", duree: "45 min à 1 h 15",
          description: "Le Pavillon d'or fut construit à la fin du XIVe siècle comme villa de retraite du shogun Ashikaga Yoshimitsu. Devenu temple zen, il a été reconstruit en 1955 après un incendie.",
          aFaire: "Faire le circuit autour de l'étang ; admirer les reflets du pavillon doré ; découvrir les jardins ; déguster éventuellement un thé.",
          conseil: "Parcours à sens unique ; prévoir des espèces.",
        },
        {
          type: "trajet", heure: "14:32", arrivee: "15:14", titre: "Kinkaku-ji → Nishiki Market", total: "42 min", prix: { yen: 230, pour: "par pers." },
          pas: [
            "3 min à pied (180 m) jusqu'à l'arrêt Kinkakuji-michi",
            "Bus 59 direction Sanjō Keihan (18 arrêts, 33 min) ; descendre à Shijō Kawaramachi",
            "6 min à pied (450 m)",
          ],
          notes: ["Nishiki : beaucoup d'étals ferment vers 17h-18h"],
          maps: M + "origin=Kinkaku-ji&destination=Nishiki+Market,+Kyoto&travelmode=transit",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Nishiki Market et Kawaramachi", photo: "photos/nishiki.webp", prix: { texte: "Gratuit" }, q: "Nishiki Market, Kyoto",
          horaires: "Variable selon les étals (environ 9h – 18h)", duree: "1 h à 2 h",
          description: "Rue commerçante historique de Kyoto, connue pour ses produits alimentaires, ses condiments, ses pickles et ses spécialités locales. Kawaramachi est le cœur commerçant voisin.",
          aFaire: "Goûter des spécialités ; chercher des souvenirs gourmands ; explorer les galeries couvertes ; dîner près de l'hôtel.",
          conseil: "Beaucoup d'étals ferment tôt : y aller en début d'après-midi.",
          aVerifier: ["Classé « Soir » dans le carnet, alors que l'arrivée est prévue à 15h14 et que les étals ferment vers 17h-18h"],
        },
      ],
    },
    {
      n: 14, photo: "photos/jour-14.webp", date: "2026-12-13", ville: "Nara", hotel: "kyoto",
      titre: "Excursion à Nara", resume: "Parc de Nara · Tōdai-ji · Kasuga-taisha",
      etapes: [
        {
          type: "trajet", heure: "08:00", arrivee: "09:01", indicatif: true, titre: "Kyoto → Nara", total: "61 min", prix: { yen: 1020, pour: "par pers.", texte: "à partir de" },
          pas: [
            "10 min à pied (600 m) jusqu'à Shijō Station",
            "Ligne Karasuma (métro) (6 arrêts, 10 min)",
            "Si train direct : même rame sur la ligne Kintetsu-Kyoto (9 arrêts, 39 min)",
            "Descendre à Kintetsu-Nara",
          ],
          maps: M + "origin=" + FORZA + "&destination=Nara+Park&travelmode=transit",
        },
        {
          type: "trajet", moment: "Matin", titre: "Gare de Nara → Tōdai-ji", total: "19 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["19 min à pied (1,3 km) depuis Kintetsu-Nara, par Noborioji-dōri, à travers le parc aux cerfs"],
          notes: ["Le parc de Nara se visite en chemin"],
          maps: M + "origin=Kintetsu-Nara+Station&destination=Todai-ji+Daibutsuden&travelmode=walking",
        },
        {
          type: "lieu", moment: "Matin", titre: "Parc de Nara", photo: "photos/nara.webp", prix: { texte: "Gratuit" }, q: "Nara Park",
          horaires: "Parc en accès libre", duree: "1 h à 1 h 30",
          description: "Le parc abrite des cerfs considérés comme les messagers des divinités dans la tradition shinto locale. Il relie plusieurs sites majeurs, comme Tōdai-ji et Kasuga-taisha.",
          aFaire: "Se promener dans le parc ; observer les cerfs avec prudence ; acheter les biscuits officiels si l'on souhaite les nourrir.",
          conseil: "Les cerfs sont insistants avec la nourriture ; rester calme.",
        },
        {
          type: "lieu", moment: "Matin", titre: "Tōdai-ji", photo: "photos/todai-ji.webp", prix: { yen: 800 }, q: "Todai-ji Daibutsuden, Nara",
          horaires: "8h00 – 17h00", duree: "1 h 15 à 1 h 45",
          description: "Fondé au VIIIe siècle, Tōdai-ji est l'un des grands temples bouddhistes du Japon. Sa salle principale abrite le grand Bouddha, parmi les statues les plus célèbres du pays.",
          aFaire: "Entrer dans la grande salle ; admirer le Bouddha ; observer la porte Nandaimon ; flâner autour du temple.",
          conseil: "Arriver tôt ; billet à régler sur place.",
        },
        {
          type: "trajet", moment: "Après-midi", titre: "Tōdai-ji → Kasuga-taisha", total: "11 min", prix: { texte: "À pied (0 ¥)" },
          pas: ["11 min à pied (850 m), chemin direct par le parc"],
          notes: ["Prévoir un déjeuner à Nara avant Kasuga-taisha"],
          maps: M + "origin=Todai-ji+Daibutsuden&destination=Kasuga-taisha+Shrine,+Nara&travelmode=walking",
        },
        {
          type: "lieu", moment: "Après-midi", titre: "Kasuga-taisha", photo: "photos/kasuga.webp", prix: { texte: "Enceinte gratuite · intérieur payant (700 ¥)" }, q: "Kasuga-taisha Shrine, Nara",
          horaires: "7h00 – 17h00 (novembre à février)", duree: "1 h à 1 h 30",
          description: "Fondé au VIIIe siècle, Kasuga-taisha est célèbre pour ses milliers de lanternes en bronze et en pierre. Le sanctuaire est lié à la famille Fujiwara.",
          aFaire: "Marcher dans les allées de lanternes ; découvrir les petits sanctuaires ; observer l'architecture rouge ; profiter de la forêt autour.",
        },
        {
          type: "trajet", heure: "16:32", arrivee: "17:51", indicatif: true, titre: "Nara → hôtel (Kyoto)", total: "79 min", prix: { yen: 1020, pour: "par pers." },
          pas: [
            "14 min à pied (900 m) jusqu'à Kintetsu-Nara",
            "Kintetsu-Kyoto express (9 arrêts, 42 min) jusqu'à Takeda ; 1 min à pied",
            "Ligne Karasuma (6 arrêts, 9 min) jusqu'à Shijō",
            "Rejoindre l'hôtel à pied depuis Shijō",
          ],
          notes: ["À adapter selon la fin de la visite"],
          maps: M + "origin=Kasuga-taisha+Shrine,+Nara&destination=" + FORZA + "&travelmode=transit",
        },
      ],
    },
    {
      n: 15, photo: "photos/jour-15.webp", date: "2026-12-14", ville: "Kyoto → Osaka", hotel: "osaka",
      titre: "Arashiyama puis Osaka", resume: "Forêt de bambous · Kyoto → Osaka · Dōtonbori",
      etapes: [
        {
          type: "trajet", heure: "07:37", arrivee: "08:23", indicatif: true, titre: "Hôtel → Arashiyama", total: "46 min", prix: { yen: 420, pour: "par pers." },
          pas: [
            "4 min à pied (270 m) jusqu'à Kyoto-Kawaramachi Station",
            "Hankyū Kyoto (3 arrêts, 5 min) jusqu'à Saiin",
            "2 min à pied jusqu'à Sai Station",
            "Randen (11 arrêts, 21 min) jusqu'à Arashiyama",
            "11 min à pied (800 m) jusqu'à la forêt de bambous",
          ],
          notes: ["Départ tôt pour devancer les groupes"],
          maps: M + "origin=" + FORZA + "&destination=Arashiyama+Bamboo+Grove&travelmode=transit",
        },
        {
          type: "lieu", moment: "Matin", titre: "Forêt de bambous d'Arashiyama", prix: { texte: "Gratuit" }, q: "Arashiyama Bamboo Grove, Kyoto",
          horaires: "Forêt de bambous en accès libre", duree: "1 h 30 à 2 h",
          description: "Quartier de l'ouest de Kyoto, célèbre pour sa forêt de bambous, ses temples et ses paysages au bord de la rivière. L'ambiance y est plus naturelle que dans le centre-ville.",
          aFaire: "Marcher dans la forêt de bambous ; voir le pont Togetsukyō ; découvrir un temple ou un jardin proche ; garder du temps pour le retour.",
          conseil: "Arriver tôt ; récupérer les valises à l'hôtel ensuite.",
        },
        {
          type: "trajet", heure: "11:31", arrivee: "12:35", titre: "Arashiyama → hôtel", total: "64 min", prix: { yen: 230, pour: "par pers." },
          pas: [
            "7 min à pied (500 m) jusqu'à l'arrêt Nonomiya",
            "Bus 11 direction Sanjō Keihan (30 arrêts, 54 min) ; descendre à Shijō Kawaramachi",
            "3 min à pied (210 m) jusqu'à l'hôtel",
          ],
          notes: ["Récupérer les valises à l'hôtel avant le train pour Osaka"],
          maps: M + "origin=Arashiyama+Bamboo+Grove&destination=" + FORZA + "&travelmode=transit",
        },
        {
          type: "trajet", heure: "13:04", arrivee: "13:58", indicatif: true, titre: "Kyoto → Osaka", total: "54 min", prix: { yen: 410, pour: "par pers.", texte: "à partir de" },
          pas: [
            "6 min à pied (350 m) jusqu'à Kyoto-Kawaramachi Station",
            "Hankyū Kyoto, rapide limité (8 arrêts, 42 min) ; descendre à Osaka-Umeda",
            "6 min à pied (450 m) jusqu'à l'hôtel ibis Osaka Umeda",
          ],
          notes: ["Valises avec soi"],
          maps: M + "origin=" + FORZA + "&destination=Ibis+Osaka+Umeda&travelmode=transit",
        },
        {
          type: "trajet", heure: "17:30", arrivee: "17:53", titre: "Umeda → Dōtonbori", total: "23 min", prix: { yen: 240, pour: "par pers." },
          pas: [
            "7 min à pied (450 m) jusqu'à Umeda Station",
            "Ligne Midōsuji direction Tennōji (4 arrêts, 9 min) ; descendre à Namba",
            "7 min à pied (500 m) jusqu'à Dōtonbori",
          ],
          notes: ["Retour à l'hôtel par la même ligne Midōsuji"],
          maps: M + "origin=Ibis+Osaka+Umeda&destination=Dotonbori,+Osaka&travelmode=transit",
        },
        {
          type: "lieu", moment: "Soir", titre: "Dōtonbori et Namba", photo: "photos/dotonbori.webp", prix: { texte: "Gratuit" }, q: "Dotonbori, Osaka",
          horaires: "Quartier en accès libre", duree: "2 h à 3 h",
          description: "Le quartier animé d'Osaka, connu pour ses enseignes lumineuses, ses restaurants et sa cuisine de rue, notamment les takoyaki et les okonomiyaki.",
          aFaire: "Marcher le long du canal ; voir les grandes enseignes ; goûter des takoyaki ; dîner dans le secteur de Namba.",
          conseil: "Soirée légère : départ tôt demain pour l'aéroport.",
        },
      ],
    },
    {
      n: 16, photo: "photos/jour-16.webp", date: "2026-12-15", ville: "Osaka",
      titre: "Osaka → aéroport du Kansai", resume: "Bus limousine 8h50 · vol de 13h50",
      etapes: [
        { type: "info", heure: "08:15", titre: "Départ conseillé de l'hôtel", notes: ["Rejoindre à pied l'arrêt HANKYU SANBAN GAI (Osaka Station / Umeda)"] },
        {
          type: "trajet", heure: "08:50", arrivee: "09:50", titre: "Osaka → aéroport du Kansai (KIX)", total: "69 min", prix: { yen: 1800, pour: "par pers." },
          pas: [
            "Depuis l'ibis Osaka Umeda, rejoindre à pied l'arrêt HANKYU SANBAN GAI",
            "Kansai-Airport Limousine Bus direct (départ 8h50)",
            "Descendre au Terminal 1 de l'aéroport du Kansai (arrivée vers 9h50)",
          ],
          aVerifier: ["Le carnet indique « 69 minutes », mais 8h15 → 9h50 font 95 min (bus seul : 60 min)"],
          maps: M + "origin=Ibis+Osaka+Umeda&destination=Kansai+International+Airport&travelmode=transit",
        },
        {
          type: "info", heure: "13:50", titre: "Vol retour", notes: ["Enregistrement, puis vol de 13h50"],
          manque: ["Détails du vol retour (compagnie, escale, heure d'arrivée)"],
        },
      ],
    },
  ],

  /* ---------------------- Taxi : adresses en japonais ---------------------
     Le carnet ne contient aucune adresse en japonais : elles sont transcrites
     ici à partir des adresses en romaji. « aVerifier: true » = à comparer avec
     la confirmation de réservation avant le départ.                          */
  adresses: [
    {
      ville: "Tokyo",
      lieux: [
        { fr: "Hôtel de Tokyo (Ichigaya Stay)", ja: "東京都新宿区市谷加賀町2-3-4", romaji: "Tōkyō-to Shinjuku-ku Ichigaya-Kagachō 2-3-4", hotel: true, aVerifier: true },
        { fr: "Aéroport de Haneda — Terminal 3", ja: "羽田空港 第3ターミナル", romaji: "Haneda Kūkō, Dai-san Tāminaru" },
        { fr: "Gare de Shinjuku", ja: "新宿駅", romaji: "Shinjuku-eki" },
        { fr: "Gare d'Ichigaya", ja: "市ケ谷駅", romaji: "Ichigaya-eki" },
        { fr: "Sensō-ji (Asakusa)", ja: "浅草寺", romaji: "Sensō-ji" },
        { fr: "Shinjuku Gyoen", ja: "新宿御苑", romaji: "Shinjuku Gyoen" },
        { fr: "Musée Ghibli (Mitaka)", ja: "三鷹の森ジブリ美術館", romaji: "Mitaka no Mori Jiburi Bijutsukan" },
        { fr: "Meiji-jingū", ja: "明治神宮", romaji: "Meiji Jingū" },
        { fr: "teamLab Planets (Toyosu)", ja: "チームラボプラネッツ TOKYO DMM", adresse: "東京都江東区豊洲6-1-16", romaji: "Chīmurabo Puranettsu — Toyosu 6-1-16", aVerifier: true },
        { fr: "Tokyo DisneySea", ja: "東京ディズニーシー", romaji: "Tōkyō Dizunī Shī" },
        { fr: "Gōtokuji (temple des chats)", ja: "豪徳寺", romaji: "Gōtoku-ji" },
      ],
    },
    {
      ville: "Mont Fuji",
      lieux: [
        { fr: "Sawa Hotel (Kawaguchiko)", ja: "サワホテル", adresse: "〒401-0301 山梨県南都留郡富士河口湖町船津2090", romaji: "Sawa Hoteru — Yamanashi-ken, Fujikawaguchiko-machi, Funatsu 2090", hotel: true, aVerifier: true },
        { fr: "Gare de Kawaguchiko (trains et bus)", ja: "河口湖駅", romaji: "Kawaguchiko-eki" },
        { fr: "Pagode Chūreitō (parc Arakurayama Sengen)", ja: "新倉山浅間公園 忠霊塔", romaji: "Arakurayama Sengen Kōen, Chūreitō" },
        { fr: "Gare de Mishima — sortie nord (Shinkansen)", ja: "三島駅 北口", romaji: "Mishima-eki, Kita-guchi" },
      ],
    },
    {
      ville: "Kyoto et Nara",
      lieux: [
        { fr: "Hotel Forza Kyoto Shijo Kawaramachi", ja: "ホテルフォルツァ京都四条河原町", adresse: "京都府京都市下京区立売東町25-1", romaji: "Hoteru Forutsa Kyōto Shijō Kawaramachi — Shimogyō-ku, Tachiuri Higashimachi 25-1", hotel: true, aVerifier: true },
        { fr: "Gare de Kyoto", ja: "京都駅", romaji: "Kyōto-eki" },
        { fr: "Kiyomizu-dera", ja: "清水寺", romaji: "Kiyomizu-dera" },
        { fr: "Kōdai-ji", ja: "高台寺", romaji: "Kōdai-ji" },
        { fr: "Fushimi Inari Taisha", ja: "伏見稲荷大社", romaji: "Fushimi Inari Taisha" },
        { fr: "Kinkaku-ji (Pavillon d'or)", ja: "金閣寺", romaji: "Kinkaku-ji" },
        { fr: "Arashiyama — forêt de bambous", ja: "嵐山 竹林の小径", romaji: "Arashiyama, Chikurin no Komichi" },
        { fr: "Tōdai-ji (Nara)", ja: "東大寺", romaji: "Tōdai-ji" },
        { fr: "Gare Kintetsu-Nara", ja: "近鉄奈良駅", romaji: "Kintetsu Nara-eki" },
      ],
    },
    {
      ville: "Osaka",
      lieux: [
        { fr: "ibis Osaka Umeda", ja: "イビス大阪梅田", adresse: "大阪府大阪市北区小松原町1-5", romaji: "Ibisu Ōsaka Umeda — Kita-ku, Komatsubara-chō 1-5", hotel: true, aVerifier: true },
        { fr: "Dōtonbori", ja: "道頓堀", romaji: "Dōtonbori" },
        { fr: "Bus pour l'aéroport — Hankyu Sanbangai", ja: "阪急三番街 高速バスターミナル", romaji: "Hankyū Sanbangai Kōsoku Basu Tāminaru", aVerifier: true },
        { fr: "Aéroport du Kansai — Terminal 1", ja: "関西国際空港 第1ターミナル", romaji: "Kansai Kokusai Kūkō, Dai-ichi Tāminaru" },
      ],
    },
  ],
  phraseTaxi: { ja: "ここまでお願いします", romaji: "Koko made onegaishimasu", fr: "Emmenez-moi ici, s'il vous plaît" },

  /* -------------------------------- Phrases ------------------------------ */
  phrases: [
    {
      categorie: "Politesse",
      liste: [
        { fr: "Bonjour", ja: "こんにちは", romaji: "Konnichiwa" },
        { fr: "Bonjour (le matin)", ja: "おはようございます", romaji: "Ohayō gozaimasu" },
        { fr: "Bonsoir", ja: "こんばんは", romaji: "Konbanwa" },
        { fr: "Merci beaucoup", ja: "ありがとうございます", romaji: "Arigatō gozaimasu" },
        { fr: "Excusez-moi / pardon", ja: "すみません", romaji: "Sumimasen" },
        { fr: "S'il vous plaît", ja: "お願いします", romaji: "Onegaishimasu" },
        { fr: "Oui / Non", ja: "はい / いいえ", romaji: "Hai / Iie" },
        { fr: "Je ne comprends pas", ja: "わかりません", romaji: "Wakarimasen" },
        { fr: "Je ne parle pas japonais", ja: "日本語が話せません", romaji: "Nihongo ga hanasemasen" },
        { fr: "Parlez-vous anglais ?", ja: "英語を話せますか？", romaji: "Eigo o hanasemasu ka?" },
      ],
    },
    {
      categorie: "Restaurant",
      liste: [
        { fr: "Nous sommes deux", ja: "二人です", romaji: "Futari desu" },
        { fr: "Avez-vous un menu en anglais ?", ja: "英語のメニューはありますか？", romaji: "Eigo no menyū wa arimasu ka?" },
        { fr: "Ceci, s'il vous plaît (en montrant)", ja: "これをお願いします", romaji: "Kore o onegaishimasu" },
        { fr: "Que recommandez-vous ?", ja: "おすすめは何ですか？", romaji: "Osusume wa nan desu ka?" },
        { fr: "De l'eau, s'il vous plaît", ja: "お水をください", romaji: "Omizu o kudasai" },
        { fr: "L'addition, s'il vous plaît", ja: "お会計をお願いします", romaji: "Okaikei o onegaishimasu" },
        { fr: "Bon appétit (avant de manger)", ja: "いただきます", romaji: "Itadakimasu" },
        { fr: "C'était délicieux (en partant)", ja: "ごちそうさまでした", romaji: "Gochisōsama deshita" },
      ],
    },
    {
      categorie: "Transports",
      liste: [
        { fr: "Où est la gare ?", ja: "駅はどこですか？", romaji: "Eki wa doko desu ka?" },
        { fr: "Où sont les toilettes ?", ja: "トイレはどこですか？", romaji: "Toire wa doko desu ka?" },
        { fr: "Ce train va-t-il à … ?", ja: "この電車は…に行きますか？", romaji: "Kono densha wa … ni ikimasu ka?" },
        { fr: "Quel quai ?", ja: "何番線ですか？", romaji: "Nanbansen desu ka?" },
        { fr: "Un billet pour …, s'il vous plaît", ja: "…までの切符を一枚ください", romaji: "… made no kippu o ichimai kudasai" },
        { fr: "Je voudrais recharger ma carte Suica", ja: "Suicaにチャージしたいです", romaji: "Suika ni chāji shitai desu" },
        { fr: "À cette adresse, s'il vous plaît (taxi)", ja: "この住所までお願いします", romaji: "Kono jūsho made onegaishimasu" },
        { fr: "Arrêtez-vous ici, s'il vous plaît", ja: "ここで止めてください", romaji: "Koko de tomete kudasai" },
      ],
    },
    {
      categorie: "Urgences",
      liste: [
        { fr: "Au secours !", ja: "助けて！", romaji: "Tasukete!" },
        { fr: "Appelez une ambulance, s'il vous plaît", ja: "救急車を呼んでください", romaji: "Kyūkyūsha o yonde kudasai" },
        { fr: "Appelez la police, s'il vous plaît", ja: "警察を呼んでください", romaji: "Keisatsu o yonde kudasai" },
        { fr: "Je ne me sens pas bien", ja: "気分が悪いです", romaji: "Kibun ga warui desu" },
        { fr: "Où est l'hôpital ?", ja: "病院はどこですか？", romaji: "Byōin wa doko desu ka?" },
        { fr: "Où est la pharmacie ?", ja: "薬局はどこですか？", romaji: "Yakkyoku wa doko desu ka?" },
        { fr: "J'ai perdu mon passeport", ja: "パスポートをなくしました", romaji: "Pasupōto o nakushimashita" },
        { fr: "Je suis perdu(e)", ja: "道に迷いました", romaji: "Michi ni mayoimashita" },
      ],
    },
    {
      categorie: "Allergies",
      liste: [
        { fr: "Je suis allergique à …", ja: "…アレルギーがあります", romaji: "… arerugī ga arimasu" },
        { fr: "Est-ce que ça contient … ?", ja: "…は入っていますか？", romaji: "… wa haitte imasu ka?" },
        { fr: "Sans …, s'il vous plaît", ja: "…抜きでお願いします", romaji: "… nuki de onegaishimasu" },
        { fr: "Je ne mange pas de viande", ja: "肉は食べません", romaji: "Niku wa tabemasen" },
        { fr: "Arachides / fruits à coque", ja: "ピーナッツ / ナッツ", romaji: "Pīnattsu / Nattsu" },
        { fr: "Crevette / crabe (crustacés)", ja: "えび / かに", romaji: "Ebi / Kani" },
        { fr: "Œuf / lait", ja: "卵 / 牛乳", romaji: "Tamago / Gyūnyū" },
        { fr: "Blé / soja / sarrasin", ja: "小麦 / 大豆 / そば", romaji: "Komugi / Daizu / Soba" },
      ],
    },
    {
      categorie: "Achats",
      liste: [
        { fr: "Combien ça coûte ?", ja: "いくらですか？", romaji: "Ikura desu ka?" },
        { fr: "Je prends ça", ja: "これをください", romaji: "Kore o kudasai" },
        { fr: "Puis-je payer par carte ?", ja: "カードで払えますか？", romaji: "Kādo de haraemasu ka?" },
        { fr: "En détaxe, s'il vous plaît (tax free)", ja: "免税でお願いします", romaji: "Menzei de onegaishimasu" },
        { fr: "Puis-je essayer ?", ja: "試着してもいいですか？", romaji: "Shichaku shite mo ii desu ka?" },
        { fr: "Je regarde seulement", ja: "見ているだけです", romaji: "Mite iru dake desu" },
        { fr: "Pas besoin de sac", ja: "袋はいりません", romaji: "Fukuro wa irimasen" },
      ],
    },
  ],

  /* ------------------------------- Checklist ------------------------------
     « id » sert à mémoriser la case cochée : ne pas le changer, ne pas le dupliquer. */
  checklist: [
    {
      titre: "Avant le départ",
      liste: [
        { id: "passeport", texte: "Passeport valide (+ photo du passeport dans le téléphone)" },
        { id: "vjw", texte: "Visit Japan Web rempli : QR codes immigration et douane enregistrés" },
        { id: "suica", texte: "Carte Suica ou Pasmo ajoutée dans Wallet et rechargée" },
        { id: "esim", texte: "eSIM Japon achetée et installée" },
        { id: "adaptateur", texte: "Adaptateur de prise type A (2 broches plates)" },
        { id: "especes", texte: "Espèces en yens pour l'arrivée" },
        { id: "banque", texte: "Carte bancaire : plafonds et frais à l'étranger vérifiés" },
        { id: "assurance", texte: "Assurance voyage / assistance (numéro noté)" },
        { id: "train", texte: "Billets de train Nîmes → Barcelone (30/11, 17h46)" },
        { id: "vols", texte: "Billets d'avion aller et retour vérifiés" },
        { id: "resa-hotels", texte: "Réservations des 5 hôtels vérifiées (Sant Boi, Tokyo, Sawa Hotel, Forza Kyoto, ibis Osaka)" },
        { id: "resa-ghibli", texte: "Billets musée Ghibli (4/12) : heure du créneau à noter" },
        { id: "resa-teamlab", texte: "Billets teamLab Planets (6/12 à 8h30)" },
        { id: "resa-disney", texte: "Billets DisneySea (7/12) + application Tokyo Disney Resort installée" },
        { id: "resa-fuji", texte: "Fuji Excursion (9/12, 8h30) : réservation et QR de retrait" },
        { id: "resa-bus", texte: "Bus Mishima Kawaguchiko Liner (10/12, 12h20, places 04A & 04B)" },
        { id: "resa-shinkansen", texte: "Shinkansen Hikari 717 (10/12, 15h46, voiture 6, 20D et 20E)" },
        { id: "adresses-ja", texte: "Adresses japonaises des hôtels comparées aux confirmations de réservation" },
        { id: "trad-google", texte: "Google Traduction installée, japonais téléchargé hors ligne, caméra et conversation essayées une fois" },
        { id: "maps", texte: "Google Maps hors ligne (Tokyo, Kawaguchiko, Kyoto, Osaka)" },
        { id: "vetements", texte: "Vêtements chauds : doudoune, pulls, bonnet, gants, écharpe, coupe-vent" },
        { id: "chaussures", texte: "Chaussures très confortables, petit sac à dos, parapluie compact" },
        { id: "batterie", texte: "Batterie externe, câbles, médicaments habituels" },
      ],
    },
    {
      titre: "Sur place",
      liste: [
        { id: "sp-qr", texte: "Haneda : présenter le QR Visit Japan Web (immigration puis douane)" },
        { id: "sp-konbini", texte: "Repérer le konbini / 7-Eleven près de l'hôtel (distributeur de billets)" },
        { id: "sp-suica", texte: "Recharger la Suica quand le solde est bas" },
        { id: "sp-fuji-billets", texte: "Retirer les billets Fuji Excursion à une borne JR East (avant le 9/12)" },
        { id: "sp-toyosu", texte: "Vérifier les jours d'accès au marché de Toyosu (6/12)" },
        { id: "sp-odaiba", texte: "Vérifier les horaires d'illumination à Odaiba (6/12)" },
        { id: "sp-meteo-fuji", texte: "Vérifier la météo pour Chūreitō (matin du 10/12)" },
        { id: "sp-bagages-fuji", texte: "10/12 : récupérer les bagages au Sawa Hotel avant le bus de 12h20" },
        { id: "sp-especes-kyoto", texte: "Prévoir des espèces pour Kinkaku-ji et Tōdai-ji (billets sur place)" },
        { id: "sp-valises-kyoto", texte: "14/12 : laisser puis récupérer les valises à l'hôtel Forza avant Osaka" },
        { id: "sp-detaxe", texte: "Garder le passeport sur soi pour les achats en détaxe" },
        { id: "sp-export", texte: "Exporter régulièrement les dépenses (onglet Dépenses)" },
      ],
    },
  ],

  /* ------------------- Traduire : accès aux applis de traduction ----------
     L'appli ne traduit pas elle-même : elle ouvre Google Traduction. */
  traduire: {
    liens: [
      // Liens d'ouverture d'applis iPhone. « googletranslate:// » n'est pas documenté par Google : à tester.
      { titre: "Ouvrir Google Traduction", sous: "Appli iPhone · japonais → français", url: "googletranslate://?sl=ja&tl=fr" },
      { titre: "Google Traduction (site web)", sous: "Secours si les applis ne s'ouvrent pas · réseau requis", url: "https://translate.google.com/?sl=ja&tl=fr&op=images", secours: true },
    ],
    modes: [
      { titre: "Lire un menu, sans réseau", etapes: ["Ouvrir Google Traduction et toucher le bouton appareil photo", "Choisir japonais → français", "Viser le texte : la traduction s'affiche par-dessus"] },
      { titre: "Parler avec quelqu'un", etapes: ["Ouvrir Google Traduction et toucher « Conversation »", "Choisir français ⇄ japonais", "Toucher le micro, parler, puis tendre le téléphone"] },
      { titre: "Le plus rapide", etapes: ["L'appareil photo de l'iPhone reconnaît le texte : viser, toucher l'icône de texte en bas à droite, puis « Traduire »"] },
    ],
    note: "Hors ligne, ces applis ne fonctionnent que si le japonais a été téléchargé avant (voir la checklist).",
  },

  /* ------------------------ Urgences (bonus, hors carnet) ----------------- */
  urgences: [
    { nom: "Police", numero: "110", tel: "110", note: "Vol, agression, accident" },
    { nom: "Ambulance et pompiers", numero: "119", tel: "119", note: "Dire « kyūkyū desu » (ambulance) ou « kaji desu » (incendie)" },
    { nom: "Japan Visitor Hotline", numero: "050-3816-2787", tel: "+815038162787", note: "Office du tourisme (JNTO), 24 h/24, en anglais — numéro à vérifier avant le départ" },
    { nom: "Ambassade de France à Tokyo", numero: "03-5798-6000", tel: "+81357986000", note: "Perte de passeport, urgence consulaire — numéro à vérifier avant le départ" },
  ],

  /* ------------------ Météo typique de décembre (statique) ----------------
     Moyennes indicatives ; le texte général vient du carnet.               */
  meteo: {
    intro: "Fin novembre et début décembre, le Japon entre dans l'hiver : temps généralement sec et ensoleillé, matinées et soirées fraîches. Les températures varient entre 3 et 16 °C selon les régions et les moments de la journée.",
    villes: [
      { ville: "Tokyo", max: 12, min: 4, note: "Sec et ensoleillé, après-midis doux. Nuit vers 16h30." },
      { ville: "Kawaguchiko (Fuji)", max: 8, min: -3, note: "Proche de 0 °C, gel le matin. Le Fuji se voit surtout tôt, par ciel dégagé." },
      { ville: "Kyoto", max: 11, min: 3, note: "Plus froide que Tokyo, surtout le matin. Nuit vers 16h45." },
      { ville: "Nara", max: 11, min: 2, note: "Comme Kyoto, frais dans le parc à l'ombre." },
      { ville: "Osaka", max: 12, min: 5, note: "Après-midis relativement doux, soirées fraîches." },
    ],
    vetements: [
      "T-shirts ou hauts à manches longues pour la journée",
      "Pulls chauds ou polaires",
      "Doudoune ou manteau chaud",
      "Veste imperméable ou coupe-vent",
      "Pantalon confortable, chaussures très confortables",
      "Écharpe, bonnet, gants, parapluie compact, petit sac à dos",
    ],
  },
};

// Permet à test.js (Node) de lire ce fichier ; sans effet dans le navigateur.
if (typeof module !== "undefined") module.exports = TRIP;
