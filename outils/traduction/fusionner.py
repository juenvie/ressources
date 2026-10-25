"""Fusionne fr_<nom>.json et en_<nom>.json dans dico.json, avec contrôles.
Usage : python3 fusionner.py commun guide-bali ..."""
import sys, os, json, re
D = os.path.dirname(os.path.abspath(__file__))
dico = json.load(open(D + "/dico.json", encoding="utf-8")) if os.path.exists(D + "/dico.json") else {}

def balises(t):
    return re.findall(r"<[^>]+>", t)

def visible(t):
    return re.sub(r"<[^>]+>", "", t)

erreurs = []
for nom in sys.argv[1:]:
    fr = json.load(open(D + f"/fr_{nom}.json", encoding="utf-8"))
    en = json.load(open(D + f"/en_{nom}.json", encoding="utf-8"))
    manquants = sorted(set(fr) - set(en), key=int)
    if manquants:
        erreurs.append(f"{nom}: traductions manquantes {manquants[:10]}")
    for k, f in fr.items():
        if k not in en:
            continue
        e = en[k]
        # ponctuation anglaise : pas d'espace avant ? ! : ;
        e = re.sub(r"(?:&nbsp;| | )([?!;])", r"\1", e)
        if balises(f) != balises(e):
            erreurs.append(f"{nom}#{k}: balises différentes\n   FR {balises(f)}\n   EN {balises(e)}")
        v = visible(e)
        if re.search(r"[—–]", v) or re.search(r"[A-Za-z]-[A-Za-z]", v):
            erreurs.append(f"{nom}#{k}: tiret dans le texte visible : {v[:90]}")
        dico[f] = e
json.dump(dico, open(D + "/dico.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(dico), "entrées")
for x in erreurs:
    print("!!", x)
