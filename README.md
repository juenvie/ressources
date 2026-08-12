# Ju.en.vie — Affiliate Hub

Le hub de ressources qui remplace le Linktree. Un site statique pur (HTML, CSS, JS), sans framework, sans build step, prêt pour GitHub Pages.

```
Affiliate Hub/
  index.html        Accueil : hero, 5 cartes univers, réseaux
  voyage.html       Ressources voyage
  sport.html        Ressources running
  creation.html     Ressources création vidéo
  australie.html    Page pilier de l'univers PVT Australie
  australie-visa.html      Étape 1 : le visa Working Holiday 417
  australie-assurance.html Étape 2 : choisir son assurance
  australie-budget.html    Étape 3 : le budget du PVT
  australie-argent.html    Étape 4 : banque, impôts et superannuation
  australie-arrivee.html   Étape 5 : les premiers jours sur place
  australie-trouver-un-job.html Étape 6 : trouver un job (sites et applications)
  australie-88-jours.html  Étape 7 : le travail spécifié
  comparatif-assurance-voyage.html  Comparatif : choisir son assurance
  comparatif-esim.html              Comparatif : choisir son eSIM
  code-promo-getyourguide.html      Gabarit de page code promo
  bons-plans.html   Tous les codes de parrainage actifs, remplie automatiquement
  guides.html       Les guides de voyage par destination
  guide-bali.html        Article : voyager à Bali
  guide-komodo.html      Article : la croisière de Komodo
  guide-laos.html        Article : voyager au Laos
  guide-vietnam.html     Article : voyager au Vietnam
  guide-philippines.html Article : voyager aux Philippines
  guide-new-york.html    Article : une semaine à New York
  css/style.css     Tout le style (thème sombre chaud Ju.en.vie)
  js/main.js        Moteur d'affichage (lit data/liens.js)
  data/liens.js     ⭐ LE fichier à modifier au quotidien
  assets/           Favicon, og-image, logo
  assets/photos/    Toutes les photos du site (originaux dans un sous dossier)
  assets/logos/     Un logo carré par marque, utilisé sur les cartes produit
  robots.txt        SEO
  sitemap.xml       SEO
```

---

## 1. Modifier un lien (l'opération de tous les jours)

Tout vit dans **`data/liens.js`**. Jamais dans le HTML.

Quand tu reçois un vrai lien affilié :

1. Ouvre `data/liens.js`
2. Cherche le partenaire avec Cmd+F (exemple : `getyourguide`)
3. Remplace le placeholder de la ligne `url` :

```js
// Avant
url: "LIEN_A_REMPLIR_GETYOURGUIDE",
// Après
url: "https://www.getyourguide.fr/?partner_id=TONID",
```

C'est tout. La carte passe automatiquement de « Bientôt » à active, avec le bouton Découvrir (et toute la carte devient cliquable vers ton lien).

Règles automatiques du moteur :

| Ce que tu fais dans `liens.js` | Ce qui se passe sur le site |
|---|---|
| `url` commence par `LIEN_A_REMPLIR` (et pas de `codePromo`) | Carte grisée « Bientôt disponible », jamais de lien mort |
| `url` est un vrai lien | Carte active : bouton Découvrir + toute la carte cliquable vers le lien |
| `codePromo` rempli mais `url` en `LIEN_A_REMPLIR` | Carte active « code seul » : pastille copiable, pas de bouton Découvrir (ex. Fortuneo) |
| `statut: "a-venir"` | Carte grisée même si l'url est réelle (pour préparer à l'avance) |
| `codePromo: "JUENVIE5"` | Encadré doré copiable (tap sur la pastille ou sur le bouton copier à côté) |
| `avantage: "5% de réduction"` | Légende centrée discrète sous le bouton, pour dire ce que le code offre |
| `accroche` commence par `[` | La phrase n'est pas affichée (placeholder) |
| `accroche: "Je l'utilise depuis Bangkok"` | La phrase perso s'affiche en italique orange |
| `badge: "prefere"` | Badge « Mon préféré » sur la carte (liste des clés dans `BADGES`) |

## 1 bis. La fiche dépliable « Mon avis en détail »

Sous chaque carte produit, un bloc repliable donne le détail. Il utilise la balise `<details>` native : aucun JavaScript, le contenu replié reste dans le HTML donc **Google l'indexe quand même**, et le clavier fonctionne sans rien ajouter.

