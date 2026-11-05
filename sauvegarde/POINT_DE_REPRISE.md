# Point de reprise — Les Cendres du Monde
<!-- TOUR_COURANT: 16 -->

## Mode actif : narration continue simplifiée
Les 16 premiers tours restent des archives immuables. Le joueur organise librement les journées et les missions parallèles, sans menu obligatoire. Conventions depuis J21 : eau de la résurgence pure, viande fumée durable, toutes conserves comestibles, graines viables. Aucun workflow GitHub Actions.

## Synchronisation du site — nouveau protocole de commit J074

Le site GitHub Pages affiche la campagne au **dernier checkpoint narratif J074 (12 janvier 2044)** via `monde-site.json` (carte générale, plan Village, ressources, découvertes) et `inventaire-site.json` (inventaire opérationnel), à la racine. Le protocole détaillé figure dans `docs/PROTOCOLE_MJ.md`.

**À chaque événement / transaction** : mettre à jour atomiquement les fichiers concernés et les registres dans `journal_inventaire/`, contrôler systématiquement **Map + Village + Inventaire**, notifier les nouveaux lieux/équipements dans `monde-site.json.annonces`. Ne pas attendre le journal quotidien pour publier les quantités. Ne jamais réappliquer un mouvement au moment de consolider. Les JSON maîtres restent à J24 et le jour réellement joué est déterminé par les journaux non consolidés.

**Import initial J074 :** 62,3 kg nourriture, ~193 L d'eau prête / 251 L capacité, ~210 kg de bois sec, 51,5 kg charbon, 14 panneaux, 11 résidents. Les registres créés à ce jalon ne recréent pas rétroactivement toutes les transactions des anciennes journées.

## IMPORTANT — nouveau protocole de sauvegarde dès J25
Les JSON et le présent point de reprise décrivent le **dernier état consolidé** (actuellement fin J24, 17 h 40), pas nécessairement le dernier jour joué. Pour reprendre après des commits légers, lire **tous les `journal_journalier/JXXX/JOUR.md`** dont le numéro de jour est **supérieur à `ETAT.date_jeu.jour_campagne`**, dans l'ordre, et appliquer leurs variations sans double comptage. Un petit commit de JOUR.md par journée ; gros commit de consolidation **uniquement à la demande**. Voir `docs/PROTOCOLE_MJ.md`. **J25 n'est pas encore joué.**

## Fin du jour 24 — novembre 2043, 17 h 40
- **Hiver arrivé** : matin **−4 °C**, maximum **+1 °C**, vent du nord, givre, premières averses de neige en fin de journée. Temps extérieur prolongé difficile : froid, glissades, pauses au chaud indispensables; pas d'épaisseur de neige affirmée.
- **Électricité enfin en service** : David dirige le travail avec Tugay, Nicolas, Élise et l'aide des autres selon disponibilités. **Quatre panneaux** fonctionnels, **batterie solaire 8 kWh**, gestion, premiers indices de charge vers 13 h 30. À **17 h 40**, le **bâtiment C** (salle commune) et des zones essentielles du **bâtiment B** (dont escalier) sont éclairés. Petits appareils rechargeables; **ni chauffage ni grosses charges**. Production, taux de charge et autonomie nocturne non chiffrés.
- **Bois** : Kübra et Sophie collectent **56 kg** de bois sec avec le chariot renforcé, **16 kg** sont utilisés en chauffage/cuisine/eau. **93 + 56 − 16 = 133 kg de bois sec**, **0 humide**.
- **Charbon** : aucun nouveau lot J24, stock **23,4 kg** (inchangé).
- **Objectifs avant décembre** : **200 kg de bois sec et 50 kg de charbon**; écarts actuels **67 kg** et **26,6 kg**. Les sorties et usages futurs feront varier le stock.
- **Protections** : Marc rapporte **12 planches** et des éléments de couverture/fixation non quantifiés. **8 planches** utilisées pour auvent/pare-vent des foyers extérieurs; **4 planches** disponibles. Chauffe à l'air libre et ventilée.
- **Agriculture** : Henri et Marianne sèment **épinards d'hiver et fèves** sur les **deux planches communes préparées J20**, visitent et entretiennent les parcelles existantes et leurs anciens jardins. Sachets de semences viables déjà en stock, nombre de graines utilisées inconnu, pas de récolte.
- **Autres réserves, dernier relevé J23** : **108 L d'eau prête**, **20 L séparés**, **40,6 kg viande fumée durable**, **39 conserves**. La journée J24 ne chiffre ni consommation ni nouvelle collecte de ces catégories : valeurs à traiter comme dernières pesées, pas comme comptage confirmé J24. Contenants 151 L nominaux, capacité de traitement d'eau ~135 L/jour depuis J23.
- **Personnes** : 7 membres confirmés (Tugay, Kübra, Marc, Élise, David, Sophie, Nicolas), Henri et Marianne alliés présents = neuf personnes. Aucun nouveau membre ni blessé. Projet de chasse partagée avec La Sallaz toujours ouvert (deux volontaires non encore désignés).

## PROCHAINE INTERACTION
Le récit s'arrête à la première mise en lumière, **J24 17 h 40** ; ne pas rejouer cette journée. Reprendre à partir de la fin J24 ou organiser librement le **J25**, avec le froid et le risque de neige. Priorités à la discrétion du joueur : compléter les réserves de bois/charbon, préserver les foyers, observer la charge du réseau, gérer les semis et l'eau. **Ne pas inventer d'autonomie électrique, de nouvelles récoltes, de dépenses non chiffrées ou de jets.**
