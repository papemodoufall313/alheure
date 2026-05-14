#!/usr/bin/env python3
"""
Générateur du journal quotidien «À l'Heure» — 8 pages A4
Usage : python3 generate_journal.py [--date 2026-01-29] [--numero 1]
Output: public/journal/alheure-YYYY-MM-DD.pdf
"""

import json, os, argparse
from datetime import datetime
from pathlib import Path

from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import Frame, Paragraph, Spacer, HRFlowable, Image as RLImage
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.utils import ImageReader

# ── Dimensions (points) ────────────────────────────────────────────────────────
W, H   = A4           # 595.27 × 841.89
ML = MR = 26
MT      = 6
MB      = 22
CW      = W - ML - MR
GAP     = 8

# ── Couleurs ──────────────────────────────────────────────────────────────────
BLUE  = HexColor("#0e2b62")
RED   = HexColor("#c8302a")
LGRAY = HexColor("#f5f3ee")
INK   = HexColor("#1a1a1a")
INK2  = HexColor("#444444")
INK3  = HexColor("#888888")
RULE  = HexColor("#c0b8a8")

# ── Styles ────────────────────────────────────────────────────────────────────
S = {
    "h1":    ParagraphStyle("h1",   fontName="Times-Bold",    fontSize=36, leading=40, textColor=INK,  spaceAfter=3,  spaceBefore=0, alignment=TA_LEFT),
    "h1w":   ParagraphStyle("h1w",  fontName="Times-Bold",    fontSize=36, leading=40, textColor=white,spaceAfter=3,  spaceBefore=0, alignment=TA_LEFT),
    "h2":    ParagraphStyle("h2",   fontName="Times-Bold",    fontSize=22, leading=26, textColor=INK,  spaceAfter=3,  spaceBefore=0, alignment=TA_LEFT),
    "h3":    ParagraphStyle("h3",   fontName="Times-Bold",    fontSize=16, leading=19, textColor=INK,  spaceAfter=2,  spaceBefore=0, alignment=TA_LEFT),
    "h4":    ParagraphStyle("h4",   fontName="Times-Bold",    fontSize=12, leading=15, textColor=INK,  spaceAfter=2,  spaceBefore=0, alignment=TA_LEFT),
    "dekL":  ParagraphStyle("dekL", fontName="Times-Italic",  fontSize=13, leading=17, textColor=INK2, spaceAfter=3,  spaceBefore=0, alignment=TA_LEFT),
    "dekLw": ParagraphStyle("dkLw", fontName="Times-Italic",  fontSize=13, leading=17, textColor=white,spaceAfter=3,  spaceBefore=0, alignment=TA_LEFT),
    "dek":   ParagraphStyle("dek",  fontName="Times-Italic",  fontSize=10, leading=13, textColor=INK2, spaceAfter=2,  spaceBefore=0, alignment=TA_LEFT),
    "by":    ParagraphStyle("by",   fontName="Helvetica-Bold",fontSize=6.5,leading=9,  textColor=INK3, spaceAfter=2,  spaceBefore=0, alignment=TA_LEFT),
    "byw":   ParagraphStyle("byw",  fontName="Helvetica-Bold",fontSize=6.5,leading=9,  textColor=HexColor("#a8b4cf"), spaceAfter=2, spaceBefore=0, alignment=TA_LEFT),
    "body":  ParagraphStyle("body", fontName="Times-Roman",   fontSize=9,  leading=13, textColor=INK,  spaceAfter=0,  spaceBefore=0, alignment=TA_JUSTIFY),
    "bodyw": ParagraphStyle("bodw", fontName="Times-Roman",   fontSize=9,  leading=13, textColor=white,spaceAfter=0,  spaceBefore=0, alignment=TA_JUSTIFY),
    "bodyS": ParagraphStyle("bS",   fontName="Times-Roman",   fontSize=8,  leading=11, textColor=INK,  spaceAfter=0,  spaceBefore=0, alignment=TA_JUSTIFY),
    "tag":   ParagraphStyle("tag",  fontName="Helvetica-Bold",fontSize=6,  leading=8,  textColor=RED,  spaceAfter=1,  spaceBefore=0, alignment=TA_LEFT),
    "tagw":  ParagraphStyle("tagw", fontName="Helvetica-Bold",fontSize=6,  leading=8,  textColor=HexColor("#f87171"), spaceAfter=1, spaceBefore=0, alignment=TA_LEFT),
    "foot":  ParagraphStyle("ft",   fontName="Helvetica",     fontSize=7,  leading=9,  textColor=INK3, alignment=TA_CENTER),
}

