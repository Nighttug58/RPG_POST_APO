/* Les Cendres du Monde — Atlas V1. Carte CANVAS autonome, sans API ni coordonnées GPS.
   Refonte complète J056. Seul l'onglet Map est fonctionnel. */
(() => {
  "use strict";

  const W = 1200, H = 800;
  const COLORS = { camp: "#b9e4b1", resource: "#73c5d6", unknown: "#f0be75" };
  const places = [
    { id:"bc", name:"Refuge B/C", short:"REFUGE B/C", type:"camp", x:710,y:352, population:"11 résidents", relation:"Camp principal", description:"Base de Tugay et Kübra, bâtiments B et C. Position indicative dans le secteur de La Sallaz ; adresse exacte non fixée dans le récit.", residents:["Tugay","Kübra","Marc","David","Nicolas","Sophie","Élise","Henri","Marianne","Maëlle","Gabriel"], notes:["75,3 kg de nourriture · fin J056","173 L d'eau prête / 251 L de stockage","14 panneaux solaires raccordés","Voiture électrique et plateforme manuelle"] },
    { id:"sallaz",name:"La Sallaz",short:"LA SALLAZ",type:"camp",x:805,y:255,population:"Non établie",relation:"Alliés · échanges",description:"Communauté partenaire du secteur de La Sallaz. Les liens agricoles et les échanges de vivres sont actifs.",residents:["Adrien","Claire","Rosa"],notes:["Serre et semences de Rosa","Claire a apporté 11 kg de vivres à Noël","Effectif total inconnu"] },
    { id:"crissier",name:"Crissier",short:"CRISSIER",type:"camp",x:318,y:442,population:"≈ 23 habitants",relation:"Contact établi",description:"Communauté de Crissier. L'emplacement de son camp n'a pas été relevé précisément.",residents:["Laurent","Camille","Nadia","Mathieu"],notes:["Compétences connues : transport et mécanique","Échanges possibles avec B/C"] },
    { id:"ouest",name:"Communauté de l'ouest",short:"GROUPE OUEST",type:"camp",x:228,y:292,population:"17 habitants",relation:"Partenaires",description:"Groupe partenaire à l'ouest de Lausanne. Le marqueur représente un secteur et non une adresse connue.",residents:["Hugo","Nora","Bastien"],notes:["Réseau solaire local remis en service","Deux groupes voisins souhaitent un conseil technique","Transport et troc"] },
    { id:"est",name:"Petit groupe de l'est",short:"GROUPE EST",type:"camp",x:1015,y:405,population:"Non établie",relation:"Contact limité",description:"Petit groupe rencontré à l'est de Lausanne ; localisation précise et effectif complet inconnus.",residents:["Isabelle","André"],notes:["Besoins évoqués autour du pompage","Coopération non confirmée"] },
    { id:"jardins",name:"Jardins d'Henri",short:"JARDINS",type:"resource",x:760,y:404,population:"—",relation:"Culture suivie",description:"Parcelles entretenues par Henri et Marianne près du refuge. Le repère n'indique pas leur position réelle.",residents:["Henri","Marianne"],notes:["Semis hivernaux d'épinards et de fèves","Premières pousses observées","Aucune récolte comptabilisée"] },
    { id:"boveresses",name:"Jardins des Boveresses",short:"BOVERESSES",type:"resource",x:926,y:295,population:"—",relation:"Parcelles repérées",description:"Anciennes parcelles connues de Tugay et Kübra, dans le secteur des Boveresses.",residents:[],notes:["Environ 20 min à pied du refuge dans le récit","Droits et état actuel non totalement vérifiés"] },
    { id:"serre",name:"Serre de Rosa",short:"SERRE",type:"resource",x:842,y:308,population:"—",relation:"Ressource alliée",description:"Serre exploitée par Rosa à La Sallaz. Les semences sont échangées avec son accord.",residents:["Rosa"],notes:["Culture sous serre","Semences de fèves et d'épinards déjà échangées"] },
    { id:"ruisseau",name:"Ruisseau forestier",short:"RUISSEAU",type:"resource",x:660,y:180,population:"—",relation:"Eau brute",description:"Ancien point de collecte dans la zone boisée. Eau à préparer avant consommation.",residents:[],notes:["Eau brute, non potable directement","Localisation indicative dans la forêt"] },
    { id:"resurgence",name:"Résurgence proche",short:"RÉSURGENCE",type:"unknown",x:738,y:307,population:"—",relation:"Non validée",description:"Résurgence découverte près du refuge. Elle reste exclue du stock d'eau potable tant que sa qualité n'est pas validée.",residents:[],notes:["À environ 5 min à pied du refuge selon le récit","Ne pas compter comme eau potable"] },
    { id:"reservoir",name:"Ancien réservoir communal",short:"RÉSERVOIR",type:"unknown",x:593,y:458,population:"—",relation:"À expertiser",description:"Ancienne installation identifiée mais non autorisée comme source d'eau prête.",residents:[],notes:["Qualité de l'eau non validée","Aucun volume disponible confirmé"] },
    { id:"captage",name:"Captage des jardins",short:"CAPTAGE",type:"unknown",x:812,y:445,population:"—",relation:"À expertiser",description:"Point de captage près des jardins, non validé pour la consommation.",residents:[],notes:["Ne contribue pas aux 173 L d'eau prête","Contrôles encore nécessaires"] },
    { id:"villas",name:"Quartier des villas",short:"VILLAS",type:"resource",x:540,y:260,population:"—",relation:"Exploré J16–J18",description:"Quartier discret de villas exploré pendant plusieurs jours ; emplacement approximatif.",residents:[],notes:["Récupérations déjà effectuées","Équipements lourds laissés sur place","Propriétés non vérifiées exhaustivement"] },
    { id:"annexe",name:"Ancienne annexe solaire",short:"ANNEXE",type:"resource",x:607,y:366,population:"—",relation:"Visitée",description:"Bâtiment technique où des panneaux et une batterie ont été récupérés. Position non relevée.",residents:[],notes:["Local technique ouvert au J23","Batterie de 8 kWh récupérée","Ne pas supposer du matériel supplémentaire"] },
    { id:"entrepot",name:"Entrepôt au symbole",short:"SYMBOLE ?",type:"unknown",x:415,y:188,population:"—",relation:"Rumeur",description:"Entrepôt évoqué dans une rumeur au nord-ouest de Lausanne. Existence et nature du symbole non confirmées.",residents:[],notes:["Information non vérifiée","Aucune menace confirmée"] }
  ];
  const byId = Object.fromEntries(places.map(p => [p.id,p]));
  const $ = id => document.getElementById(id);
  const canvas = $("world-map"), wrap = $("canvas-wrap"), ctx = canvas.getContext("2d");
  let filter = "all", selected = "bc", zoom = 1, panX = 0, panY = 0, cssW = 0, cssH = 0;
  let pointer = null;
  const categories = {camp:"COMMUNAUTÉ",resource:"RESSOURCE",unknown:"À VÉRIFIER"};
  const safe = (tag, className, text) => { const el=document.createElement(tag); if(className) el.className=className; if(text!==undefined) el.textContent=String(text); return el; };
  const shown = () => places.filter(p => filter === "all" || p.type === filter);
  const coord = p => String.fromCharCode(65+Math.min(7,Math.max(0,Math.floor(p.x/(W/8))))) + (Math.min(7,Math.max(0,Math.floor(p.y/(H/8))))+1);
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));

  function renderInfo() {
    const p=byId[selected]; if(!p) return;
    $("intel-position").textContent=coord(p);
    const root=$("intel-body"); root.replaceChildren();
    root.append(safe("p","type-line "+p.type,categories[p.type]),safe("h3","",p.name),safe("p","intel-desc",p.description));
    const metrics=safe("div","intel-metrics");
    for(const [label,value] of [["Population",p.population],["Relations",p.relation]]) {
      const m=safe("div","metric");m.append(safe("span","",label),safe("strong","",value));metrics.append(m);
    }
    root.append(metrics);
    if(p.residents.length) {
      root.append(safe("h4","","Habitants / personnes connues"));
      const names=safe("div","resident-list");
      p.residents.forEach(name=>names.append(safe("span","",name)));
      root.append(names);
    }
    root.append(safe("h4","","Informations"));
    const ul=safe("ul","intel-notes");p.notes.forEach(note=>ul.append(safe("li","",note)));root.append(ul);
  }
  function renderIndex() {
    const root=$("location-index");root.replaceChildren();
    const list=shown();$("index-count").textContent=list.length+" lieux";$("site-count").textContent=places.length;
    list.forEach(p=>{
      const btn=safe("button","location-button"+(p.id===selected?" selected":""),"");
      btn.type="button";btn.append(safe("span","",p.name),safe("small","",coord(p)));
      btn.addEventListener("click",()=>{select(p.id);centerOn(p);});
      root.append(btn);
    });
  }
  function select(id) { if(!byId[id]) return;selected=id;renderInfo();renderIndex();draw(); }
  function setupPlaceholders() {
    for(const name of ["inventaire","tbd1","tbd2","tbd3","tbd4"]){
      const root=$("panel-"+name);const card=safe("div","placeholder-card");
      card.append(safe("div","big","⊞"),safe("p","eyebrow","MODULE NON CONFIGURÉ"),safe("h2","",name==="inventaire"?"Inventaire":name.toUpperCase()),safe("p","","Cet onglet est réservé pour une prochaine étape. Aucun module ni donnée n'est encore raccordé."));
      root.append(card);
    }
  }
  function setTab(name) {
    document.querySelectorAll(".tab").forEach(b=>{const active=b.dataset.tab===name;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;});
    document.querySelectorAll("main > .page").forEach(p=>p.hidden=p.id!=="panel-"+name);
    if(name==="map")requestAnimationFrame(resize);
  }
  function initTabs() {
    const tabs=[...document.querySelectorAll(".tab")];
    tabs.forEach((b,i)=>{
      b.addEventListener("click",()=>setTab(b.dataset.tab));
      b.addEventListener("keydown",e=>{
        if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
        e.preventDefault();
        let next=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
        tabs[next].focus();setTab(tabs[next].dataset.tab);
      });
    });
  }
  function fit() {return Math.min(cssW/W,cssH/H);}
  function transform() {const scale=fit()*zoom;return {scale,ox:(cssW-W*scale)/2+panX,oy:(cssH-H*scale)/2+panY};}
  function toWorld(px,py){const t=transform();return {x:(px-t.ox)/t.scale,y:(py-t.oy)/t.scale};}
  function screenPoint(x,y){const t=transform();return {x:x*t.scale+t.ox,y:y*t.scale+t.oy};}
  function resize(){
    cssW=wrap.clientWidth;cssH=wrap.clientHeight;
    if(!cssW||!cssH)return;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
    draw();
  }
  function poly(points,fill,stroke=null,width=1) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();}
  }
  function road(points,width,stroke="#344b44",dash=[]) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.lineWidth=width;ctx.lineJoin="round";ctx.lineCap="round";ctx.strokeStyle=stroke;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
  }
  function textLabel(label,x,y,size=18,color="#718e82",align="center") {
    ctx.textAlign=align;ctx.textBaseline="middle";ctx.font="700 "+size+"px 'Barlow Condensed',sans-serif";ctx.fillStyle=color;ctx.fillText(label,x,y);
  }
  function background() {
    ctx.fillStyle="#162521";ctx.fillRect(0,0,W,H);
    poly([[0,0],[1200,0],[1200,250],[1050,290],[920,240],[700,265],[550,210],[350,270],[0,200]],"#1b3029");
    poly([[0,80],[270,80],[440,260],[260,390],[0,330]],"#1d3028");
    poly([[900,50],[1200,0],[1200,580],[1090,520],[1000,340]],"#20372e");
    poly([[80,370],[340,300],[550,410],[460,640],[0,610]],"#1b2927");
    poly([[500,430],[850,375],[1020,500],[930,650],[600,620]],"#20322e");
    // Forest texture: small deterministic strokes, no random flicker.
    for(let i=0;i<110;i++){
      const x=(i*193+61)%1200,y=(i*89+41)%330;
      ctx.strokeStyle="#2a4537";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y+3);ctx.lineTo(x,y-8);ctx.lineTo(x+6,y+3);ctx.stroke();
    }
    // Lac Léman au sud: simplification géographique, non cartographique.
    poly([[0,690],[130,674],[290,686],[430,669],[570,676],[710,660],[865,680],[1000,652],[1200,665],[1200,800],[0,800]],"#183c48");
    road([[0,690],[130,674],[290,686],[430,669],[570,676],[710,660],[865,680],[1000,652],[1200,665]],3,"#3d6a6b");
    for(let i=0;i<18;i++)road([[i*74,740+(i%3)*12],[i*74+34,740+(i%3)*12]],1,"#315d68");
    textLabel("L A C   L É M A N",700,746,27,"#638e99");
    // Arterial routes, intentionally schematic.
    road([[0,462],[230,440],[400,410],[565,402],[700,430],[900,475],[1200,510]],18,"#2c413d");
    road([[0,462],[230,440],[400,410],[565,402],[700,430],[900,475],[1200,510]],2,"#577064",[10,12]);
    road([[325,0],[420,160],[520,280],[645,385],[725,530],[760,650]],14,"#31453f");
    road([[1000,0],[940,150],[830,260],[765,360],[670,500],[590,675]],14,"#31453f");
    road([[100,260],[360,310],[570,330],[810,320],[1120,300]],10,"#30463f");
    road([[260,600],[420,530],[600,500],[820,530],[1080,600]],9,"#2c403b");
    road([[600,60],[680,190],[730,290],[720,390],[800,510]],5,"#34564c");
    // Indicative stream.
    road([[735,25],[700,95],[655,155],[675,210],[730,295],[780,380],[830,470],[900,550]],5,"#427986");
    road([[735,25],[700,95],[655,155],[675,210],[730,295],[780,380],[830,470],[900,550]],1,"#78afba");
    textLabel("FORÊTS DU NORD",690,77,23,"#678778");
    textLabel("CRISSIER",230,515,22,"#5b756d");
    textLabel("RENENS",370,605,22,"#607a71");
    textLabel("LAUSANNE",690,580,34,"#657f74");
    textLabel("PULLY / EST",1070,578,19,"#59756c");
    // Grid A–H / 1–8
    ctx.lineWidth=1;ctx.strokeStyle="rgba(176,209,185,.11)";
    for(let i=0;i<=8;i++){
      ctx.beginPath();ctx.moveTo(i*W/8,0);ctx.lineTo(i*W/8,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,i*H/8);ctx.lineTo(W,i*H/8);ctx.stroke();
    }
    for(let i=0;i<8;i++){
      textLabel(String.fromCharCode(65+i),i*150+75,16,16,"#a5bdae");
      textLabel(String(i+1),15,i*100+50,16,"#a5bdae");
    }
  }
  function drawMarkers(dpr) {
    const active=shown();
    active.forEach(p=>{
      const isSelected=p.id===selected, color=COLORS[p.type];
      ctx.save();ctx.translate(p.x,p.y);
      if(isSelected){ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fillStyle="rgba(185,228,177,.15)";ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=color;ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,isSelected?11:8,0,Math.PI*2);ctx.fillStyle="#0e1917";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=color;ctx.stroke();
      ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
      ctx.restore();
    });
    // Labels are drawn in screen space to remain readable at all zoom levels.
    const t=transform();
    ctx.setTransform(dpr,0,0,dpr,0,0);
    active.filter(p=>p.type==="camp"||p.id===selected).forEach(p=>{
      const pos={x:p.x*t.scale+t.ox,y:p.y*t.scale+t.oy};
      const label=p.short;ctx.font="700 12px 'Barlow Condensed',sans-serif";
      const width=ctx.measureText(label).width+18;
      const left=clamp(pos.x-width/2,2,Math.max(2,cssW-width-2));
      const top=pos.y-38;
      ctx.fillStyle=p.id===selected?"#b9e4b1":"rgba(13,27,23,.94)";
      ctx.fillRect(left,top,width,23);
      ctx.fillStyle=p.id===selected?"#13251d":"#e4f0e6";
      ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label,left+width/2,top+12);
    });
  }
  function draw() {
    if(!ctx||!cssW||!cssH)return;
    const dpr=canvas.width/cssW;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssW,cssH);
    const t=transform();ctx.setTransform(dpr*t.scale,0,0,dpr*t.scale,dpr*t.ox,dpr*t.oy);
    background();
    // Marker labels need screen coordinates; drawMarkers resets the transform.
    drawMarkers(dpr);
  }
  function centerOn(p) {const t=transform();panX+=(cssW/2-(p.x*t.scale+t.ox));panY+=(cssH/2-(p.y*t.scale+t.oy));draw();}
  function changeZoom(factor,point={x:cssW/2,y:cssH/2}) {
    const before=toWorld(point.x,point.y);
    zoom=clamp(zoom*factor,.75,3.2);
    const after=screenPoint(before.x,before.y);
    panX+=point.x-after.x;panY+=point.y-after.y;draw();
  }
  function initMap(){
    document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
      filter=b.dataset.filter;
      document.querySelectorAll(".filter").forEach(x=>{const active=x===b;x.classList.toggle("active",active);x.setAttribute("aria-pressed",String(active));});
      if(!shown().some(p=>p.id===selected))selected=shown()[0].id;
      renderInfo();renderIndex();draw();
    }));
    $("zoom-in").addEventListener("click",()=>changeZoom(1.3));
    $("zoom-out").addEventListener("click",()=>changeZoom(1/1.3));
    $("zoom-reset").addEventListener("click",()=>{zoom=1;panX=0;panY=0;draw();});
    canvas.addEventListener("wheel",e=>{e.preventDefault();const rect=canvas.getBoundingClientRect();changeZoom(e.deltaY<0?1.12:1/1.12,{x:e.clientX-rect.left,y:e.clientY-rect.top});},{passive:false});
    canvas.addEventListener("pointerdown",e=>{
      if(e.button!==0&&e.pointerType==="mouse")return;
      pointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};
      canvas.setPointerCapture(e.pointerId);canvas.classList.add("dragging");
    });
    canvas.addEventListener("pointermove",e=>{
      if(!pointer||pointer.id!==e.pointerId)return;
      const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
      if(Math.hypot(e.clientX-pointer.startX,e.clientY-pointer.startY)>7)pointer.moved=true;
      if(pointer.moved){panX+=dx;panY+=dy;draw();}
      pointer.x=e.clientX;pointer.y=e.clientY;
    });
    canvas.addEventListener("pointerup",e=>{
      if(!pointer||pointer.id!==e.pointerId)return;
      if(!pointer.moved){
        const rect=canvas.getBoundingClientRect();const px=e.clientX-rect.left,py=e.clientY-rect.top;
        let closest=null,best=26;
        shown().forEach(p=>{const q=screenPoint(p.x,p.y);const d=Math.hypot(q.x-px,q.y-py);if(d<best){best=d;closest=p;}});
        if(closest)select(closest.id);
      }
      pointer=null;canvas.classList.remove("dragging");
    });
    canvas.addEventListener("pointercancel",()=>{pointer=null;canvas.classList.remove("dragging");});
    window.addEventListener("resize",resize);
    if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(wrap);
  }
  setupPlaceholders();initTabs();initMap();renderInfo();renderIndex();resize();
})();
