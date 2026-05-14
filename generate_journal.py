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
from reportlab.platypus import Frame, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT

# ── Dimensions (points) ────────────────────────────────────────────────────────
W, H   = A4           # 595.27 × 841.89
ML = MR = 26          # marges latérales
MT      = 8           # marge haute
MB      = 24          # marge basse (footer)
CW      = W - ML - MR # largeur contenu ≈ 543 pt
GAP     = 8           # gouttière entre colonnes

# ── Couleurs ──────────────────────────────────────────────────────────────────
BLUE  = HexColor("#0e2b62")
RED   = HexColor("#c8302a")
LGRAY = HexColor("#f5f3ee")
INK   = HexColor("#1a1a1a")
INK2  = HexColor("#444444")
INK3  = HexColor("#888888")
RULE  = HexColor("#c0b8a8")

# ── Styles typographiques ──────────────────────────────────────────────────────
S = {
    "h1":    ParagraphStyle("h1",   fontName="Times-Bold",    fontSize=40, leading=44, textColor=INK,  spaceAfter=4, alignment=TA_LEFT),
    "h2":    ParagraphStyle("h2",   fontName="Times-Bold",    fontSize=26, leading=30, textColor=INK,  spaceAfter=3, alignment=TA_LEFT),
    "h3":    ParagraphStyle("h3",   fontName="Times-Bold",    fontSize=17, leading=20, textColor=INK,  spaceAfter=2, alignment=TA_LEFT),
    "h4":    ParagraphStyle("h4",   fontName="Times-Bold",    fontSize=13, leading=16, textColor=INK,  spaceAfter=2, alignment=TA_LEFT),
    "dek":   ParagraphStyle("dek",  fontName="Times-Italic",  fontSize=11, leading=14, textColor=INK2, spaceAfter=3, alignment=TA_LEFT),
    "dekL":  ParagraphStyle("dekL", fontName="Times-Italic",  fontSize=14, leading=18, textColor=INK2, spaceAfter=4, alignment=TA_LEFT),
    "by":    ParagraphStyle("by",   fontName="Helvetica-Bold",fontSize=7,  leading=9,  textColor=INK3, spaceAfter=3, alignment=TA_LEFT),
    "body":  ParagraphStyle("body", fontName="Times-Roman",   fontSize=9,  leading=13, textColor=INK,  alignment=TA_JUSTIFY),
    "bodyS": ParagraphStyle("bS",   fontName="Times-Roman",   fontSize=8,  leading=11, textColor=INK,  alignment=TA_JUSTIFY),
    "quote": ParagraphStyle("qt",   fontName="Times-Italic",  fontSize=10, leading=14, textColor=BLUE, spaceAfter=2, alignment=TA_CENTER),
    "rub":   ParagraphStyle("rub",  fontName="Helvetica-Bold",fontSize=6.5,leading=8,  textColor=white, alignment=TA_CENTER),
    "foot":  ParagraphStyle("ft",   fontName="Helvetica",     fontSize=7,  leading=9,  textColor=INK3, alignment=TA_CENTER),
    "footR": ParagraphStyle("ftr",  fontName="Helvetica",     fontSize=7,  leading=9,  textColor=INK3, alignment=TA_RIGHT),
    "tag":   ParagraphStyle("tag",  fontName="Helvetica-Bold",fontSize=6.5,leading=8,  textColor=BLUE, alignment=TA_LEFT),
}

BADGE_LABELS = {
    "rep":        "GRAND REPORTAGE",
    "longformat": "LONG FORMAT",
    "video":      "VIDÉO",
    "live":       "DIRECT",
}

RUBRIQUE_LABELS = {
    "senegal":  "SÉNÉGAL",
    "afrique":  "AFRIQUE",
    "monde":    "MONDE",
    "politique":"POLITIQUE",
    "economie": "ÉCONOMIE",
    "societe":  "SOCIÉTÉ",
    "sport":    "SPORT",
    "culture":  "CULTURE",
    "diaspora": "DIASPORA",
}

def fr_date(d: datetime) -> str:
    mois = ["janvier","février","mars","avril","mai","juin",
            "juillet","août","septembre","octobre","novembre","décembre"]
    jours = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]
    return f"{jours[d.weekday()]} {d.day} {mois[d.month-1]} {d.year}"

