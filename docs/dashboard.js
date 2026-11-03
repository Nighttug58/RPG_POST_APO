/* Tableau de bord en lecture seule — aucune bibliothèque externe. */
(() => {
  "use strict";

  const REPO = "https://raw.githubusercontent.com/Nighttug58/RPG_POST_APO/main/";
  const PATHS = {
    etat: "sauvegarde/ETAT.json",
    personnage: "personnage/PERSONNAGE.json",
    inventaire: "sauvegarde/INVENTAIRE.json"
  };
  const $ = (id) => document.getElementById(id);
  const MISSING = "Non défini";

  function readable(value, unit = "") {
    if (value === null || value === undefined || value === "") return MISSING;
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (typeof value === "number") {
      return value.toLocaleString("fr-CH", { maximumFractionDigits: 2 }) + unit;
    }
    if (Array.isArray(value)) return value.length ? value.join(", ") : "Aucun";
    return String(value);
  }

  function node(tag, className = "", content = null) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== null) el.textContent = String(content);
    return el;
  }

  function reset(el) {
    el.replaceChildren();
    return el;
  }

  function group(parent, heading) {
    const section = node("section", "group");
    section.append(node("h2", "", heading));
    parent.append(section);
    return section;
  }

  function line(parent, label, value, unit = "") {
    const item = node("div", "item");
    item.append(node("div", "key", label), node("div", "value", readable(value, unit)));
    parent.append(item);
    return item;
  }

  function tile(parent, label, value) {
    const item = node("div", "tile");
    item.append(node("div", "key", label), node("div", "value", readable(value)));
    parent.append(item);
  }

  function entries(parent, values) {
    const grid = node("div", "pairs");
    for (const [key, val, unit] of values) line(grid, key, val, unit || "");
    parent.append(grid);
  }

  function tags(parent, values) {
    if (!Array.isArray(values) || values.length === 0) {
      parent.append(node("p", "muted", "Aucun élément enregistré."));
      return;
    }
    const wrap = node("div", "tags");
    values.forEach((value) => wrap.append(node("span", "tag", value)));
    parent.append(wrap);
  }

  function stats(parent, values) {
    const section = group(parent, "Caractéristiques");
    const names = {
      force: "Force", agilite: "Agilité", perception: "Perception",
      intelligence: "Intelligence", volonte: "Volonté", relations: "Relations"
    };
    for (const [key, name] of Object.entries(names)) {
      const value = values?.[key] ?? null;
      const element = node("div", "stat");
      const head = node("div", "stat-head");
      head.append(node("span", "", name), node("strong", "", value === null ? MISSING : readable(value) + " / 5"));
      element.append(head);
      if (typeof value === "number") {
        const bar = node("div", "bar");
        const fill = node("span");
        fill.style.width = Math.min(100, Math.max(0, (value / 5) * 100)) + "%";
        bar.append(fill);
        element.append(bar);
      }
      section.append(element);
    }
  }

  function renderSummary(state) {
    const root = reset($("summary"));
    const place = state.localisation?.lieu_precis || state.localisation?.region || null;
    const phase = state.phase === "creation_personnage" ? "Création du personnage" : state.phase;
    tile(root, "Tour sauvegardé", state.tour);
    tile(root, "Phase", phase);
    tile(root, "Localisation", place);
    tile(root, "Année fictive", state.date_jeu?.annee ?? null);
  }

  function renderCharacter(data) {
    const root = reset($("panel-personnage"));
    const id = data.identite || {};
    const header = group(root, "Identité du protagoniste");
    entries(header, [
      ["État de création", data.statut === "non_cree" ? "Non créé" : data.statut],
      ["Nom", id.nom], ["Âge", id.age, " ans"], ["Passé", id.passe],
      ["Origine", id.origine], ["Motivation", id.motivation]
    ]);

    const grid = node("div", "grid");
    root.append(grid);
    stats(grid, data.caracteristiques || {});

    const skills = group(grid, "Compétences");
    if (!data.competences || Object.keys(data.competences).length === 0) {
      skills.append(node("p", "muted", "Aucune compétence attribuée."));
    } else {
      const list = node("div", "pairs");
      for (const [name, value] of Object.entries(data.competences)) {
        line(list, name.replace(/_/g, " "), value, " / 3");
      }
      skills.append(list);
    }

    const health = group(root, "État physique");
    const body = data.etat_physique || {};
    entries(health, [
      ["Santé", body.sante], ["Fatigue", body.fatigue],
      ["Faim", body.faim], ["Hydratation", body.hydratation]
    ]);
    health.append(node("p", "muted", "Blessures connues"));
    tags(health, body.blessures);

    const traits = group(root, "Qualités et faiblesses");
    traits.append(node("p", "muted", "Qualités"));
    tags(traits, data.traits?.qualites);
    traits.append(node("p", "muted", "Faiblesses"));
    tags(traits, data.traits?.faiblesses);

    const progress = group(root, "Progression");
    entries(progress, [["Expérience", data.progression?.experience]]);
    progress.append(node("p", "muted", "Capacités particulières"));
    tags(progress, data.progression?.capacites_speciales);
  }

  function renderInventory(data) {
    const root = reset($("panel-inventaire"));
    const stock = group(root, "Ressources");
    const consumables = data.consommables || {};
    entries(stock, [
      ["Eau potable", consumables.eau_potable_l, " L"],
      ["Nourriture", consumables.nourriture_portions, " portion(s)"],
      ["Fournitures de soins", consumables.soins_unites, " unité(s)"],
      ["Capacité de transport", data.charge?.capacite_kg, " kg"]
    ]);

    const items = group(root, "Objets et équipement");
    if (!Array.isArray(data.objets) || data.objets.length === 0) {
      items.append(node("p", "empty", "Inventaire vide ou pas encore attribué."));
    } else {
      let knownMass = 0;
      let anyUnknownMass = false;
      for (const item of data.objets) {
        const row = node("div", "inventory-row");
        const detail = node("div");
        detail.append(node("div", "inventory-title", item.nom || item.id || "Objet inconnu"));
        const info = [
          item.etat ? "État : " + item.etat : null,
          item.emplacement ? "Emplacement : " + item.emplacement : null,
          item.masse_unitaire_kg == null ? "Masse inconnue" : readable(item.masse_unitaire_kg, " kg / unité")
        ].filter(Boolean).join(" · ");
        detail.append(node("div", "inventory-meta", info));
        row.append(detail, node("strong", "numeric", "× " + readable(item.quantite)));
        items.append(row);
        if (typeof item.masse_unitaire_kg === "number" && typeof item.quantite === "number") {
          knownMass += item.masse_unitaire_kg * item.quantite;
        } else {
          anyUnknownMass = true;
        }
      }
      items.append(node("p", "muted",
        "Masse connue des objets : " + readable(knownMass, " kg") +
        (anyUnknownMass ? " (somme partielle)" : " (hors consommables et contenus non pesés)")
      ));
    }
  }

  function status(message, error = false) {
    $("status").textContent = message;
    $("status").classList.toggle("error", error);
  }

  async function fetchJson(path) {
    const url = REPO + path + "?updated=" + Date.now();
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(path + " : réponse HTTP " + response.status);
    const value = await response.json();
    if (!value || typeof value !== "object" || value.schema_version !== "2.0") {
      throw new Error(path + " : format de sauvegarde V2 incorrect");
    }
    return value;
  }

  async function refresh() {
    const button = $("refresh");
    button.disabled = true;
    status("Chargement des données depuis la branche main…");
    try {
      const [state, character, inventory] = await Promise.all([
        fetchJson(PATHS.etat), fetchJson(PATHS.personnage), fetchJson(PATHS.inventaire)
      ]);
      renderSummary(state);
      renderCharacter(character);
      renderInventory(inventory);
      const clock = new Date().toLocaleTimeString("fr-CH", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      status("Lecture GitHub réussie à " + clock + " · Tour " + state.tour +
        " · Affichage en lecture seule.");
    } catch (error) {
      status("Impossible d'actualiser : " + error.message +
        ". Vérifie l'accès aux fichiers JSON publics et réessaie.", true);
    } finally {
      button.disabled = false;
    }
  }

  function switchTab(name) {
    for (const item of ["personnage", "inventaire"]) {
      const active = item === name;
      const tab = $("tab-" + item);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      $("panel-" + item).hidden = !active;
    }
  }

  $("tab-personnage").addEventListener("click", () => switchTab("personnage"));
  $("tab-inventaire").addEventListener("click", () => switchTab("inventaire"));
  for (const name of ["personnage", "inventaire"]) {
    $("tab-" + name).addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const other = name === "personnage" ? "inventaire" : "personnage";
        switchTab(other);
        $("tab-" + other).focus();
      }
    });
  }
  $("refresh").addEventListener("click", refresh);
  refresh();
})();