BADGE_LABELS = {"rep":"GRAND REPORTAGE","longformat":"LONG FORMAT","video":"VIDÉO","live":"DIRECT"}
RUBRIQUE_LABELS = {
    "senegal":"SÉNÉGAL","afrique":"AFRIQUE","monde":"MONDE",
    "politique":"POLITIQUE","economie":"ÉCONOMIE","societe":"SOCIÉTÉ",
    "sport":"SPORT","culture":"CULTURE","diaspora":"DIASPORA",
}

BASE = Path(__file__).parent

def fr_date(d: datetime) -> str:
    mois  = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]
    jours = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]
    return f"{jours[d.weekday()]} {d.day} {mois[d.month-1]} {d.year}"

def esc(t: str) -> str:
    return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

def body_text(body: list, max_chars=9999) -> str:
    """Extrait tout le texte des blocs body. max_chars = limite optionnelle."""
    parts, total = [], 0
    for blk in body:
        if blk.get("type") in ("p","blockquote","pullquote"):
            t = blk.get("text","")
            if max_chars and total + len(t) > max_chars:
                parts.append(t[:max_chars-total] + "…"); break
            parts.append(t); total += len(t)
    return " ".join(parts)

def load_img(art: dict, max_w: float, fixed_h: float):
    """
    Charge l'image de l'article redimensionnée à fixed_h de hauteur exacte,
    centrée dans max_w (pas d'étirement, crop visuel obtenu par contrainte).
    Retourne un RLImage ou None.
    """
    url = art.get("imgUrl","")
    if not url:
        return None
    path = BASE / "public" / url.lstrip("/")
    if not path.exists():
        jpg = path.with_suffix(".jpg")
        if jpg.exists(): path = jpg
        else: return None
    if path.suffix.lower() == ".svg":
        return None
    try:
        ir  = ImageReader(str(path))
        iw, ih = ir.getSize()
        # Hauteur fixe, largeur proportionnelle mais plafonnée à max_w
        ratio = fixed_h / ih
        w_scaled = iw * ratio
        if w_scaled > max_w:
            # Recadrer horizontalement en réduisant davantage
            ratio = max_w / iw
            return RLImage(str(path), width=max_w, height=ih*ratio)
        return RLImage(str(path), width=w_scaled, height=fixed_h)
    except Exception:
        return None

def rub_label(art: dict) -> str:
    return BADGE_LABELS.get(art.get("badge",""), RUBRIQUE_LABELS.get(art.get("rubrique",""), art.get("rubrique","").upper()))

# ─── En-têtes / pieds de page ─────────────────────────────────────────────────

def draw_une_header(c, edition_date: datetime, numero: int):
    c.setFillColor(RED);  c.rect(0, H-5, W, 5, fill=1, stroke=0)
    c.setFillColor(BLUE); c.rect(0, H-83, W, 78, fill=1, stroke=0)
    c.setFont("Times-BoldItalic", 52); c.setFillColor(white)
    c.drawCentredString(W/2, H-63, "À l'Heure")
    c.setFont("Helvetica", 7.5); c.setFillColor(HexColor("#a8b4cf"))
    c.drawCentredString(W/2, H-78, "LE QUOTIDIEN D'INFORMATION")
    # Bande info
    c.setFillColor(LGRAY); c.rect(0, H-105, W, 22, fill=1, stroke=0)
    c.setFillColor(RED);   c.rect(0, H-107, W, 2, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 7); c.setFillColor(BLUE)
    info = f"{fr_date(edition_date).upper()}   |   N° {numero:03d}   |   PRIX : 100 FCFA   |   WWW.ALHEURE.SN   |   ISSN : 3020-0001"
    c.drawCentredString(W/2, H-99, info)

