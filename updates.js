/* Dernières découvertes / relevés, fournis par monde-site.json */
(() => {
 "use strict";
 const root=document.getElementById("latest-events"), ref=document.getElementById("latest-reference");
 if(!root)return;
 const el=(tag,text,cls)=>{const x=document.createElement(tag);x.textContent=text;if(cls)x.className=cls;return x;};
 fetch("./monde-site.json?rev=shared-j74-1",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json();}).then(data=>{
  if(data.schema!=="monde-site/1.0")throw Error("Version de données incompatible");
  const j=data.reference?.jour||"?";
  if(ref)ref.textContent="J"+j+" · "+(data.reference?.date||"");
  root.replaceChildren();
  for(const update of data.annonces||[]){
    const item=el("article","","latest-item");
    const header=el("div","","latest-item-top");
    header.append(el("span","J"+update.jour+" · "+({zone:"NOUVELLE ZONE",village:"VILLAGE",equipement:"ÉQUIPEMENT"}[update.type]||"ACTUALITÉ"),"latest-kind"),el("span",update.status||"","latest-status"));
    item.append(header,el("h3",update.titre),el("p",update.description),el("small",update.location||""));
    root.append(item);
  }
  const counter=document.querySelector(".head-meta strong");if(counter)counter.textContent="JOUR "+j;
 }).catch(err=>{root.replaceChildren(el("p","Actualités indisponibles : "+err.message));});
})();