"""Construit en/<guide>.html à partir de la page française et du dictionnaire,
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

CARTES_EN = {
 "guide-bali": ("Indonesia", "Travelling in Bali", "Nine stops from the south to the northern mountains: budget, transport and good addresses."),
 "guide-komodo": ("Indonesia", "The Komodo cruise", "Four days on a boat between the islands: choosing your crew, the budget and what you see."),
 "guide-laos": ("Laos", "Travelling in Laos", "A country you cross slowly: itinerary, transport, budget and good surprises."),
 "guide-thailande": ("Thailand", "Travelling in Thailand", "Two weeks from Bangkok to the islands: entry rules, trekking in Chiang Mai, Koh Phi Phi and Koh Lanta."),
 "guide-vietnam": ("Vietnam", "Travelling in Vietnam", "Three weeks from north to south: night buses, the Ha Giang loop and the real budget."),
 "guide-ha-giang": ("Vietnam", "The Ha Giang loop", "Three hundred kilometres of mountains along the Chinese border: route, permit, budget."),
 "guide-philippines": ("Philippines", "Travelling in the Philippines", "Palawan from end to end, and three days at sea between El Nido and Coron."),
 "guide-new-york": ("United States", "A week in New York", "One neighbourhood a day, the subway, the viewpoints and where to run in the city."),
 "guide-cote-est-australie": ("Australia", "Road trip along the east coast", "Three weeks in a campervan from Sydney to Cairns: the route stop by stop and the real budget."),
 "guide-whitsundays": ("Australia", "The Whitsundays cruise", "Two days on a sailing boat, Whitehaven Beach and snorkelling on the Great Barrier Reef."),
}
SUITE_EN = {
 "guide-bali": ["guide-komodo", "guide-philippines", "guide-thailande"],
 "guide-komodo": ["guide-bali", "guide-philippines", "guide-vietnam"],
 "guide-laos": ["guide-thailande", "guide-vietnam", "guide-ha-giang"],
 "guide-thailande": ["guide-laos", "guide-vietnam", "guide-bali"],
 "guide-vietnam": ["guide-ha-giang", "guide-laos", "guide-thailande"],
 "guide-ha-giang": ["guide-vietnam", "guide-laos", "guide-philippines"],
 "guide-philippines": ["guide-bali", "guide-komodo", "guide-thailande"],
 "guide-new-york": ["guide-cote-est-australie", "guide-bali", "guide-vietnam"],
 "guide-cote-est-australie": ["guide-whitsundays", "guide-bali", "guide-new-york"],
 "guide-whitsundays": ["guide-cote-est-australie", "guide-komodo", "guide-philippines"],
}

def suite_en(page):
    li = ""
    for i in SUITE_EN[page]:
        lab, tit, desc = CARTES_EN[i]
        li += (f'            <li><a href="{i}.html">\n'
               f'              <img src="../assets/photos/suite/{i}.jpg" alt="" width="600" height="450" loading="lazy" onerror="this.remove()">\n'
               f'              <span class="corps-suite"><span class="pays-guide">{lab}</span><b>{tit}</b><span>{desc}</span></span>\n'
               f'            </a></li>\n')
    return ('<nav class="a-lire-ensuite" aria-labelledby="titre-a-lire-ensuite">\n'
            '          <h2 id="titre-a-lire-ensuite">Read next</h2>\n'
            '          <ul>\n' + li + '          </ul>\n'
            '          <p><a class="btn-lien" href="../guides.html">See all my guides</a></p>\n'
            '        </nav>')

def selecteur(page, langue):
    if langue == "fr":
        return ('<nav class="choix-langue" aria-label="Langue de la page">'
                f'<a href="{page}.html" lang="fr" hreflang="fr" aria-current="page">FR</a>'
                f'<a href="en/{page}.html" lang="en" hreflang="en">EN</a></nav>')
    return ('<nav class="choix-langue" aria-label="Page language">'
            f'<a href="../{page}.html" lang="fr" hreflang="fr">FR</a>'
            f'<a href="{page}.html" lang="en" hreflang="en" aria-current="page">EN</a></nav>')

def alternates(page):
    return (f'  <link rel="alternate" hreflang="fr" href="{BASE}{page}.html">\n'
            f'  <link rel="alternate" hreflang="en" href="{BASE}en/{page}.html">\n'
            f'  <link rel="alternate" hreflang="x-default" href="{BASE}{page}.html">\n')

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
    nav = re.search(r'<nav class="a-lire-ensuite".*?</nav>', fr, re.S)
    out, manquants = fr, []
    for a, b, t in sorted(S.tous(fr), reverse=True):
        if nav and nav.start() <= a < nav.end():
            continue
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
    out = out.replace(f"{BASE}{page}.html", f"{BASE}en/{page}.html")
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
    # « À lire ensuite » : remplacé après la réécriture, ses chemins sont déjà justes
    nav = re.search(r'<nav class="a-lire-ensuite".*?</nav>', out, re.S)
    out = out[:nav.start()] + suite_en(page) + out[nav.end():]
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