def draw_inner_header(c, rubrique_label: str, edition_date: datetime, numero: int, page_num: int):
    c.setFillColor(BLUE); c.rect(0, H-30, W, 30, fill=1, stroke=0)
    c.setFillColor(RED);  c.rect(0, H-32, W, 2, fill=1, stroke=0)
    c.setFont("Times-BoldItalic", 14); c.setFillColor(white)
    c.drawString(ML, H-22, "À l'Heure")
    c.setFont("Helvetica-Bold", 10); c.setFillColor(RED)
    c.drawCentredString(W/2, H-22, rubrique_label)
    c.setFont("Helvetica", 7); c.setFillColor(HexColor("#a8b4cf"))
    c.drawRightString(W-MR, H-22, f"N° {numero:03d} · {fr_date(edition_date)}")

def draw_footer(c, page_num: int, edition_date: datetime):
    c.setFillColor(BLUE); c.rect(0, 0, W, MB-4, fill=1, stroke=0)
    c.setFillColor(RED);  c.rect(0, MB-4, W, 2, fill=1, stroke=0)
    c.setFont("Helvetica", 6); c.setFillColor(HexColor("#a8b4cf"))
    c.drawString(ML, 7, "RIGUEUR · INDÉPENDANCE · PROXIMITÉ · INNOVATION")
    c.drawCentredString(W/2, 7, "alheure.info")
    c.drawRightString(W-MR, 7, f"Page {page_num}")

def col_rule(c, x, y_bot, height):
    c.setStrokeColor(RULE); c.setLineWidth(0.4)
    c.line(x, y_bot, x, y_bot+height)

# ─── Flowables article ────────────────────────────────────────────────────────

def article_story(a: dict, hs="h3", ds="dek", bs="body",
                  max_body=600, with_img=False, img_w=None, img_h=None,
                  dark=False) -> list:
    hs2 = hs+"w" if dark and hs+"w" in S else hs
    ds2 = ds+"w" if dark and ds+"w" in S else ds
    bs2 = bs+"w" if dark and bs+"w" in S else bs
    ts2 = "tagw" if dark else "tag"
    by2 = "byw" if dark else "by"

    story = []
    story.append(Paragraph(rub_label(a), S[ts2]))
    story.append(Spacer(1,1))
    story.append(Paragraph(esc(a.get("title","Sans titre")), S[hs2]))
    if a.get("dek"):
        story.append(Paragraph(esc(a["dek"]), S[ds2]))
    if a.get("author"):
        story.append(Paragraph(f'Par {esc(a["author"])}  ·  {esc(a.get("date",""))}', S[by2]))
    story.append(HRFlowable(width="100%", thickness=0.4, color=RULE if not dark else HexColor("#2a4a8c"), spaceAfter=3, spaceBefore=1))

    # Image
    if with_img and img_w and img_h:
        img = load_img(a, img_w, img_h)
        if img:
            story.append(img)
            story.append(Spacer(1,4))

    # Corps
    txt = body_text(a.get("body",[]), max_chars=max_body)
    if txt:
        story.append(Paragraph(esc(txt), S[bs2]))
    return story

# ─── PAGE 1 — LA UNE ──────────────────────────────────────────────────────────

