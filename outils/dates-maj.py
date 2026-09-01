#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rafraîchit la date « Page vérifiée et mise à jour le ... » des pages dont le
contenu a réellement changé.

Une modification réelle, c'est une page HTML modifiée. Un changement de style
ou de script touche les 28 pages d'un coup sans rien changer à leur contenu :
ces fichiers là ne déclenchent aucune date.

Usage :
    python3 outils/dates-maj.py            # pages modifiées non encore validées
    python3 outils/dates-maj.py --depuis HEAD~1
    python3 outils/dates-maj.py page.html  # une page précise
"""
import io, re, subprocess, sys, os
from datetime import date

MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

def en_francais(d):
    return "%d %s %d" % (d.day, MOIS[d.month - 1], d.year)

def pages_modifiees(args):
    explicites = [a for a in args if a.endswith(".html")]
    if explicites:
        return explicites
    if "--depuis" in args:
        ref = args[args.index("--depuis") + 1]
        cmd = ["git", "diff", "--name-only", ref, "--", "*.html"]
    else:
        cmd = ["git", "status", "--porcelain", "--", "*.html"]
    sortie = subprocess.run(cmd, capture_output=True, text=True).stdout.splitlines()
    if "--depuis" in args:
        return [l.strip() for l in sortie if l.strip()]
    return [l[3:].strip() for l in sortie if l[3:].strip().endswith(".html")]

def main():
    aujourdhui = date.today()
    iso, lisible = aujourdhui.isoformat(), en_francais(aujourdhui)
    touchees, inchangees = [], []
    for f in pages_modifiees(sys.argv[1:]):
        if not os.path.exists(f):
            continue
        s = io.open(f, encoding="utf-8").read()
        m = re.search(r'<time datetime="(\d{4}-\d{2}-\d{2})">([^<]+)</time>', s)
        if not m:
            continue
        if m.group(1) == iso:
            inchangees.append(f)
            continue
        s = s.replace(m.group(0), '<time datetime="%s">%s</time>' % (iso, lisible))
        io.open(f, "w", encoding="utf-8").write(s)
        touchees.append("%s : %s -> %s" % (f, m.group(2), lisible))
    for l in touchees:
        print("  " + l)
    print("%d date(s) rafraîchie(s), %d déjà à jour." % (len(touchees), len(inchangees)))

if __name__ == "__main__":
    main()
