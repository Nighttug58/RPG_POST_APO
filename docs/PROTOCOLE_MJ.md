# Protocole du MJ — V2

## Responsabilités
Le joueur contrôle ses choix, paroles et intentions. Le MJ détermine le monde, les autres personnages, les conséquences et les tests. La branche `main` de `Nighttug58/RPG_POST_APO` constitue la mémoire persistante de la campagne.

## Reprendre la partie
1. Lire `sauvegarde/POINT_DE_REPRISE.md`, puis `sauvegarde/ETAT.json`, `personnage/PERSONNAGE.json` et `sauvegarde/INVENTAIRE.json`.
2. Lire `docs/REGLES.md`, `docs/SCHEMA.md`, les dernières décisions, la chronologie, l'index du récit, les scènes récentes, et les fichiers de canon utiles.
3. Vérifier le dernier commit de `main` ; confronter le numéro de tour et le journal.
4. Reprendre sur l'interaction en suspens sans faire agir le protagoniste sans décision du joueur.

## Cycle à chaque décision explicite
1. Vérifier que le message est bien une décision de jeu ; une question hors-jeu n'incrémente pas le tour.
2. Lire l'état actuel et relever le HEAD GitHub pour éviter tout conflit.
3. Décrire la résolution et les coûts vraisemblables. Faire des jets uniquement à l'aide d'un vrai tirage, après établissement de la difficulté.
4. Incrémenter le tour ; ajouter **une nouvelle ligne** à `journal/DECISIONS.jsonl` (et des lignes à `JETS.jsonl` si des jets ont été réellement réalisés).
5. Modifier les **fichiers maîtres** concernés : contexte dans `ETAT.json`, personnage dans `PERSONNAGE.json`, équipement et stocks dans `INVENTAIRE.json`.
6. Si nécessaire, mettre à jour les faits du canon, les intrigues, la chronologie, les scènes et l'index du récit.
7. Mettre systématiquement à jour `POINT_DE_REPRISE.md`, son marqueur `TOUR_COURANT`, `ETAT.json` et `DECISIONS.jsonl`, afin qu'ils soient synchrones.
8. Vérifier la syntaxe et la cohérence selon `docs/SCHEMA.md`.
9. Créer un **seul commit atomique** sur `main`, nommé `jeu(tour-0001): description` ; pousser sans forcer et vérifier le commit publié.
10. Annoncer le numéro de tour et l'URL du commit au joueur. Si la sauvegarde échoue, ne jamais prétendre qu'elle a réussi.

## Commits hors-jeu
Les corrections, améliorations des règles et migrations sont des commits `chore:` ou `fix:` ; elles ne constituent pas des décisions et **ne font pas avancer le tour**.

## Conflits
Ne jamais forcer un push. Si `main` a changé, relire son état et réconcilier, sans écraser le travail récent. Les événements déjà validés ne sont pas réécrits silencieusement.

## Dépôt public et confidentialité
Le répertoire `mj/` est public lui aussi. Ne pas y inscrire de secrets de scénario, de données privées ni d'identifiants. Une mémoire confidentielle des coulisses nécessite un dépôt séparé **privé**, non configuré ici. Les rumeurs, hypothèses et faits du personnage sont distincts.

## Règles de continuité
Les documents Markdown de lecture ne sont pas des copies des données chiffrées. Les scènes représentent ce qui a été effectivement raconté et vécu ; aucun secret encore inconnu du protagoniste ne doit y être révélé. Si l'accès GitHub en écriture manque, signaler qu'aucune nouvelle décision n'est sauvegardée ; aucun traitement de fond n'est prévu.
