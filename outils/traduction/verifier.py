import re, sys, os
R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")) + "/"
for p in sys.argv[1:]:
    s = open(R + "en/" + p + ".html", encoding="utf-8").read()
    corps = s[s.index("<body"):]
    corps = re.sub(r"<script.*?</script>|<!--.*?-->", "", corps, flags=re.S)
    corps = re.sub(r'<p class="a-ecrire">.*?</p>', "", corps, flags=re.S)
    txt = re.sub(r"<[^>]+>", "\n", corps)
    fr = [l.strip() for l in txt.split("\n") if re.search(r"\b(le|la|les|des|une|est|avec|pour|dans|sur|qui|et)\b", l) and len(l.strip()) > 3]
    attrs = [a for a in re.findall(r'(?:alt|aria-label|title)="([^"]*)"', s) if re.search(r"\b(le|la|les|des|une|avec|pour|dans)\b", a)]
    rel = sorted(set(u for u in re.findall(r'(?:href|src)="([^"#:]+?)(?:#[^"]*)?"', s) if not u.startswith("../") and not u.startswith("//") and not os.path.exists(R + "en/" + u)))
    print(f"== {p}: texte FR suspect {len(fr)}, attributs {len(attrs)}, chemins relatifs non réécrits {rel}")
    for x in (fr + attrs)[:12]:
        print("   ", x[:110])
