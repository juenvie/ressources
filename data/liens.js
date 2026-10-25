/* ============================================================
   JU.EN.VIE — AFFILIATE HUB
   FICHIER CENTRAL DES LIENS ET CODES

   C'est le SEUL fichier à modifier au quotidien.

   Pour activer un lien :
   1. Cherche le partenaire (Cmd+F sur son nom).
   2. Remplace la valeur `url` par ton vrai lien affilié.
   C'est tout. La carte passe automatiquement de « Bientôt »
   à active sur le site.

   Champs de chaque lien :
   - id            identifiant unique (kebab-case, jamais affiché)
   - nom           nom affiché du partenaire ou produit
   - categorie     "voyage" | "sport" | "creation"
   - sousCategorie une clé déclarée dans CATEGORIES ci-dessous
   - url           vrai lien affilié, ou placeholder "LIEN_A_REMPLIR_..."
   - codePromo     code de parrainage affiché et copiable, ou null
   - resume        une phrase factuelle sur le produit
   - accroche      TA phrase perso "Pourquoi je l'utilise".
                   Tant qu'elle commence par "[", elle n'est pas affichée.
   - badge         une clé de BADGES ci-dessous, ou null
   - icone         pictogramme de repli, utilisé si `logo` est absent ou introuvable.
                   Une clé de ICONES dans js/main.js : bouclier, signal, billet,
                   lit, sac, avion, echange, carte, graphique, batterie, prise,
                   livre, plan, boussole, chaussure, montre, feuille, eclair,
                   telephone, camera, drone, micro, palette, ciseaux, reglages
   - logo          chemin vers assets/logos/{id}.png, ou absent si pas de logo
                   (produit générique sans marque précise, ou marque à
                   déterminer : le site retombe alors sur `icone`)
   - statut        "actif" | "a-venir"
                   Note : un lien "actif" avec une url placeholder est
                   quand même affiché en « Bientôt », jamais de lien mort.
   - interne       true si l'url pointe vers une page du site (ex.
                   "guides.html") : la carte s'ouvre alors dans le même
                   onglet et sans rel="sponsored", réservé aux liens affiliés
   - libelleAction texte du bouton de la carte. Par défaut : "Voir le prix"
                   pour le matériel (bagages, chaussures, montres, audio,
                   accessoires, nutrition, récupération, matériel) et
                   "Découvrir" pour les services.

   LA FICHE DÉPLIABLE
   Ces champs alimentent le bloc « Mon avis en détail » sous la carte.
   Tous sont facultatifs et indépendants : un champ vide ou en brouillon
   ne s'affiche pas, et si aucun n'est rempli la fiche n'apparaît pas.
   Même règle que l'accroche : tant qu'un texte commence par "[", il est
   considéré comme un brouillon et reste invisible sur le site.

   - avis          ton avis développé, deux ou trois phrases à la première
                   personne. C'est le cœur de la fiche, et la seule chose
                   qu'aucun concurrent ne peut copier.
   - jeUtilisePour liste d'usages concrets ("filmer en marchant", "payer
                   en Asie sans frais"). Trois maximum, courts.
   - avantages     liste de ce que tu aimes. Déjà remplie de façon
                   factuelle, à corriger si ton expérience diffère.
   - inconvenients liste des limites. Toujours en mettre au moins une :
                   une fiche sans défaut ne convainc personne.
   - pourQui       une phrase, à qui ce produit s'adresse vraiment.
   - depuisQuand   preuve d'usage courte, affichée sous les badges
                   ("Utilisé depuis 2023", "Testé sur 8 pays").
   ============================================================ */

/* ------------------------------------------------------------
   RÉSEAUX SOCIAUX ET LIENS PERSO
   Affichés sur l'accueil et dans le footer de chaque page.
   Mets une vraie URL pour afficher le lien, laisse le
   placeholder pour le masquer temporairement.
   ------------------------------------------------------------ */
const RESEAUX = [
  { id: "instagram", nom: "Instagram", icone: "instagram", url: "https://www.instagram.com/ju.en.vie/" },
  { id: "tiktok",    nom: "TikTok",    icone: "tiktok", url: "https://www.tiktok.com/@juenvie" },
  { id: "facebook",  nom: "Facebook",  icone: "facebook", url: "https://www.facebook.com/profile.php?id=61575631193636" },
  { id: "youtube",   nom: "YouTube",   icone: "youtube", url: "https://www.youtube.com/@Ju.en.vie.75" },
  { id: "mail",      nom: "Contact",   icone: "mail", url: "LIEN_A_REMPLIR_MAILTO" },
  { id: "linkedin",  nom: "LinkedIn",  icone: "linkedin", url: "LIEN_A_REMPLIR_LINKEDIN" },
  /* Le portfolio n'est plus dans cette rangée : il est en anglais et destiné
     aux marques, pas aux abonnés. Le lien vit maintenant dans un encadré dédié
     en bas de la page À propos, là où une marque qui se renseigne va lire. */
  { id: "souvence",  nom: "Souvence",  icone: "livre", url: "LIEN_A_REMPLIR_SOUVENCE" },
];

/* ------------------------------------------------------------
   BADGES DISPONIBLES
   Utilise la clé (à gauche) dans le champ `badge` d'un lien.
   Le badge « Bientôt » est automatique, ne pas l'assigner.
   ------------------------------------------------------------ */
const BADGES = {
  "prefere":       { label: "Mon préféré",                     classe: "badge-prefere" },
  "qualite-prix":  { label: "Excellent rapport qualité prix",  classe: "badge-qualite-prix" },
  "debutant":      { label: "Débutant",                        classe: "badge-debutant" },
  "professionnel": { label: "Professionnel",                   classe: "badge-professionnel" },
  "plus-utilise":  { label: "Le plus utilisé",                 classe: "badge-plus-utilise" },
  "voyage":        { label: "Voyage",                          classe: "badge-voyage" },
  "running":       { label: "Running",                         classe: "badge-running" },
  "creation":      { label: "Création",                        classe: "badge-creation" },
};

/* ------------------------------------------------------------
   CATÉGORIES ET SOUS-CATÉGORIES
   L'ordre ici définit l'ordre d'affichage sur les pages.
   Pour ajouter une sous-catégorie : ajoute une ligne ici,
   puis utilise sa clé dans les liens concernés.
   ------------------------------------------------------------ */
