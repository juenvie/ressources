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

  /** Une url de réseau social est réelle si ce n'est pas un placeholder. */
  function estUrlReelle(url) {
    return typeof url === "string" && url.length > 0 && !url.startsWith("LIEN_A_REMPLIR");
  }

  /** L'accroche perso n'est affichée que si Julien l'a remplie. */
  function accrocheRemplie(accroche) {
    return typeof accroche === "string" && accroche.length > 0 && !accroche.startsWith("[");
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

  /** Détecte si l'icône est une simple initiale (lettre) ou un emoji. */
  function estInitiale(icone) {
    return typeof icone === "string" && /^[a-zA-ZÀ-ÿ]{1,2}$/.test(icone);
  }

  var ICONE_COPIE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  var ICONE_PARTAGE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

  /* ---------- 2. Construction des cartes produit ---------- */

  function construireBadges(lien, pret) {
    var morceaux = [];
    if (lien.badge && BADGES[lien.badge]) {
      var b = BADGES[lien.badge];
      morceaux.push('<span class="badge ' + b.classe + '">' + echapper(b.label) + "</span>");
    }
    if (!pret) {
      morceaux.push('<span class="badge badge-bientot">Bientôt</span>');
    }
    if (morceaux.length === 0) return "";
    return '<div class="badges-carte">' + morceaux.join("") + "</div>";
  }

  function construireCarte(lien, position) {
    var pret = estLienPret(lien);
    var nom = echapper(lien.nom);

    var html = '<div class="entete-carte">';
    var classeIcone = estInitiale(lien.icone) ? "icone-lien initiale" : "icone-lien";
    if (lien.logo) {
      /* data-secours : si l'image de marque est introuvable (404),
         gererErreurLogo() retombe sur l'emoji plutôt que de laisser
         une icône cassée. Voir l'écouteur "error" global plus bas. */
      html +=
        '<span class="icone-lien avec-logo">' +
        '<img src="' + echapper(lien.logo) + '" alt="" loading="lazy" ' +
        'data-secours="' + echapper(lien.icone) + '" ' +
        'data-secours-classe="' + classeIcone + '"></span>';
    } else {
      html += '<span class="' + classeIcone + '" aria-hidden="true">' + echapper(lien.icone) + "</span>";
    }
    html += "<h3>" + nom + "</h3>";
    html += "</div>";

    if (lien.resume) {
      html += '<p class="resume">' + echapper(lien.resume) + "</p>";
    }
    if (accrocheRemplie(lien.accroche)) {
      html += '<p class="accroche">' + echapper(lien.accroche) + "</p>";
    }

    html += construireBadges(lien, pret);

    if (lien.codePromo) {
      html +=
        '<button type="button" class="code-promo" data-action="copier-code" data-code="' +
        echapper(lien.codePromo) +
        '" aria-label="Copier le code ' +
        echapper(lien.codePromo) +
        " de " +
        nom +
        '">' +
        '<span class="etiquette">Code</span> ' +
        echapper(lien.codePromo) +
        "</button>";
    }

    html += '<div class="actions-carte">';
    if (pret) {
      html +=
        '<a class="btn-lien" href="' +
        echapper(lien.url) +
        '" target="_blank" rel="sponsored noopener">Découvrir</a>';
      html +=
        '<button type="button" class="btn-icone" data-action="copier-lien" data-url="' +
        echapper(lien.url) +
        '" aria-label="Copier le lien de ' + nom + '">' + ICONE_COPIE + "</button>";
      html +=
        '<button type="button" class="btn-icone" data-action="partager" data-url="' +
        echapper(lien.url) +
        '" data-nom="' + nom + '" aria-label="Partager ' + nom + '">' + ICONE_PARTAGE + "</button>";
    } else {
      html += '<span class="btn-lien desactive">Bientôt disponible</span>';
    }
    html += "</div>";

    var carte = document.createElement("article");
    carte.className = "carte-lien revele" + (pret ? "" : " a-venir");
    carte.dataset.recherche = normaliser(lien.nom + " " + (lien.resume || ""));
    carte.dataset.nom = normaliser(lien.nom);
    carte.dataset.pret = pret ? "1" : "0";
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
      return l.categorie === cleCategorie && l.indispensable;
    });
    if (indispensables.length > 0) {
      var sectionI = document.createElement("section");
      sectionI.className = "section-indispensables";
      sectionI.setAttribute("aria-labelledby", "titre-indispensables");

      var enteteI = document.createElement("div");
      enteteI.className = "entete-indispensables";
      enteteI.innerHTML =
        '<span class="label-section">À ne pas manquer</span>' +
        '<h2 id="titre-indispensables">Mes indispensables</h2>' +
        "<p>Si je ne devais en retenir que quelques uns, ce serait ceux là.</p>";
      sectionI.appendChild(enteteI);

      var grilleI = document.createElement("div");
      grilleI.className = "grille-liens";
      indispensables.forEach(function (lien) {
        grilleI.appendChild(construireCarte(lien, position));
        position += 1;
      });
      sectionI.appendChild(grilleI);
      zone.appendChild(sectionI);
    }

    Object.keys(categorie.sousCategories).forEach(function (cleSous) {
      var liens = LIENS.filter(function (l) {
        return l.categorie === cleCategorie && l.sousCategorie === cleSous;
      });
      if (liens.length === 0) return;

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

    var message = document.createElement("p");
    message.className = "aucun-resultat";
    message.innerHTML = "<b>Aucun résultat</b>Essaie un autre mot ou retire les filtres.";
    zone.appendChild(message);

    construireToolbar(zone, categorie, cleCategorie);
  }

  /* ---------- 4. Recherche, filtres, tri ---------- */

  function construireToolbar(zone, categorie, cleCategorie) {
    var toolbar = document.querySelector(".toolbar");
    if (!toolbar) return;

    var chipsConteneur = toolbar.querySelector(".filtres-chips");
    var champ = toolbar.querySelector("input[type='search']");
    var tri = toolbar.querySelector(".selecteur-tri");

    /* Chips : « Tout » + une par sous-catégorie */
    var filtreActif = "tout";
    var cles = ["tout"].concat(Object.keys(categorie.sousCategories));
    cles.forEach(function (cle) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.dataset.filtre = cle;
      chip.textContent = cle === "tout" ? "Tout" : categorie.sousCategories[cle];
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

    if (tri) {
      tri.addEventListener("change", function () {
        var mode = tri.value;
        zone.querySelectorAll(".grille-liens").forEach(function (grille) {
          var cartes = Array.prototype.slice.call(grille.children);
          cartes.sort(function (a, b) {
            if (mode === "alpha") {
              return a.dataset.nom.localeCompare(b.dataset.nom, "fr");
            }
            if (mode === "disponibles") {
              if (a.dataset.pret !== b.dataset.pret) {
                return a.dataset.pret === "1" ? -1 : 1;
              }
            }
            return Number(a.dataset.position) - Number(b.dataset.position);
          });
          cartes.forEach(function (carte) {
            grille.appendChild(carte);
          });
        });
      });
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
        return l.categorie === cle;
      }).length;
      element.dataset.vers = String(total);
      element.dataset.suffixe = " ressources";
      element.textContent = "0 ressources";
    });

    /* Compteur global du hero */
    var statTotal = document.querySelector("[data-stat-total]");
    if (statTotal) {
      statTotal.dataset.vers = String(LIENS.length);
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
      if (!l.logo) return false;
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
      col.produits.forEach(function (pid) {
        var lien = LIENS.filter(function (l) {
          return l.id === pid;
        })[0];
        if (lien) {
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
          '<span aria-hidden="true">' + echapper(reseau.icone) + "</span>" + echapper(reseau.nom);
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

  function copierTexte(texte, messageSucces) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(
        function () {
          afficherToast(messageSucces);
        },
        function () {
          afficherToast("Copie impossible sur ce navigateur");
        }
      );
    } else {
      afficherToast("Copie impossible sur ce navigateur");
    }
  }

  /* Repli logo -> emoji : les évènements "error" des <img> ne remontent
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
      conteneur.textContent = img.dataset.secours;
    },
    true
  );

  /* Un seul écouteur pour toutes les actions des cartes */
  document.addEventListener("click", function (evenement) {
    var bouton = evenement.target.closest("[data-action]");
    if (!bouton) return;

    var action = bouton.dataset.action;
    if (action === "copier-lien") {
      copierTexte(bouton.dataset.url, "Lien copié");
    } else if (action === "copier-code") {
      copierTexte(bouton.dataset.code, "Code " + bouton.dataset.code + " copié");
    } else if (action === "partager") {
      var donnees = { title: bouton.dataset.nom, url: bouton.dataset.url };
      if (navigator.share) {
        navigator.share(donnees).catch(function () {
          /* Partage annulé par l'utilisateur : rien à faire */
        });
      } else {
        copierTexte(bouton.dataset.url, "Lien copié, prêt à partager");
      }
    }
  });

  /* Retour en haut */
  function initialiserRetourHaut() {
    var bouton = document.querySelector(".retour-haut");
    if (!bouton) return;

    var enAttente = false;
    window.addEventListener(
      "scroll",
      function () {
        if (enAttente) return;
        enAttente = true;
        requestAnimationFrame(function () {
          bouton.classList.toggle("visible", window.scrollY > 600);
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
  function initialiserApparition() {
    var elements = document.querySelectorAll(".revele");
    if (elements.length === 0) return;

    var prefereReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefereReduit || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("visible");
      });
      return;
    }

    var observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    elements.forEach(function (element) {
      observateur.observe(element);
    });

    /* Filet de sécurité : si l'observer ne s'est déclenché pour aucun
       élément (onglet en arrière-plan, navigateur qui gèle les
       callbacks), on révèle tout. Du contenu invisible est pire
       qu'une animation manquée. */
    setTimeout(function () {
      if (!document.querySelector(".revele.visible")) {
        elements.forEach(function (element) {
          element.classList.add("visible");
        });
        observateur.disconnect();
      }
    }, 900);
  }

  /* ---------- Démarrage ---------- */

  var zoneLiens = document.querySelector("[data-categorie]");
  if (zoneLiens) rendrePageCategorie(zoneLiens);

  rendreAccueil();
  rendreReseaux();
  construireMarque();
  rendreCollections();
  initialiserStagger();
  initialiserCompteurs();
  initialiserRetourHaut();
  initialiserApparition();
})();
