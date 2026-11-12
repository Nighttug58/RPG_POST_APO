#!/usr/bin/env python3
"""Export Word A5 du manuscrit RUPTURE, cinquième passe."""
from pathlib import Path
from docx import Document
from docx.shared import Cm,Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import re,json

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'Livre/editions/passe5/RUPTURE_edition_revisee_passe5.md'
OUT=SOURCE.parent
def load():
    raw=SOURCE.read_text(encoding='utf8')
    start=raw.index('# PARTIE I\n')
    blocks=[b.strip() for b in raw[start:].split('\n\n') if b.strip()]
    ch=[];part=None
    for b in blocks:
        if b.startswith('# PARTIE '):part=b[9:]
        elif b.startswith('## Chapitre '):
            m=re.fullmatch(r'## Chapitre (\d+) — (.+)',b)
            if not m:raise ValueError(b)
            ch.append({'num':int(m[1]),'title':m[2],'part':part,'text':[]})
        else:
            if not ch:raise ValueError('Missing chapter')
            ch[-1]['text'].append(b)
    if [c['num'] for c in ch]!=list(range(1,28)) or len(set(c['part'] for c in ch))!=8:
        raise ValueError('Missing or unordered chapters / parts')
    words=sum(len(' '.join(c['text']).split()) for c in ch)
    if not 85000<=words<=100000:raise ValueError('Missing narrative content')
    return ch,words

def style(doc,name,size,bold=False,italic=False,before=0,after=0):
    st=doc.styles.add_style(name,WD_STYLE_TYPE.PARAGRAPH);st.base_style=doc.styles['Normal']
    st.font.name='EB Garamond';st.font.size=Pt(size);st.font.bold=bold;st.font.italic=italic
    st.paragraph_format.space_before=Pt(before);st.paragraph_format.space_after=Pt(after)
    st.paragraph_format.first_line_indent=Cm(0)
    return st

def marker(p,n):
    start=OxmlElement('w:bookmarkStart');start.set(qn('w:id'),str(n))
    start.set(qn('w:name'),f'chap_{n:02}')
    end=OxmlElement('w:bookmarkEnd');end.set(qn('w:id'),str(n))
    p._p.insert(0,start);p._p.append(end)

def hyperlink(p,n,label):
    h=OxmlElement('w:hyperlink');h.set(qn('w:anchor'),f'chap_{n:02}')
    r=OxmlElement('w:r');t=OxmlElement('w:t');t.text=label
    r.append(t);h.append(r);p._p.append(h)

def export(ch):
    d=Document();sec=d.sections[0]
    sec.page_width=Cm(14.8);sec.page_height=Cm(21)
    sec.top_margin=Cm(1.9);sec.bottom_margin=Cm(1.85)
    sec.left_margin=Cm(2.15);sec.right_margin=Cm(1.75)
    sec.footer_distance=Cm(.9);sec.different_first_page_header_footer=True
    n=d.styles['Normal'];n.font.name='EB Garamond';n.font.size=Pt(11.5)
    n.paragraph_format.first_line_indent=Cm(.48)
    n.paragraph_format.line_spacing=1.22
    n.paragraph_format.space_after=Pt(0);n.paragraph_format.widow_control=True
    style(d,'Roman titre',33)
    style(d,'Roman auteur',14,before=12)
    style(d,'Roman sommaire',21,after=16)
    style(d,'Roman partie',11,bold=True,after=12)
    style(d,'Roman chapitre',18,after=20)
    style(d,'Roman date',10,italic=True,before=8,after=10)
    style(d,'Roman scene',10,before=9,after=9)
    p=d.add_paragraph('RUPTURE',style='Roman titre');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before=Cm(6)
    p=d.add_paragraph('Tugay',style='Roman auteur');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    d.add_page_break()
    d.add_paragraph('Sommaire',style='Roman sommaire')
    last=None
    for c in ch:
        if c['part']!=last:
            last=c['part'];d.add_paragraph('PARTIE '+last,style='Roman partie')
        p=d.add_paragraph();p.paragraph_format.first_line_indent=Cm(0)
        hyperlink(p,c['num'],f"{c['num']:02}  {c['title']}")
    last=None
    for c in ch:
        newpart=c['part']!=last
        if newpart:
            last=c['part'];p=d.add_paragraph('PARTIE '+last,style='Roman partie')
            p.paragraph_format.page_break_before=True
        p=d.add_paragraph(style='Roman chapitre')
        if not newpart:p.paragraph_format.page_break_before=True
        marker(p,c['num'])
        a=p.add_run(f"CHAPITRE {c['num']}");a.bold=True;a.font.size=Pt(10)
        a.add_break();p.add_run(c['title'])
        for s in c['text']:
            if s=='· · ·':
                p=d.add_paragraph(s,style='Roman scene');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
            elif re.match(r'^\d{1,2} [a-zéûô]+ \d{4}(\b| —)',s,re.I):
                d.add_paragraph(s,style='Roman date')
            else:
                p=d.add_paragraph(s)
                if s.startswith(('— ','– ')):p.paragraph_format.first_line_indent=Cm(0)
    p=sec.footer.paragraphs[0];p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    r=p.add_run()
    for kind in ('begin','separate','end'):
        if kind=='separate':
            x=OxmlElement('w:instrText');x.set(qn('xml:space'),'preserve');x.text=' PAGE ';r._r.append(x)
        x=OxmlElement('w:fldChar');x.set(qn('w:fldCharType'),kind);r._r.append(x)
    d.core_properties.title='RUPTURE — Édition révisée, passe 5'
    d.core_properties.author='Tugay'
    return d

if __name__=='__main__':
    chapters,words=load()
    export(chapters).save(OUT/'RUPTURE_edition_revisee_passe5.docx')
    (OUT/'controle_passe5.json').write_text(json.dumps({'chapters':27,'parts':8,'words':words},indent=2)+'\n',encoding='utf8')
    print('Roman exporté, mots:',words)
