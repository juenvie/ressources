/* ============================================================
   JU.EN.VIE — AFFILIATE HUB
   Moteur d'affichage. Lit data/liens.js et construit les pages.
   Aucune dépendance externe.

   Sommaire :
   1. Utilitaires
   2. Construction des cartes produit
   3. Rendu des pages catégorie
   4. Recherche, filtres, tri
   5. Accueil (compteurs et réseaux)
   6. Interactions globales (toast, copie, partage,
      retour en haut, apparition au scroll)
   ============================================================ */

(function () {
  "use strict";

  /* Active les styles dépendants de JS (apparition au scroll) */
  document.documentElement.classList.add("js");

  /* ---------- 1. Utilitaires ---------- */

  /** Un lien est prêt si son statut est actif ET que son url est réelle. */
  function estLienPret(lien) {
    return (
      lien.statut === "actif" &&
      typeof lien.url === "string" &&
      lien.url.length > 0 &&
      !lien.url.startsWith("LIEN_A_REMPLIR")
    );
  }

  /** Un partenaire « code seul » : actif et pourvu d'un code, mais sans
      lien de parrainage (certains fonctionnent uniquement au code, ex.
      Fortuneo). La carte s'affiche alors active, avec sa pastille code,
      mais sans bouton Découvrir. */
  function estCodeSeul(lien) {
    return lien.statut === "actif" && !estLienPret(lien) && !!lien.codePromo;
  }

  /** Une carte est « utilisable » (donc non grisée) si elle a un vrai
      lien OU si c'est un partenaire code seul. */
  function estUtilisable(lien) {
    return estLienPret(lien) || estCodeSeul(lien);
  }

  /** Mode brouillon : en local, ou avec ?brouillon dans l'adresse (retenu le
      temps de la session). Il montre ce qui est encore masqué en ligne :
      textes en [BROUILLON], cartes sans lien. Calculé une seule fois, au
      démarrage, parce que le rendu des cartes en dépend. */
  function estModeBrouillon() {
    var hote = window.location.hostname;
    var local =
      hote === "localhost" || hote === "127.0.0.1" || hote === "" || hote.indexOf(".local") > -1;
    var demande = window.location.search.indexOf("brouillon") > -1;

    if (demande) {
      try {
        window.sessionStorage.setItem("brouillon", "1");
      } catch (e) {
        /* navigation privée : tant pis, le paramètre d'URL suffit */
      }
    }

    var retenu = false;
    try {
      retenu = window.sessionStorage.getItem("brouillon") === "1";
    } catch (e) {
      retenu = false;
    }
    return local || demande || retenu;
  }

  var BROUILLON = estModeBrouillon();

  /* Langue de la page. Les guides existent aussi en anglais (dossier en/) :
     les rares textes écrits par le JavaScript y passent en anglais. */
  var ANGLAIS = /^en\b/.test(document.documentElement.lang || "");
  function t(fr, en) {
    return ANGLAIS ? en : fr;
  }

  /* Pages anglaises : les textes de data/liens-en.js remplacent ceux des
     fiches françaises (les liens, codes et statuts ne bougent pas), et les
     logos, qui sont des chemins relatifs, remontent d'un dossier. */
  if (ANGLAIS) {
    if (typeof LIENS_EN !== "undefined") {
      LIENS.forEach(function (lien) {
        if (LIENS_EN[lien.id]) Object.assign(lien, LIENS_EN[lien.id]);
      });
    }
    LIENS.forEach(function (lien) {
      if (lien.logo && !/^(https?:|\/|\.\.\/)/.test(lien.logo)) lien.logo = "../" + lien.logo;
    });
    if (typeof CATEGORIES_EN !== "undefined") {
      Object.keys(CATEGORIES_EN).forEach(function (cle) {
        if (CATEGORIES[cle]) Object.assign(CATEGORIES[cle], CATEGORIES_EN[cle]);
      });
    }
    if (typeof COLLECTIONS_EN !== "undefined" && typeof COLLECTIONS !== "undefined") {
      COLLECTIONS.forEach(function (c) {
        if (COLLECTIONS_EN[c.id]) Object.assign(c, COLLECTIONS_EN[c.id]);
      });
    }
    if (typeof BADGES_EN !== "undefined") {
      Object.keys(BADGES_EN).forEach(function (cle) {
        if (BADGES[cle]) BADGES[cle].label = BADGES_EN[cle];
      });
    }
  }

  /** Une carte s'affiche si elle est utilisable. Une carte sans lien ni
      code (« Bientôt disponible ») reste masquée en ligne : elle apparaît
      d'elle même dès que son lien est rempli dans liens.js. En mode
      brouillon, elle reste visible, grisée, pour que Julien la voie. */
  function estVisible(lien) {
    return estUtilisable(lien) || BROUILLON;
  }

  /** Une url de réseau social est réelle si ce n'est pas un placeholder. */
  function estUrlReelle(url) {
    return typeof url === "string" && url.length > 0 && !url.startsWith("LIEN_A_REMPLIR");
  }

  /** Un texte perso n'est affiché que s'il est vraiment rempli. La
      convention du fichier de données : tant qu'une valeur commence par
      "[", c'est un brouillon et rien ne s'affiche. */
  function texteRempli(valeur) {
    return typeof valeur === "string" && valeur.length > 0 && !valeur.startsWith("[");
  }

  function accrocheRemplie(accroche) {
    return texteRempli(accroche);
  }

  /** Même règle pour les listes : on ne garde que les entrées remplies,
      ce qui permet de laisser des brouillons au milieu d'une liste. */
  function listeRemplie(valeur) {
    if (!Array.isArray(valeur)) return [];
    return valeur.filter(texteRempli);
  }

  /** Échappe une chaîne pour insertion dans du HTML. */
  function echapper(texte) {
    var div = document.createElement("div");
    div.textContent = texte == null ? "" : String(texte);
    return div.innerHTML;
  }

  /** Normalise pour la recherche : minuscules et sans accents. */
  function normaliser(texte) {
    return String(texte)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /** Détecte si l'icône est une simple initiale (lettre) plutôt qu'une clé
      de pictogramme. */
  function estInitiale(icone) {
    return typeof icone === "string" && /^[a-zA-ZÀ-ÿ]{1,2}$/.test(icone) && !ICONES[icone];
  }

  /* Pictogrammes au trait, une seule famille dessinée sur une grille de 24,
     à la place des emojis : un emoji change d'allure d'un téléphone à
     l'autre, ceux ci gardent la couleur et l'épaisseur du site partout.
     La clé est celle du champ `icone` de liens.js. */
  var ICONES = {
    bouclier: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    signal: '<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
    billet: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10"/>',
    lit: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',
    sac: '<path d="M8 8V6a4 4 0 0 1 8 0v2"/><rect x="5" y="8" width="14" height="13" rx="3"/><path d="M9 14h6"/>',
    avion: '<path d="M21 3L3 10.5l7 2.5 2.5 7z"/><path d="M10 13l11-10"/>',
    echange: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    carte: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    graphique: '<path d="M4 19h16M5 15l4-4 3 3 6-7"/><path d="M15 7h3v3"/>',
    batterie: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4M10.5 10v4"/>',
    prise: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    livre: '<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12"/>',
    plan: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
    boussole: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    chaussure: '<path d="M3 17v-6l4-1 2-4 4 3h2l6 4v4H3zM3 17h18"/>',
    montre: '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3M12 10v2.5l1.5 1"/>',
    feuille: '<path d="M5 19C5 11 10 5 20 5c0 10-6 15-14 15M5 19l7-7"/>',
    eclair: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    telephone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    camera: '<path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    drone: '<circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M7.5 7.5l3 3M16.5 7.5l-3 3M7.5 16.5l3-3M16.5 16.5l-3-3"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
    micro: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1.3-1-1.6-1-2.6 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    ciseaux: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/>',
    reglages: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.5 5 4.8"/>',
    facebook: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4"/>',
  };

  /** Le SVG d'un pictogramme, ou une chaîne vide si la clé est inconnue. */
  function iconeSvg(cle) {
    if (!ICONES[cle]) return "";
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      ICONES[cle] + "</svg>"
    );
  }

  /** Contenu de la pastille d'icône : le pictogramme, ou l'initiale. */
  function contenuIcone(icone) {
    return iconeSvg(icone) || echapper(icone);
  }

  var ICONE_COPIE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  /* ---------- 2. Construction des cartes produit ---------- */

  /* Badges optionnels d'un produit (ex. « Mon préféré »). Le statut
     « Bientôt » n'a plus de badge : le bouton « Bientôt disponible » en
     bas de carte le signale déjà. */
  function construireBadges(lien) {
    if (!lien.badge || !BADGES[lien.badge]) return "";
    var b = BADGES[lien.badge];
    return (
      '<div class="badges-carte"><span class="badge ' +
      b.classe + '">' + echapper(b.label) + "</span></div>"
    );
  }

  /* Libellé du bouton par défaut, choisi selon la sous-catégorie. Les
     sous-catégories de matériel mènent vers une fiche produit marchande :
     « Voir le prix » annonce honnêtement où l'on atterrit, alors que
     « Découvrir » convient aux services (réservation, banque, eSIM).
     Un champ libelleAction sur un lien l'emporte toujours. */
  var LIBELLE_PAR_SOUS_CATEGORIE = {
    bagages: t("Voir le prix", "See the price"),
    chaussures: t("Voir le prix", "See the price"),
    montres: t("Voir le prix", "See the price"),
    audio: t("Voir le prix", "See the price"),
    accessoires: t("Voir le prix", "See the price"),
    nutrition: t("Voir le prix", "See the price"),
    recuperation: t("Voir le prix", "See the price"),
    materiel: t("Voir le prix", "See the price"),
  };

  function libelleAction(lien) {
    if (lien.libelleAction) return lien.libelleAction;
    return LIBELLE_PAR_SOUS_CATEGORIE[lien.sousCategorie] || t("Découvrir", "Discover");
  }

  /* Fiche détaillée, dépliable, à l'intérieur de la carte.
     Elle utilise <details> natif : aucun JavaScript, aucun état à gérer,
     et le contenu replié reste dans le HTML donc indexable par Google.
     Chaque bloc est indépendant : une carte qui n'a qu'un avis affiche
     seulement l'avis, une carte sans aucun champ rempli n'affiche pas
     la fiche du tout. */
  function construireFiche(lien) {
    var morceaux = "";

    if (texteRempli(lien.avis)) {
      morceaux += '<p class="fiche-avis">' + echapper(lien.avis) + "</p>";
    }

    var usages = listeRemplie(lien.jeUtilisePour);
    if (usages.length > 0) {
      morceaux +=
        '<div class="fiche-bloc"><p class="fiche-titre">' + t("Je m'en sers pour", "I use it for") + '</p><ul class="fiche-usages">' +
        usages
          .map(function (u) {
            return "<li>" + echapper(u) + "</li>";
          })
          .join("") +
        "</ul></div>";
    }

    var plus = listeRemplie(lien.avantages);
    var moins = listeRemplie(lien.inconvenients);
    if (plus.length > 0 || moins.length > 0) {
      morceaux += '<div class="fiche-balance">';
      if (plus.length > 0) {
        morceaux +=
          '<div class="fiche-bloc"><p class="fiche-titre">' + t("Ce que j'aime", "What I like") + '</p><ul class="fiche-plus">' +
          plus
            .map(function (p) {
              return "<li>" + echapper(p) + "</li>";
            })
            .join("") +
          "</ul></div>";
      }
      if (moins.length > 0) {
        morceaux +=
          '<div class="fiche-bloc"><p class="fiche-titre">' + t("Les limites", "The downsides") + '</p><ul class="fiche-moins">' +
          moins
            .map(function (m) {
              return "<li>" + echapper(m) + "</li>";
            })
            .join("") +
          "</ul></div>";
      }
      morceaux += "</div>";
    }

    if (texteRempli(lien.pourQui)) {
      morceaux +=
        '<p class="fiche-pour-qui"><span>' + t("Pour qui", "Who it is for") + "</span> " + echapper(lien.pourQui) + "</p>";
    }

    if (morceaux === "") return "";

    /* Le libellé annonce ce qu'on va lire : un avis perso, ou simplement
       les caractéristiques quand l'avis n'est pas encore écrit. */
    var libelle = texteRempli(lien.avis) ? t("Mon avis en détail", "My detailed review") : t("Voir le détail", "See the details");
    return (
      '<details class="fiche"><summary class="fiche-resume">' +
      libelle +
      '</summary><div class="fiche-corps">' +
      morceaux +
      "</div></details>"
    );
  }

  function construireCarte(lien, position) {
    var pret = estLienPret(lien);
    var codeSeul = estCodeSeul(lien);
    var utilisable = pret || codeSeul;
    var nom = echapper(lien.nom);

    var html = '<div class="entete-carte">';
    var classeIcone = estInitiale(lien.icone) ? "icone-lien initiale" : "icone-lien";
    if (lien.logo) {
      /* data-secours : si l'image de marque est introuvable (404),
         gererErreurLogo() retombe sur le pictogramme plutôt que de laisser
         une icône cassée. Voir l'écouteur "error" global plus bas. */
      html +=
        '<span class="icone-lien avec-logo">' +
        '<img src="' + echapper(lien.logo) + '" alt="" loading="lazy" ' +
        'data-secours="' + echapper(lien.icone) + '" ' +
        'data-secours-classe="' + classeIcone + '"></span>';
    } else {
      html += '<span class="' + classeIcone + '" aria-hidden="true">' + contenuIcone(lien.icone) + "</span>";
    }
    html += "<h3>" + nom + "</h3>";
    html += "</div>";

    /* Pas de texte descriptif sur la carte (le résumé reste dans l'index
       de recherche, voir dataset.recherche plus bas). Seule l'accroche
       perso, si Julien l'a remplie, s'affiche. */
    if (accrocheRemplie(lien.accroche)) {
      html += '<p class="accroche">' + echapper(lien.accroche) + "</p>";
    }

    html += construireBadges(lien);

    /* Preuve d'usage : « Utilisé depuis 2022 », « Testé sur 3 pays »...
       Une ligne courte, factuelle, qui distingue un produit réellement
       éprouvé d'une simple recommandation. */
    if (texteRempli(lien.depuisQuand)) {
      html += '<p class="anciennete">' + echapper(lien.depuisQuand) + "</p>";
    }

    html += construireFiche(lien);

    if (lien.codePromo) {
      var code = echapper(lien.codePromo);
      var libelleCopie = 'aria-label="' + t("Copier le code ", "Copy the code ") + code + t(" de ", " for ") + nom + '"';
      /* Le code est copiable de deux façons : tap sur la pastille dorée,
         ou tap sur le bouton copier juste à côté (même action). */
      html +=
        '<div class="ligne-code">' +
        '<button type="button" class="code-promo" data-action="copier-code" data-code="' +
        code + '" ' + libelleCopie + ">" +
        '<span class="etiquette">Code</span> ' + code +
        "</button>" +
        '<button type="button" class="btn-icone btn-copier-code" data-action="copier-code" data-code="' +
        code + '" ' + libelleCopie + ">" + ICONE_COPIE + "</button>" +
        "</div>";
    }

    /* Bouton d'action. Cartes code seul : aucun bouton (la pastille code
       suffit). Sinon : « Découvrir » (lien réel) ou « Bientôt disponible »
       (à venir). La carte reste cliquable en entier via le JS. */
    if (!codeSeul) {
      html += '<div class="actions-carte">';
      if (pret) {
        /* Lien interne (une page du site, ex. les guides) : navigation
           normale dans le même onglet, et surtout pas de rel="sponsored"
           qui signalerait à tort un lien affilié à Google. */
        var libelle = echapper(libelleAction(lien));
        html +=
          '<a class="btn-lien" href="' +
          echapper(lien.url) +
          (lien.interne ? '">' : '" target="_blank" rel="sponsored noopener">') +
          libelle +
          "</a>";
      } else {
        html += '<span class="btn-lien desactive">' + t("Bientôt disponible", "Coming soon") + "</span>";
      }
      html += "</div>";
    }

    /* Mention de l'avantage (ex. « 5% de réduction »), centrée en bas de
       carte. Affichée seulement si le champ avantage est renseigné. */
    if (lien.avantage) {
      html += '<p class="avantage-promo">' + echapper(lien.avantage) + "</p>";
    }

    var carte = document.createElement("article");
    carte.className =
      "carte-lien revele" + (utilisable ? "" : " a-venir") + (pret ? " carte-cliquable" : "");
    /* Index de recherche : le nom, le résumé, et tout le contenu de la
       fiche dépliable. Un mot lu dans « Ce que j'aime » doit ramener la
       carte, même si la fiche est repliée au moment de la recherche. */
    carte.dataset.recherche = normaliser(
      [
        lien.nom,
        lien.resume,
        lien.pourQui,
        lien.avis,
        listeRemplie(lien.jeUtilisePour).join(" "),
        listeRemplie(lien.avantages).join(" "),
        listeRemplie(lien.inconvenients).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
    );
    carte.dataset.nom = normaliser(lien.nom);
    carte.dataset.pret = utilisable ? "1" : "0";
    carte.dataset.position = String(position);
    carte.innerHTML = html;
    return carte;
  }

  /* ---------- 3. Rendu des pages catégorie ---------- */

  function rendrePageCategorie(zone) {
    var cleCategorie = zone.dataset.categorie;
    var categorie = CATEGORIES[cleCategorie];
    if (!categorie) return;

    var position = 0;

    /* Section « Mes indispensables » en tête, si la catégorie en a.
       Ces cartes sont des doublons volontaires des produits qui
       réapparaissent plus bas dans leur sous-catégorie. La section
       se masque dès qu'on recherche ou qu'on filtre (voir appliquer). */
    var indispensables = LIENS.filter(function (l) {
      return l.categorie === cleCategorie && l.indispensable && estVisible(l);
    });
    if (indispensables.length > 0) {
      var sectionI = document.createElement("section");
      sectionI.className = "section-indispensables";
      sectionI.setAttribute("aria-labelledby", "titre-indispensables");

      var enteteI = document.createElement("div");
      enteteI.className = "entete-indispensables";
      enteteI.innerHTML =
        '<span class="label-section">' + t("À ne pas manquer", "Not to be missed") + "</span>" +
        '<h2 id="titre-indispensables">' + t("Mes indispensables", "My essentials") + "</h2>" +
        "<p>" + t("Si je ne devais en retenir que quelques uns, ce serait ceux là.", "If I could only keep a few, it would be these.") + "</p>";
      sectionI.appendChild(enteteI);

      var grilleI = document.createElement("div");
      grilleI.className = "grille-liens";
      indispensables.forEach(function (lien, i) {
        var carte = construireCarte(lien, position);
        /* Le premier indispensable devient la carte vedette : bandeau
           pleine largeur en tête, seul bouton plein de la page. */
        if (i === 0) carte.classList.add("carte-vedette");
        grilleI.appendChild(carte);
        position += 1;
      });
      sectionI.appendChild(grilleI);
      zone.appendChild(sectionI);
    }

    var sousVisibles = [];
    Object.keys(categorie.sousCategories).forEach(function (cleSous) {
      var liens = LIENS.filter(function (l) {
        return l.categorie === cleCategorie && l.sousCategorie === cleSous && estVisible(l);
      });
      if (liens.length === 0) return;
      sousVisibles.push(cleSous);

      var section = document.createElement("section");
      section.className = "section-souscategorie";
      section.dataset.sousCategorie = cleSous;

      var titre = document.createElement("h2");
      titre.id = "section-" + cleSous;
      titre.textContent = categorie.sousCategories[cleSous];
      section.appendChild(titre);
      section.setAttribute("aria-labelledby", titre.id);

      var grille = document.createElement("div");
      grille.className = "grille-liens";
      liens.forEach(function (lien) {
        grille.appendChild(construireCarte(lien, position));
        position += 1;
      });
      section.appendChild(grille);
      zone.appendChild(section);
    });

    /* Aucune carte à montrer : la page affiche son encadré « en
       préparation » (écrit dans le HTML) et retire la barre de recherche,
       qui n'aurait rien à chercher. */
    if (sousVisibles.length === 0) {
      var preparation = document.querySelector("[data-en-preparation]");
      if (preparation) preparation.hidden = false;
      var barre = document.querySelector(".toolbar");
      if (barre) barre.hidden = true;
      return;
    }

    var message = document.createElement("p");
    message.className = "aucun-resultat";
    message.innerHTML = t("<b>Aucun résultat</b>Essaie un autre mot ou retire les filtres.", "<b>No results</b>Try another word or remove the filters.");
    zone.appendChild(message);

    construireToolbar(zone, categorie, sousVisibles);
  }

  /* ---------- 4. Recherche, filtres, tri ---------- */

  function construireToolbar(zone, categorie, sousVisibles) {
    var toolbar = document.querySelector(".toolbar");
    if (!toolbar) return;

    var chipsConteneur = toolbar.querySelector(".filtres-chips");
    var champ = toolbar.querySelector("input[type='search']");

    /* Chips : « Tout » + une par sous-catégorie qui a des cartes */
    var filtreActif = "tout";
    var cles = ["tout"].concat(sousVisibles);
    cles.forEach(function (cle) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.dataset.filtre = cle;
      chip.textContent = cle === "tout" ? t("Tout", "All") : categorie.sousCategories[cle];
      chip.setAttribute("aria-pressed", cle === "tout" ? "true" : "false");
      chip.addEventListener("click", function () {
        filtreActif = cle;
        chipsConteneur.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c.dataset.filtre === cle ? "true" : "false");
        });
        appliquer();
      });
      chipsConteneur.appendChild(chip);
    });

    function appliquer() {
      var requete = champ ? normaliser(champ.value.trim()) : "";
      var totalVisibles = 0;

      zone.querySelectorAll(".section-souscategorie").forEach(function (section) {
        var correspondFiltre =
          filtreActif === "tout" || section.dataset.sousCategorie === filtreActif;
        var visiblesSection = 0;

        section.querySelectorAll(".carte-lien").forEach(function (carte) {
          var visible =
            correspondFiltre &&
            (requete === "" || carte.dataset.recherche.indexOf(requete) !== -1);
          carte.style.display = visible ? "" : "none";
          if (visible) visiblesSection += 1;
        });

        section.style.display = visiblesSection > 0 ? "" : "none";
        totalVisibles += visiblesSection;
      });

      var message = zone.querySelector(".aucun-resultat");
      if (message) message.classList.toggle("visible", totalVisibles === 0);

      /* Les indispensables ne s'affichent qu'en vue par défaut, pour
         ne pas dupliquer les résultats pendant une recherche ou un tri
         par sous-catégorie. */
      var sectionIndisp = zone.querySelector(".section-indispensables");
      if (sectionIndisp) {
        sectionIndisp.style.display =
          requete === "" && filtreActif === "tout" ? "" : "none";
      }
    }

    if (champ) {
      champ.addEventListener("input", appliquer);
    }
  }

  /* ---------- 5. Accueil : compteurs et réseaux ---------- */

  function rendreAccueil() {
    /* Compteur de ressources par catégorie sur les grandes cartes.
       On prépare la valeur cible (data-vers), l'animation la comptera
       quand la carte entre à l'écran. */
    document.querySelectorAll("[data-compteur]").forEach(function (element) {
      var cle = element.dataset.compteur;
      var total = LIENS.filter(function (l) {
        return l.categorie === cle && estVisible(l);
      }).length;
      /* Catégorie encore vide : on l'annonce plutôt qu'un « 0 ressources ». */
      if (total === 0) {
        element.textContent = t("En préparation", "Coming soon");
        return;
      }
      element.dataset.vers = String(total);
      element.dataset.suffixe = total > 1 ? t(" ressources", " resources") : t(" ressource", " resource");
      element.textContent = "0" + element.dataset.suffixe;
    });

    /* Compteur global du hero */
    var statTotal = document.querySelector("[data-stat-total]");
    if (statTotal) {
      statTotal.dataset.vers = String(LIENS.filter(estVisible).length);
      statTotal.textContent = "0";
    }
  }

  /* Compte de 0 jusqu'à la valeur cible, avec une décélération douce. */
  function animerCompteur(element) {
    var cible = parseInt(element.dataset.vers, 10);
    if (isNaN(cible)) return;
    var suffixe = element.dataset.suffixe || "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = cible + suffixe;
      return;
    }

    var duree = 1100;
    var debut = null;
    function etape(horodatage) {
      if (debut === null) debut = horodatage;
      var progression = Math.min((horodatage - debut) / duree, 1);
      var adouci = 1 - Math.pow(1 - progression, 3);
      element.textContent = Math.round(adouci * cible) + suffixe;
      if (progression < 1) requestAnimationFrame(etape);
    }
    requestAnimationFrame(etape);
  }

  function initialiserCompteurs() {
    var compteurs = document.querySelectorAll("[data-vers]");
    if (compteurs.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      compteurs.forEach(animerCompteur);
      return;
    }

    var observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            animerCompteur(entree.target);
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    compteurs.forEach(function (c) {
      observateur.observe(c);
    });
  }

  /* Carrousel de logos (accueil) : deux copies identiques à la suite
     pour une boucle sans couture via translateX(-50%). */
  function construireMarque() {
    var piste = document.querySelector("[data-marquee] .marquee-piste");
    if (!piste) return;

    /* Une seule vignette par marque : plusieurs produits d'une même
       marque (ex. DJI) partagent un champ `marque` et ne s'affichent
       qu'une fois dans la bande. À défaut, on déduplique par nom. */
    var vus = {};
    var avecLogo = LIENS.filter(function (l) {
      if (!l.logo || !estVisible(l)) return false;
      var cle = l.marque || l.nom;
      if (vus[cle]) return false;
      vus[cle] = true;
      return true;
    });
    if (avecLogo.length === 0) {
      var bande = document.querySelector(".bande-marques");
      if (bande) bande.style.display = "none";
      return;
    }

    function creerItem(lien) {
      var item = document.createElement("span");
      item.className = "marque-item";
      /* Nom affiché au survol/clic : le nom de marque s'il est défini
         (ex. « DJI » plutôt que « DJI Osmo Action »), sinon le nom. */
      var nom = lien.marque || lien.nom;
      item.title = nom;
      item.dataset.nom = nom;
      var img = document.createElement("img");
      img.src = lien.logo;
      img.alt = "";
      /* Pas de lazy-load ici : dans une bande animée, les logos
         chargeraient trop tard et laisseraient des tuiles vides.
         Chargement direct mais en basse priorité (~6 Ko par logo). */
      img.decoding = "async";
      img.fetchPriority = "low";
      img.width = 40;
      img.height = 40;
      item.appendChild(img);
      return item;
    }

    for (var copie = 0; copie < 2; copie++) {
      avecLogo.forEach(function (lien) {
        piste.appendChild(creerItem(lien));
      });
    }

    activerNomMarque();
  }

  /* Clic/tap sur un logo : fige le défilement et affiche le nom de la
     marque juste sous la bande. Clic ailleurs : le nom disparaît et le
     défilement reprend. Fonctionne à l'identique souris et tactile. */
  function activerNomMarque() {
    var bande = document.querySelector(".bande-marques");
    var etiquette = document.querySelector("[data-nom-marque]");
    if (!bande || !etiquette) return;

    var itemActif = null;

    function effacer() {
      if (!itemActif) return;
      itemActif.classList.remove("actif");
      itemActif = null;
      bande.classList.remove("nom-actif");
      etiquette.textContent = "";
    }

    bande.addEventListener("click", function (evenement) {
      var item = evenement.target.closest(".marque-item");
      if (!item) return;
      evenement.stopPropagation();
      if (item === itemActif) {
        effacer();
        return;
      }
      if (itemActif) itemActif.classList.remove("actif");
      itemActif = item;
      item.classList.add("actif");
      etiquette.textContent = item.dataset.nom;
      bande.classList.add("nom-actif");
    });

    /* Clic n'importe où ailleurs : on referme. */
    document.addEventListener("click", effacer);
  }

  /* Collections thématiques (accueil) : remplit chaque bloc
     data-collection-bloc avec les produits listés dans COLLECTIONS. */
  function rendreCollections() {
    if (typeof COLLECTIONS === "undefined") return;
    document.querySelectorAll("[data-collection-bloc]").forEach(function (section) {
      var col = COLLECTIONS.filter(function (c) {
        return c.id === section.dataset.collectionBloc;
      })[0];
      var grille = section.querySelector("[data-collection]");
      if (!col || !grille) {
        section.remove();
        return;
      }

      var titre = section.querySelector("[data-collection-titre]");
      var sousTitre = section.querySelector("[data-collection-soustitre]");
      if (titre) titre.textContent = col.titre;
      if (sousTitre) sousTitre.textContent = col.sousTitre;

      var position = 0;
      col.produits.forEach(function (entree) {
        /* Une entrée est un id, ou { id, url } pour remplacer le lien
           de la fiche dans cette collection seulement. */
        var pid = typeof entree === "string" ? entree : entree.id;
        var lien = LIENS.filter(function (l) {
          return l.id === pid;
        })[0];
        if (lien && typeof entree === "object" && entree.url) {
          lien = Object.assign({}, lien, { url: entree.url });
        }
        if (lien && estVisible(lien)) {
          grille.appendChild(construireCarte(lien, position));
          position += 1;
        }
      });

      if (grille.children.length === 0) {
        section.remove();
        return;
      }
      section.hidden = false;
    });
  }

  /* Page Bons plans : toutes les cartes qui ont un code de parrainage
     utilisable. Rien à maintenir à la main, la page grandit d'elle même
     à chaque code ajouté dans liens.js. */
  function rendreBonsPlans() {
    var grille = document.querySelector("[data-bons-plans]");
    if (!grille) return;

    var avecCode = LIENS.filter(function (l) {
      return l.codePromo && estUtilisable(l);
    });

    avecCode.forEach(function (lien, i) {
      grille.appendChild(construireCarte(lien, i));
    });

    /* Aucun code actif : on le dit plutôt que de laisser une page vide. */
    var message = document.querySelector(".aucun-bon-plan");
    if (message) message.hidden = avecCode.length > 0;

    /* Pastille de statut : le compte est calculé, donc toujours juste.
       Elle remplace celle de la date, qui n'a pas de sens ici. */
    var contenu = document.querySelector(".hero-contenu");
    if (contenu && avecCode.length > 0) {
      var pastille = document.createElement("p");
      pastille.className = "pastille-statut";
      pastille.innerHTML =
        '<span class="point" aria-hidden="true"></span>' +
        avecCode.length +
        (avecCode.length > 1 ? t(" codes actifs", " active codes") : t(" code actif", " active code"));
      contenu.insertBefore(pastille, contenu.firstChild);
    }
  }

  /* Les sections des pages catégorie sont créées en JavaScript, donc après
     le saut d'ancre du navigateur. Un lien du menu vers #section-banque
     n'irait nulle part : on refait le saut une fois les cartes en place. */
  function rejoindreAncre() {
    if (!window.location.hash) return;
    var cible = document.getElementById(window.location.hash.slice(1));
    if (cible) cible.scrollIntoView();
  }

  /* Décalage de cascade : chaque carte reçoit un --stagger (0 à 2)
     selon sa position dans sa grille, pour révéler ligne par ligne. */
  function initialiserStagger() {
    document
      .querySelectorAll(".grille-liens, .grille-categories")
      .forEach(function (grille) {
        var cartes = grille.querySelectorAll(".revele");
        cartes.forEach(function (carte, index) {
          carte.style.setProperty("--stagger", index % 3);
        });
      });
  }

  function rendreReseaux() {
    document.querySelectorAll("[data-reseaux]").forEach(function (liste) {
      RESEAUX.forEach(function (reseau) {
        if (!estUrlReelle(reseau.url)) return;
        var item = document.createElement("li");
        var lien = document.createElement("a");
        lien.href = reseau.url;
        if (reseau.url.indexOf("http") === 0) {
          lien.target = "_blank";
          lien.rel = "noopener";
        }
        lien.innerHTML =
          '<span class="icone-reseau" aria-hidden="true">' + contenuIcone(reseau.icone) + "</span>" + echapper(reseau.nom);
        item.appendChild(lien);
        liste.appendChild(item);
      });
    });
  }

  /* ---------- 6. Interactions globales ---------- */

  var minuteurToast = null;
  function afficherToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  /* Repli de copie pour les navigateurs sans API clipboard (ou qui la
     refusent) : textarea invisible + execCommand, la méthode classique. */
  function copierTexteRepli(texte, messageSucces) {
    var zone = document.createElement("textarea");
    zone.value = texte;
    zone.setAttribute("readonly", "");
    zone.style.position = "fixed";
    zone.style.opacity = "0";
    document.body.appendChild(zone);
    zone.select();
    var reussi = false;
    try {
      reussi = document.execCommand("copy");
    } catch (erreur) {
      reussi = false;
    }
    document.body.removeChild(zone);
    afficherToast(reussi ? messageSucces : t("Copie impossible sur ce navigateur", "Copying is not possible in this browser"));
  }

  function copierTexte(texte, messageSucces) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(
        function () {
          afficherToast(messageSucces);
        },
        function () {
          copierTexteRepli(texte, messageSucces);
        }
      );
    } else {
      copierTexteRepli(texte, messageSucces);
    }
  }

  /* Repli logo -> pictogramme : les évènements "error" des <img> ne remontent
     pas (pas de bubbling), on écoute donc en phase de capture sur le
     document entier plutôt que d'attacher un écouteur par carte. */
  document.addEventListener(
    "error",
    function (evenement) {
      var img = evenement.target;
      if (!img.matches || !img.matches(".icone-lien.avec-logo img")) return;
      var conteneur = img.parentElement;
      conteneur.classList.remove("avec-logo");
      conteneur.className = img.dataset.secoursClasse;
      conteneur.setAttribute("aria-hidden", "true");
      conteneur.innerHTML = contenuIcone(img.dataset.secours);
    },
    true
  );

  /* Un seul écouteur pour les interactions des cartes. */
  document.addEventListener("click", function (evenement) {
    /* 1. Boutons de copie du code : prioritaires, jamais de navigation. */
    var bouton = evenement.target.closest("[data-action]");
    if (bouton) {
      if (bouton.dataset.action === "copier-code") {
        copierTexte(bouton.dataset.code, t("Code " + bouton.dataset.code + " copié", "Code " + bouton.dataset.code + " copied"));
      }
      return;
    }

    /* 2. Clic ailleurs sur une carte avec lien : ouvre le lien de
          parrainage, comme le bouton Découvrir. Un clic direct sur le
          bouton s'ouvre nativement (laissé passer), et on ne navigue pas
          pendant une sélection de texte. */
    if (evenement.target.closest("a")) return;
    /* La fiche dépliable vit à l'intérieur d'une carte cliquable : sans
       cette garde, ouvrir la fiche partirait aussitôt sur le lien. */
    if (evenement.target.closest("details")) return;
    if (window.getSelection && String(window.getSelection())) return;
    var carte = evenement.target.closest(".carte-lien");
    if (!carte) return;
    var lien = carte.querySelector("a.btn-lien[href]");
    if (!lien) return;
    /* Lien externe : nouvel onglet. Lien interne (pages du site) :
       navigation classique, pour ne pas multiplier les onglets. */
    if (lien.target === "_blank") {
      window.open(lien.href, "_blank", "noopener");
    } else {
      window.location.href = lien.href;
    }
  });

  /* Menu mobile : le bouton hamburger déplie la navigation sous la barre.
     Aucun état n'est stocké, la classe sur le <nav> suffit, et l'attribut
     aria-expanded du bouton pilote à la fois l'accessibilité et l'icône. */
  function initialiserMenu() {
    var bouton = document.querySelector(".bouton-menu");
    var nav = document.getElementById("nav-principale");
    if (!bouton || !nav) return;

    function fermer() {
      nav.classList.remove("ouvert");
      bouton.setAttribute("aria-expanded", "false");
    }

    bouton.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });

    /* On referme après un clic sur un lien : sur une ancre de la même page,
       le menu resterait sinon ouvert par dessus le contenu visé. */
    nav.addEventListener("click", function (evenement) {
      if (evenement.target.closest("a")) fermer();
    });

    document.addEventListener("keydown", function (evenement) {
      if (evenement.key === "Escape") fermer();
    });

    /* Passage en grand écran : la navigation reprend sa forme de barre,
       la classe n'a plus de sens et fausserait l'état du bouton. */
    window.matchMedia("(min-width: 860px)").addEventListener("change", function (e) {
      if (e.matches) fermer();
    });
  }

  /* Le méga menu est écrit en dur dans chaque page. Un lien vers une
     rubrique qui n'a aucune carte visible (par exemple sport.html#section-
     chaussures tant qu'aucun lien n'est rempli) mènerait à une section qui
     n'existe pas : on le masque, puis la colonne si elle se retrouve vide.
     Un panneau sans aucune colonne reçoit une courte note à la place. */
  function elaguerMegaMenu() {
    var pages = {};
    Object.keys(CATEGORIES).forEach(function (cle) {
      pages[CATEGORIES[cle].page] = cle;
    });

    document.querySelectorAll('.megamenu a[href*="#section-"]').forEach(function (a) {
      var morceaux = a.getAttribute("href").split("#section-");
      var cleCategorie = pages[morceaux[0].split("/").pop()];
      if (!cleCategorie) return;
      var aDesCartes = LIENS.some(function (l) {
        return l.categorie === cleCategorie && l.sousCategorie === morceaux[1] && estVisible(l);
      });
      if (!aDesCartes) a.closest("li").hidden = true;
    });

    document.querySelectorAll(".megamenu-colonne").forEach(function (colonne) {
      var liens = colonne.querySelectorAll("li");
      if (liens.length === 0) return;
      var restants = [].filter.call(liens, function (li) {
        return !li.hidden;
      });
      if (restants.length === 0) colonne.hidden = true;
    });

    document.querySelectorAll(".megamenu-grille").forEach(function (grille) {
      var colonnes = grille.querySelectorAll(".megamenu-colonne");
      var visibles = [].filter.call(colonnes, function (c) {
        return !c.hidden;
      });
      if (colonnes.length === 0 || visibles.length > 0) return;
      var note = document.createElement("div");
      note.className = "megamenu-colonne megamenu-preparation";
      note.innerHTML =
        '<p class="megamenu-titre">' + t("En préparation", "Coming soon") + "</p>" +
        "<p>" + t("Ma sélection arrive. Je n'affiche ici que ce que j'utilise, avec un lien vérifié.",
                  "My selection is on its way. I only list what I use, with a verified link.") + "</p>";
      grille.insertBefore(note, grille.firstChild);
    });
  }

  /* Méga menu. Le HTML des panneaux est écrit en dur dans chaque page :
     Google suit donc tous ces liens internes, et la navigation reste
     entièrement utilisable sans JavaScript (survol en CSS sur grand écran,
     panneaux visibles à la suite sur téléphone).
     Le JavaScript n'ajoute que le confort : ouverture au clic pour le
     tactile et le clavier, fermeture par Échap ou par un clic à côté. */
  function initialiserMegaMenu() {
    var items = document.querySelectorAll(".nav-item-deroulant");
    if (items.length === 0) return;

    function fermerTout(sauf) {
      items.forEach(function (item) {
        if (item === sauf) return;
        item.classList.remove("deroule");
        var b = item.querySelector(".bouton-deroulant");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }

    items.forEach(function (item) {
      var bouton = item.querySelector(".bouton-deroulant");
      if (!bouton) return;
      bouton.addEventListener("click", function (evenement) {
        evenement.stopPropagation();
        var ouvert = item.classList.toggle("deroule");
        bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
        fermerTout(item);
      });
    });

    /* Un clic sur un lien du panneau doit laisser la navigation se faire :
       on ferme seulement, sans bloquer l'événement. */
    document.addEventListener("click", function (evenement) {
      if (evenement.target.closest(".nav-item-deroulant")) return;
      fermerTout(null);
    });

    document.addEventListener("keydown", function (evenement) {
      if (evenement.key === "Escape") fermerTout(null);
    });

    /* Changement de format : les panneaux repassent en survol sur grand
       écran, l'état déplié n'a plus de sens et resterait coincé. */
    window.matchMedia("(min-width: 860px)").addEventListener("change", function () {
      fermerTout(null);
    });
  }


  /* ---------- Vidéos YouTube ----------
     On n'insère pas l'iframe YouTube au chargement : elle pèse plus d'un mégaoctet
     de scripts et pose des cookies avant même qu'on ait cliqué. À la place on
     affiche la miniature, et l'iframe ne remplace le lien qu'au clic. Sans
     JavaScript, le lien reste un lien vers YouTube, donc rien n'est cassé. */
  function initialiserVideosYoutube() {
    var liens = document.querySelectorAll("[data-youtube]");
    if (!liens.length) return;

    Array.prototype.forEach.call(liens, function (lien) {
      lien.addEventListener("click", function (evenement) {
        var identifiant = lien.getAttribute("data-youtube");
        if (!identifiant) return;
        evenement.preventDefault();

        var cadre = document.createElement("iframe");
        /* nocookie : pas de cookie publicitaire posé par la lecture. */
        cadre.src =
          "https://www.youtube-nocookie.com/embed/" +
          encodeURIComponent(identifiant) +
          "?autoplay=1&rel=0";
        cadre.title = lien.getAttribute("data-titre") || t("Vidéo YouTube", "YouTube video");
        cadre.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        cadre.allowFullscreen = true;
        cadre.loading = "lazy";
        cadre.setAttribute("frameborder", "0");

        lien.parentNode.replaceChild(cadre, lien);
      });
    });
  }
  /* Retour en haut, et ombre de l'entête dès qu'on quitte le haut de page.
     Les deux partagent le même écouteur de défilement. */
  function initialiserRetourHaut() {
    var bouton = document.querySelector(".retour-haut");
    var entete = document.querySelector(".entete");
    if (!bouton) return;

    var enAttente = false;
    window.addEventListener(
      "scroll",
      function () {
        if (enAttente) return;
        enAttente = true;
        requestAnimationFrame(function () {
          bouton.classList.toggle("visible", window.scrollY > 600);
          if (entete) entete.classList.toggle("defile", window.scrollY > 8);
          enAttente = false;
        });
      },
      { passive: true }
    );

    bouton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Apparition au scroll avec IntersectionObserver natif */
  /* Mode brouillon : réaffiche les blocs « à écrire », masqués en ligne.
     Actif automatiquement quand on travaille en local, et à la demande
     partout ailleurs en ajoutant ?brouillon à l'URL. Le choix est retenu
     pour la session, pour pouvoir naviguer de page en page sans le
     retaper. */
  function initialiserModeBrouillon() {
    if (BROUILLON) {
      document.documentElement.classList.add("mode-brouillon");
    }
  }

  /* Pastille de statut en tête de page. Sur un article, elle reprend la
     date de mise à jour déjà affichée en bas : l'information est lue depuis
     le HTML existant, donc elle ne peut pas se désynchroniser, et il n'y a
     rien à ajouter dans les 24 pages. */
  function initialiserPastilleStatut() {
    var contenu = document.querySelector(".hero-contenu");
    if (!contenu || contenu.querySelector(".pastille-statut")) return;

    var date = document.querySelector(".date-maj time");
    if (!date) return;

    var pastille = document.createElement("p");
    pastille.className = "pastille-statut";
    pastille.innerHTML =
      '<span class="point" aria-hidden="true"></span>' + t("Mis à jour le ", "Updated on ") + echapper(date.textContent);
    contenu.insertBefore(pastille, contenu.firstChild);
  }

  /* Marque les blocs visuels d'un article pour qu'ils apparaissent au
     défilement. C'est fait ici plutôt que dans les 17 pages concernées :
     une seule liste à maintenir, et les futurs articles en héritent.
     Le texte courant n'est volontairement jamais marqué. */
  function preparerAnimationsArticle() {
    var zone = document.querySelector("main");
    if (!zone) return;

    /* Photos : variante plus lente, voir .revele-photo dans le style. */
    zone.querySelectorAll(".photo-article").forEach(function (figure) {
      figure.classList.add("revele", "revele-photo");
    });

    /* Dans une paire, la seconde photo suit la première d'un souffle. */
    zone.querySelectorAll(".duo-photos").forEach(function (duo) {
      duo.querySelectorAll(".photo-article").forEach(function (figure, i) {
        figure.style.setProperty("--stagger", i);
      });
    });

    zone
      .querySelectorAll(
        ".tableau-comparatif, .encadre-ressources, .autres-guides, .bloc-code-promo, .avant-apres > div, .bande-cta"
      )
      .forEach(function (bloc) {
        bloc.classList.add("revele");
      });

    /* Séries : chaque élément suit le précédent, dans l'ordre de lecture.
       Le décalage est plafonné, sinon la dernière étape d'une longue
       frise attendrait une seconde de trop. */
    [
      ".reperes .repere",
      ".frise li",
      ".grille-apps .carte-app",
      ".grille-points .point"
    ].forEach(function (selecteur) {
      zone.querySelectorAll(selecteur).forEach(function (element, i) {
        element.classList.add("revele");
        element.style.setProperty("--stagger", Math.min(i, 5));
      });
    });
  }

  function initialiserApparition() {
    var elements = document.querySelectorAll(".revele");
    if (elements.length === 0) return;

    /* Préférence système : tout est là d'emblée, sans transition. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach(function (element) {
        element.classList.add("visible");
      });
      return;
    }

    /* Une photo pas encore chargée ferait un fondu sur du vide : on attend
       son arrivée. Le délai de sécurité couvre le cas où l'image ne
       répond jamais, du contenu invisible étant pire qu'un fondu raté. */
    function reveler(element) {
      var image = element.classList.contains("revele-photo")
        ? element.querySelector("img")
        : null;
      if (!image || image.complete) {
        element.classList.add("visible");
        return;
      }
      var fait = false;
      function montrer() {
        if (fait) return;
        fait = true;
        element.classList.add("visible");
      }
      image.addEventListener("load", montrer, { once: true });
      image.addEventListener("error", montrer, { once: true });
      setTimeout(montrer, 1200);
    }

    /* Repli sans observateur : on révèle au défilement, au même seuil.
       Sert quand IntersectionObserver manque, et quand ses callbacks sont
       gelés (onglet en arrière plan, navigateur bridé). Révéler toute la
       page d'un coup, comme avant, faisait disparaître l'animation dès
       qu'un article n'avait aucun bloc au dessus de la ligne de flottaison. */
    function replierSurLeDefilement(restants) {
      var enAttente = false;

      function passer() {
        enAttente = false;
        var seuil = window.innerHeight * 0.92;
        restants = restants.filter(function (element) {
          if (element.getBoundingClientRect().top >= seuil) return true;
          reveler(element);
          return false;
        });
        if (restants.length === 0) {
          window.removeEventListener("scroll", planifier);
          window.removeEventListener("resize", planifier);
        }
      }

      function planifier() {
        if (enAttente) return;
        enAttente = true;
        window.requestAnimationFrame(passer);
      }

      window.addEventListener("scroll", planifier, { passive: true });
      window.addEventListener("resize", planifier);
      passer();
    }

    if (!("IntersectionObserver" in window)) {
      replierSurLeDefilement([].slice.call(elements));
      return;
    }

    /* Preuve que l'observateur tourne. Sur un article, tous les blocs
       animés sont sous la ligne de flottaison : se contenter de vérifier
       qu'un élément est visible ferait croire à une panne. */
    var observateurVivant = false;

    var observateur = new IntersectionObserver(
      function (entrees) {
        observateurVivant = true;
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            reveler(entree.target);
            observateur.unobserve(entree.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    elements.forEach(function (element) {
      observateur.observe(element);
    });

    /* Filet de sécurité : si l'observateur ne s'est jamais exécuté, on
       bascule sur le repli au défilement plutôt que de tout révéler. */
    setTimeout(function () {
      if (observateurVivant) return;
      observateur.disconnect();
      replierSurLeDefilement(
        [].filter.call(elements, function (element) {
          return !element.classList.contains("visible");
        })
      );
    }, 900);
  }

  /* ---------- Démarrage ---------- */

  var zoneLiens = document.querySelector("[data-categorie]");
  if (zoneLiens) rendrePageCategorie(zoneLiens);

  rendreAccueil();
  rendreReseaux();
  construireMarque();
  initialiserModeBrouillon();
  rendreCollections();
  rendreBonsPlans();
  /* Après rendreBonsPlans : sur la page des codes, c'est elle qui pose sa
     propre pastille, et la fonction ci dessous ne la double pas. */
  initialiserPastilleStatut();
  /* Avant initialiserApparition : c'est elle qui pose les classes que
     l'observateur ira ensuite chercher. */
  preparerAnimationsArticle();
  initialiserStagger();
  initialiserCompteurs();
  initialiserMenu();
  elaguerMegaMenu();
  initialiserMegaMenu();
  initialiserRetourHaut();
  initialiserVideosYoutube();
  initialiserApparition();
  /* En dernier : les sections visées par une ancre existent maintenant. */
  rejoindreAncre();
})();
