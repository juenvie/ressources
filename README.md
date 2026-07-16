# Ju.en.vie — Affiliate Hub

Le hub de ressources qui remplace le Linktree. Un site statique pur (HTML, CSS, JS), sans framework, sans build step, prêt pour GitHub Pages.

```
Affiliate Hub/
  index.html        Accueil : hero, 3 cartes univers, réseaux
  voyage.html       Ressources voyage
  sport.html        Ressources running
  creation.html     Ressources création vidéo
  css/style.css     Tout le style (thème sombre chaud Ju.en.vie)
  js/main.js        Moteur d'affichage (lit data/liens.js)
  data/liens.js     ⭐ LE fichier à modifier au quotidien
  assets/           Favicon, og-image, logo, photo hero (2 tailles)
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
2. **Les badges** : assigne `"prefere"`, `"qualite-prix"`, `"plus-utilise"`... aux produits que tu veux pousser (clés disponibles dans `BADGES`).
3. **Les logos manquants** : les produits génériques (powerbank, gourde, adaptateur...) et l'app running affichent encore un emoji, faute de marque précise. Voir la section logos ci-dessous pour en ajouter un.
4. **YouTube, mail, LinkedIn, Souvence** : URLs dans `RESEAUX`.

## Logos de marque

Chaque produit rattaché à une marque identifiable affiche son vrai logo (`assets/logos/{id}.png`) plutôt qu'un emoji. Les produits sans marque précise (accessoires génériques type gourde, cadenas, adaptateur) et l'app running (marque pas encore choisie) gardent volontairement l'emoji du champ `icone`.

**Ajouter ou remplacer un logo :**

1. Trouve un logo carré du partenaire (le plus simple : `https://www.google.com/s2/favicons?domain=lemarquant.com&sz=256`, ou le fichier `apple-touch-icon.png` à la racine de leur site).
2. Enregistre le fichier dans `assets/logos/` en le nommant exactement comme l'`id` du produit, exemple `assets/logos/insta360.png`.
3. Ajoute la ligne `logo: "assets/logos/insta360.png",` dans l'entrée correspondante de `liens.js` (juste après `icone:`).

Pas besoin de fond blanc ni de recadrage : chaque logo est affiché dans un chip clair automatique (`icone-lien.avec-logo` dans `style.css`) qui gère le contraste, que le logo soit sombre, blanc ou coloré. Si le fichier n'existe pas ou ne charge pas, le site retombe automatiquement sur l'emoji, jamais d'icône cassée (écouteur `error` global dans `main.js`).

## Photo hero et logo

La photo du hero de l'accueil vit dans `assets/` en deux tailles générées depuis l'original (`portrait-rooftop-skyline-bangkok-640.jpg` pour mobile, `-1080.jpg` pour desktop). Pour la changer : remplace ces deux fichiers en gardant les mêmes noms (ou change les chemins dans le `<img class="photo-hero">` de `index.html`). L'original à la racine du dossier ne sert pas au site, tu peux le déplacer où tu veux.

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
