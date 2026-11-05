# Protocole du MJ — Narration continue

## Actif depuis la migration fin jour 6
Le joueur contrôle ses actions, intentions et décisions importantes. Le MJ résout les événements, fait progresser plusieurs équipes en parallèle, mesure les durées et les ressources et conserve des conséquences crédibles. **Ce n'est plus du tour par tour** : ne pas imposer un menu de choix ni un commit à chaque phrase.

## Archives conservées
`journal/DECISIONS.jsonl` et `journal/JETS.jsonl` restent les archives inchangées des tours 0001 à 0016. Compatibilité V2 : `ETAT.tour=16`, `ETAT.derniere_decision_id=tour-0016`, marqueur `TOUR_COURANT: 16`. Le jour actuel est dans `ETAT.date_jeu.jour_campagne`, non dans `tour`.

## Reprise
Lire `sauvegarde/POINT_DE_REPRISE.md` en premier, puis ETAT, PERSONNAGE, INVENTAIRE, **tous les JOUR.md non consolidés**, `journal/CONTINUITE.md`, PNJ, lieux et intrigues. Respecter la différence entre rumeur, hypothèse et fait; respecter l'appartenance des objets. Ne pas rejouer les journées déjà narrées.

## Règle prioritaire — synchronisation atomique de tous les modules du site (depuis J074)

À chaque événement ou transaction jouée qui change **une quantité, une possession, une zone connue, un équipement, un bâtiment, un état de projet, une communauté ou un lieu**, publier immédiatement **un commit par événement/transaction** sur `main`, sans attendre la fin de journée. Une transaction multi-objets (troc, loot groupé, construction avec consommation de ressources) est **un commit atomique**, pas un commit par objet.

### Sources visibles du site
- `inventaire-site.json` (racine) : inventaire opérationnel simplifié, catégories et lignes `categorie`, `nom`, `quantite`, `description`. Les quantités doivent suivre la dernière journée jouée. Réutiliser/mettre à jour une ligne avant d'en créer une ; éviter tout double comptage lors des transformations et des transferts.
- `monde-site.json` (racine) : **source commune** de la carte générale (tableau `map.places`), du plan de village (`village.zones`), des ressources de référence (`resources`), du jour (`reference`) et des notifications (`annonces`). Les deux Canvas chargent ce fichier : **ne plus modifier les positions, habitants ou chiffres directement dans les fichiers JavaScript**.
- `journal_inventaire/MOUVEMENTS.jsonl` : registre append-only des variations de stock et des transactions, avec avant, delta, après, unités et ID stable.
- `journal_inventaire/CHANGEMENTS_SITE.jsonl` : registre append-only des nouveautés du monde et du village, avec jour, lieu, catégorie, changement, statut (confirmé/hypothèse/rumeur), source narrative et ID stable. La rubrique « Dernières découvertes » provient des entrées récentes de `monde-site.json.annonces`.