Six champs facultatifs l'alimentent, tous indépendants. Un champ vide ne s'affiche pas, et si aucun n'est rempli la fiche n'apparaît pas du tout.

| Champ | Ce qu'il donne |
|---|---|
| `avis` | Le paragraphe à la première personne, en italique avec un liseré orange. C'est le cœur de la fiche. |
| `jeUtilisePour` | Liste d'usages concrets, chevrons orange |
| `avantages` | Liste « Ce que j'aime », puces vertes |
| `inconvenients` | Liste « Les limites », puces grises |
| `pourQui` | Encadré doré en bas de la fiche |
| `depuisQuand` | Ligne courte sous les badges, avec une pastille dorée (ex. « Utilisé depuis 2023 ») |

Les 77 produits ont déjà leurs `avantages`, `inconvenients` et `pourQui` remplis de façon factuelle : corrige librement si ton expérience diffère. Les trois champs personnels (`avis`, `jeUtilisePour`, `depuisQuand`) sont en `[BROUILLON : ...]`, donc invisibles tant que tu ne les as pas écrits.

Deux règles à garder :

- **Toujours au moins un inconvénient.** Une fiche sans défaut ne convainc personne, et c'est exactement ce qui distingue un avis d'une publicité.
- **L'`avis` avant tout le reste.** Les avantages, n'importe quel site les liste. Ton avis, personne ne peut le copier.

Le libellé du bouton s'adapte tout seul : « Voir le prix » sur le matériel (bagages, chaussures, montres, audio, accessoires, nutrition, récupération, matériel), « Découvrir » sur les services. Un champ `libelleAction` sur un lien l'emporte toujours.

## 2. Ajouter un produit

Dans `data/liens.js`, copie un bloc existant de la même sous-catégorie, colle le à côté et change les valeurs :

```js
{
  id: "insta360",                    // unique, en minuscules
  nom: "Insta360",
  categorie: "creation",             // voyage | sport | creation
  sousCategorie: "materiel",         // une clé déclarée dans CATEGORIES
  url: "LIEN_A_REMPLIR_INSTA360",
  codePromo: null,                   // ex. "JUENVIE5" → pastille dorée copiable
  avantage: null,                    // ex. "5% de réduction" (légende sous le bouton)
  resume: "Caméras 360 pour des plans impossibles.",  // non affiché, sert à la recherche
  accroche: "[Pourquoi j'utilise ce produit]",
  // Fiche dépliable, tout est facultatif (voir section 1 bis)
  avis: "[Ton avis développé, deux ou trois phrases]",
  jeUtilisePour: ["Filmer en marchant", "Les plans à la volée"],
  avantages: ["Stabilisation efficace", "Se range dans une poche"],
  inconvenients: ["Autonomie faible"],
  pourQui: "Qui filme seul et veut du 360 sans trépied.",
  depuisQuand: "[Utilisé depuis 2023]",
  badge: null,
  icone: "🎥",                        // emoji de repli
  logo: "assets/logos/insta360.png",  // optionnel, voir section logos plus bas
  statut: "actif",
},
```

Il apparaît immédiatement au bon endroit sur la bonne page, dans la recherche et les filtres. L'ordre des cartes suit l'ordre du fichier.

## 3. Ajouter une sous-catégorie

Dans `data/liens.js`, section `CATEGORIES`, ajoute une ligne dans la catégorie voulue :

```js
sousCategories: {
  "materiel":    "Matériel vidéo",
  "accessoires": "Accessoires",
  "logiciels":   "Logiciels et apps",
  "ia":          "Outils IA",        // ← nouvelle sous-catégorie
},
```

Puis utilise la clé `"ia"` dans tes produits. La section, son titre et sa puce de filtre se créent automatiquement.

## 4. Mes indispensables (haut des pages catégories)

Chaque page catégorie affiche en tête un encart « Mes indispensables » avec tes produits phares, avant les sous-catégories. Pour choisir lesquels : ajoute `indispensable: true,` dans le produit voulu, dans `data/liens.js`.

```js
{
  id: "wise",
  nom: "Wise",
  ...
  indispensable: true,   // ← apparaît dans l'encart en haut de la page Voyage
  statut: "actif",
},
```

