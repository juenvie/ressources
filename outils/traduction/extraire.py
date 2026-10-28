"""Extrait les segments à traduire. Usage : python3 extraire.py
Écrit fr_commun.json puis fr_<page>.json (seulement les segments pas encore
présents dans le dictionnaire dico.json)."""
import sys, os, json, re, collections
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
import segments as S
R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")) + "/"
import glob
# Toutes les pages du site existent en anglais (dossier en/). Une nouvelle page
# à la racine est prise en compte d'office.
GUIDES = sorted(os.path.basename(p)[:-5] for p in glob.glob(R + "*.html"))

def identite(t):
    """Segments qu'on ne traduit pas : notes « À compléter » de Julien, texte
    sans lettre, titres de vidéos (elles sont en français)."""
    nu = re.sub(r"<[^>]+>", "", t).strip()
    return nu.startswith("À compléter") or not re.search(r"[A-Za-zÀ-ÿ]", nu)

def segs_page(p):
    page = open(R + p + ".html", encoding="utf-8").read()
    # le sélecteur FR | EN et les hreflang sont posés par construire.py, pas traduits
    page = re.sub(r'<nav class="choix-langue".*?</nav>', "", page, flags=re.S)
    out = []
    for a, b, t in S.tous(page):
        out.append(t)
    return out

if __name__ == "__main__":
    dico = json.load(open(D + "/dico.json", encoding="utf-8")) if os.path.exists(D + "/dico.json") else {}
    par = {g: segs_page(g) for g in GUIDES}
    cnt = collections.Counter(x for g in GUIDES for x in set(par[g]))
    def a_faire(liste):
        vus, out = set(), []
        for x in liste:
            if x in dico or x in vus or identite(x):
                continue
            vus.add(x); out.append(x)
        return out
    communs = a_faire([x for g in GUIDES for x in par[g] if cnt[x] >= 4])
    if communs:
        json.dump({str(i): x for i, x in enumerate(communs)}, open(D + "/fr_commun.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print("commun", len(communs))
    deja = set(communs)
    for g in GUIDES:
        l = [x for x in a_faire(par[g]) if x not in deja]
        deja |= set(l)
        json.dump({str(i): x for i, x in enumerate(l)}, open(D + f"/fr_{g}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
        print(g, len(l), sum(len(x) for x in l))