def body_to_text(body: list, max_chars=600) -> str:
    """Extrait le texte brut des blocs body (types p, blockquote, pullquote)."""
    parts = []
    total = 0
    for blk in body:
        if blk.get("type") in ("p", "blockquote", "pullquote"):
            t = blk.get("text", "")
            if total + len(t) > max_chars:
                t = t[:max_chars - total] + "…"
                parts.append(t)
                break
            parts.append(t)
            total += len(t)
            if total >= max_chars:
                break
    return " ".join(parts)

def escape(t: str) -> str:
    return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("'","&apos;")

def build_article_story(a: dict, headline_style="h3", dek_style="dek",
                         body_style="body", show_dek=True,
                         show_byline=True, max_body=400) -> list:
    """Retourne une liste de Flowables pour un article."""
    story = []
    rub = a.get("rubrique","")
    badge = a.get("badge")

    # Badge rubrique
    label = BADGE_LABELS.get(badge, RUBRIQUE_LABELS.get(rub, rub.upper()))
    story.append(Paragraph(f'<font color="#c8302a">▌</font> {label}', S["tag"]))
    story.append(Spacer(1, 2))

    # Titre
    title = escape(a.get("title","Sans titre"))
    story.append(Paragraph(title, S[headline_style]))

    # Chapeau
    if show_dek and a.get("dek"):
        story.append(Paragraph(escape(a["dek"]), S[dek_style]))

    # Auteur
    if show_byline and a.get("author"):
        story.append(Paragraph(f'Par {escape(a["author"])} · {escape(a.get("date",""))}', S["by"]))

    story.append(HRFlowable(width="100%", thickness=0.4, color=RULE, spaceAfter=4, spaceBefore=1))

    # Corps
    txt = body_to_text(a.get("body",[]), max_chars=max_body)
    if txt:
        story.append(Paragraph(escape(txt), S[body_style]))

    return story

# ─────────────────────────────────────────────────────────────────────────────
# HEADER & FOOTER
# ─────────────────────────────────────────────────────────────────────────────

def draw_une_header(c, date_str: str, numero: int, edition_date: datetime):
    """Dessine l'en-tête de la Une (page 1)."""
    # Bande rouge top
    c.setFillColor(RED)
    c.rect(0, H - 5, W, 5, fill=1, stroke=0)

    # Fond bleu header
    header_h = 78
    c.setFillColor(BLUE)
    c.rect(0, H - 5 - header_h, W, header_h, fill=1, stroke=0)

    # Logo
    c.setFillColor(white)
    c.setFont("Times-BoldItalic", 54)
    c.drawCentredString(W / 2, H - 5 - 58, "À l'Heure")

    # Tagline
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#a8b4cf"))
    c.drawCentredString(W / 2, H - 5 - 73, "LE QUOTIDIEN D'INFORMATION")

    # Bande info (blanche)
    info_y = H - 5 - header_h - 22
    c.setFillColor(LGRAY)
    c.rect(0, info_y, W, 22, fill=1, stroke=0)

    # Filet rouge sous la bande info
    c.setFillColor(RED)
    c.rect(0, info_y - 3, W, 3, fill=1, stroke=0)

    # Texte info bar
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 7.5)
    info = (f"{date_str.upper()}   |   N° {numero:03d}   |   PRIX : 100 FCFA   "
            f"|   WWW.ALHEURE.SN   |   ISSN : 3020-0001")
    c.drawCentredString(W / 2, info_y + 7, info)

def draw_inner_header(c, rubrique_label: str, date_str: str, numero: int, page_num: int):
    """En-tête compact pour pages 2–8."""
    bar_h = 28
    c.setFillColor(BLUE)
    c.rect(0, H - bar_h, W, bar_h, fill=1, stroke=0)

    # Logo petit
    c.setFillColor(white)
    c.setFont("Times-BoldItalic", 16)
    c.drawString(ML, H - bar_h + 8, "À l'Heure")

    # Rubrique
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(RED)
    c.drawCentredString(W / 2, H - bar_h + 8, rubrique_label)

    # Date + N°
    c.setFont("Helvetica", 7)
    c.setFillColor(HexColor("#a8b4cf"))
    c.drawRightString(W - MR, H - bar_h + 8, f"N° {numero:03d} · {date_str}")

    # Filet rouge
    c.setFillColor(RED)
    c.rect(0, H - bar_h - 2, W, 2, fill=1, stroke=0)