Le produit reste aussi affiché dans sa sous-catégorie normale plus bas (c'est voulu, l'encart est une mise en avant). L'encart se masque tout seul dès qu'un visiteur lance une recherche ou choisit un filtre, pour ne pas afficher deux fois le même résultat. Vise 3 ou 4 indispensables par page, au delà ça dilue.

## 5. Collections thématiques (accueil)

L'accueil peut afficher des blocs « collection » qui regroupent des produits de catégories différentes autour d'un contexte, par exemple « Spécial PVT Australie ». Tout se pilote dans le tableau `COLLECTIONS`, en bas de `data/liens.js` :

```js
const COLLECTIONS = [
  {
    id: "pvt-australie",
    titre: "Spécial PVT Australie",
    sousTitre: "Le kit que je prépare en premier pour mon départ en Working Holiday.",
    produits: ["wise", "chapka", "airalo", "osprey", "adaptateur-universel"],   // des id de produits, dans l'ordre voulu
  },
];
```

Pour changer le contenu d'une collection : modifie la liste `produits`. Pour changer le titre ou la phrase : modifie `titre` / `sousTitre`, ils s'affichent automatiquement.

Pour créer une nouvelle collection, deux étapes : ajoute un bloc dans `COLLECTIONS` avec un nouvel `id`, puis colle ce conteneur dans `index.html` (là où tu veux qu'il apparaisse), en reprenant l'id dans les deux attributs :

```html
<section class="section-collection" data-collection-bloc="mon-id" hidden>
  <div class="conteneur">
    <span class="label-section">Collection</span>
    <h2 data-collection-titre></h2>
    <p class="intro-collection" data-collection-soustitre></p>
    <div class="grille-liens" data-collection="mon-id"></div>
  </div>
</section>
```

L'attribut `hidden` est normal : le bloc reste caché tant que le JavaScript ne l'a pas rempli, ce qui évite un encart vide si une collection est mal configurée.

## 6. Ajouter une grande catégorie (nouvelle page)

1. Dans `CATEGORIES`, ajoute un bloc sur le modèle de `voyage` (nom, emoji, page, description, sousCategories).
2. Duplique `voyage.html`, renomme le (exemple `nomade.html`), puis dedans : change `<title>`, les meta, le hero, et surtout `data-categorie="voyage"` en `data-categorie="nomade"`.
3. Ajoute le lien dans le menu `<nav>` des 4 autres pages et une carte sur `index.html`.
4. Ajoute l'URL dans `sitemap.xml`.

## 7. Réseaux sociaux et liens perso

En haut de `data/liens.js`, tableau `RESEAUX`. Un lien avec un placeholder `LIEN_A_REMPLIR_...` est simplement masqué. Mets la vraie URL pour l'afficher (pour le mail, format `mailto:ton@mail.com`).

## 8. Déployer sur GitHub Pages

Depuis ce dossier :

```bash
git init
git add .
git commit -m "Affiliate hub v1"
# Crée un repo sur github.com (par exemple : ressources), puis :
git remote add origin https://github.com/juenvie/ressources.git
git branch -M main
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Source : Deploy from a branch → main / (root) → Save**. Le site sera en ligne quelques minutes plus tard sur `https://juenvie.github.io/ressources/`.

Chaque mise à jour ensuite :

```bash
git add . && git commit -m "maj liens" && git push
```

### Après le premier déploiement

Si tu changes de nom de repo, fais un chercher-remplacer de `https://juenvie.github.io/ressources` par ta vraie URL dans : les 4 fichiers HTML (balises `og:url`, `og:image`, JSON LD), `robots.txt` et `sitemap.xml`.

## 9. Personnalisation restante

Ce qui t'attend, par ordre d'impact :

1. **Les accroches perso** : chaque produit a maintenant un brouillon du type `[BROUILLON : ...]`, une suggestion de départ à lire, ajuster avec un vrai détail si tu en as un, puis valider. Tant que le texte commence par `[`, rien ne s'affiche sur le site, donc aucun risque de publier un brouillon par erreur. Pour publier : retire `[BROUILLON : ` au début et `]` à la fin. C'est toujours ce qui différencie le site d'un Linktree, donc le passage le plus rentable de ta liste.
2. **Les `avis` des fiches** : les 77 fiches ont leurs avantages, leurs limites et leur « pour qui », mais l'avis reste vide. Commence par les produits que tu utilises vraiment tous les jours, pas par le haut de la liste. Ajoute `depuisQuand` dans la foulée, c'est une ligne et ça vaut une preuve.
3. **Les badges** : assigne `"prefere"`, `"qualite-prix"`, `"plus-utilise"`... aux produits que tu veux pousser (clés disponibles dans `BADGES`).
4. **Les logos manquants** : les produits génériques (powerbank, gourde, adaptateur...) et l'app running affichent encore un emoji, faute de marque précise. Voir la section logos ci-dessous pour en ajouter un.
5. **YouTube, mail, LinkedIn, Souvence** : URLs dans `RESEAUX`.

## La signature animée de l'entête

À chaque ouverture de page, le mot `ju.en.vie` s'écrit lettre après lettre, puis un petit pictogramme s'échappe sur la droite et disparaît. L'ensemble dure environ deux secondes et demie.

Le découpage en lettres et la pose du pictogramme sont dans `initialiserSignature()` (`js/main.js`), l'animation elle même est entièrement en CSS (section 19 de `style.css`). Trois garde fous :

- Les lettres restent en opacité 0, jamais en `display: none`. La largeur du mot est donc réservée dès le premier rendu et rien ne bouge à l'écran.
- Le pictogramme est en position absolue, il ne pousse ni le menu ni le bouton hamburger.
- Si la personne a demandé à son système de réduire les animations, rien ne se déclenche et le mot s'affiche normalement.

Pour changer le pictogramme d'une page, ajoute une ligne dans `ENVOL_PAR_PAGE`, en haut de la fonction :

```js
var ENVOL_PAR_PAGE = {
  "sport.html": "course",      // un coureur part sur la droite
  "creation.html": "camera",   // un appareil photo, un flash, puis plus rien
};
```

Toute page absente de cette table reçoit l'avion, qui file vers la droite.

Les pictogrammes sont des SVG regroupés dans l'objet `PICTOGRAMMES` de `main.js`. Pour en ajouter un, écris le SVG sous une nouvelle clé, référence cette clé dans `ENVOL_PAR_PAGE`, et donne lui une classe `.envol-{clé}` avec ses `@keyframes` en section 19 du style. Le flash de la caméra est un pseudo élément `::after`, donc aucune balise en plus dans la page.

## Le mode brouillon

Les blocs `.a-ecrire` sont tes pense bêtes. **Ils ne s'affichent plus en ligne** : une page publiée ne doit jamais montrer « À compléter » à un lecteur ni à Google.

Tu les revois dans deux cas :

- en local, automatiquement, quand tu ouvres le site depuis ton ordinateur ;
- en ligne, en ajoutant `?brouillon` à la fin de n'importe quelle URL. Le mode reste actif tant que tu ne fermes pas l'onglet, donc tu peux naviguer de page en page.

En mode brouillon, chaque bloc porte une étiquette orange « À écrire » pour qu'on ne confonde jamais un pense bête avec du contenu.

## Le référencement, ce qui est en place

**Indexation.** Plus aucune page en `noindex`. Les 24 pages sont dans `sitemap.xml`, régénéré automatiquement par le script d'indexation. Chaque page a son `canonical`.

**Données structurées.** 44 blocs au total : `WebSite` et `Person` sur l'accueil, `BreadcrumbList` sur 17 pages, `Article` sur 17 pages avec auteur et date, `FAQPage` sur 7 pages, `ProfilePage` sur la page à propos. Toutes ont été validées syntaxiquement.

**Moteurs conversationnels.** `robots.txt` autorise explicitement GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot et les autres. Pour en bloquer un, remplace `Allow` par `Disallow` sur sa ligne.

`llms.txt`, à la racine, est le sommaire du site écrit pour les assistants IA : ce qu'on y trouve, page par page, avec les points de vigilance. C'est ce fichier qu'ils lisent en priorité. **Pense à le mettre à jour quand tu ajoutes une page importante.**

**Les FAQ comptent double.** Google les utilise pour les extraits enrichis, les IA les extraient en priorité parce que le format question réponse est directement citable. Les sept pages qui en ont une sont les plus susceptibles d'être citées.

## Dates et fraîcheur

Chaque article affiche « Page vérifiée et mise à jour le... » en bas, avec une balise `<time>` lisible par les machines. La même date figure dans le schéma `Article`.

Sur les sujets administratifs australiens, cette date est un argument de confiance : les montants et les règles changent chaque année. Quand tu revérifies une page, change les trois occurrences de la date, dans `datePublished` si c'est la première publication, dans `dateModified`, et dans le `<time>` visible.

## Trois détails repris de reflare.io

**Le mot du titre en dégradé.** Le `<em>` de chaque `<h1>` est rempli par `--degrade-accent` au lieu d'un orange plein. La règle est sous `@supports` : un navigateur qui ne sait pas découper un fond sur du texte garde la couleur pleine, plutôt que d'afficher un mot transparent donc invisible.

**La frise qui se dessine.** Dans les six pages qui ont une frise d'itinéraire, le numéro d'étape se pose puis le trait descend jusqu'à l'étape suivante. C'est du `scaleY` sur le pseudo élément, composé par le GPU, pas une animation de hauteur qui recalculerait la mise en page à chaque image.

Attention à un piège de cascade rencontré ici : `.js .frise li.revele` est plus spécifique que le `.js .revele.visible` générique. Sans la règle `.js .frise li.revele.visible`, les étapes restaient décalées de 14 pixels pour toujours. Si tu ajoutes une variante d'animation pour un composant précis, pense à écrire aussi sa règle de relâchement.

**La pastille de statut.** Un petit badge en haut de page, avec une diode qui bat. Sur un article, elle affiche la date de mise à jour, **lue depuis le `<time>` déjà présent en bas de page** : l'information ne peut pas se désynchroniser et il n'y a rien à écrire dans les 24 pages. Sur la page Bons plans, elle affiche le nombre de codes actifs, calculé depuis `liens.js`.

Les cinq pages sans date (accueil, Voyage, Sport, Création, Guides) n'ont pas de pastille, c'est voulu : ce ne sont pas des articles.

## Les animations de lecture des articles

Quand on descend dans un guide, les blocs visuels apparaissent en fondu montant à mesure qu'ils entrent à l'écran. Les photos ont leur propre variante, plus lente, avec un très léger agrandissement au départ : l'image donne l'impression de se poser plutôt que d'apparaître d'un coup.

Rien n'est à ajouter dans le HTML. La fonction `preparerAnimationsArticle()` de `js/main.js` marque toute seule, dans chaque page, les photos, les paires de photos, les repères, les étapes de frise, les cartes d'application et les encadrés. Un nouvel article en hérite sans rien faire.

Trois choix à connaître :

- **Le texte courant n'est jamais animé.** Un paragraphe qui arrive en retard gêne la lecture au lieu de l'embellir. Seuls les blocs visuels bougent.
- **Une photo attend d'être chargée avant de se révéler.** Sinon le fondu se jouerait sur un rectangle vide. Un délai de sécurité d'une seconde et demie couvre le cas où l'image ne répond jamais.
- **Tout passe par le même observateur** que les cartes du reste du site, donc aucun écouteur de défilement en plus. S'il ne démarre pas, un repli au défilement prend le relais. Et si la personne a demandé à son système de réduire les animations, tout est affiché d'emblée.

Les séries s'égrènent : dans une paire de photos, la seconde suit la première d'un souffle, et les étapes d'une frise arrivent dans l'ordre de lecture. Le décalage est plafonné à cinq crans pour que la fin d'une longue liste n'attende pas.

Pour ne plus animer un type de bloc, retire son sélecteur de `preparerAnimationsArticle()`. Pour en animer un nouveau, ajoute le à la même liste.

## Les deux logos

`assets/logo.png` est le logo d'origine, avec sa large marge crème. Il sert au favicon, à l'icône d'application et au pied de page.

`assets/logo-entete.png` est le même logo recadré au plus près du dessin, et exporté en 96 pixels pour rester net sur les écrans à haute densité. À taille d'affichage égale, le soleil y est 44% plus grand. C'est celui de l'entête, où le logo ne fait que 40 pixels.

Le recadrage est calculé sur la distance maximale entre le centre du dessin et un pixel dessiné, pas sur la boîte englobante. C'est ce qui garantit que le masque circulaire de l'entête ne coupe aucun rayon du soleil.

## Les cartes de la page d'accueil

Cinq univers, sur une grille de six colonnes : trois cartes de deux colonnes sur la première ligne, deux cartes de trois colonnes sur la seconde. Chaque carte porte sa photo de fond via une variable CSS, déclarée en section 5 :

```css
.carte-australie {
  --fond-photo: url("../assets/photos/categorie-australie.jpg");
}
```

Les trois premières affichent un compteur calculé depuis `liens.js`. Les deux dernières affichent un texte figé, « 7 étapes » et « 7 destinations », parce qu'Australie et Guides ne sont pas des catégories de `liens.js`. Pense à les corriger à la main si tu ajoutes une étape ou une destination.

## Logos de marque

Chaque produit rattaché à une marque identifiable affiche son vrai logo (`assets/logos/{id}.png`) plutôt qu'un emoji. Les produits sans marque précise (accessoires génériques type gourde, cadenas, adaptateur) et l'app running (marque pas encore choisie) gardent volontairement l'emoji du champ `icone`.

**Ajouter ou remplacer un logo :**

1. Trouve un logo carré du partenaire (le plus simple : `https://www.google.com/s2/favicons?domain=lemarquant.com&sz=256`, ou le fichier `apple-touch-icon.png` à la racine de leur site).
2. Enregistre le fichier dans `assets/logos/` en le nommant exactement comme l'`id` du produit, exemple `assets/logos/insta360.png`.
3. Ajoute la ligne `logo: "assets/logos/insta360.png",` dans l'entrée correspondante de `liens.js` (juste après `icone:`).

Pas besoin de fond blanc ni de recadrage : chaque logo est affiché dans un chip clair automatique (`icone-lien.avec-logo` dans `style.css`) qui gère le contraste, que le logo soit sombre, blanc ou coloré. Si le fichier n'existe pas ou ne charge pas, le site retombe automatiquement sur l'emoji, jamais d'icône cassée (écouteur `error` global dans `main.js`).

## L'univers Australie

L'Australie n'est pas un guide parmi les autres, c'est un silo complet : une page pilier `australie.html` et six articles `australie-*.html` qui se renvoient les uns aux autres. C'est la structure la plus efficace en référencement : le pilier capte la recherche large (« PVT Australie »), chaque article capte une recherche précise (« 88 jours », « assurance PVT », « Tax File Number »), et les liens internes font remonter tout le bloc.

Les quatre portes d'entrée sont le menu principal, la carte de `guides.html`, la carte « Tout le PVT en Australie » de la page Voyage (pilotée depuis `liens.js`), et les liens internes des articles pays.

**Règle à respecter en ajoutant un article :** une intention de recherche par page. Si tu écris sur les certificats RSA et White Card, ce n'est pas dans la page job, c'est une page à part, sinon les deux se cannibalisent dans Google.

**Chaque page renvoie vers sa source officielle.** Le visa vers le Department of Home Affairs, les impôts et la superannuation vers l'Australian Taxation Office, les salaires vers le Fair Work Ombudsman, la santé vers Services Australia. C'est ce qui différencie ces pages des articles recopiés de forums, et ces liens sont à revérifier une fois par an.

**Les six pages portent encore une balise `noindex`** parce qu'il y reste des chiffres personnels à ajouter (marqués en italique pointillé). Le jour où tu les remplis : supprime la ligne `<meta name="robots" content="noindex, follow">`, puis ajoute l'URL dans `sitemap.xml`, un bloc commenté y montre le format.

## Les pages qui convertissent

Trois pages ne racontent pas un voyage, elles répondent à une intention d'achat. Ce sont celles qui rapportent.

`comparatif-assurance-voyage.html` et `comparatif-esim.html` répondent aux requêtes « quelle assurance voyage » et « quelle eSIM choisir ». Elles s'appuient sur un tableau comparatif (`.tableau-comparatif`, défilement horizontal automatique sur téléphone) qui donne le positionnement de chaque acteur, jamais des chiffres figés : les tarifs et les garanties changent trop vite pour qu'un tableau daté reste honnête.

`code-promo-getyourguide.html` est le gabarit à dupliquer pour chaque partenaire dont tu as un code. Les gens tapent « code promo + marque » avec la carte bleue à la main, c'est la requête la plus proche de l'achat qui existe.

**Dupliquer le gabarit pour un nouveau partenaire :**

1. Copie `code-promo-getyourguide.html` en `code-promo-{marque}.html`.
2. Change le titre, la description, le canonical, le code dans `data-code` et le lien affilié.
3. Adapte les trois questions fréquentes, et surtout le bloc de données structurées `FAQPage` du `<head>` : c'est lui qui peut faire apparaître les questions directement dans Google.
4. Ajoute l'URL dans `sitemap.xml`.

Le bouton de copie fonctionne sans code supplémentaire : `main.js` écoute tous les éléments portant `data-action="copier-code"`, sur n'importe quelle page.

Les deux comparatifs sont aussi des cartes de la page Voyage, dans la sous-catégorie « Mes comparatifs », pilotées depuis `liens.js` avec `interne: true`. Elles apparaissent donc dans la recherche et les filtres comme les autres ressources.

**La date de vérification** en bas de ces pages (`.date-maj`) n'est pas décorative : sur un sujet où les prix bougent, c'est un signal de fraîcheur pour le lecteur et pour Google. Mets la à jour quand tu revois la page.

## Deux composants pour aérer les articles

Deux blocs réutilisables, en HTML et CSS pur, sans image ni librairie.

**Les repères** (`.reperes`) : quatre chiffres clés en tête d'article, juste sous le sommaire. Durée, nombre d'étapes, saison, monnaie. Ils donnent le format du voyage avant même la première phrase.

```html
<div class="reperes">
  <div class="repere"><b>3 semaines</b><span>Durée</span></div>
  <div class="repere texte"><b>Dong</b><span>Monnaie</span></div>
</div>
```

La classe `texte` réduit la taille pour les valeurs qui ne sont pas un nombre, sinon elles débordent.

**La frise** (`.frise`) : les étapes de l'itinéraire numérotées et reliées par un trait, en ouverture de la section itinéraire. La numérotation est automatique, il suffit d'ajouter un `<li>`.

```html
<ol class="frise">
  <li>Hanoi<span>Le vieux quartier et le point de départ vers le nord</span></li>
  <li>Sapa<span>Rizières en terrasses et sentiers entre les hameaux</span></li>
</ol>
```

## Les guides de voyage

`guides.html` liste les articles sous forme de cartes. Chaque carte pointe vers une page `guide-*.html` : un article de blog classique, pensé pour le référencement (un titre unique, une description, un fil d'Ariane, un sommaire ancré et un maillage vers la page Voyage).

La carte « Mes guides de voyage » de la page Voyage renvoie vers `guides.html`. Elle est pilotée depuis `data/liens.js` comme les autres, avec deux champs propres aux liens internes : `interne: true` (ouverture dans le même onglet, sans `rel="sponsored"`) et `libelleAction` pour le texte du bouton.

**Tant qu'un article n'est pas écrit**, il porte deux garde fous à retirer le jour de la publication :

1. `<meta name="robots" content="noindex, follow">` dans le `<head>`, pour que Google n'indexe pas une page vide.
2. Son absence de `sitemap.xml` (un bloc commenté y montre quoi ajouter).

Les paragraphes affichés en italique barré de pointillés (`class="a-ecrire"`) marquent ce qu'il reste à écrire. Supprime la ligne quand tu remplis la partie.

**Ajouter un nouveau guide :** duplique `guide-laos.html`, change le titre, la description, le canonical, le fil d'Ariane, le sommaire et les sections. Puis ajoute une carte dans `guides.html` et une entrée dans le bloc « Les autres guides » des articles existants.

**Mettre une photo dans un article :**

```html
<figure class="photo-article portrait">   <!-- retire "portrait" pour une photo paysage -->
  <img src="assets/photos/guides/ma-photo-1200.jpg"
       srcset="assets/photos/guides/ma-photo-800.jpg 800w, assets/photos/guides/ma-photo-1200.jpg 1200w"
       sizes="(min-width: 560px) 440px, 100vw"
       width="900" height="1200" loading="lazy"
       alt="Description courte de la photo">
</figure>
```

Les photos verticales sont bridées à 440 px de large pour ne pas transformer l'article en couloir. Les photos horizontales prennent toute la colonne de lecture, avec `sizes="(min-width: 800px) 720px, 100vw"`.

## Photos et logo

Toutes les photos du site vivent dans `assets/photos/`, rangées en trois niveaux :

```
assets/photos/            versions web des pages principales
  guides/                 versions web des articles, plus un dossier de dépôt
    australie/ bali/ komodo/ laos/ new-york/ philippines/ vietnam/
  originaux/              originaux pleine résolution, jamais servis par le site
    site/ australie/ bali/ komodo/ laos/ new-york/ philippines/ vietnam/
```

Le principe : tu déposes tes photos brutes dans `guides/{destination}/`, on génère les deux tailles web à la racine de `guides/`, puis les originaux partent dans `originaux/{destination}/`. Le mode d'emploi complet est dans `assets/photos/guides/LISEZ-MOI.txt`.

| Fichier | Où il s'affiche |
| --- | --- |
| `portrait-rooftop-skyline-bangkok-640.jpg` / `-1080.jpg` | photo de fond du hero de l'accueil |
| `run-sunset-bali-640.jpg` / `-960.jpg` | portrait du hero de `sport.html` |
| `coworking-640.jpg` / `-960.jpg` | portrait du hero de `creation.html` |
| `piscine-bondi-sydney-640.jpg` / `-960.jpg` | photo du hero de `voyage.html` |
| `categorie-voyage.jpg`, `categorie-sport.jpg`, `categorie-creation-coworking.jpg` | fond des trois cartes de l'accueil |
| `guides/{destination}.jpg` | photo de la carte de `guides.html`, format paysage 4/3 |
| `guides/laos-*.jpg`, `guides/bali-*.jpg`, `guides/vietnam-*.jpg`, `guides/komodo-*.jpg`, `guides/australie-*.jpg` | photos placées dans les articles correspondants |

**Changer une photo de hero :** remplace les deux fichiers en gardant les mêmes noms (ou change les chemins dans le `<img>` de la page). Pour regénérer les deux tailles depuis un original, en ligne de commande :

```bash
sips --resampleWidth 640 -s format jpeg -s formatOptions 55 originaux/ma-photo.jpg --out ma-photo-640.jpg
sips --resampleWidth 960 -s format jpeg -s formatOptions 55 originaux/ma-photo.jpg --out ma-photo-960.jpg
```

Le cadrage du portrait (quelle partie de la photo reste visible dans la pastille ronde sur mobile) se règle avec une seule ligne dans `style.css` : `--cadrage-portrait` sur les classes `.portrait-sport`, `.portrait-creation` et `.portrait-voyage`. Le premier pourcentage est horizontal, le second vertical (plus il est petit, plus on voit le haut de la photo).

Le logo `assets/logo.png` est utilisé à trois endroits : header (cliquable vers l'accueil), footer (idem) et icône Apple de l'écran d'accueil. Un seul fichier à remplacer pour tout mettre à jour.

## Animations

Le site a une couche d'animations légère, entièrement en CSS natif et petit JavaScript, sans aucune librairie (rien à installer, rien à charger en plus) :

- **Entrée du hero** : titre, sous-titre et boutons apparaissent en cascade au chargement.
- **Halos vivants** : sur toutes les pages, les lueurs orange du hero dérivent et respirent lentement. Sur l'accueil, la photo fait en plus un très léger zoom continu.
- **Reflet lumineux** : une bande de lumière balaie au survol le bouton « Explorer les ressources » (accueil) et les boutons « Découvrir » des produits (pages catégories). Les boutons « Bientôt disponible » n'en ont pas.
- **Compteurs animés** : les chiffres comptent de zéro quand ils entrent à l'écran.
- **Carrousel de marques** : sur l'accueil, une bande de logos défile en boucle (`construireMarque` dans `main.js`). Elle se construit toute seule à partir des produits qui ont un logo, donc elle grandit quand tu ajoutes des marques. Elle se met en pause au survol.
- **Apparition au scroll en cascade** : les cartes se révèlent ligne par ligne quand on descend.

Tout n'anime que la position et la transparence, ce qui reste fluide à 60 images par seconde même sur téléphone, et léger pour GitHub Pages. Les visiteurs qui ont activé « réduire les animations » sur leur appareil voient le site sans mouvement, contenu bien visible (géré via `prefers-reduced-motion`).

## Notes techniques

Aucune dépendance externe hors Google Fonts (Playfair Display et Inter). Animations en CSS natif et IntersectionObserver, respecte `prefers-reduced-motion`. Liens affiliés en `rel="sponsored noopener"`. Thème sombre chaud unique, contrastes AA vérifiés.