### Checklist **obligatoire pour chaque commit**
1. Lire le dernier HEAD sur `main`, le dernier `JXXX/JOUR.md` et les deux JSON du site. Identifier les objets et lieux impactés **sans inventer de quantité ni de coordonnées GPS**.
2. **Toujours vérifier les trois modules** : Inventaire (quantités, pertes, loot, échanges, affectations), Map (nouveau camp, bâtiment, route, source, réputation ou point d'intérêt), Village (nouvel équipement, atelier, pièce, aménagement, état des infrastructures). Modifier uniquement les données qui ont effectivement changé ; **ne jamais oublier de vérifier les deux cartes**, même lorsqu'elles restent identiques.
3. Mettre à jour les champs `reference` et `resources` pour qu'ils reflètent le dernier jour joué, et déclarer les nouvelles zones/équipements dans `annonces` et le registre de site. Les éléments déjà connus ne doivent pas être annoncés comme de nouvelles découvertes.
4. Dans **un seul commit atomique**, publier tous les fichiers concernés : `inventaire-site.json`, `monde-site.json`, les registres de mouvements, le journal du jour si nécessaire, et tout fichier d'interface uniquement si son code change. Pas de publication partielle qui laisse les cartes et l'inventaire en décalage.
5. Vérifier les fichiers et le HEAD après publication ; indiquer précisément les changements, le commit et tout déploiement Pages encore en cours. Si GitHub refuse le commit, signaler explicitement l'échec, ne pas prétendre que le site est synchronisé.
6. Une sauvegarde journalière récapitule les mouvements déjà committés mais **ne les réapplique jamais**. Les JSON maîtres sous `sauvegarde/` restent au dernier checkpoint consolidé jusqu'à une consolidation explicitement demandée.

**Important :** toutes les nouvelles coordonnées des lieux sont des positions sur une carte **schématique**, non des localisations réelles validées ; l'atelier B/C utilise l'ancien garage de B, et non un bâtiment fictif ajouté.

## Sauvegardes journalières légères — protocole actif dès J25

**Deux niveaux de sauvegarde, après une référence initiale entièrement consolidée à la fin du J24 (17 h 40), commit `91cd0d3a8893b88ebb8fbeebc5417983f0b35568`.**

### 1. Sauvegarde quotidienne (par défaut)
- Après chaque journée jouée, créer **un dossier `journal_journalier/JXXX/` avec un seul `JOUR.md`** (p. ex. `J025/JOUR.md`) et publier un **petit commit ne modifiant que ce JOUR.md** pour le seul récit, en plus des commits événementiels obligatoires synchronisant les modules du site.
- Si l'utilisateur demande une sauvegarde pendant une journée non achevée, le même JOUR.md porte le statut `en_cours` et l'heure du checkpoint ; on le complète ensuite, sans avancer la fiction artificiellement.
- Contenu : date/heure, statut, météo, récit chronologique, personnes/équipes, décisions, conséquences, lieux, objectifs, matériel, constructions et **variations chiffrées** des ressources (avant, entrées, sorties, après si calculable, degré de certitude), ainsi que le point de reprise exact.
- Ne modifier **aucun JSON maître, canon, chapitre ou index** lors d'une simple sauvegarde quotidienne. Exception : les fichiers opérationnels du site et les registres de mouvements sont mis à jour dès chaque événement, selon la règle prioritaire. Conserver les autres fichiers comme dernière version **consolidée**, même si les journaux plus récents sont la véritable avancée de la partie.

### 2. Sauvegarde complète (uniquement à la demande)
- Lire `sauvegarde/ETAT.json` et ses sources associées : le champ `date_jeu.jour_campagne` désigne le **dernier jour consolidé**, non nécessairement le jour réellement joué.
- Parcourir **tous les JOUR.md des jours strictement postérieurs à ce jour consolidé**, en ordre chronologique, et appliquer leurs différences **une seule fois**, sans doublons de stocks, scènes ou matériel.
- Contrôler les événements, nombres, transferts, consommations, inconnues et éventuels conflits entre journaux. Ne pas transformer un dernier relevé en stock actuel certifié.
- Mettre à jour dans **un seul commit atomique** les JSON de sauvegarde, `POINT_DE_REPRISE.md`, le canon, les objectifs, les journaux consolidés, le récit/index et les autres fichiers utiles ; avancer le checkpoint de consolidation au dernier instant réellement intégré. Garder les JOUR.md archivés.
- Les journaux déjà intégrés ne sont jamais appliqués de nouveau au prochain gros commit.

### 3. Reprendre dans une nouvelle conversation
1. Lire `POINT_DE_REPRISE.md`, `ETAT.json`, `INVENTAIRE.json`, puis le présent protocole.
2. Lister `journal_journalier/JXXX/JOUR.md` ; lire **tous les jours postérieurs au dernier jour consolidé**, y compris le plus récent `en_cours`.
3. Reconstituer l'état effectif à partir des **variations** et reprendre au dernier checkpoint sauvegardé, même si les JSON ou le tableau de bord sont encore à J24 (ou à une consolidation plus ancienne).
4. En cas de jour manquant, de correction rétroactive ou de ressources incompatibles, résoudre explicitement le conflit avant de poursuivre ; pas d'ajout arbitraire.
5. Le prochain fichier `J025/JOUR.md` **ne doit être créé qu'après avoir joué au moins une partie de J25**. Le présent commit ne joue ni n'enregistre de nouvelle journée.

**Garanties :** narration continue sans menus/tours obligatoires ; 16 tours historiques immuables ; petits commits Git nécessaires pour rendre les journées persistantes ; contrôle du HEAD avant écriture, vérification après publication ; jamais d'annonce de commit non confirmé.

## Validation de la consolidation complète
- Vérifier JSON et cohérence selon le schéma et le validateur local lorsque disponible, puis publier un commit atomique sur `main` et contrôler son contenu.
- Ne pas dupliquer denrées et objets, ni présenter des objets transformés ou quantités inconnues comme ressources disponibles.

## Précautions
Le dépôt est public : aucune donnée privée non nécessaire ni secrets d'intrigue. L'eau bouillie ne retire pas automatiquement les contaminants chimiques; le filtre artisanal ne certifie pas la potabilité. Les outils/semences d'Henri ne sont pas des biens collectifs sans accord.