def draw_une(c, articles: list, edition_date: datetime, numero: int):
    draw_une_header(c, edition_date, numero)
    draw_footer(c, 1, edition_date)

    content_top = H - 109   # sous header+infobar
    content_bot = MB
    content_h   = content_top - content_bot

    vedette    = next((a for a in articles if a.get("featured")), articles[0] if articles else None)
    secondaires= [a for a in articles if a is not vedette][:3]

    # ── Zone vedette : 58% de la hauteur ──────────────────────────────────────
    ved_h   = content_h * 0.58
    ved_y   = content_bot + content_h - ved_h
    txt_w   = CW * 0.62
    img_w   = CW - txt_w - 4

    # Fond bleu zone vedette
    c.setFillColor(BLUE)
    c.rect(ML, ved_y, CW, ved_h, fill=1, stroke=0)

    # Image article vedette à droite
    if vedette:
        img = load_img(vedette, img_w - 4, ved_h - 4)
        if img:
            iw, ih = img.drawWidth, img.drawHeight
            ix = ML + txt_w + 4
            iy = ved_y + (ved_h - ih) / 2
            img.drawOn(c, ix, iy)
        else:
            c.setFillColor(HexColor("#0a1e45"))
            c.rect(ML + txt_w + 4, ved_y, img_w - 4, ved_h, fill=1, stroke=0)

    # Badge rubrique vedette
    if vedette:
        rl = rub_label(vedette)
        c.setFillColor(RED); c.rect(ML, ved_y+ved_h-18, 120, 16, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 7); c.setFillColor(white)
        c.drawString(ML+6, ved_y+ved_h-11, rl)

        frame_v = Frame(ML+8, ved_y+4, txt_w-16, ved_h-28,
                        showBoundary=0, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        sv = article_story(vedette, "h1", "dekL", "body", max_body=700,
                           with_img=False, dark=True)
        frame_v.addFromList(sv, c)

    # Filet rouge séparateur
    sep_y = ved_y - 5
    c.setFillColor(RED); c.rect(ML, sep_y, CW, 2, fill=1, stroke=0)

    # ── Articles secondaires : bas de page ────────────────────────────────────
    sec_h  = sep_y - content_bot - 4
    col_w  = (CW - 2*GAP) / 3

    for i, art in enumerate(secondaires):
        cx = ML + i*(col_w+GAP)
        if i > 0:
            col_rule(c, cx-GAP/2, content_bot, sec_h)
        img = load_img(art, col_w, IMG_H)
        story = []
        if img:
            story.append(img); story.append(Spacer(1,3))
        story += article_story(art, "h4", "dek", "bodyS", max_body=9999)
        fr = Frame(cx, content_bot, col_w, sec_h,
                   showBoundary=0, leftPadding=0, rightPadding=0, topPadding=4, bottomPadding=0)
        fr.addFromList(story, c)

    c.showPage()

# ─── PAGES STANDARD ───────────────────────────────────────────────────────────

IMG_H = 58  # hauteur fixe de toutes les images dans les colonnes intérieures

def distribute(articles: list, cols: int) -> list[list]:
    """Répartit les articles en round-robin sur cols colonnes."""
    buckets: list[list] = [[] for _ in range(cols)]
    for i, a in enumerate(articles):
        buckets[i % cols].append(a)
    return buckets

def draw_standard_page(c, articles: list, rubrique_label: str,
                        page_num: int, edition_date: datetime, numero: int):
    draw_inner_header(c, rubrique_label, edition_date, numero, page_num)
    draw_footer(c, page_num, edition_date)

    content_top = H - 34
    content_bot = MB
    content_h   = content_top - content_bot

    n = len(articles)
    if n == 0:
        c.setFont("Helvetica", 9); c.setFillColor(INK3)
        c.drawCentredString(W/2, H/2, f"Aucun article — {rubrique_label}")
        c.showPage(); return

    # Nombre de colonnes selon le nombre d'articles
    cols  = 1 if n == 1 else (2 if n == 2 else 3)
    col_w = (CW - (cols-1)*GAP) / cols

    # Distribution round-robin : article 0 → col0, article 1 → col1, etc.
    art_lists = distribute(articles, cols)

    for i in range(cols):
        cx = ML + i*(col_w+GAP)
        if i > 0:
            col_rule(c, cx-GAP/2, content_bot, content_h)

        story = []
        for j, art in enumerate(art_lists[i]):
            is_lead = (j == 0 and i == 0)
            hs = "h2" if is_lead else ("h3" if j == 0 else "h4")

            # Image en haut de chaque premier article de colonne, hauteur fixe IMG_H
            if j == 0:
                img = load_img(art, col_w, IMG_H)
                if img:
                    story.append(img)
                    story.append(Spacer(1, 4))

            # Texte complet — pas de troncature, la Frame gère le débordement
            story += article_story(art, hs, "dek", "body", max_body=9999)
            story.append(Spacer(1, 5))
            story.append(HRFlowable(width="100%", thickness=0.5,
                                     color=RULE, spaceAfter=5, spaceBefore=0))

        fr = Frame(cx, content_bot, col_w, content_h,
                   showBoundary=0, leftPadding=0, rightPadding=0,
                   topPadding=6, bottomPadding=0)
        fr.addFromList(story, c)

    c.showPage()

# ─── PAGE 8 — GRAND FORMAT / PORTRAIT / INTERVIEW ────────────────────────────

def draw_page8(c, articles: list, page_num: int, edition_date: datetime, numero: int):
    label = "GRANDE INTERVIEW · PORTRAIT · CONTRIBUTION"
    draw_inner_header(c, label, edition_date, numero, page_num)
    draw_footer(c, page_num, edition_date)

    content_top = H - 34
    content_bot = MB
    content_h   = content_top - content_bot
    col_w       = (CW - GAP) / 2

    if not articles:
        fr = Frame(ML, content_bot, CW, content_h, showBoundary=0, leftPadding=0, rightPadding=0, topPadding=8, bottomPadding=0)
        fr.addFromList([Spacer(1,60), Paragraph("ESPACE RÉSERVÉ", S["h2"]),
                        Spacer(1,8), Paragraph("Grande interview · Portrait · Contribution", S["dek"]),
                        Spacer(1,12), Paragraph("Publiez un article avec le badge «longformat» ou la rubrique «interview» pour alimenter cette page.", S["body"])], c)
        c.showPage(); return

    col_rule(c, ML+col_w+GAP/2, content_bot, content_h)

    art = articles[0]
    img_full = load_img(art, col_w, IMG_H * 2)

    for i in range(2):
        cx = ML + i*(col_w+GAP)
        fr = Frame(cx, content_bot, col_w, content_h,
                   showBoundary=0, leftPadding=0, rightPadding=0, topPadding=6, bottomPadding=0)
        if i == 0:
            story = article_story(art, "h2", "dekL", "body", max_body=1000)
        else:
            story = []
            if img_full:
                story.append(img_full); story.append(Spacer(1,8))
            # Continuation corps
            all_txt = body_text(art.get("body",[]), max_chars=2000)
            words = all_txt.split()
            half  = len(words)//2
            story.append(Paragraph(esc(" ".join(words[half:])), S["body"]))
            if len(articles) > 1:
                story += [Spacer(1,10),
                          HRFlowable(width="100%", thickness=0.6, color=BLUE, spaceAfter=6),
                          *article_story(articles[1], "h4", "dek", "bodyS", max_body=350)]
        fr.addFromList(story, c)

    c.showPage()

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date",   default=datetime.today().strftime("%Y-%m-%d"))
    parser.add_argument("--numero", type=int, default=1)
    parser.add_argument("--out",    default=None)
    args = parser.parse_args()

    edition_date = datetime.strptime(args.date, "%Y-%m-%d")
    numero       = args.numero

    data   = BASE / "src" / "data" / "articles.json"
    outdir = BASE / "public" / "journal"
    outdir.mkdir(exist_ok=True)
    out_path = args.out or str(outdir / f"alheure-{args.date}.pdf")

    with open(data, encoding="utf-8") as f:
        all_arts = json.load(f)

    articles = [a for a in all_arts if a.get("status","published") in ("published","",None)]

    def by_rub(*rubriques):
        return [a for a in articles if a.get("rubrique","") in rubriques]

    actualites = by_rub("senegal","politique","economie","monde")
    societe    = by_rub("societe","diaspora","sante","education")
    afrique    = by_rub("afrique")
    sport      = by_rub("sport")
    culture    = by_rub("culture")
    special    = by_rub("interview","portrait","contribution") or \
                 [a for a in articles if a.get("badge") == "longformat"] or \
                 articles[-2:]

    c = rl_canvas.Canvas(out_path, pagesize=A4)
    c.setTitle(f"À l'Heure — N° {numero:03d} — {fr_date(edition_date)}")
    c.setAuthor("Rédaction À l'Heure")

    # Page 1 — La Une
    draw_une(c, articles, edition_date, numero)

    # Pages 2-3 — Actualités
    mid = max(1, len(actualites)//2)
    draw_standard_page(c, actualites[:mid] or articles[:4],   "ACTUALITÉS",   2, edition_date, numero)
    draw_standard_page(c, actualites[mid:] or articles[4:8],  "ACTUALITÉS",   3, edition_date, numero)

    # Page 4 — Société
    draw_standard_page(c, societe  or articles[8:11],  "SOCIÉTÉ",      4, edition_date, numero)

    # Page 5 — ActuAfrique
    draw_standard_page(c, afrique  or articles[11:14], "ACTU AFRIQUE", 5, edition_date, numero)

    # Page 6 — Sport
    draw_standard_page(c, sport    or articles[14:16], "SPORT",        6, edition_date, numero)

    # Page 7 — Culture
    draw_standard_page(c, culture  or articles[16:19], "CULTURE",      7, edition_date, numero)

    # Page 8 — Grand format
    draw_page8(c, special, 8, edition_date, numero)

    c.save()
    print(f"✓ Journal généré : {out_path}")

if __name__ == "__main__":
    main()
