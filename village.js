/* Village B/C — Canvas schématique indépendant de l'Atlas de Lausanne. */
(() => {
"use strict";
const canvas=document.getElementById("village-canvas");
const stage=document.getElementById("village-stage");
if(!canvas||!stage)return;
const ctx=canvas.getContext("2d");
const W=1100,H=760;
const palette={building:"#e8c7ab",water:"#83cbdf",energy:"#f3d189",garden:"#a9d8a2",workshop:"#d7c3e6"};
const zones=[
{id:"b",name:"Bâtiment B",category:"building",rect:[86,110,242,210],kind:"building",desc:"Logements de la communauté. Tugay et Kübra habitent notamment le bâtiment B ; éclairage essentiel alimenté par le réseau solaire.",items:["Logements et espaces de repos","Escaliers éclairés par le réseau autonome"]},
{id:"c",name:"Bâtiment C",category:"building",rect:[362,95,345,218],kind:"building",desc:"Salle commune, réunions, cuisine et stocks collectifs. Cœur de la vie quotidienne des onze habitants.",items:["Salle commune","Cuisine et stockage principal","Local technique énergétique"]},
{id:"solar",name:"Zone solaire",category:"energy",rect:[774,96,250,176],kind:"solar",desc:"Installation solaire commune B/C. Quatorze panneaux raccordés ; le réseau sert prioritairement l'éclairage et les petits appareils.",items:["14 panneaux raccordés","Batterie 8 kWh nominale","Module complémentaire d'environ 6 kWh utiles"]},
{id:"water",name:"Stockage d’eau",category:"water",rect:[785,324,236,110],kind:"water",desc:"Récipients et cuve assurant une capacité totale nominale fixée à 251 L. L'eau prête stockée atteint environ 192 L en fin J61.",items:["251 L de capacité totale","Environ 192 L d'eau prête","4 L isolés hors stock utilisable"]},
{id:"garden",name:"Jardins et parcelles",category:"garden",rect:[85,390,276,216],kind:"garden",desc:"Parcelles de culture entretenues par Henri et Marianne, avec semis d'hiver. Le plan montre un emplacement conceptuel, non une surface cadastrale.",items:["Semis d'épinards et de fèves","Premières pousses observées","Pas de récolte nouvelle confirmée"]},
{id:"fire",name:"Foyer et auvent",category:"workshop",rect:[763,491,263,150],kind:"fire",desc:"Foyer communautaire de chauffe et de préparation d'eau. Marc a construit un auvent et des pare-vent ; le foyer reste à l'extérieur et ventilé.",items:["Auvent et pare-vent","Chauffe et cuisine extérieure","Foyer collectif existant"]},
{id:"store",name:"Abri à matériaux",category:"workshop",rect:[395,534,145,115],kind:"store",desc:"Zone indicative de stockage des planches, tréteaux, tuyaux et matériaux récupérés. Implantation précise à confirmer.",items:["36 m de tuyauterie récupérée en J57","Tréteaux et planches","Matériaux en attente d'utilisation"]},
{id:"atelier",name:"Atelier en projet",category:"workshop",rect:[558,534,173,115],kind:"atelier",desc:"Atelier communautaire envisagé à partir des établis et des caisses d'outillage. Le local n'est pas encore officiellement aménagé.",items:["3 établis démontables, dont 2 utilisables après nettoyage","Caisses d'outillage récupérées","Projet non terminé"]},
{id:"car",name:"Stationnement",category:"workshop",rect:[95,645,267,79],kind:"car",desc:"Emplacement schématique de la voiture électrique grise et des transports manuels. Ce stationnement n'est pas une installation canonique supplémentaire.",items:["Voiture grise roulante","Plateforme manuelle à deux roues","Autonomie de 500 km seulement estimée"]},
{id:"court",name:"Cour commune",category:"building",rect:[393,342,326,160],kind:"court",desc:"Zone centrale conceptuelle de circulation et de rassemblement entre les deux bâtiments. Son implantation est illustrative.",items:["Accès aux bâtiments","Rassemblements et déplacements internes"]}
];
const $=id=>document.getElementById(id);
const txt=(tag,content,cls="")=>{const n=document.createElement(tag);n.textContent=content;if(cls)n.className=cls;return n;};
let selected="c", zoom=1,panX=0,panY=0,cw=0,ch=0,pointer=null;
const fit=()=>Math.min(cw/W,ch/H);
const camera=()=>{const s=fit()*zoom;return {s,x:(cw-W*s)/2+panX,y:(ch-H*s)/2+panY};};
const local=(x,y)=>{const t=camera();return {x:(x-t.x)/t.s,y:(y-t.y)/t.s};};
function round(x,y,w,h,r,fill,stroke="#4c6659",lw=2){
ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}
}
function line(points,width,color,dash=[]){
ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=width;ctx.strokeStyle=color;ctx.lineCap="round";ctx.lineJoin="round";ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
}
function label(text,x,y,size=16,color="#eaf3e9",align="center"){
ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillStyle=color;ctx.font="700 "+size+"px sans-serif";ctx.fillText(text,x,y);
}
function background(){
ctx.fillStyle="#162820";ctx.fillRect(0,0,W,H);
for(let y=22;y<H;y+=65)for(let x=22;x<W;x+=64){
ctx.beginPath();ctx.arc(x+(y%3)*5,y,4,0,Math.PI*2);ctx.fillStyle="#294432";ctx.fill();
}
round(35,42,1030,684,28,"#24352b","#62725b",8);
for(let i=0;i<21;i++){const x=47+i*49;line([[x,43],[x+11,43]],5,"#738567");line([[x,724],[x+11,724]],5,"#738567");}
for(let i=0;i<12;i++){const y=66+i*54;line([[36,y],[36,y+20]],5,"#738567");line([[1064,y],[1064,y+20]],5,"#738567");}
round(43,50,1014,668,18,"#354133",null);
for(let i=0;i<35;i++){
const x=65+(i*179)%960,y=74+(i*131)%600;
ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fillStyle=i%3===0?"#526348":"#435343";ctx.fill();
}
line([[214,316],[515,315],[608,342],[630,529]],23,"#776e55");
line([[608,317],[845,305],[895,450],[890,490]],20,"#776e55");
line([[370,480],[395,550]],16,"#776e55");
line([[205,608],[204,643]],15,"#776e55");
label("REFUGE B/C · PLAN SCHÉMATIQUE",549,63,17,"#b1c5aa");
}
function building(zone){
const [x,y,w,h]=zone.rect;
round(x+7,y+10,w,h,10,"#121d1a",null);
round(x,y,w,h,10,zone.id==="b"?"#885f54":"#646f67","#d4d1b8",3);
for(let i=1;i<4;i++)line([[x+15,y+i*h/4],[x+w-15,y+i*h/4]],2,"#adafa2");
for(let i=0;i<3;i++)round(x+27+i*(w-55)/3,y+h-30,25,13,2,"#e6ce94","#433b31",1);
round(x+w/2-17,y+h-21,34,21,2,"#c3a681","#323b34",1);
}
function drawZone(z){
const [x,y,w,h]=z.rect;const is=z.id===selected;
ctx.save();
if(is){round(x-7,y-7,w+14,h+14,16,"rgba(185,228,177,.14)",palette[z.category],3);}
if(z.kind==="building")building(z);
else if(z.kind==="solar"){
round(x,y,w,h,10,"#263d35","#55725e",2);
for(let i=0;i<14;i++){let col=i%7,row=Math.floor(i/7);const bx=x+15+col*32,by=y+21+row*65;round(bx,by,27,53,2,"#264d6c","#5e91a9",1);line([[bx+13,by+2],[bx+13,by+50]],1,"#608da3");line([[bx+1,by+26],[bx+26,by+26]],1,"#608da3");}
}else if(z.kind==="garden"){
round(x,y,w,h,10,"#3b4d32","#729561",2);
for(let i=0;i<3;i++)for(let j=0;j<3;j++){let bx=x+16+i*85,by=y+17+j*61;round(bx,by,76,51,3,"#554c2f","#917d43",2);for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(bx+12+k*13,by+25,6,0,Math.PI*2);ctx.fillStyle="#86b66e";ctx.fill();}}
}else if(z.kind==="water"){
round(x,y,w,h,10,"#2b4549","#6a9ca0");
for(let i=0;i<4;i++){round(x+12+i*54,y+15,43,68,5,"#b4c6bf","#617f83",2);line([[x+18+i*54,y+35],[x+49+i*54,y+35]],2,"#668d94");}
}else if(z.kind==="fire"){
round(x,y,w,h,10,"#635c45","#aa9871",2);
for(let i=0;i<4;i++)line([[x+15+i*59,y+4],[x+15+i*59,y+h-4]],4,"#b29a65");
ctx.beginPath();ctx.arc(x+w/2,y+h/2+3,38,0,Math.PI*2);ctx.fillStyle="#474943";ctx.fill();ctx.strokeStyle="#a4a390";ctx.lineWidth=8;ctx.stroke();
label("✦",x+w/2,y+h/2,34,"#e8b76e");
}else if(z.kind==="store"||z.kind==="atelier"||z.kind==="car"){
round(x,y,w,h,9,"#564d41","#a89c80");
if(z.kind==="store")for(let i=0;i<5;i++)round(x+13,y+15+i*17,w-25,10,2,"#a78a62",null);
if(z.kind==="atelier"){round(x+20,y+23,w-40,28,3,"#ad9365",null);for(let i=0;i<4;i++)round(x+25+i*32,y+58,16,20,2,"#687e76",null);}
if(z.kind==="car"){round(x+35,y+25,w-70,36,16,"#bbc7c6","#f0f4e8");round(x+95,y+29,60,27,6,"#527481",null);}
}else{
round(x,y,w,h,12,"#36463a","#80957a",2);
ctx.beginPath();ctx.arc(x+w/2,y+h/2,47,0,Math.PI*2);ctx.fillStyle="#5b6956";ctx.fill();
}
ctx.restore();
}
function draw(){
if(!cw||!ch)return;
const dpr=canvas.width/cw;
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cw,ch);
const t=camera();ctx.setTransform(dpr*t.s,0,0,dpr*t.s,dpr*t.x,dpr*t.y);
background();zones.forEach(drawZone);
ctx.setTransform(dpr,0,0,dpr,0,0);
for(const z of zones){
const [x,y,w,h]=z.rect;const left=t.x+(x+w/2)*t.s;const top=t.y+(y+h-10)*t.s;
ctx.font="700 11px sans-serif";const tw=ctx.measureText(z.name).width+20;
ctx.fillStyle=z.id===selected?"#b9e4b1":"#172820";
ctx.beginPath();ctx.roundRect(left-tw/2,top-10,tw,22,4);ctx.fill();
ctx.fillStyle=z.id===selected?"#193020":"#f0f3e6";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(z.name,left,top+1);
}
}
function detail(){
const z=zones.find(z=>z.id===selected);if(!z)return;
const target=$("village-detail");target.replaceChildren();
target.append(txt("p",z.category==="building"?"BÂTIMENT":z.category==="energy"?"ÉNERGIE":z.category==="water"?"EAU":z.category==="garden"?"AGRICULTURE":"AMÉNAGEMENT","village-type"));
target.append(txt("h3",z.name),txt("p",z.desc,"village-description"));
const ul=txt("ul","","village-notes");z.items.forEach(i=>ul.append(txt("li",i)));target.append(ul);
const directory=$("village-index");directory.replaceChildren();
for(const item of zones){const btn=txt("button",item.name,item.id===selected?"village-item active":"village-item");btn.type="button";btn.addEventListener("click",()=>choose(item.id,true));directory.append(btn);}
}
function choose(id,center=false){
selected=id;detail();
if(center){const z=zones.find(x=>x.id===id);const [x,y,w,h]=z.rect;const t=camera();panX+=cw/2-(t.x+(x+w/2)*t.s);panY+=ch/2-(t.y+(y+h/2)*t.s);}
draw();
}
function resize(){
cw=stage.clientWidth;ch=stage.clientHeight;if(!cw||!ch)return;
const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);draw();
}
function doZoom(factor,px=cw/2,py=ch/2){
const before=local(px,py);zoom=Math.min(3.2,Math.max(.8,zoom*factor));const t=camera();panX+=px-(t.x+before.x*t.s);panY+=py-(t.y+before.y*t.s);draw();
}
$("village-zoom-in").addEventListener("click",()=>doZoom(1.25));
$("village-zoom-out").addEventListener("click",()=>doZoom(.8));
$("village-reset").addEventListener("click",()=>{zoom=1;panX=0;panY=0;draw();});
canvas.addEventListener("wheel",e=>{e.preventDefault();const r=canvas.getBoundingClientRect();doZoom(e.deltaY<0?1.1:.9,e.clientX-r.left,e.clientY-r.top);},{passive:false});
canvas.addEventListener("pointerdown",e=>{if(e.button!==0&&e.pointerType==="mouse")return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener("pointermove",e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(e.clientX-pointer.sx,e.clientY-pointer.sy)>7)pointer.moved=true;if(pointer.moved){panX+=dx;panY+=dy;draw();}pointer.x=e.clientX;pointer.y=e.clientY;});
canvas.addEventListener("pointerup",e=>{
if(!pointer||pointer.id!==e.pointerId)return;
if(!pointer.moved){const r=canvas.getBoundingClientRect();const p=local(e.clientX-r.left,e.clientY-r.top);const hit=[...zones].reverse().find(z=>{const [x,y,w,h]=z.rect;return p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;});if(hit)choose(hit.id);}
pointer=null;
});
canvas.addEventListener("pointercancel",()=>{pointer=null;});
window.addEventListener("resize",resize);
if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(stage);
document.getElementById("tab-village")?.addEventListener("click",()=>requestAnimationFrame(resize));
detail();resize();
})();