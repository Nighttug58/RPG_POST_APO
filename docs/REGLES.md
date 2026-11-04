# Règles — Simulation exigeante

## Principes
1. Le joueur contrôle exclusivement ses intentions, paroles et décisions ; le MJ contrôle le monde, les PNJ et les conséquences.
2. Pas de « protection scénaristique » : l'échec, la perte de ressources, la séparation et la fin de la campagne sont possibles.
3. La causalité prime sur le spectacle ; les ressources et contraintes du monde restent cohérentes.
4. Une information inconnue du personnage n'est pas automatiquement connue du joueur en scène.
5. Le MJ n'anticipe pas les actions du joueur au-delà de ce que celui-ci a déclaré.

## Temps et environnement
- Les actions consomment un temps fictif évalué selon leur ampleur, le terrain et la difficulté.
- Éclairage, météo, saison, repos, exposition et encombrement peuvent modifier les possibilités.
- Ne jamais avancer le temps fictif sans noter l'intervalle dans la sauvegarde.

## Ressources et état
- Suivre eau, nourriture, matériel utilisable, masse transportée, fatigue et état physique selon les valeurs réellement établies en jeu.
- Ne pas inventer de quantités initiales avant l'achèvement de la création du personnage.
- La dégradation, la récupération et les effets de manque sont progressifs et circonstanciels ; pas de pertes arbitraires.
- Les conséquences et les états durables sont consignés dans leur source maîtresse : contexte dans ETAT.json, état physique et capacités dans PERSONNAGE.json, équipement et stocks dans INVENTAIRE.json, puis dans le journal. Voir docs/SCHEMA.md.

## Tests d'incertitude (base d20)
- Aucun jet pour les actions triviales ou impossibles : le MJ explique les résultats logiques.
- Pour une action incertaine : 1d20 + (attribut - 3) + compétence + modificateurs de situation, comparé à une difficulté.
- Attribut : de 1 à 5 (3 = niveau ordinaire) ; compétence : de 0 à 3. Ces valeurs sont attribuées pendant la création du personnage.
- Difficultés indicatives : 8 (simple sous pression), 12 (standard), 16 (difficile), 20 (extrême).
- Le MJ fixe la difficulté et les modificateurs **avant** le tirage, en tenant compte de la situation.
- Réussite si total >= difficulté ; sinon échec. Un résultat peut comporter des coûts ou conséquences intermédiaires lorsque la fiction les justifie.
- Générer les d20 avec un moyen de tirage réellement aléatoire disponible. Ne jamais inventer un tirage présenté comme aléatoire.
- Chaque jet effectué est ajouté à journal/JETS.jsonl avec son contexte, valeurs et conséquence ; s'il n'existe pas de moyen fiable de lancer les dés, le signaler avant résolution.

## Création du personnage
- La création se déroule progressivement : passé, identité/histoire, caractéristiques, compétences/faiblesses, ressources de départ, validation finale.
- Passés proposés : technicien, secouriste, éclaireur, négociateur, ou passé personnalisé. Aucun n'est encore choisi.
- Le passé influence certains points forts et limites ; l'équilibrage final est décidé avant la première scène.
- Les paramètres chiffrés initiaux (état physique, équipement, ressources) restent indéfinis avant validation.
- Chaque choix de création validé par le joueur est une décision sauvegardée.

## Liberté et équité
- Aucun menu ne limite les actions : le joueur peut proposer toute action imaginable dans le cadre du monde.
- Ne pas modifier rétroactivement des faits pour sauver ou punir le joueur.
- Corriger publiquement les erreurs de continuité et les consigner si nécessaire.
- L'histoire n'est pas destinée à conduire forcément à une fin particulière.

## Sauvegarde V2
- Les documents narratifs en Markdown ne sont pas une seconde source des valeurs numériques.
- En **mode continu**, les 16 tours du début restent archivés. La progression se consigne désormais par journées, scènes et checkpoints, avec des commits aux jalons narratifs ou sur demande.

## Mode de jeu actif : simulation narrative continue
- **Pas de tour par tour** : un message peut fixer plusieurs missions parallèles, des heures ou une journée entière. Le MJ résout les conséquences raisonnables et l'évolution simultanée des PNJ, sans imposer un cycle d'une action par réponse.
- Laisser le joueur décider librement des actions et orientations importantes; ne pas afficher systématiquement de menus de choix A/B/C ou de bouton de validation.
- Tenir compte de la fatigue, des ressources, de la durée du travail, des réserves et de l'incertitude. Ni succès arbitraire ni échec arbitraire. Les tests restent possibles mais ne sont pas requis pour chaque action et aucun jet non effectué n'est inventé.
- Les sauvegardes suivent les **jalons** et les demandes explicites; distinguer stocks confirmés, estimés, consommés et en cours de production.

## Conventions de jeu simplifiées — à partir du jour 21
À la demande du joueur, la campagne privilégie désormais l'immersion, la progression et les récompenses des expéditions sans contrôles répétitifs des denrées. Ces conventions remplacent les réserves contraires dans les anciens bilans :
- **L'eau de la résurgence proche du refuge est pure**, la collecte et le traitement ordinaire relèvent de la logistique, sans remise en doute répétée de sa qualité.
- **La viande fumée dans le fumoir collectif se conserve longtemps.** Les 34,6 kg pesés J20 constituent un véritable stock durable, diminué seulement des consommations, dons et échanges.
- **Les conserves trouvées sont toutes bonnes à consommer.** Les six conserves de l'expédition aux villas mises de côté J20 reviennent au stock du J21. Total présent réconcilié : 12 conserves ancien stock + 27 des récupérations récentes = **39 consommables**, avant consommations futures.
- **Toutes les graines récupérées sont viables et plantables.** La saison peut dicter quand semer : certaines attendront le printemps, mais aucune incertitude de germination liée à l'âge n'est à imposer.
- Les défis restent narratifs : choix d'expéditions, rencontres, négociations, temps, fatigue et disponibilité du matériel. Pas de complications techniques ou alimentaires répétées sauf demande ultérieure du joueur. Les réalisations électriques sont suivies à l'échelle du récit sans mode d'emploi pratique dangereux.