def draw_footer(c, page_num: int, date_str: str):
    """Footer en bas de chaque page."""
    c.setFillColor(BLUE)
    c.rect(0, 0, W, MB - 6, fill=1, stroke=0)

    c.setFillColor(RED)
    c.rect(0, MB - 6, W, 2, fill=1, stroke=0)

    c.setFont("Helvetica", 6.5)
    c.setFillColor(HexColor("#a8b4cf"))
    c.drawString(ML, 8, "RIGUEUR · INDÉPENDANCE · PROXIMITÉ · INNOVATION")
    c.drawCentredString(W / 2, 8, "alheure.info")
    c.drawRightString(W - MR, 8, f"Page {page_num} · {date_str}")

def draw_column_rule(c, x, y, height):
    """Filet vertical entre colonnes."""
    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(x, y, x, y + height)

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 1 — LA UNE
# ─────────────────────────────────────────────────────────────────────────────

def draw_une(c, articles: list, date_str: str, numero: int, edition_date: datetime):
    c.setPageSize(A4)
    draw_une_header(c, fr_date(edition_date), numero, edition_date)
    draw_footer(c, 1, fr_date(edition_date))

    # Zone de contenu
    header_total = 5 + 78 + 22 + 3  # red + blue + info + red = 108
    content_top  = H - header_total - MT
    content_bot  = MB
    content_h    = content_top - content_bot

    # ── Article vedette (featured ou premier article) ──
    vedette = next((a for a in articles if a.get("featured")), articles[0] if articles else None)
    secondaires = [a for a in articles if a is not vedette][:4]

    # Bandeau vedette : 60% de la hauteur
    vedette_h = content_h * 0.60
    vedette_y = content_bot + content_h - vedette_h

    # Fond bleu pour la vedette
    c.setFillColor(BLUE)
    c.rect(ML, vedette_y, CW * 0.65, vedette_h, fill=1, stroke=0)

    # Badge rubrique vedette
    if vedette:
        rub = vedette.get("rubrique","")
        badge = vedette.get("badge")
        rlabel = BADGE_LABELS.get(badge, RUBRIQUE_LABELS.get(rub, rub.upper()))
        c.setFillColor(RED)
        c.rect(ML, vedette_y + vedette_h - 18, 110, 16, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(white)
        c.drawString(ML + 5, vedette_y + vedette_h - 11, rlabel)

        # Titre vedette
        titre = vedette.get("title","")
        frame_vedette = Frame(ML + 8, vedette_y + 8, CW * 0.65 - 16, vedette_h - 36,
                               showBoundary=0, leftPadding=0, rightPadding=0,
                               topPadding=0, bottomPadding=0)
        story_vedette = [
            Paragraph(escape(titre), S["h1"]),
            Spacer(1, 4),
        ]
        if vedette.get("dek"):
            story_vedette.append(Paragraph(escape(vedette["dek"]), S["dekL"]))
            story_vedette.append(Spacer(1, 4))
        if vedette.get("author"):
            story_vedette.append(Paragraph(
                f'<font color="#a8b4cf">Par {escape(vedette["author"])}</font>', S["by"]))
            story_vedette.append(Spacer(1, 6))
        txt = body_to_text(vedette.get("body",[]), max_chars=500)
        if txt:
            p = ParagraphStyle("bv", fontName="Times-Roman", fontSize=9.5, leading=13,
                                textColor=white, alignment=TA_JUSTIFY)
            story_vedette.append(Paragraph(escape(txt), p))
        frame_vedette.addFromList(story_vedette, c)

    # Zone image droite vedette (placeholder hachuré)
    img_x = ML + CW * 0.65 + 4
    img_w = CW * 0.35 - 4
    c.setFillColor(HexColor("#0a1e45"))
    c.rect(img_x, vedette_y, img_w, vedette_h, fill=1, stroke=0)
    c.setFillColor(HexColor("#2a3e65"))
    c.setFont("Helvetica", 8)
    c.drawCentredString(img_x + img_w / 2, vedette_y + vedette_h / 2, "PHOTO")
    c.drawCentredString(img_x + img_w / 2, vedette_y + vedette_h / 2 - 14, "À l'Heure")

    # Filet rouge séparateur
    sep_y = vedette_y - 4
    c.setFillColor(RED)
    c.rect(ML, sep_y, CW, 2, fill=1, stroke=0)

    # ── Articles secondaires (3 colonnes dans 40% inférieur) ──
    sec_h = vedette_y - 4 - content_bot - 6
    sec_y = content_bot
    col_w = (CW - 2 * GAP) / 3

    for i, art in enumerate(secondaires[:3]):
        cx = ML + i * (col_w + GAP)
        if i > 0:
            draw_column_rule(c, cx - GAP / 2, sec_y, sec_h)

        frame = Frame(cx, sec_y, col_w, sec_h - 2,
                      showBoundary=0, leftPadding=0, rightPadding=0,
                      topPadding=4, bottomPadding=0)
        story = build_article_story(art, "h4", "dek", "bodyS",
                                    show_dek=True, show_byline=True, max_body=280)
        frame.addFromList(story, c)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGES STANDARD (3 colonnes)
# ─────────────────────────────────────────────────────────────────────────────

def draw_standard_page(c, articles: list, rubrique_label: str,
                        page_num: int, date_str: str, numero: int,
                        cols: int = 3):
    c.setPageSize(A4)
    draw_inner_header(c, rubrique_label, date_str, numero, page_num)
    draw_footer(c, page_num, date_str)

    # Zone de contenu
    content_top = H - 30 - 4  # header + filet rouge
    content_bot = MB
    content_h   = content_top - content_bot

    col_w = (CW - (cols - 1) * GAP) / cols

    # Distribution des articles dans les colonnes
    story_all = []
    for i, art in enumerate(articles):
        hs = "h3" if i == 0 else "h4"
        ds = "dek" if i == 0 else "dek"
        mb = 500 if i == 0 else 320
        story_all += build_article_story(art, hs, ds, "body",
                                         show_dek=True, show_byline=True, max_body=mb)
        story_all.append(Spacer(1, 8))
        story_all.append(HRFlowable(width="100%", thickness=0.6, color=BLUE,
                                     spaceAfter=6, spaceBefore=0))

    # Répartition en colonnes (approx égales par nombre d'articles)
    per_col = max(1, len(articles) // cols)
    art_lists = []
    for i in range(cols):
        start = i * per_col
        end   = start + per_col if i < cols - 1 else len(articles)
        art_lists.append(articles[start:end])

    for i in range(cols):
        cx = ML + i * (col_w + GAP)
        if i > 0:
            draw_column_rule(c, cx - GAP / 2, content_bot, content_h)

        frame = Frame(cx, content_bot, col_w, content_h,
                      showBoundary=0, leftPadding=0, rightPadding=0,
                      topPadding=6, bottomPadding=0)
        col_story = []
        for j, art in enumerate(art_lists[i]):
            hs = "h3" if j == 0 and i == 0 else "h4"
            mb = 520 if j == 0 and i == 0 else 350
            col_story += build_article_story(art, hs, "dek", "body",
                                              show_dek=True, show_byline=True, max_body=mb)
            col_story.append(Spacer(1, 6))
            col_story.append(HRFlowable(width="100%", thickness=0.5, color=RULE,
                                         spaceAfter=5, spaceBefore=0))
        frame.addFromList(col_story, c)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 8 — GRANDE INTERVIEW / PORTRAIT / CONTRIBUTION (2 colonnes)
# ─────────────────────────────────────────────────────────────────────────────

def draw_page8(c, articles: list, page_num: int, date_str: str, numero: int):
    c.setPageSize(A4)
    rubrique_label = "GRANDE INTERVIEW · PORTRAIT · CONTRIBUTION"
    draw_inner_header(c, rubrique_label, date_str, numero, page_num)
    draw_footer(c, page_num, date_str)

    content_top = H - 30 - 4
    content_bot = MB
    content_h   = content_top - content_bot
    col_w       = (CW - GAP) / 2

    if not articles:
        # Page blanche avec message
        frame = Frame(ML, content_bot, CW, content_h, showBoundary=0,
                      leftPadding=0, rightPadding=0, topPadding=8, bottomPadding=0)
        frame.addFromList([
            Spacer(1, 80),
            Paragraph("ESPACE RÉSERVÉ", S["h2"]),
            Spacer(1, 8),
            Paragraph("Grande interview · Portrait · Contribution", S["dek"]),
            Spacer(1, 16),
            Paragraph("Publiez un article avec les rubriques «interview», «portrait» ou «contribution» pour alimenter cette page automatiquement.", S["body"]),
        ], c)
        c.showPage()
        return

    # Article principal sur 2 colonnes
    art = articles[0]
    draw_column_rule(c, ML + col_w + GAP / 2, content_bot, content_h)

    for i in range(2):
        cx = ML + i * (col_w + GAP)
        frame = Frame(cx, content_bot, col_w, content_h, showBoundary=0,
                      leftPadding=0, rightPadding=0, topPadding=6, bottomPadding=0)
        if i == 0:
            story = build_article_story(art, "h2", "dekL", "body",
                                        show_dek=True, show_byline=True, max_body=900)
        else:
            # Suite de l'article + éventuellement art 2
            txt = body_to_text(art.get("body",[]), max_chars=1800)
            words = txt.split()
            half  = len(words) // 2
            story = [Paragraph(escape(" ".join(words[half:])), S["body"])]
            if len(articles) > 1:
                story += [Spacer(1, 10),
                           HRFlowable(width="100%", thickness=0.6, color=BLUE,
                                       spaceAfter=6),
                           *build_article_story(articles[1], "h4", "dek", "bodyS",
                                                 max_body=300)]
        frame.addFromList(story, c)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGE VIDE (si pas assez d'articles)
# ─────────────────────────────────────────────────────────────────────────────

def draw_empty_page(c, rubrique_label: str, page_num: int, date_str: str, numero: int):
    c.setPageSize(A4)
    draw_inner_header(c, rubrique_label, date_str, numero, page_num)
    draw_footer(c, page_num, date_str)
    c.setFont("Helvetica", 9)
    c.setFillColor(INK3)
    c.drawCentredString(W / 2, H / 2, f"Aucun article — rubrique «{rubrique_label}»")
    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Génère le journal PDF À l'Heure")
    parser.add_argument("--date",   default=datetime.today().strftime("%Y-%m-%d"),
                        help="Date d'édition YYYY-MM-DD")
    parser.add_argument("--numero", type=int, default=1, help="Numéro du journal")
    parser.add_argument("--out",    default=None, help="Chemin de sortie du PDF")
    args = parser.parse_args()

    edition_date = datetime.strptime(args.date, "%Y-%m-%d")
    date_str     = fr_date(edition_date)
    numero       = args.numero

    # Lecture des articles
    base   = Path(__file__).parent
    data   = base / "src" / "data" / "articles.json"
    outdir = base / "public" / "journal"
    outdir.mkdir(exist_ok=True)

    out_path = args.out or str(outdir / f"alheure-{args.date}.pdf")

    with open(data, encoding="utf-8") as f:
        all_articles = json.load(f)

    # Ne retenir que les articles publiés
    articles = [a for a in all_articles if a.get("status","published") in ("published", None, "")]

    def by_rub(*rubriques):
        return [a for a in articles if a.get("rubrique","") in rubriques]

    # Répartition par page
    actualites  = by_rub("senegal","politique","economie","monde")
    societe     = by_rub("societe","diaspora","sante","education")
    afrique     = by_rub("afrique")
    sport       = by_rub("sport")
    culture     = by_rub("culture")
    special     = by_rub("interview","portrait","contribution","longformat") or articles[-2:]

    # Canvas PDF
    c = rl_canvas.Canvas(out_path, pagesize=A4)
    c.setTitle(f"À l'Heure — N° {numero:03d} — {date_str}")
    c.setAuthor("Rédaction À l'Heure")
    c.setSubject("Journal quotidien d'information")

    # ── Page 1 : La Une ──────────────────────────────────────────────────────
    draw_une(c, articles[:8], date_str, numero, edition_date)

    # ── Pages 2-3 : Actualités ────────────────────────────────────────────────
    mid = len(actualites) // 2 or 1
    p2_arts = actualites[:mid] if actualites else articles[:3]
    p3_arts = actualites[mid:] if actualites else articles[3:6]

    draw_standard_page(c, p2_arts or articles[:3], "ACTUALITÉS", 2, date_str, numero)
    draw_standard_page(c, p3_arts or articles[3:6], "ACTUALITÉS", 3, date_str, numero)

    # ── Page 4 : Société ─────────────────────────────────────────────────────
    draw_standard_page(c, societe or articles[6:9], "SOCIÉTÉ", 4, date_str, numero)

    # ── Page 5 : ActuAfrique ─────────────────────────────────────────────────
    draw_standard_page(c, afrique or articles[9:12], "ACTU AFRIQUE", 5, date_str, numero)

    # ── Page 6 : Sport ────────────────────────────────────────────────────────
    draw_standard_page(c, sport or articles[12:14], "SPORT", 6, date_str, numero)

    # ── Page 7 : Culture ──────────────────────────────────────────────────────
    draw_standard_page(c, culture or articles[14:17], "CULTURE", 7, date_str, numero)

    # ── Page 8 : Grande Interview / Portrait / Contribution ───────────────────
    draw_page8(c, special, 8, date_str, numero)

    c.save()
    print(f"✓ Journal généré : {out_path}")
    return out_path

if __name__ == "__main__":
    main()
