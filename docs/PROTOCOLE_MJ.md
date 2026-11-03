# Protocole de maître du jeu et de sauvegarde

## Hiérarchie des sources
1. Branche `main` actuelle du dépôt : source de vérité persistante.
2. `sauvegarde/POINT_DE_REPRISE.md` et `sauvegarde/ETAT.json` : situation de jeu et dernier tour enregistré.
3. Fiche, inventaire, chronologie, décisions, tests, canon et pistes : contexte complémentaire.
4. Conversation en cours : éléments non encore sauvegardés, à distinguer du canon.

## À chaque nouvelle session
1. Vérifier l'accès en lecture et, si possible, en écriture à `Nighttug58/RPG_POST_APO`.
2. Relire au minimum POINT_DE_REPRISE, ETAT.json, REGLES, FICHE et dernières entrées de CHRONOLOGIE et DECISIONS.
3. Lire PNJ, lieux, factions, pistes et autres pièces pertinentes à la scène.
4. Vérifier le dernier commit GitHub et la valeur `tour` avant toute résolution.
5. Résumer la scène en cours sans avancer le temps ni provoquer une décision non demandée.
6. En absence d'accès en écriture, avertir le joueur : aucun nouveau choix ne doit être présenté comme sauvegardé.

## Cycle d'une décision
1. Recevoir un choix ou une action explicite du joueur. Une question hors-jeu sans décision ne déclenche pas de commit.
2. Consulter la branche `main` à jour et relever la dernière révision pour éviter de réécrire un état plus récent.
3. Résoudre les conséquences logiques et les tests éventuels ; produire un résultat précis.
4. Incrémenter le tour / identifiant de décision uniquement pour un choix nouveau et validé.
5. Mettre à jour, selon nécessité, la fiche, l'inventaire, le canon, les pistes, le journal et les jets.
6. Mettre **toujours** à jour `sauvegarde/ETAT.json`, `sauvegarde/POINT_DE_REPRISE.md` et `journal/DECISIONS.jsonl`. Ces trois fichiers doivent raconter la même version des faits.
7. Sauvegarder tous les changements de ce choix **dans un seul commit atomique** sur `main` : `jeu(tour-0001): description courte`. Inclure un identifiant unique et l'ordre des décisions.
8. Vérifier que le commit est visible sur GitHub, puis annoncer son lien et le nouveau tour au joueur.
9. Seulement après confirmation de la sauvegarde, traiter ce choix comme état durable lors de la prochaine reprise.

## Échec et conflits
- En cas d'échec GitHub, ne jamais annoncer « sauvegardé ». Expliquer quels fichiers ou quel tour n'ont pas été enregistrés.
- Si la branche a changé, relire le nouvel état, comparer et réconcilier, plutôt que forcer l'historique.
- Ne pas réécrire ou supprimer un événement déjà validé sans correction explicite signalée.
- Ne jamais forcer un push sur `main`. Ne pas faire de commit vide pour une simple réponse informative.
- Les outils GitHub doivent être activement utilisés à chaque nouveau choix ; le dépôt ne se met pas à jour tout seul et aucun travail en arrière-plan n'est supposé.

## Formats
- `ETAT.json` : JSON valide, valeurs indéfinies = `null` ; valeurs inconnues ne sont pas égales à 0.
- `DECISIONS.jsonl` : une entrée JSON par ligne, comprenant au moins `id`, `tour`, `phase`, `choix_joueur`, `consequences`, `temps_ecoule_minutes`, `lieu_apres`. Pas de modification d'entrées antérieures hors correction documentée.
- `JETS.jsonl` : une ligne JSON par test avec `tour`, `raison`, `d20`, `bonus`, `difficulte`, `total`, `reussite`, `effet`.
- La chronologie consigne les événements acquis, leur date/heure fictive si connue, et une référence de tour.
- Le point de reprise se termine par « PROCHAINE INTERACTION » et l'option en suspens.

## Spoilers / sécurité des données
Le dépôt GitHub est **public**. Ne jamais y inscrire de secrets personnels réels, données sensibles ou mots de passe. Les coulisses fictives du MJ sont également lisibles par quiconque visite le dépôt : fichier `mj/COULISSES.md`, marqué SPOILERS, à réserver aux informations fictionnelles nécessaires à la continuité. Ne pas inventer à l'avance des secrets inutiles.