const CATEGORIES = {
  voyage: {
    nom: "Voyage",
    emoji: "🌍",
    page: "voyage.html",
    description: "Réservations, connectivité, banques, assurances et bagages. Tout ce qui me permet de partir loin, longtemps, l'esprit léger.",
    sousCategories: {
      "comparatifs": "Mes comparatifs",
      "reservation": "Réservation et activités",
      "esim":        "eSIM et connectivité",
      "banque":      "Banques et argent",
      "assurance":   "Assurances voyage",
      "bagages":     "Bagages et accessoires",
      "souvenirs":   "Albums souvenirs",
      "guides":      "Mes guides de voyage",
    },
  },
  sport: {
    nom: "Sport",
    emoji: "🏃",
    page: "sport.html",
    description: "Chaussures, montres, nutrition et récupération. Le setup qui m'accompagne du footing du matin jusqu'à la ligne d'arrivée du marathon.",
    sousCategories: {
      "chaussures":   "Chaussures",
      "montres":      "Montres et data",
      "nutrition":    "Nutrition et hydratation",
      "recuperation": "Récupération",
      "applications": "Applications running",
    },
  },
  creation: {
    nom: "Création",
    emoji: "🎥",
    page: "creation.html",
    description: "Caméras, drone, micros, accessoires et logiciels. Tout le matériel derrière mes vidéos, du tournage au montage.",
    sousCategories: {
      "materiel":    "Matériel vidéo",
      "accessoires": "Accessoires",
      "logiciels":   "Logiciels et apps",
    },
  },
};

/* ------------------------------------------------------------
   LES LIENS
   Pour ajouter un produit : copie un bloc, change les valeurs.
   Il apparaîtra automatiquement au bon endroit.
   ------------------------------------------------------------ */
