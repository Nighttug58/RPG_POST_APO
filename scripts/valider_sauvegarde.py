#!/usr/bin/env python3
"""Contrôle de cohérence de la sauvegarde RPG — aucune dépendance externe."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors = []


def fail(message):
    errors.append(message)


def read_json(path):
    try:
        value = json.loads((ROOT / path).read_text(encoding="utf-8"))
        if not isinstance(value, dict):
            raise ValueError("la racine doit être un objet")
        return value
    except (OSError, ValueError) as exc:
        fail(f"{path}: {exc}")
        return {}


def read_jsonl(path):
    try:
        lines = (ROOT / path).read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        fail(f"{path}: {exc}")
        return []
    result = []
    for i, line in enumerate(lines, 1):
        if not line.strip():
            fail(f"{path}:{i}: ligne vide interdite")
            continue
        try:
            row = json.loads(line)
            if not isinstance(row, dict):
                raise ValueError("chaque ligne doit être un objet")
            result.append(row)
        except ValueError as exc:
            fail(f"{path}:{i}: {exc}")
    return result


def number(value):
    return type(value) in (int, float)


def validate():
    state = read_json("sauvegarde/ETAT.json")
    character = read_json("personnage/PERSONNAGE.json")
    inventory = read_json("sauvegarde/INVENTAIRE.json")
    decisions = read_jsonl("journal/DECISIONS.jsonl")
    rolls = read_jsonl("journal/JETS.jsonl")

    for label, obj in (("ETAT", state), ("PERSONNAGE", character), ("INVENTAIRE", inventory)):
        if obj.get("schema_version") != "2.0":
            fail(f"{label}: schema_version doit valoir 2.0")
    for key in ("personnage", "inventaire", "ressources"):
        if key in state:
            fail(f"ETAT: duplication interdite de {key}")

    turn = state.get("tour")
    if type(turn) is not int or turn < 0:
        fail("ETAT: tour doit être un entier positif ou nul")
        turn = 0
    if turn != len(decisions):
        fail(f"ETAT.tour={turn}, mais {len(decisions)} décisions")
    last = f"tour-{turn:04d}" if turn else None
    if state.get("derniere_decision_id") != last:
        fail("ETAT: identifiant de dernière décision divergent")
    if not isinstance(state.get("phase"), str):
        fail("ETAT: phase manquante")
    if not isinstance(state.get("date_jeu"), dict):
        fail("ETAT: date_jeu doit être un objet")
    if not isinstance(state.get("localisation"), dict):
        fail("ETAT: localisation doit être un objet")

    for i, row in enumerate(decisions, 1):
        if row.get("tour") != i or row.get("id") != f"tour-{i:04d}":
            fail(f"Décision {i}: ordre ou identifiant incohérent")
        for key in ("phase", "choix_joueur", "consequences", "temps_ecoule_minutes", "lieu_apres"):
            if key not in row:
                fail(f"Décision {i}: manque {key}")
        duration = row.get("temps_ecoule_minutes")
        if duration is not None and (not number(duration) or duration < 0):
            fail(f"Décision {i}: durée invalide")

    traits = character.get("caracteristiques", {})
    if not isinstance(traits, dict):
        fail("PERSONNAGE: caractéristiques invalides")
    else:
        for key in ("force", "agilite", "perception", "intelligence", "volonte", "relations"):
            val = traits.get(key)
            if val is not None and (type(val) is not int or val < 1 or val > 5):
                fail(f"PERSONNAGE: {key} doit être null ou entre 1 et 5")
    skills = character.get("competences")
    if skills is not None:
        if not isinstance(skills, dict):
            fail("PERSONNAGE: compétences doit être objet ou null")
        else:
            for name, val in skills.items():
                if type(val) is not int or not (0 <= val <= 3):
                    fail(f"PERSONNAGE: compétence {name} hors 0 à 3")
    if character.get("statut") == "non_cree" and state.get("phase") != "creation_personnage":
        fail("PERSONNAGE: non créé, mais phase incohérente")

    items = inventory.get("objets")
    if not isinstance(items, list):
        fail("INVENTAIRE: objets doit être une liste")
        items = []
    ids = set()
    for index, item in enumerate(items, 1):
        if not isinstance(item, dict):
            fail(f"INVENTAIRE: élément {index} non objet")
            continue
        item_id = item.get("id")
        if not isinstance(item_id, str) or not item_id or item_id in ids:
            fail(f"INVENTAIRE: identifiant absent ou dupliqué au rang {index}")
        ids.add(item_id)
        qty = item.get("quantite")
        if not number(qty) or qty <= 0:
            fail(f"INVENTAIRE: quantité invalide pour {item_id}")
        mass = item.get("masse_unitaire_kg")
        if mass is not None and (not number(mass) or mass < 0):
            fail(f"INVENTAIRE: masse invalide pour {item_id}")
    consumables = inventory.get("consommables")
    if not isinstance(consumables, dict):
        fail("INVENTAIRE: consommables doit être un objet")
    else:
        for key in ("eau_potable_l", "nourriture_portions", "soins_unites"):
            val = consumables.get(key)
            if val is not None and (not number(val) or val < 0):
                fail(f"INVENTAIRE: quantité négative ou invalide pour {key}")

    for index, row in enumerate(rolls, 1):
        for key in ("tour", "raison", "d20", "bonus", "difficulte", "total", "reussite", "effet"):
            if key not in row:
                fail(f"Jet {index}: manque {key}")
        die, bonus, difficulty = row.get("d20"), row.get("bonus"), row.get("difficulte")
        total, success, t = row.get("total"), row.get("reussite"), row.get("tour")
        if type(t) is not int or not (1 <= t <= turn):
            fail(f"Jet {index}: référence de tour invalide")
        if type(die) is not int or not 1 <= die <= 20:
            fail(f"Jet {index}: d20 invalide")
        if not number(bonus) or not number(difficulty) or not number(total):
            fail(f"Jet {index}: valeurs numériques manquantes")
        elif type(die) is int and total != die + bonus:
            fail(f"Jet {index}: total mal calculé")
        elif type(success) is not bool or success != (total >= difficulty):
            fail(f"Jet {index}: réussite incompatible avec le total")

    try:
        resume = (ROOT / "sauvegarde/POINT_DE_REPRISE.md").read_text(encoding="utf-8")
        marker = re.search(r"<!-- TOUR_COURANT: (\d+) -->", resume)
        if not marker or int(marker.group(1)) != turn:
            fail("POINT_DE_REPRISE: marqueur de tour manquant ou différent")
        if "PROCHAINE INTERACTION" not in resume:
            fail("POINT_DE_REPRISE: prochaine interaction absente")
    except OSError as exc:
        fail(f"POINT_DE_REPRISE: {exc}")
    for name in ("docs/SCHEMA.md", "recit/INDEX.md", "docs/REGLES.md"):
        if not (ROOT / name).is_file():
            fail(f"Fichier de référence absent: {name}")
    scene = state.get("derniere_scene_canonique")
    if scene is not None:
        if not isinstance(scene, str) or not scene.startswith("recit/") or not (ROOT / scene).is_file():
            fail("ETAT: dernière scène absente ou mal référencée")

    if errors:
        for message in errors:
            print(f"ERREUR : {message}", file=sys.stderr)
        return 1
    print(f"Validation OK : architecture V2, {turn} tours, {len(rolls)} jets.")
    return 0


if __name__ == "__main__":
    sys.exit(validate())
