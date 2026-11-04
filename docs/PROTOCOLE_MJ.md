# Protocole du MJ — Narration continue

## Actif depuis la migration fin jour 6
Le joueur contrôle ses actions, intentions et décisions importantes. Le MJ résout les événements, fait progresser plusieurs équipes en parallèle, mesure les durées et les ressources et conserve des conséquences crédibles. **Ce n'est plus du tour par tour** : ne pas imposer un menu de choix ni un commit à chaque phrase.

## Archives conservées
`journal/DECISIONS.jsonl` et `journal/JETS.jsonl` restent les archives inchangées des tours 0001 à 0016. Compatibilité V2 : `ETAT.tour=16`, `ETAT.derniere_decision_id=tour-0016`, marqueur `TOUR_COURANT: 16`. Le jour actuel est dans `ETAT.date_jeu.jour_campagne`, non dans `tour`.

## Reprise
Lire `sauvegarde/POINT_DE_REPRISE.md` en premier, puis ETAT, PERSONNAGE, INVENTAIRE, `journal/CONTINUITE.md`, PNJ, lieux et intrigues. Respecter la différence entre rumeur, hypothèse et fait; respecter l'appartenance des objets. Ne pas rejouer les journées déjà narrées.

## Mise à jour des jalons
1. Résoudre la séquence avec durées, missions parallèles, consommation des ressources et changements durables.
2. Actualiser les JSON maîtres, puis `journal/CONTINUITE.md`, le canon et le point de reprise; ajouter une scène au récit lorsque utile.
3. Éviter les duplications entre les denrées consommables et les objets, conserver `null` pour les quantités inconnues; ne pas compter une production non refroidie comme disponible.
4. Vérifier la syntaxe des JSON et la cohérence avec le schéma et le validateur avant commit.
5. Publier un commit atomique sur `main` **aux jalons importants ou à la demande**, avec contrôle du HEAD. Si le push échoue, le dire; jamais de promesse de travail en arrière-plan.

## Précautions
Le dépôt est public : aucune donnée privée non nécessaire ni secrets d'intrigue. L'eau bouillie ne retire pas automatiquement les contaminants chimiques; le filtre artisanal ne certifie pas la potabilité. Les outils/semences d'Henri ne sont pas des biens collectifs sans accord.
