# Affichage du personnage et de l'inventaire

## Dans ChatGPT

Demander simplement : **« Affiche ma fiche et mon inventaire »**, **« Montre mon inventaire »** ou **« Quel est mon état ? »**.

Pour cet affichage, le MJ :
1. Lit sur GitHub `sauvegarde/ETAT.json`, `personnage/PERSONNAGE.json` et `sauvegarde/INVENTAIRE.json` depuis la branche `main`.
2. Présente un tableau de bord clair dans la réponse, **sans créer de décision ni de commit**.
3. Indique le numéro de tour et l'horodatage de la consultation si utile.
4. N'invente jamais une statistique absente ou `null` ; l'affiche comme « Non défini ».
5. Ne prétend pas que la fiche se met à jour toute seule : chaque demande exige une nouvelle lecture des données.

**Limite technique :** un fichier JavaScript hébergé sur GitHub ne peut pas se brancher automatiquement au moteur de rendu de ChatGPT. Le MJ construit donc l'affichage du chat à partir du contenu actuel des fichiers. Cela peut être une présentation interactive, mais ce n'est pas une exécution du script GitHub.

## Dans un navigateur

Les fichiers `docs/index.html`, `docs/dashboard.js` et `docs/dashboard.css` composent un visualiseur statique **en lecture seule**, sans dépendance externe. Ils récupèrent les JSON publics de `Nighttug58/RPG_POST_APO` sur la branche `main`.

Pour activer le site avec GitHub Pages :
1. Ouvrir le dépôt sur GitHub.
2. Aller dans **Settings → Pages**.
3. Dans **Build and deployment**, sélectionner **Deploy from a branch**, puis **main** et **/docs** ; enregistrer.
4. Attendre que GitHub affiche l'URL du site et vérifier que la page charge correctement les JSON.
5. Utiliser le bouton « Actualiser les données » après une décision. Les données proviennent du `main` public et leur lecture peut subir un léger délai de propagation.

L'URL typique (si activée et déployée) : `https://nighttug58.github.io/RPG_POST_APO/`.

Le tableau de bord n'édite rien : les changements de personnage et d'inventaire se font exclusivement via les décisions jouées et les commits GitHub.

## Vie privée

Le dépôt est public ; l'affichage l'est aussi. Ne pas utiliser les JSON pour des informations personnelles sensibles, car elles seraient accessibles à toute personne connaissant l'URL.
