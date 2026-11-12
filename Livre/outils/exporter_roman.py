#!/usr/bin/env python3
"""Édition A5 du roman RUPTURE. Aucun texte narratif n'est réécrit."""
from pathlib import Path
from hashlib import sha256
import re, json
import yaml
from markdown_it import MarkdownIt
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/"Livre"/"chapitres"
OUT=ROOT/"Livre"/"exports"
OUT.mkdir(exist_ok=True,parents=True)
FONT="EB Garamond"
ROMAN=["I","II","III","IV","V","VI","VII","VIII"]

def chapters():
    expected=[SRC/f"chapitre-{n:02}.md" for n in range(1,51)]
    actual=sorted(SRC.glob("chapitre-*.md"))
    if expected!=actual: raise ValueError("Chapitre absent ou numéro inattendu: "+str([p.name for p in actual]))
    result=[]
    for n,p in enumerate(expected,1):
        raw=p.read_text(encoding="utf-8-sig")
        match=re.match(r"\A---\s*\n(.*?)\n---\s*\n",raw,re.S)
        if not match: raise ValueError("Métadonnées absentes: "+str(p))
        y=yaml.safe_load(match.group(1))
        body=raw[match.end():].strip("\n")
        title=str(y["title"])
        part=int(y["partie"])
        head=re.match(r"^#\s+Chapitre\s+(\d+)\s*[—–-]\s*(.*?)\s*$",body,re.M)
        if int(y["chapitre"])!=n or not 1<=part<=8 or not head or int(head.group(1))!=n or head.group(2)!=title:
            raise ValueError("Numéro/titre/partie incohérent: "+str(p))
        narrative=re.sub(r"\A#\s+Chapitre\s+\d+\s*[—–-]\s*[^\n]+\n*","",body,count=1)
        words=len(re.findall(r"(?u)\b[^\W_]+(?:[’'\-][^\W_]+)*\b",narrative))
        result.append(dict(number=n,part=part,title=title,body=narrative,
                           file=str(p.relative_to(ROOT)),words=words,
                           bytes=len(raw.encode("utf-8")),sha256=sha256(raw.encode("utf-8")).hexdigest()))
    return result

def style(doc,name,size,bold=False,italic=False,before=0,after=0,next=False):
    s=doc.styles.add_style(name,WD_STYLE_TYPE.PARAGRAPH)
    s.base_style=doc.styles["Normal"]
    s.font.name=FONT;s.font.size=Pt(size);s.font.bold=bold;s.font.italic=italic
    s.font.color.rgb=RGBColor(34,33,31)
    pf=s.paragraph_format
    pf.space_before=Pt(before);pf.space_after=Pt(after)
    pf.keep_with_next=next;pf.widow_control=True;pf.first_line_indent=Cm(0)
    return s

def bookmark(p,n):
    a=OxmlElement("w:bookmarkStart");a.set(qn("w:id"),str(n));a.set(qn("w:name"),f"chap_{n:02}")
    b=OxmlElement("w:bookmarkEnd");b.set(qn("w:id"),str(n))
    p._p.insert(0,a);p._p.append(b)

def link(p,n,title):
    h=OxmlElement("w:hyperlink");h.set(qn("w:anchor"),f"chap_{n:02}")
    r=OxmlElement("w:r");t=OxmlElement("w:t");t.text=f"{n:02}  {title}"
    r.append(t);h.append(r);p._p.append(h)

def page_field(p):
    p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    r=p.add_run()
    for kind in ("begin","separate","end"):
        if kind=="separate":
            ins=OxmlElement("w:instrText");ins.set(qn("xml:space"),"preserve");ins.text=" PAGE ";r._r.append(ins)
        f=OxmlElement("w:fldChar");f.set(qn("w:fldCharType"),kind);r._r.append(f)

def inline(p,token):
    bold=False;italic=False
    for t in token.children or []:
        if t.type=="strong_open":bold=True
        elif t.type=="strong_close":bold=False
        elif t.type=="em_open":italic=True
        elif t.type=="em_close":italic=False
        elif t.type in ("text","code_inline","html_inline","image"):
            r=p.add_run(t.content or "")
            r.bold=bold;r.italic=italic
            if t.type=="code_inline":r.font.name="Liberation Mono";r.font.size=Pt(9)
        elif t.type in ("softbreak","hardbreak"):p.add_run().add_break()

