# Schéma de données — V2

## Source unique de vérité

| Type de données | Source maîtresse | Documents dérivés |
| --- | --- | --- |
| Tour, phase, temps, lieu, météo, position dans l'histoire | `sauvegarde/ETAT.json` | POINT_DE_REPRISE.md |
| Identité, statistiques, compétences, santé, fatigue, besoins | `personnage/PERSONNAGE.json` | FICHE.md |
| Objets, consommables, capacités de charge | `sauvegarde/INVENTAIRE.json` | INVENTAIRE.md (lien seulement) |
| Décisions et conséquences | `journal/DECISIONS.jsonl` | CHRONOLOGIE.md |
| Jets réellement effectués | `journal/JETS.jsonl` | Narration |
| Scènes et dialogues vécus | `recit/chapitre-XXX/scene-YYY.md` | recit/INDEX.md |
| Monde et relations connus | `canon/` | Notes et références |

Une information chiffrée ne doit jamais avoir deux sources indépendantes. Les fichiers Markdown résument ou commentent les valeurs JSON sans les recopier inutilement.

## Valeurs et statuts
- `null` = pas encore défini. Ne pas le confondre avec `0`.
- `[]` = aucune entrée consignée. Ne signifie pas que l'univers ne contient rien.
- Les nombres sont de vrais nombres JSON, non des chaînes.
- Tous les documents structurés ont `schema_version: "2.0"`.
- Au tour 0, le personnage est non créé ; aucun choix d'origine n'est acté.

## Contrat d'ETAT.json
Le fichier contient `tour`, `derniere_decision_id`, `phase`, `etape_creation`, `date_jeu`, `localisation`, `conditions`, `progression`, `chapitre_actuel`, `derniere_scene_canonique`, `prochaine_action`.
Il ne doit contenir **aucun** champ `personnage`, `inventaire` ou `ressources` : ces catégories sont ailleurs.

## Contrat de PERSONNAGE.json
Le fichier contient `identite`, `caracteristiques` (six attributs, de 1 à 5 si attribués), `competences` (de 0 à 3 si attribuées), `traits`, `etat_physique` et `progression`. Toute valeur encore non choisie reste `null`.

## Contrat d'INVENTAIRE.json
- `objets` est un tableau d'objets identifiés, avec `id` unique, `quantite` non négative (`0` uniquement pour la traçabilité d'objets épuisés ou intégrés à un autre lot, sans les compter comme disponibles), `masse_unitaire_kg` (éventuellement null).
- `consommables` regroupe les stocks quantifiés d'eau potable, nourriture et soins.
- Un stock consommable ne doit pas apparaître **à la fois** comme quantité dans `objets` et dans `consommables`. Un contenant vide est un objet distinct.
- `charge.capacite_kg` est renseignée uniquement si une capacité a été fixée. La masse portée est déduite des masses connues, pas dupliquée.

## Journaux des décisions et des jets
Chaque ligne JSONL contient un objet JSON, sans ligne vide. Dans `DECISIONS.jsonl`, chaque choix ajoute une ligne avec les clés :
`id`, `tour`, `phase`, `choix_joueur`, `consequences`, `temps_ecoule_minutes`, `lieu_apres`.

Dans l'archive initiale (16 tours), les décisions sont numérotées `tour-0001`, etc. Depuis le mode continu, `ETAT.tour=16` et `derniere_decision_id=tour-0016` sont figés à des fins de compatibilité. Les nouveaux jalons sont datés par `date_jeu.jour_campagne` et `checkpoint` et décrits dans `journal/CONTINUITE.md`.

Dans `JETS.jsonl`, chaque entrée contient `tour`, `raison`, `d20`, `bonus`, `difficulte`, `total`, `reussite`, `effet`. Aucun jet imaginaire ne doit être enregistré comme aléatoire.

## Récit par chapitres
Créer `recit/chapitre-001/scene-001.md` seulement au début effectif de la partie. Chaque scène précise les tours, le lieu, la date fictive si connue et les événements vécus. L'index et `ETAT.derniere_scene_canonique` désignent les scènes existantes.

## Reprise et contrôle
`POINT_DE_REPRISE.md` doit contenir un marqueur `<!-- TOUR_COURANT: N -->`, synchronisé avec `ETAT.tour`, et la section `PROCHAINE INTERACTION`. Lancer `python3 scripts/valider_sauvegarde.py` avant chaque commit de décision, quand l'exécution locale est disponible. La validation est locale; aucun workflow GitHub Actions n'est configuré depuis J19.

## Extension V2, narration continue
`ETAT.mode_jeu="narration_continue"` ; `date_jeu.jour_campagne` est la date relative en jeu, `checkpoint.id` identifie le jalon. Les 16 décisions anciennes et leurs jets restent immuables. Les quantités dans `INVENTAIRE.consommables` peuvent être des derniers comptages datés, avec `null` pour les soldes inconnus; `INVENTAIRE.objets[].capacite_unitaire_l` permet de dériver la capacité des contenants alimentaires. `POINT_DE_REPRISE` conserve le marqueur tour historique 16, sans indiquer que la fiction s'y trouve encore.
