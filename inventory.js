/* RPG_POST_APO — Inventaire simplifié : nom, quantité et description */
(() => {
  "use strict";
  const panel=document.getElementById("panel-inventaire");
  if(!panel)return;
  const node=(tag,cls="",value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;};
  panel.classList.remove("placeholder");
  panel.replaceChildren();
  const header=node("div","inventory-head");
  const caption=node("div");
  caption.append(node("p","eyebrow","MODULE 02 / GESTION DU REFUGE"),node("h2","","Inventaire"));
  caption.append(node("p","description","Objets regroupés par famille · nom, quantité et description · données actualisées"));
  header.append(caption);
  panel.append(header);
  const message=node("p","inv-notice","Chargement des données…");
  message.setAttribute("role","status");
  panel.append(message);
  const toolbar=node("div","inv-controls");
  const search=node("input","inv-search");search.type="search";search.placeholder="Rechercher un objet…";search.setAttribute("aria-label","Rechercher un objet");
  const category=node("select","inv-select");category.setAttribute("aria-label","Filtrer par catégorie");
  toolbar.append(search,category);
  panel.append(toolbar);
  const count=node("p","inv-count","");
  const list=node("div","inv-list");panel.append(count,list);
  const foot=node("p","inv-footnote","Les quantités historiques sont indicatives jusqu'à un nouveau comptage. Les denrées et les composants déjà inclus dans les totaux ne sont jamais additionnés une seconde fois.");
  panel.append(foot);
  let data=null;
  function render(){
    if(!data)return;
    list.replaceChildren();
    const term=search.value.trim().toLocaleLowerCase("fr");
    const filtered=data.items.filter(i=>(category.value==="all"||i.categorie===category.value)&&
      (!term||[i.nom,i.description,i.quantite,i.categorie].join(" ").toLocaleLowerCase("fr").includes(term)));
    count.textContent=filtered.length+" lignes sur "+data.items.length+" · "+data.categories.length+" catégories";
    if(!filtered.length){list.append(node("p","inv-empty","Aucun objet trouvé."));return;}
    for(const cat of data.categories){
      const items=filtered.filter(i=>i.categorie===cat);if(!items.length)continue;
      const section=node("section","inv-category");
      const heading=node("div","inv-category-head");
      heading.append(node("h3","",cat),node("span","",items.length+" lignes"));
      section.append(heading);
      const table=node("div","inv-table");
      const h=node("div","inv-row inv-row-head");
      h.append(node("span","","Nom"),node("span","","Quantité"),node("span","","Description"));
      table.append(h);
      for(const item of items){
        const row=node("div","inv-row");
        row.append(node("strong","inv-name",item.nom),node("span","inv-qty",item.quantite),node("p","inv-desc",item.description));
        table.append(row);
      }
      section.append(table);list.append(section);
    }
  }
  async function load(){
    try{
      const response=await fetch("./inventaire-site.json?schema=shared-j74-1",{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const value=await response.json();
      if(value.schema!=="inventaire-normalise/2.0"||!Array.isArray(value.items)||!Array.isArray(value.categories))throw new Error("Format non reconnu");
      data=value;
      category.replaceChildren();const all=node("option","","Toutes les catégories");all.value="all";category.append(all);
      for(const label of data.categories){const o=node("option","",label);o.value=label;category.append(o);}
      message.textContent="Registre normalisé · "+data.reference+" · Les anciens éléments consommés, déplacés ou déjà comptés dans des totaux ne sont pas doublés.";
      render();
    }catch(error){
      message.textContent="Erreur de chargement : "+error.message;
    }
  }
  search.addEventListener("input",render);category.addEventListener("change",render);
  load();
  // Inventaire et carte utilisent la même version du monde au jour courant.
})();