const LIENS = [

  /* ================= VOYAGE ================= */

  /* --- Mes comparatifs (pages du site, pas des partenaires) --- */
  {
    id: "comparatif-assurance",
    nom: "Quelle assurance voyage choisir",
    categorie: "voyage",
    sousCategorie: "comparatifs",
    url: "comparatif-assurance-voyage.html",
    interne: true,
    libelleAction: "Lire le comparatif",
    codePromo: null,
    resume: "Carte bancaire, plafonds, franchise, sports exclus : comment lire un contrat.",
    accroche: "[BROUILLON : Le poste où l'on économise cent euros et où l'on en perd dix mille.]",
    badge: null,
    icone: "bouclier",
    statut: "actif",
  },
  {
    id: "comparatif-esim",
    nom: "Quelle eSIM choisir",
    categorie: "voyage",
    sousCategorie: "comparatifs",
    url: "comparatif-esim.html",
    interne: true,
    libelleAction: "Lire le comparatif",
    codePromo: null,
    resume: "eSIM, carte SIM locale ou itinérance : ce qui coûte le moins cher selon le voyage.",
    accroche: "[BROUILLON : Une eSIM pour les premiers jours, une SIM locale ensuite si je reste.]",
    badge: null,
    icone: "signal",
    statut: "actif",
  },

  /* --- Réservation et activités --- */
  {
    id: "getyourguide",
    nom: "GetYourGuide",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "https://gyg.me/juenvie-app",
    codePromo: "JUENVIE5",
    avantage: "5% de réduction",
    resume: "Visites guidées, activités et billets dans le monde entier.",
    accroche: "[BROUILLON : C'est mon réflexe pour réserver une activité sur place, sans passer par vingt sites différents.]",
    avis: "[BROUILLON A VALIDER : Je réserve mes activités dessus parce que je peux annuler jusqu'à la veille. En voyage, les plans changent tout le temps : une météo qui tourne, un bus qui prend trois heures de plus, et l'excursion réservée devient une perte sèche. Là, j'annule et je reprogramme.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Annulation gratuite jusqu'à vingt quatre heures avant sur la majorité des activités",
      "Billets sur le téléphone, rien à imprimer",
      "Avis nombreux et vérifiés sur les activités très réservées",
    ],
    inconvenients: [
      "Les petits prestataires locaux sont parfois moins chers en direct",
      "Le choix se réduit vite hors des grandes destinations",
    ],
    pourQui: "Qui veut réserver une activité la veille pour le lendemain sans se poser de question.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "billet",
    logo: "assets/logos/getyourguide.png",
    statut: "actif",
  },
  {
    id: "klook",
    nom: "Klook",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "LIEN_A_REMPLIR_KLOOK",
    codePromo: null,
    resume: "Activités, transports et pass, imbattable en Asie.",
    accroche: "[BROUILLON : En Asie, c'est souvent moins cher et plus rapide à réserver que sur place.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Très fort en Asie : transferts aéroport, cartes SIM, pass de transport",
      "Prix souvent inférieurs à ceux affichés au guichet",
      "Réservation de dernière minute possible sur beaucoup d'activités",
    ],
    inconvenients: [
      "Couverture faible en Europe et en Amérique",
      "Interface chargée, saturée d'offres promotionnelles",
    ],
    pourQui: "Qui voyage en Asie et veut réserver transports et activités depuis son téléphone.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "billet",
    logo: "assets/logos/klook.png",
    statut: "actif",
  },
  {
    id: "booking",
    nom: "Booking.com",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "LIEN_A_REMPLIR_BOOKING",
    codePromo: null,
    resume: "Hôtels et logements, l'app de réservation la plus complète.",
    accroche: "[BROUILLON : Mon appli numéro un pour un hôtel, l'annulation gratuite me sauve à chaque changement de plan.]",
    avis: "[BROUILLON A VALIDER : C'est mon réflexe pour un hôtel, et surtout pour l'annulation gratuite. Je réserve la première nuit d'une étape et je décide sur place si je reste. Le seul défaut, c'est la pression permanente de l'interface : les compteurs de derniers logements sont là pour faire décider vite.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Annulation gratuite sur une grande partie des chambres",
      "Filtres précis et vue carte pour choisir un quartier plutôt qu'un hôtel",
      "Programme Genius qui débloque des réductions au fil des séjours",
    ],
    inconvenients: [
      "Les frais de service n'apparaissent pas toujours avant la dernière étape",
      "Pression commerciale permanente : compteurs, alertes, derniers logements",
    ],
    pourQui: "Qui réserve au fil de l'eau et a besoin de pouvoir tout annuler.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "lit",
    logo: "assets/logos/booking.png",
    indispensable: true,
    statut: "actif",
  },
  {
    id: "hostelworld",
    nom: "Hostelworld",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "LIEN_A_REMPLIR_HOSTELWORLD",
    codePromo: null,
    resume: "Auberges de jeunesse pour voyager social et petit budget.",
    accroche: "[BROUILLON : Pour rencontrer du monde en solo, rien ne vaut une bonne auberge bien notée dessus.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Le plus grand choix d'auberges, avec des avis détaillés sur l'ambiance",
      "Filtres utiles : dortoir femmes, âge moyen, activités proposées",
      "Réservation possible avec un acompte seulement",
    ],
    inconvenients: [
      "Frais de réservation en plus de l'acompte",
      "Peu pertinent dès qu'on cherche un hôtel classique",
    ],
    pourQui: "Qui voyage seul et choisit une auberge sur son ambiance autant que sur son prix.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "sac",
    logo: "assets/logos/hostelworld.png",
    statut: "actif",
  },
  /* Mad Monkey : partenariat au code seul, sans lien de suivi. Le
     code s'utilise en réservant directement sur le site officiel. */
  {
    id: "mad-monkey",
    nom: "Mad Monkey",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "https://madmonkeyhostels.com",
    libelleAction: "Réserver",
    codePromo: "Julien10",
    avantage: "10% de réduction",
    resume: "Réseau d'auberges sociales en Australie et en Asie du Sud Est.",
    accroche: "Les auberges où j'ai dormi à Sydney et à Cairns, avec une soirée à thème chaque soir.",
    avis: "Très bonne expérience au Mad Monkey Bayswater à Sydney comme au Mad Monkey Central à Cairns. Des soirées à thème sont organisées chaque soir, et c'est le moyen le plus simple de rencontrer du monde quand on arrive quelque part sans connaître personne.",
    jeUtilisePour: [
      "Mes nuits à Sydney et à Cairns pendant mon PVT",
    ],
    avantages: [
      "10% de réduction avec le code, en réservant sur le site officiel",
      "Auberges sociales pensées pour rencontrer du monde en arrivant",
      "Présent en Australie et dans plusieurs pays d'Asie du Sud Est",
    ],
    inconvenients: [
      "Le code ne s'applique qu'en réservant directement sur le site de Mad Monkey",
      "Le réseau ne couvre pas toutes les villes, vérifie avant de bâtir ton itinéraire autour",
    ],
    pourQui: "Qui voyage seul et veut une auberge où il est facile de rencontrer du monde.",
    depuisQuand: "Depuis mon arrivée en Australie, en 2026",
    badge: null,
    icone: "lit",
    logo: "assets/logos/mad-monkey.png",
    statut: "actif",
  },
  {
    id: "expedia",
    nom: "Expedia",
    categorie: "voyage",
    sousCategorie: "reservation",
    url: "LIEN_A_REMPLIR_EXPEDIA",
    codePromo: null,
    resume: "Vols, hôtels et packages au même endroit.",
    accroche: "[BROUILLON : Utile quand je veux grouper vol et hôtel en une seule réservation.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Vol et hôtel dans une seule réservation, souvent moins cher qu'en séparé",
      "Programme One Key partagé avec Hotels.com",
      "Modification de vol possible sur une partie des billets",
    ],
    inconvenients: [
      "Un problème sur le vol devient un dossier à trois : la compagnie, la plateforme, l'hôtel",
      "Le service client est le point faible quand un voyage part de travers",
    ],
    pourQui: "Qui veut boucler vol et hôtel en une seule fois pour un séjour court.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "avion",
    logo: "assets/logos/expedia.png",
    statut: "actif",
  },

  /* --- eSIM et connectivité --- */
  {
    id: "saily",
    nom: "Saily",
    categorie: "voyage",
    sousCategorie: "esim",
    url: "https://saily.onelink.me/ymzx/referrals",
    codePromo: "JULIEN3574",
    avantage: "5% de réduction",
    resume: "eSIM simple et abordable, créée par l'équipe de NordVPN.",
    accroche: "Simple à installer avant même d'atterrir, ça évite la galère du duty free.",
    avis: "L'eSIM s'installe avant le départ et fonctionne à la seconde où l'avion se pose. Plus de recherche de boutique dans un aéroport à minuit, plus de carte SIM achetée trois fois le prix au duty free. C'est de la data seule, mais en voyage je n'ai jamais eu besoin d'autre chose.",
    jeUtilisePour: [
      "Avoir internet dès que j'arrive dans un pays",
    ],
    avantages: [
      "Installation avant le départ, active dès l'atterrissage",
      "Application claire, consommation suivie en temps réel",
      "Forfaits régionaux qui couvrent plusieurs pays d'un coup",
    ],
    inconvenients: [
      "Catalogue moins large que les opérateurs plus anciens sur les destinations rares",
      "Data uniquement, ni appels ni SMS",
    ],
    pourQui: "Qui veut être connecté en sortant de l'avion, sans chercher une boutique.",
    depuisQuand: "Depuis plusieurs années",
    badge: null,
    icone: "signal",
    logo: "assets/logos/saily.png",
    statut: "actif",
  },
  {
    id: "holafly",
    nom: "Holafly",
    categorie: "voyage",
    sousCategorie: "esim",
    /* Lien Impact : le code JULIENENVIE s'applique tout seul à l'arrivée. */
    url: "https://holafly.sjv.io/c/7978142/3856277/24764",
    codePromo: "JULIENENVIE",
    avantage: "5% de réduction",
    resume: "eSIM en data illimitée dans plus de 200 destinations.",
    /* Julien n'a pas encore utilisé Holafly : pas d'accroche ni d'avis tant qu'il ne l'a pas testé. */
    accroche: null,
    avis: null,
    jeUtilisePour: [],
    avantages: [
      "Data illimitée dans plus de 200 destinations, avec une eSIM globale et plus de 15 eSIM régionales",
      "Installation en deux minutes, et ton numéro WhatsApp ne change pas",
      "Support humain 24h/24 et 7j/7, remboursement possible sous 6 mois",
      "Le code se réutilise à chaque eSIM, et donne 10% sur les forfaits Holafly Plans pendant 12 mois",
    ],
    inconvenients: [
      "Le partage de connexion dépend de l'offre et de la destination, vérifie avant d'acheter",
      "Pour un séjour court avec peu de besoins en data, un forfait au gigaoctet peut suffire",
    ],
    pourQui: "Qui part longtemps, vers des destinations plus exotiques, et ne veut surtout pas compter ses gigaoctets.",
    depuisQuand: null,
    badge: null,
    icone: "signal",
    logo: "assets/logos/holafly.png",
    statut: "actif",
  },

  /* --- Banques et argent --- */
  {
    id: "wise",
    nom: "Wise",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "https://wise.com/invite/dic/julienpierred7",
    codePromo: "julienpierred7",
    resume: "Compte multidevises et paiements à l'étranger sans frais cachés.",
    accroche: "[BROUILLON : Le compte que j'active avant chaque grand départ, payer en devise locale sans frais change vraiment la donne.]",
    avis: "[BROUILLON A VALIDER : Je m'en sers dès que deux devises entrent en jeu. Le taux affiché est le vrai taux du marché, et la commission est annoncée avant de valider, pas cachée dans la conversion. Sur un long voyage, l'écart avec une banque classique se compte en centaines d'euros.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Taux de change réel, sans marge cachée dans le taux",
      "Compte multi devises avec de vraies coordonnées bancaires locales",
      "Frais annoncés noir sur blanc avant de valider un virement",
    ],
    inconvenients: [
      "Ce n'est pas une banque : ni découvert, ni crédit, ni dépôt d'espèces",
      "Le virement peut prendre un jour ouvré selon la devise",
    ],
    pourQui: "Qui est payé dans une devise et dépense dans une autre.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "echange",
    logo: "assets/logos/wise.png",
    indispensable: true,
    statut: "actif",
  },
  {
    id: "revolut",
    nom: "Revolut",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "https://revolut.com/referral/?referral-code=julien4uj7!NOV2-24-VR-FR",
    codePromo: "julien4uj7!NOV2-24-VR-FR",
    resume: "Carte de voyage, change instantané et budgets séparés.",
    accroche: "[BROUILLON : Le change en temps réel évite les mauvaises surprises à la sortie d'un distributeur.]",
    avis: "[BROUILLON A VALIDER : C'est ma carte du quotidien à l'étranger. Paiement sans frais dans la devise locale, virement instantané à quelqu'un qui a l'appli, et une carte virtuelle jetable quand je dois payer sur un site que je ne connais pas. Le seul point à retenir : éviter les grosses conversions le week end.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Paiement en devise étrangère sans frais dans la limite du plan",
      "Application complète : budgets, sous comptes, virements instantanés",
      "Carte virtuelle jetable pour les paiements en ligne",
    ],
    inconvenients: [
      "Majoration du taux de change le week end sur les plans gratuits",
      "Plafonds de retrait vite atteints sans abonnement payant",
    ],
    pourQui: "Qui veut une carte de voyage gratuite et une application qui fait tout depuis le téléphone.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "carte",
    logo: "assets/logos/revolut.png",
    statut: "actif",
  },
  {
    id: "trade-republic",
    nom: "Trade Republic",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "https://refnocode.trade.re/p1txpjf1",
    codePromo: "p1txpjf1",
    resume: "Compte rémunéré et investissement, avec carte incluse.",
    accroche: "[BROUILLON : Je m'en sers pour faire fructifier ce que je ne dépense pas en voyage.]",
    avis: "[BROUILLON A VALIDER : Je place ce que je ne dépense pas en voyage plutôt que de le laisser dormir. Un euro par ordre, des versements programmés sur ETF sans frais, et l'application reste assez simple pour ne pas y passer ses soirées. À garder en tête : investir peut faire perdre de l'argent.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Ordres de bourse à un euro de commission",
      "Plans d'investissement programmés sans frais sur les ETF",
      "Intérêts versés sur les liquidités non investies",
    ],
    inconvenients: [
      "Investir comporte un risque de perte en capital",
      "Interface volontairement minimaliste, peu d'outils d'analyse",
    ],
    pourQui: "Qui veut investir régulièrement de petites sommes sans payer de frais de courtage.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "graphique",
    logo: "assets/logos/trade-republic.png",
    statut: "actif",
  },
  {
    id: "boursobank",
    nom: "BoursoBank",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "https://bour.so/p/gYMHSupb7Ii",
    codePromo: "JUDE2303",
    avantage: "Jusqu'à 150€ offerts",
    resume: "Banque en ligne française complète, carte gratuite.",
    accroche: "[BROUILLON : Une banque française solide à garder en parallèle des comptes voyage.]",
    avis: "[BROUILLON A VALIDER : Le compte français que je garde pour tout ce qui a besoin d'un IBAN FR : le salaire, les impôts, les prélèvements. Les néobanques sont plus pratiques au quotidien mais elles ne remplacent pas ça, et la prime de bienvenue paie largement l'ouverture.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Banque en ligne française, avec un vrai IBAN FR",
      "Paiements et retraits à l'étranger sans frais sur les offres haut de gamme",
      "Prime de bienvenue régulière à l'ouverture",
    ],
    inconvenients: [
      "Conditions de revenus ou d'utilisation à respecter selon la carte",
      "Les frais à l'étranger dépendent de la gamme choisie, à vérifier avant de partir",
    ],
    pourQui: "Qui veut garder un IBAN français pour son salaire, ses impôts et ses prélèvements.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "carte",
    logo: "assets/logos/boursobank.png",
    statut: "actif",
  },
  {
    id: "fortuneo",
    nom: "Fortuneo",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "LIEN_A_REMPLIR_FORTUNEO",
    codePromo: "13385764",
    avantage: "140€ offerts",
    resume: "Banque en ligne, carte gratuite et paiements sans frais à l'étranger.",
    accroche: "[BROUILLON : Carte gratuite et zéro frais à l'étranger, un bon compte de secours.]",
    avis: "[BROUILLON A VALIDER : L'alternative française à regarder si tu cherches une carte assurée sans cotisation. Les conditions d'utilisation sont à lire avant de signer, elles conditionnent la gratuité.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Carte Gold Mastercard sans cotisation sous conditions d'utilisation",
      "Assurances et assistance voyage incluses avec les cartes haut de gamme",
      "IBAN français",
    ],
    inconvenients: [
      "Conditions de revenus pour accéder aux meilleures cartes",
      "Application moins riche que celle des néobanques",
    ],
    pourQui: "Qui cherche une banque française avec une carte assurée pour voyager.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "carte",
    logo: "assets/logos/fortuneo.png",
    statut: "actif",
  },
  {
    id: "amex",
    nom: "American Express",
    categorie: "voyage",
    sousCategorie: "banque",
    url: "https://americanexpress.com/fr-fr/referral/gold?ref=jULIEDb6rZ",
    codePromo: null,
    resume: "Carte de paiement internationale, programme de fidélité et avantages voyage.",
    accroche: "[BROUILLON : Utile pour les programmes de fidélité et les assurances voyage incluses avec la carte.]",
    avis: "[BROUILLON A VALIDER : Je la sors surtout pour les assurances qu'elle embarque, qui sont d'un autre niveau que celles d'une carte classique. Mais je ne pars jamais avec elle seule : en Asie du Sud Est, une bonne partie des commerçants ne la prennent pas.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Assurances voyage et achat parmi les plus complètes du marché",
      "Programme de points convertibles en miles",
      "Service client réputé en cas de litige avec un commerçant",
    ],
    inconvenients: [
      "Acceptation limitée hors des grandes villes, notamment en Asie du Sud Est",
      "Cotisation annuelle sur la plupart des cartes",
    ],
    pourQui: "Qui voyage surtout là où la carte est acceptée et veut des assurances solides.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "carte",
    logo: "assets/logos/amex.png",
    indispensable: true,
    statut: "actif",
  },

  /* --- Assurances voyage --- */
  /* Chapka : liens de parrainage par formule (paramètre app=Juenvie).
     La fiche pointe vers l'accueil pour laisser choisir la formule ;
     la collection PVT pointe directement vers Cap Working Holiday.
     Pour une autre langue, remplacer .fr par .com, .es, .it ou .de.
       Accueil ............... https://www.chapkadirect.fr/index.php?app=Juenvie
       Cap Working Holiday ... https://www.chapkadirect.fr/index.php?action=produit&id=927&app=Juenvie  (PVT, jusqu'à 24 mois)
       Cap Aventure .......... https://www.chapkadirect.fr/index.php?action=produit&id=795&app=Juenvie  (tour du monde, 3 à 24 mois)
       Cap Assistance 24h/24 . https://www.chapkadirect.fr/index.php?action=produit&id=924&app=Juenvie  (voyage de moins de 3 mois)
       Cap Assistance Annuel . https://www.chapkadirect.fr/index.php?action=produit&id=920&app=Juenvie  (plusieurs voyages dans l'année)
       Cap Annulation ........ https://www.chapkadirect.fr/index.php?action=produit&id=839&app=Juenvie
       Cap Student ........... https://www.chapkadirect.fr/index.php?action=produit&id=926&app=Juenvie
       Cap Tempo Expat ....... https://www.chapkadirect.fr/index.php?action=produit&id=928&app=Juenvie
       Cap Au Pair ........... https://www.chapkadirect.fr/index.php?action=produit&id=962&app=Juenvie
       Cap Volontariat ....... https://www.chapkadirect.fr/index.php?action=produit&id=929&app=Juenvie
       Cap Groupe ............ https://www.chapkadirect.fr/index.php?action=produit&id=871&app=Juenvie */
  {
    id: "chapka",
    nom: "Chapka",
    categorie: "voyage",
    sousCategorie: "assurance",
    url: "https://www.chapkadirect.fr/index.php?app=Juenvie",
    codePromo: null,
    resume: "Assurance voyage française, référence des PVT et tours du monde.",
    accroche: "L'assurance que j'ai prise pour mon année de PVT en Australie.",
    avis: "Je l'ai prise pour mon PVT en Australie, environ 400 € pour l'année. C'est le contrat le plus clairement pensé pour les PVTistes : il est écrit pour ce cas précis, pas pour un voyage de deux semaines auquel on ajouterait une option. Avant de souscrire, vérifie ligne par ligne si les sports que tu pratiques sont couverts ou s'ils demandent une option.",
    jeUtilisePour: [
      "Mon année de PVT en Australie",
    ],
    avantages: [
      "Contrats dédiés au PVT et aux longs séjours",
      "Frais médicaux couverts à hauteur de plusieurs centaines de milliers d'euros",
      "Courtier français : contrat, devis et service client en français",
    ],
    inconvenients: [
      "Certains sports et activités demandent une option payante en plus",
      "Il faut souvent avancer les frais avant d'être remboursé",
    ],
    pourQui: "Qui part plusieurs mois ou en PVT et veut un contrat pensé pour cette durée.",
    depuisQuand: "Depuis mon départ en PVT, en 2026",
    badge: null,
    icone: "bouclier",
    logo: "assets/logos/chapka.png",
    indispensable: true,
    statut: "actif",
  },

  /* --- Bagages et accessoires --- */
  {
    id: "powerbank-voyage",
    nom: "Powerbank",
    categorie: "voyage",
    sousCategorie: "bagages",
    url: "LIEN_A_REMPLIR_POWERBANK_VOYAGE",
    codePromo: null,
    resume: "Batterie externe pour tenir une journée complète de voyage.",
    accroche: "[BROUILLON : Indispensable dès que la journée dépasse les huit heures loin d'une prise.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Recharge le téléphone plusieurs fois sur une journée de transport",
      "Les modèles USB C récents rechargent aussi un ordinateur portable",
    ],
    inconvenients: [
      "Interdite en soute, elle doit rester en cabine",
      "Au delà de cent wattheures, l'accord de la compagnie aérienne est nécessaire",
    ],
    pourQui: "Qui enchaîne bus de nuit, aéroports et journées entières loin d'une prise.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "batterie",
    statut: "actif",
  },
  {
    id: "adaptateur-universel",
    nom: "Adaptateur universel",
    categorie: "voyage",
    sousCategorie: "bagages",
    url: "LIEN_A_REMPLIR_ADAPTATEUR",
    codePromo: null,
    resume: "Un seul adaptateur pour se brancher partout dans le monde.",
    accroche: "[BROUILLON : Un seul objet qui règle le problème des prises dans tous les pays où je passe.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Un seul objet pour tous les continents",
      "Les modèles avec ports USB évitent d'emporter plusieurs chargeurs",
    ],
    inconvenients: [
      "Un adaptateur ne convertit pas la tension, seulement la forme de la prise",
      "Encombrant et lourd comparé à un adaptateur simple",
    ],
    pourQui: "Qui change de pays plusieurs fois dans le même voyage.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "prise",
    statut: "actif",
  },

  /* --- Albums souvenirs --- */
  {
    id: "souvence",
    nom: "Souvence",
    categorie: "voyage",
    sousCategorie: "souvenirs",
    url: "https://www.souvence.com/JULIEN11925",
    codePromo: "JULIEN11925",
    resume: "Albums photo personnalisés pour immortaliser ses voyages.",
    accroche: "[BROUILLON : Une belle façon de garder une trace physique d'un voyage, pas juste des photos qui dorment sur le téléphone.]",
    badge: null,
    icone: "livre",
    logo: "assets/logos/souvence.png",
    statut: "actif",
  },

  /* --- Mes guides de voyage --- */
  {
    id: "pvt-australie-section",
    nom: "Tout le PVT en Australie",
    categorie: "voyage",
    sousCategorie: "guides",
    url: "australie.html",
    interne: true,
    libelleAction: "Voir la section",
    codePromo: null,
    resume: "Visa 417, assurance, budget, banque, arrivée et 88 jours.",
    accroche: "[BROUILLON : La section que j'alimente depuis l'Australie, au fur et à mesure des démarches.]",
    badge: null,
    icone: "boussole",
    statut: "actif",
  },
  {
    id: "guides-juenvie",
    nom: "Mes guides de voyage",
    categorie: "voyage",
    sousCategorie: "guides",
    url: "guides.html",
    interne: true,
    libelleAction: "Lire mes guides",
    codePromo: null,
    resume: "Mes guides par destination : Bali, Laos, Vietnam, Australie.",
    accroche: "[BROUILLON : Mes propres guides, écrits avec ce que j'aurais aimé savoir avant de partir.]",
    badge: null,
    icone: "plan",
    statut: "actif",
  },

  /* ================= SPORT ================= */

  /* --- Chaussures --- */
  {
    id: "adidas-adizero",
    nom: "Adidas Adizero",
    categorie: "sport",
    sousCategorie: "chaussures",
    url: "LIEN_A_REMPLIR_ADIZERO",
    codePromo: null,
    resume: "La gamme running d'Adidas taillée pour la vitesse et le marathon.",
    accroche: "[BROUILLON : Ma paire de compétition, légère et réactive sur les allures rapides.]",
    avis: "[BROUILLON A VALIDER : Ma chaussure de séance rapide et de course. Le retour d'énergie est vraiment perceptible sur les allures soutenues. En revanche, ce n'est pas une chaussure de sortie longue à allure lente, et elle s'use plus vite qu'une chaussure d'entraînement classique.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Gamme entièrement pensée pour la vitesse",
      "Plaque carbone sur les modèles compétition, retour d'énergie très marqué",
      "Parmi les plus légères du marché",
    ],
    inconvenients: [
      "Durée de vie courte sur les modèles à plaque",
      "Amorti ferme, peu adapté aux sorties longues à allure lente",
    ],
    pourQui: "Qui prépare un chrono et cherche une chaussure de séance rapide ou de course.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "chaussure",
    logo: "assets/logos/adidas-adizero.png",
    indispensable: true,
    statut: "actif",
  },
  {
    id: "asics",
    nom: "Asics",
    categorie: "sport",
    sousCategorie: "chaussures",
    url: "LIEN_A_REMPLIR_ASICS",
    codePromo: null,
    resume: "Référence running, du footing quotidien au jour de course.",
    accroche: "[BROUILLON : Ma paire de tous les jours, fiable pour les sorties tranquilles.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Gamme Gel très établie sur l'entraînement quotidien",
      "Bonne durabilité des semelles",
      "Plusieurs largeurs disponibles sur certains modèles",
    ],
    inconvenients: [
      "Plus lourdes que la concurrence à gamme équivalente",
      "Beaucoup de références très proches, difficile de s'y retrouver",
    ],
    pourQui: "Qui cherche une chaussure d'entraînement fiable qui tienne une saison entière.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "chaussure",
    logo: "assets/logos/asics.png",
    statut: "actif",
  },

  /* --- Montres et data --- */
  {
    id: "garmin",
    nom: "Garmin",
    categorie: "sport",
    sousCategorie: "montres",
    url: "LIEN_A_REMPLIR_GARMIN",
    codePromo: null,
    resume: "Montres GPS de référence pour le suivi d'entraînement.",
    accroche: "[BROUILLON : Elle mesure tout ce qui compte pour progresser, la montre ne me quitte jamais à l'entraînement.]",
    avis: "[BROUILLON A VALIDER : Je l'utilise pour préparer mes courses, pas pour compter mes pas. Les données d'entraînement sont détaillées et exportables, et l'autonomie tient largement une semaine chargée. L'interface demande du temps avant de devenir naturelle.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Autonomie de plusieurs jours à plusieurs semaines selon le modèle",
      "Cartographie et navigation embarquées sur les modèles haut de gamme",
      "Données d'entraînement détaillées et exportables",
    ],
    inconvenients: [
      "Prix élevé sur les modèles complets",
      "Interface dense, il faut du temps pour l'apprivoiser",
    ],
    pourQui: "Qui suit un plan d'entraînement et veut des données fiables sur la durée.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "montre",
    logo: "assets/logos/garmin.png",
    indispensable: true,
    statut: "actif",
  },

  /* --- Audio --- */

  /* --- Accessoires --- */

  /* --- Nutrition et hydratation --- */
  {
    id: "nutripure",
    nom: "Nutripure",
    categorie: "sport",
    sousCategorie: "nutrition",
    url: "LIEN_A_REMPLIR_NUTRIPURE",
    codePromo: null,
    resume: "Compléments français, formules propres et transparentes.",
    accroche: "[BROUILLON : Des compléments français avec une composition claire, sans liste d'ingrédients à rallonge.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Marque française, composition et origine des ingrédients détaillées",
      "Gamme large : protéines, magnésium, oméga trois",
      "Contrôles antidopage sur une partie des produits",
    ],
    inconvenients: [
      "Un complément ne remplace jamais une alimentation construite",
      "Prix supérieur aux marques de grande distribution",
    ],
    pourQui: "Qui veut compléter son alimentation et regarde d'abord l'étiquette.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "feuille",
    logo: "assets/logos/nutripure.png",
    statut: "actif",
  },
  {
    id: "decathlon-nutrition",
    nom: "Decathlon",
    categorie: "sport",
    sousCategorie: "nutrition",
    url: "LIEN_A_REMPLIR_DECATHLON",
    codePromo: null,
    resume: "Nutrition sportive efficace à petit prix.",
    accroche: "[BROUILLON : Pour s'équiper sans se ruiner quand on débute la nutrition sportive.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Le meilleur rapport entre le prix et la quantité pour commencer",
      "Disponible en magasin partout en France",
      "Gamme simple, peu de références inutiles",
    ],
    inconvenients: [
      "Formulations plus basiques que celles des marques spécialisées",
      "Choix de goûts limité",
    ],
    pourQui: "Qui débute et veut tester gels et boissons sans y laisser un budget.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "sac",
    logo: "assets/logos/decathlon-nutrition.png",
    statut: "actif",
  },

  /* --- Récupération --- */
  {
    id: "compex",
    nom: "Compex",
    categorie: "sport",
    sousCategorie: "recuperation",
    url: "LIEN_A_REMPLIR_COMPEX",
    codePromo: null,
    resume: "Électrostimulation pour la récupération musculaire.",
    accroche: "[BROUILLON : Pratique les jours de repos pour accélérer la récupération sans rien faire.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Électrostimulation pour la récupération comme pour le renforcement",
      "Programmes guidés, peu de réglages à comprendre",
      "S'utilise assis, sans le moindre effort",
    ],
    inconvenients: [
      "Poser les électrodes au bon endroit demande de la pratique",
      "Les électrodes sont des consommables à racheter régulièrement",
    ],
    pourQui: "Qui doit récupérer vite entre deux séances, ou entretenir un muscle pendant une blessure.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "eclair",
    logo: "assets/logos/compex.png",
    statut: "actif",
  },

  /* --- Applications running --- */
  {
    id: "app-running",
    nom: "Application running",
    categorie: "sport",
    sousCategorie: "applications",
    url: "LIEN_A_REMPLIR_APP_RUNNING",
    codePromo: null,
    resume: "Mon app d'entraînement, bientôt détaillée ici.",
    accroche: "[BROUILLON : L'app que j'utilise vraiment pour structurer mes semaines d'entraînement, à détailler une fois choisie.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Suivi des séances et de la progression sur la durée",
      "Plans guidés pour un premier dix kilomètres ou un marathon",
      "Dimension sociale qui aide beaucoup à tenir la régularité",
    ],
    inconvenients: [
      "Les fonctions vraiment utiles sont presque toujours derrière un abonnement",
      "Le GPS du téléphone est moins précis que celui d'une montre",
    ],
    pourQui: "Qui débute et veut structurer son entraînement avant d'investir dans une montre.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "telephone",
    statut: "a-venir",
  },

  /* ================= CRÉATION ================= */

  /* --- Matériel vidéo --- */
  {
    id: "dji-osmo-action",
    nom: "DJI Osmo Action",
    marque: "DJI",
    categorie: "creation",
    sousCategorie: "materiel",
    url: "LIEN_A_REMPLIR_OSMO_ACTION",
    codePromo: null,
    resume: "Caméra d'action stabilisée pour filmer en mouvement.",
    accroche: "[BROUILLON : Stabilisée même en courant, c'est elle qui capture le plus de mes images de mouvement.]",
    avis: "[BROUILLON A VALIDER : Le double écran change tout quand on filme seul : on se voit, donc on se cadre. Avant ça je passais mon temps à refaire des plans mal centrés. Elle chauffe sur les longues prises en haute définition, c'est le compromis à accepter.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Deux écrans, dont un à l'avant pour se cadrer soi même",
      "Stabilisation efficace sans aucun accessoire",
      "Batteries qui tiennent le froid mieux que la concurrence",
    ],
    inconvenients: [
      "Écosystème d'accessoires moins fourni que celui du leader des caméras d'action",
      "Échauffement possible en haute définition sur les longues prises",
    ],
    pourQui: "Qui filme seul, en mouvement, et a besoin de se voir pendant la prise.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "camera",
    logo: "assets/logos/dji-osmo-action.png",
    indispensable: true,
    statut: "actif",
  },
  {
    id: "dji-mini",
    nom: "DJI Mini",
    marque: "DJI",
    categorie: "creation",
    sousCategorie: "materiel",
    url: "LIEN_A_REMPLIR_DJI_MINI",
    codePromo: null,
    resume: "Drone de moins de 250 g, parfait en voyage.",
    accroche: "[BROUILLON : Un drone assez léger pour ne jamais peser dans le sac, malgré les plans qu'il permet.]",
    avis: "[BROUILLON A VALIDER : Moins de deux cent cinquante grammes, donc une réglementation allégée dans beaucoup de pays et un drone qui tient dans une poche de sac. C'est ce poids qui fait que je l'emporte vraiment, au lieu de le laisser à l'hôtel. En contrepartie, le vent le secoue vite.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Moins de deux cent cinquante grammes : réglementation allégée dans beaucoup de pays",
      "Se range dans une poche de sac à dos",
      "Qualité d'image très au dessus de ce que le poids laisse imaginer",
    ],
    inconvenients: [
      "Sensible au vent, conséquence directe de sa légèreté",
      "Les règles de vol restent à vérifier pays par pays avant de décoller",
    ],
    pourQui: "Qui voyage léger et veut des plans aériens sans transporter une valise de matériel.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "drone",
    logo: "assets/logos/dji-mini.png",
    indispensable: true,
    statut: "actif",
  },
  {
    id: "micro-dji",
    nom: "Micro DJI",
    marque: "DJI",
    categorie: "creation",
    sousCategorie: "materiel",
    url: "LIEN_A_REMPLIR_MICRO_DJI",
    codePromo: null,
    resume: "Micro sans fil compact pour un son propre en vlog.",
    accroche: "[BROUILLON : Le son propre change tout en vlog, même avec du vent ou du bruit ambiant.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Émetteur à pincer, aucun câble entre le micro et la caméra",
      "Enregistrement de secours dans l'émetteur : la prise est sauvée même si la liaison coupe",
      "Portée largement suffisante en extérieur",
    ],
    inconvenients: [
      "Le boîtier de charge est un objet de plus à ne pas oublier",
      "L'émetteur se voit à l'image sur un vêtement clair",
    ],
    pourQui: "Qui parle face caméra et veut un son propre sans personne pour tenir la perche.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "micro",
    logo: "assets/logos/micro-dji.png",
    statut: "actif",
  },
  {
    id: "powerbank-createur",
    nom: "Powerbank grande capacité",
    categorie: "creation",
    sousCategorie: "materiel",
    url: "LIEN_A_REMPLIR_POWERBANK_CREA",
    codePromo: null,
    resume: "Pour recharger caméra, drone et téléphone en tournage.",
    accroche: "[BROUILLON : Une grosse capacité pour ne jamais couper un tournage faute de batterie.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Recharge caméra, drone et téléphone sur une journée entière de tournage",
      "Un modèle USB C puissant recharge aussi un ordinateur portable",
    ],
    inconvenients: [
      "Doit voyager en cabine, jamais en soute",
      "Le poids grimpe très vite avec la capacité",
    ],
    pourQui: "Qui tourne toute la journée loin de la moindre prise.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "batterie",
    statut: "actif",
  },

  /* --- Accessoires --- */
  {
    id: "anker",
    nom: "Anker",
    categorie: "creation",
    sousCategorie: "accessoires",
    url: "LIEN_A_REMPLIR_ANKER",
    codePromo: null,
    resume: "Chargeurs, câbles et batteries fiables.",
    accroche: "[BROUILLON : Des chargeurs qui tiennent la charge rapide sans jamais chauffer.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Chargeurs GaN compacts et puissants",
      "Fiabilité et garantie sérieuses",
      "Gamme complète : chargeurs, câbles, batteries, hubs",
    ],
    inconvenients: [
      "Nommage des références confus d'une génération à l'autre",
      "Prix supérieur aux marques sans nom",
    ],
    pourQui: "Qui veut un seul chargeur pour l'ordinateur, la caméra et le téléphone.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "prise",
    logo: "assets/logos/anker.png",
    statut: "actif",
  },
  {
    id: "ugreen",
    nom: "Ugreen",
    categorie: "creation",
    sousCategorie: "accessoires",
    url: "LIEN_A_REMPLIR_UGREEN",
    codePromo: null,
    resume: "Hubs, adaptateurs et accessoires de charge malins.",
    accroche: "[BROUILLON : Un hub qui règle le problème des ports manquants sur un ordinateur en voyage.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Hubs et adaptateurs à prix contenu",
      "Câbles bien construits pour la gamme de prix",
      "Choix très large de connectiques rares",
    ],
    inconvenients: [
      "Qualité inégale d'une référence à l'autre",
      "Documentation technique sommaire",
    ],
    pourQui: "Qui a besoin d'un adaptateur précis sans y mettre le prix d'une grande marque.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "prise",
    logo: "assets/logos/ugreen.png",
    statut: "actif",
  },

  /* --- Logiciels et apps --- */
  {
    id: "canva-pro",
    nom: "Canva Pro",
    categorie: "creation",
    sousCategorie: "logiciels",
    url: "LIEN_A_REMPLIR_CANVA",
    codePromo: null,
    resume: "Visuels, miniatures et documents de marque en quelques minutes.",
    accroche: "[BROUILLON : Pour sortir une miniature ou un visuel propre en quelques minutes, sans ouvrir Photoshop.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Prise en main immédiate, sans aucune formation",
      "Redimensionnement automatique d'un visuel vers tous les formats",
      "Banque de photos et de modèles incluse dans l'abonnement",
    ],
    inconvenients: [
      "Les modèles les plus utilisés donnent des visuels qui se ressemblent tous",
      "Contrôle typographique limité face à un vrai logiciel de mise en page",
    ],
    pourQui: "Qui doit produire vite des miniatures et des visuels propres sans être graphiste.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "palette",
    logo: "assets/logos/canva-pro.png",
    statut: "actif",
  },
  {
    id: "capcut-pro",
    nom: "CapCut Pro",
    categorie: "creation",
    sousCategorie: "logiciels",
    url: "LIEN_A_REMPLIR_CAPCUT",
    codePromo: null,
    resume: "Montage mobile et desktop, redoutable pour les formats courts.",
    accroche: "[BROUILLON : Redoutable pour monter vite un format court directement depuis le téléphone.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Montage vertical rapide, pensé pour les réseaux",
      "Sous titres automatiques corrects en français",
      "Version mobile et version bureau synchronisées",
    ],
    inconvenients: [
      "Conditions d'utilisation à lire attentivement pour un usage commercial",
      "Les effets à la mode datent une vidéo en quelques mois",
    ],
    pourQui: "Qui publie des formats courts et veut monter depuis son téléphone.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "ciseaux",
    logo: "assets/logos/capcut-pro.png",
    statut: "actif",
  },
  {
    id: "lightroom",
    nom: "Adobe Lightroom",
    categorie: "creation",
    sousCategorie: "logiciels",
    url: "LIEN_A_REMPLIR_LIGHTROOM",
    codePromo: null,
    resume: "Retouche photo et colorimétrie, sur mobile et desktop.",
    accroche: "[BROUILLON : Ma retouche photo au quotidien, les préréglages font gagner un temps précieux.]",
    avis: "[BROUILLON : ton avis développé, deux ou trois phrases. Ce que ça a changé pour toi, dans quelles conditions tu l'as testé.]",
    jeUtilisePour: [
      "[BROUILLON : un usage concret, en quelques mots]",
    ],
    avantages: [
      "Retouche non destructive, l'original reste toujours récupérable",
      "Synchronisation entre le téléphone et l'ordinateur",
      "Presets réutilisables pour tenir une identité visuelle",
    ],
    inconvenients: [
      "Abonnement mensuel sans fin",
      "Le stockage inclus devient vite insuffisant",
    ],
    pourQui: "Qui photographie en RAW et veut une retouche cohérente d'une image à l'autre.",
    depuisQuand: "[BROUILLON : Utilisé depuis 2023]",
    badge: null,
    icone: "reglages",
    logo: "assets/logos/lightroom.png",
    statut: "actif",
  },
];


/* ------------------------------------------------------------
   COLLECTIONS THÉMATIQUES
   Regroupements transverses affichés sur l'accueil, par-dessus
   les catégories. Chaque collection liste des id de produits
   déclarés dans LIENS ci-dessus. Un produit peut aussi s'écrire
   { id: "...", url: "..." } pour pointer, dans cette collection
   seulement, vers une autre page que celle de sa fiche.
   Pour changer le contenu : modifie le tableau `produits`.
   Pour ajouter une collection : copie un bloc, puis pose un
   conteneur data-collection-bloc="son-id" dans index.html.
   ------------------------------------------------------------ */
const COLLECTIONS = [
  {
    id: "pvt-australie",
    titre: "Spécial PVT Australie",
    sousTitre: "Le kit que je prépare en premier pour mon départ en Working Holiday.",
    produits: [
      "wise",
      { id: "chapka", url: "https://www.chapkadirect.fr/index.php?action=produit&id=927&app=Juenvie" },
      "adaptateur-universel",
    ],
  },
];
