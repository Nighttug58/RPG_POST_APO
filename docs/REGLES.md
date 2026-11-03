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
- Les conséquences et les états durables doivent être consignés dans ETAT.json et le journal.

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
