# Journaux quotidiens légers — Les Cendres du Monde

Dès **J25**, sauvegarder chaque journée dans un unique `journal_journalier/JXXX/JOUR.md` (ex. `J025/JOUR.md`). Le jour 24 à 17 h 40 est la **dernière consolidation initiale** (commit `91cd0d3`). Il n'existe encore **aucune journée J25 jouée** au moment d'adopter ce protocole.

## Gabarit du fichier JOUR.md

```md
# Jour XXX — Titre narratif
**Date fictive :** novembre 2043
**Heures :** ...
**Statut :** en_cours | termine
**Base consolidée :** jour et checkpoint de ETAT.json
**Point de départ :** checkpoint précédent

## Météo et environnement
## Chronologie : heures, dialogues, missions simultanées et résultats
## Ressources : bilan des variations
| Ressource | Avant connu | Gains | Dépenses | Après calculé | Certitude |
| --- | --- | --- | --- | --- | --- |
## Objets, constructions et lieux
## Personnes, conséquences et décisions
## Objectifs, risques et nouvelles règles
## Dernier checkpoint et prochaine interaction
```

**Règles :** tracer les consommations et conversions sans double comptage ; distinguer comptage certain, estimation, et quantité inconnue ; ne pas inventer des récoltes, jets ou événements ; mentionner les différences non résolues. Un dernier relevé n'est pas forcément le solde actuel.

## Reprise
Lire `sauvegarde/ETAT.json` et `POINT_DE_REPRISE.md`, puis tous les JOUR.md **strictement plus récents que le jour consolidé** en ordre croissant. Ces Markdown sont des **variations à appliquer sur la sauvegarde consolidée**, non des stocks supplémentaires.

## Consolidation à la demande
Réconcilier tous les journaux non intégrés et mettre à jour les sources maîtresses en un commit atomique. Avancer `ETAT.date_jeu.jour_campagne` et le point de reprise au dernier checkpoint réellement intégré. Conserver les fichiers journaliers, mais ne pas les réappliquer aux prochaines consolidations. Les tableaux de bord fondés sur les JSON restent datés de la dernière consolidation jusqu'à cette opération.

**Premier JOUR.md à créer au jeu : `J025/JOUR.md`.** Ne pas le créer seulement pour installer le protocole.