def body(doc,markdown):
    tokens=MarkdownIt("commonmark").parse(markdown)
    i=0;quote=False;bullet=0
    while i<len(tokens):
        t=tokens[i]
        if t.type=="heading_open" and i+2<len(tokens):
            p=doc.add_paragraph(style="Intertitre");inline(p,tokens[i+1]);i+=3;continue
        if t.type=="paragraph_open" and i+2<len(tokens):
            x=tokens[i+1]
            children=x.children or []
            date=(len(children)>=3 and children[0].type=="em_open" and children[-1].type=="em_close")
            form="Date narrative" if date else ("Citation" if quote else "Normal")
            p=doc.add_paragraph(style=form)
            if bullet:p.add_run("•  ")
            elif form=="Normal" and x.content.lstrip().startswith(("— ","– ")):
                p.paragraph_format.first_line_indent=Cm(0)
            inline(p,x)
            i+=3;continue
        if t.type=="blockquote_open":quote=True
        elif t.type=="blockquote_close":quote=False
        elif t.type in ("bullet_list_open","ordered_list_open"):bullet+=1
        elif t.type in ("bullet_list_close","ordered_list_close"):bullet=max(0,bullet-1)
        elif t.type=="hr":
            p=doc.add_paragraph(style="Séparation");p.add_run("· · ·")
        elif t.type in ("fence","code_block","html_block"):
            doc.add_paragraph(t.content.rstrip("\n"),style="Citation")
        i+=1

def make(items):
    d=Document();sec=d.sections[0]
    sec.page_width=Cm(14.8);sec.page_height=Cm(21)
    sec.top_margin=Cm(1.9);sec.bottom_margin=Cm(1.85)
    sec.left_margin=Cm(2.15);sec.right_margin=Cm(1.75)
    sec.header_distance=Cm(.9);sec.footer_distance=Cm(.9)
    sec.different_first_page_header_footer=True
    n=d.styles["Normal"];n.font.name=FONT;n.font.size=Pt(11.5)
    n.font.color.rgb=RGBColor(34,33,31)
    n.paragraph_format.first_line_indent=Cm(.48)
    n.paragraph_format.line_spacing=1.22
    n.paragraph_format.space_after=Pt(0)
    n.paragraph_format.widow_control=True
    for name,size,bold,ital,before,after,nxt in [
        ("Grand titre",33,0,0,0,0,0),("Sous-titre",12,0,1,10,0,0),
        ("Auteur",14,0,0,50,0,0),("Sommaire titre",22,0,0,0,16,1),
        ("Sommaire partie",11,1,0,12,3,1),("Sommaire chapitre",10,0,0,0,3,0),
        ("Partie",10,1,0,0,13,1),("Chapitre",18,0,0,0,21,1),
        ("Intertitre",12,1,0,20,9,1),("Date narrative",10,0,1,12,12,0),
        ("Citation",10.5,0,1,8,8,0),("Séparation",10,0,0,12,12,0)]:
        style(d,name,size,bold,ital,before,after,nxt)
    d.styles["Sommaire chapitre"].paragraph_format.left_indent=Cm(.5)
    d.styles["Citation"].paragraph_format.left_indent=Cm(.6)
    d.styles["Citation"].paragraph_format.right_indent=Cm(.3)
    t=d.add_paragraph(style="Grand titre");t.paragraph_format.space_before=Cm(6.2)
    t.alignment=WD_ALIGN_PARAGRAPH.CENTER;t.add_run("RUPTURE")
    p=d.add_paragraph(style="Sous-titre");p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run("Roman")
    p=d.add_paragraph(style="Auteur");p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run("Tugay")
    d.add_page_break()
    d.add_paragraph("Sommaire",style="Sommaire titre")
    last=None
    for c in items:
        if c["part"]!=last:
            last=c["part"];d.add_paragraph("PARTIE "+ROMAN[last-1],style="Sommaire partie")
        p=d.add_paragraph(style="Sommaire chapitre");link(p,c["number"],c["title"])
    for c in items:
        p=d.add_paragraph(style="Partie");p.paragraph_format.page_break_before=True
        p.add_run("PARTIE "+ROMAN[c["part"]-1])
        p=d.add_paragraph(style="Chapitre");bookmark(p,c["number"])
        x=p.add_run(f'CHAPITRE {c["number"]}');x.bold=True;x.font.size=Pt(11);x.add_break()
        p.add_run(c["title"])
        body(d,c["body"])
    foot=sec.footer.paragraphs[0]
    foot.paragraph_format.first_line_indent=Cm(0);page_field(foot)
    d.core_properties.title="RUPTURE";d.core_properties.author="Tugay"
    d.core_properties.subject="Manuscrit intégral — 50 chapitres"
    return d

def main():
    items=chapters()
    target=OUT/"RUPTURE_manuscrit_integral.docx"
    make(items).save(target)
    manifest=dict(title="RUPTURE",author="Tugay",chapters=len(items),
                  parts=len(set(c["part"] for c in items)),
                  estimated_words=sum(c["words"] for c in items),
                  source_files=[{k:c[k] for k in ("number","part","title","file","bytes","words","sha256")} for c in items],
                  note="Les fichiers source sont intacts. Seuls le YAML et les signes de mise en forme Markdown sont retirés de l'affichage.")
    (OUT/"controle_assemblage.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Assemblage:",len(items),"chapitres,",manifest["estimated_words"],"mots environ;",target)
if __name__=="__main__":main()
