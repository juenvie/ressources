"""Construit en/<page>.html à partir de la page française et du dictionnaire,
et pose le sélecteur FR | EN et les hreflang sur les deux versions.
Usage : python3 construire.py guide-whitsundays [guide-bali ...]   (ou : tous)"""
import sys, os, json, re
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
import segments as S
from extraire import GUIDES, identite
R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")) + "/"
BASE = "https://juenvie.com/ressources/"
dico = json.load(open(D + "/dico.json", encoding="utf-8"))

MOIS = {"janvier": "January", "février": "February", "mars": "March", "avril": "April", "mai": "May", "juin": "June",
        "juillet": "July", "août": "August", "septembre": "September", "octobre": "October", "novembre": "November",
        "décembre": "December"}

def selecteur(page, langue):
    if langue == "fr":
        return ('<nav class="choix-langue" aria-label="Langue de la page">'
                f'<a href="{page}.html" lang="fr" hreflang="fr" aria-current="page">FR</a>'
                f'<a href="en/{page}.html" lang="en" hreflang="en">EN</a></nav>')
    return ('<nav class="choix-langue" aria-label="Page language">'
            f'<a href="../{page}.html" lang="fr" hreflang="fr">FR</a>'
            f'<a href="{page}.html" lang="en" hreflang="en" aria-current="page">EN</a></nav>')

def url_fr(page):
    return BASE if page == "index" else f"{BASE}{page}.html"

def url_en(page):
    return f"{BASE}en/" if page == "index" else f"{BASE}en/{page}.html"

def alternates(page):
    return (f'  <link rel="alternate" hreflang="fr" href="{url_fr(page)}">\n'
            f'  <link rel="alternate" hreflang="en" href="{url_en(page)}">\n'
            f'  <link rel="alternate" hreflang="x-default" href="{url_fr(page)}">\n')

def nettoyer(page_html):
    """Retire sélecteur et hreflang déjà posés, pour repartir de la page brute."""
    page_html = re.sub(r'\n[ \t]*<nav class="choix-langue".*?</nav>', "", page_html, flags=re.S)
    page_html = re.sub(r'  <link rel="alternate" hreflang="[^"]+" href="[^"]+">\n', "", page_html)
    return page_html

def poser(page_html, page, langue):
    ancre = '<span class="mot-logo">ju.en.vie</span></a>'
    assert page_html.count(ancre) == 1
    page_html = page_html.replace(ancre, ancre + "\n      " + selecteur(page, langue))
    m = re.search(r'  <link rel="canonical"[^>]*>\n', page_html)
    page_html = page_html[:m.end()] + alternates(page) + page_html[m.end():]
    return page_html

def date_en(t):
    m = re.fullmatch(r'Page vérifiée et mise à jour le <time datetime="([^"]+)">(\d+) (\S+) (\d{4})</time>\.', t)
    if m and m.group(3) in MOIS:
        return f'Page checked and updated on <time datetime="{m.group(1)}">{m.group(2)} {MOIS[m.group(3)]} {m.group(4)}</time>.'
    return None

def reecrire_url(u):
    if re.match(r"^(https?:|mailto:|tel:|#|data:|//)", u) or u == "":
        return u
    cible = u.split("#")[0].split("?")[0]
    if cible.endswith(".html") and cible[:-5] in GUIDES:
        return u
    return "../" + u

def construire(page):
    fr = nettoyer(open(R + page + ".html", encoding="utf-8").read())
    out, manquants = fr, []
    for a, b, t in sorted(S.tous(fr), reverse=True):
        if t in dico:
            n = dico[t]
        elif identite(t):
            continue
        elif date_en(t):
            n = date_en(t)
        else:
            manquants.append(t); continue
        out = out[:a] + n + out[b:]
    if manquants:
        print(f"!! {page} : {len(manquants)} segments sans traduction")
        for x in manquants[:15]:
            print("   ", x[:120])
        return False
    out = out.replace('<html lang="fr">', '<html lang="en">', 1)
    out = out.replace('<meta property="og:locale" content="fr_FR">', '<meta property="og:locale" content="en_GB">')
    # adresses absolues (canonical, og:url, JSON-LD) : vers la version anglaise
    # de chaque page traduite, accueil compris
    def absolue(m):
        q, cible = m.group(1), m.group(2) or ""
        nom = cible[:-5] if cible else "index"
        if nom in GUIDES:
            return f"{q}{url_en(nom)}{q}"
        return m.group(0)
    out = re.sub(r'(["\'])https://juenvie\.com/ressources/([a-z0-9-]+\.html)?\1', absolue, out)
    out = out.replace('"inLanguage": "fr"', '"inLanguage": "en"')
    # chemins relatifs : un niveau plus bas, sauf vers les autres guides traduits
    def attr(m):
        nom, val = m.group(1), m.group(2)
        if nom == "srcset":
            val = ", ".join(" ".join([reecrire_url(p.strip().split(" ")[0])] + p.strip().split(" ")[1:]) for p in val.split(","))
        else:
            val = reecrire_url(val)
        return f'{nom}="{val}"'
    tete, corps = out.split("<body", 1)
    tete = re.sub(r'\b(href|src)="([^"]*)"', attr, tete)
    corps = re.sub(r'\b(href|src|srcset)="([^"]*)"', attr, corps)
    out = tete + "<body" + corps
    # données des cartes produit en anglais, chargées juste après liens.js
    out = out.replace('<script src="../data/liens.js" defer></script>',
                      '<script src="../data/liens.js" defer></script>\n  <script src="../data/liens-en.js" defer></script>')
    out = poser(out, page, "en")
    os.makedirs(R + "en", exist_ok=True)
    open(R + "en/" + page + ".html", "w", encoding="utf-8").write(out)
    frp = poser(fr, page, "fr")
    open(R + page + ".html", "w", encoding="utf-8").write(frp)
    print("ok", page)
    return True

pages = GUIDES if sys.argv[1:] == ["tous"] else sys.argv[1:]
for p in pages:
    construire(p)
