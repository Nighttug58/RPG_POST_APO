/* Les Cendres du Monde — module Inventaire J061.
   Toutes les données proviennent du fichier local inventaire-site.json.
   Les quantités des archives J24 NE sont PAS des soldes J61. */
(() => {
  "use strict";
  const root = document.getElementById("panel-inventaire");
  if (!root) return;
  const CATEGORY_NAMES = {
    eau:"Eau", hygiene:"Hygiène", cuisine:"Cuisine", outils:"Outils et maintenance",
    agriculture:"Agriculture", transport:"Transport", eclairage:"Éclairage",
    communication:"Communication", combustible:"Combustible", soins:"Soins",
    couchage:"Couchage", vetements:"Vêtements", stockage:"Stockage",
    documents:"Documents", narration:"Objets narratifs", ancien_camp:"Ancien camp",
    equipement:"Équipement", orientation:"Orientation", documentation:"Documentation",
    alimentation:"Alimentation", energie:"Énergie", amenagement:"Aménagement",
    construction:"Construction"
  };
  const EL = (tag, className="", text=null) => {
    const node=document.createElement(tag);
    if(className) node.className=className;
    if(text!==null) node.textContent=String(text);
    return node;
  };
  const format = n => typeof n==="number" ? n.toLocaleString("fr-CH",{maximumFractionDigits:1}) : "Non précisé";
  let data = null, query = "", category = "all", period = "all", sort = "category";

  root.classList.remove("placeholder");
  root.replaceChildren();
  const title = EL("div","inventory-head");
  const header=EL("div","");
  header.append(EL("p","eyebrow","MODULE 02 / REGISTRE MATÉRIEL"),EL("h2","","Inventaire du refuge"));
  const expl=EL("p","description","Tous les objets consignés, avec leur utilité, quantité connue, état et provenance.");
  header.append(expl);
  const reload=EL("button","inventory-reload","↻ Actualiser");reload.type="button";
  title.append(header,reload);root.append(title);
  const notice=EL("div","inv-notice","Chargement de l'inventaire…");notice.setAttribute("role","status");
  root.append(notice);
  const metrics=EL("div","inv-metrics");root.append(metrics);
  const tools=EL("div","inv-controls");
  const search=EL("input","inv-search");search.type="search";search.placeholder="Rechercher un objet, une description, un lieu…";search.setAttribute("aria-label","Rechercher dans l'inventaire");
  const select=EL("select","inv-select");select.setAttribute("aria-label","Catégorie");
  const time=EL("select","inv-select");time.setAttribute("aria-label","Période de l'inventaire");
  [["all","Toutes les périodes"],["recent","Ajouts J44–J61"],["legacy","Archive consolidée J24"]].forEach(([val,label])=>{const x=EL("option","",label);x.value=val;time.append(x);});
  const order=EL("select","inv-select");order.setAttribute("aria-label","Trier les objets");
  [["category","Catégorie puis nom"],["name","Nom A–Z"],["day","Journaux les plus récents"]].forEach(([val,label])=>{const o=EL("option","",label);o.value=val;order.append(o);});
  tools.append(search,select,time,order);root.append(tools);
  const count=EL("p","inv-count","");root.append(count);
  const list=EL("div","inv-list");root.append(list);
  const foot=EL("p","inv-footnote","Le stock alimentaire et l'eau de J61 sont des totaux déjà consolidés : les lignes anciennes ne doivent pas être additionnées une seconde fois.");
  root.append(foot);

  function metric(label,value,sub) {
    const card=EL("div","inv-metric");
    card.append(EL("span","",label),EL("strong","",value),EL("small","",sub));
    return card;
  }
  function renderMetrics(){
    metrics.replaceChildren();
    const r=data.ressources;
    metrics.append(
      metric("Nourriture",format(r.nourriture_kg)+" kg","Stock total fin J61"),
      metric("Eau prête",format(r.eau_prete_l)+" L",format(r.eau_capacite_l)+" L de capacité totale"),
      metric("Bois sec",format(r.bois_sec_kg)+" kg","Stock estimé fin J61"),
      metric("Charbon",format(r.charbon_kg)+" kg","Dernier relevé, non repesé"),
      metric("Panneaux solaires",format(r.panneaux),"Raccordés au réseau B/C"),
      metric("Fiches d'objets",format(data.objets.length),"Archives + récupérations identifiées")
    );
  }
  function addOptions(){
    select.replaceChildren();
    const cats=[...new Set(data.objets.map(x=>x.categorie))].sort((a,b)=>(CATEGORY_NAMES[a]||a).localeCompare(CATEGORY_NAMES[b]||b,"fr"));
    const all=EL("option","","Toutes les catégories");all.value="all";select.append(all);
    cats.forEach(c=>{const o=EL("option","",CATEGORY_NAMES[c]||c);o.value=c;select.append(o);});
  }
  function row(item){
    const details=EL("details","inv-entry");
    const summary=EL("summary","inv-entry-summary");
    const left=EL("div","inv-entry-left");
    const name=EL("strong","inv-item-name",item.nom);
    const subtitle=EL("span","inv-item-sub",(CATEGORY_NAMES[item.categorie]||item.categorie)+" · "+item.source);
    left.append(name,subtitle);
    const right=EL("div","inv-entry-right");
    let qty=item.quantite===null?"Non chiffré":format(item.quantite)+" "+(item.unite||"unité"+(item.quantite>1?"s":""));
    if(item.quantite===0)qty="0 (archive)";
    right.append(EL("strong","",qty),EL("span","inv-chevron","⌄"));
    summary.append(left,right);details.append(summary);
    const info=EL("div","inv-entry-content");
    info.append(EL("p","inv-description",item.description));
    const dl=EL("dl","inv-facts");
    const facts=[
      ["État / observations",item.etat],
      ["Emplacement",item.emplacement],
      ["Référence",item.source],
      ["Fiabilité du comptage",item.fiabilite],
      ["Identifiant",item.id]
    ];
    if(typeof item.capacite_unitaire_l==="number")facts.splice(2,0,["Capacité unitaire",format(item.capacite_unitaire_l)+" L"]);
    facts.forEach(([k,v])=>{const block=EL("div","");block.append(EL("dt","",k),EL("dd","",v||"Non précisé"));dl.append(block);});
    info.append(dl);details.append(info);
    return details;
  }
  function renderList(){
    if(!data)return;
    const normalized=query.trim().toLocaleLowerCase("fr");
    const found=data.objets.filter(item=>{
      if(category!=="all"&&item.categorie!==category)return false;
      if(period==="recent"&&item.jour<=24)return false;
      if(period==="legacy"&&item.jour>24)return false;
      if(!normalized)return true;
      const text=[item.nom,item.description,item.categorie,CATEGORY_NAMES[item.categorie],item.emplacement,item.etat,item.source].join(" ").toLocaleLowerCase("fr");
      return text.includes(normalized);
    }).sort((a,b)=>{
      if(sort==="day")return b.jour-a.jour||a.nom.localeCompare(b.nom,"fr");
      if(sort==="name")return a.nom.localeCompare(b.nom,"fr");
      return (CATEGORY_NAMES[a.categorie]||a.categorie).localeCompare(CATEGORY_NAMES[b.categorie]||b.categorie,"fr")||a.nom.localeCompare(b.nom,"fr");
    });
    count.textContent=found.length+" résultat"+(found.length>1?"s":"")+" sur "+data.objets.length+" fiches répertoriées";
    list.replaceChildren();
    if(!found.length){list.append(EL("p","inv-empty","Aucun objet ne correspond aux filtres sélectionnés."));return;}
    let current="";
    found.forEach(item=>{
      if(sort==="category"&&item.categorie!==current){
        current=item.categorie;list.append(EL("h3","inv-group-title",CATEGORY_NAMES[current]||current));
      }
      list.append(row(item));
    });
  }
  async function load(){
    reload.disabled=true;notice.textContent="Lecture de l'inventaire du site…";
    try{
      const response=await fetch("./inventaire-site.json?rev=inventory-j61-2",{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const obj=await response.json();
      if(!Array.isArray(obj.objets)||!obj.ressources)throw new Error("Format de données invalide");
      data=obj;
      notice.textContent="Référence : "+obj.date_reference+" · Les 158 fiches historiques (J24) conservent leurs derniers relevés. Les ajouts J44–J61 indiquent des récupérations, pas forcément le stock restant.";
      renderMetrics();addOptions();renderList();
    } catch(e){
      notice.textContent="Impossible de charger la liste : "+e.message+". Vérifiez que inventaire-site.json est publié à la racine du site.";
      list.replaceChildren();
    }finally{reload.disabled=false;}
  }
  search.addEventListener("input",()=>{query=search.value;renderList();});
  select.addEventListener("change",()=>{category=select.value;renderList();});
  time.addEventListener("change",()=>{period=time.value;renderList();});
  order.addEventListener("change",()=>{sort=order.value;renderList();});
  reload.addEventListener("click",load);
  load();
})();