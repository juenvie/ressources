"""Découpe une page en segments traduisibles.

Un segment est une suite de texte et de balises en ligne (b, a, em...) entre
deux balises de bloc. Les attributs traduisibles (alt, aria-label, title,
placeholder, content des meta) sont des segments à part. Le contenu des
<script> et <style> n'est jamais touché, sauf les chaînes du JSON-LD,
traitées à part."""
import re, json, html

INLINE = {"b", "strong", "em", "i", "a", "span", "br", "time", "small", "sup", "sub", "abbr", "code", "u", "s", "mark", "wbr"}
ATTRS = ("alt", "aria-label", "title", "placeholder", "data-titre")
META_TRAD = re.compile(r'<meta\s+(?:name|property)="(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)"\s+content="([^"]*)"')
JSONLD_CLES = {"headline", "description", "name", "text", "alternativeHeadline", "caption", "about"}

TOKEN = re.compile(r"(<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)", re.S)

def tag_name(t):
    m = re.match(r"</?([a-zA-Z0-9]+)", t)
    return m.group(1).lower() if m else None

def blocs(page):
    """Rend la liste des segments (début, fin, texte) du <body>, hors commentaires et scripts."""
    corps = page.index("<body")
    out = []
    parts = TOKEN.split(page[corps:])
    pos = corps
    run_start = None; run = []
    def flush(end):
        nonlocal run_start, run
        if run_start is not None:
            seg = "".join(run)
            if re.search(r"[A-Za-zÀ-ÿ0-9]", re.sub(r"<[^>]+>", "", seg)):
                # on retire les espaces de bord pour garder l'indentation intacte
                lead = len(seg) - len(seg.lstrip()); trail = len(seg) - len(seg.rstrip())
                out.append((run_start + lead, end - trail, seg.strip()))
        run_start = None; run = []
    for p in parts:
        if not p:
            continue
        is_tag = p.startswith("<")
        name = tag_name(p) if is_tag and not p.startswith("<!--") else None
        if is_tag and (p.startswith("<!--") or p.startswith("<script") or p.startswith("<style") or name not in INLINE):
            flush(pos)
        else:
            if run_start is None:
                run_start = pos
            run.append(p)
        pos += len(p)
    flush(pos)
    return out

def attributs(page):
    out = []
    corps = page.index("<body")
    for m in re.finditer(r'\s(' + "|".join(ATTRS) + r')="([^"]*[A-Za-zÀ-ÿ][^"]*)"', page[corps:]):
        out.append((corps + m.start(2), corps + m.end(2), m.group(2)))
    for m in META_TRAD.finditer(page):
        out.append((m.start(2), m.end(2), m.group(2)))
    t = re.search(r"<title>(.*?)</title>", page, re.S)
    out.append((t.start(1), t.end(1), t.group(1)))
    return out

def jsonld(page):
    """Chaînes traduisibles des blocs JSON-LD : (début, fin, texte) sur la chaîne brute."""
    out = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', page, re.S):
        bloc = m.group(1); base = m.start(1)
        for k in re.finditer(r'"(' + "|".join(JSONLD_CLES) + r')"\s*:\s*"((?:[^"\\]|\\.)*)"', bloc):
            out.append((base + k.start(2), base + k.end(2), k.group(2)))
    return out

def tous(page):
    segs = blocs(page) + attributs(page) + jsonld(page)
    segs.sort()
    return segs
